#!/usr/bin/env node

/**
 * Runs the workspace build and prints only what a reader has to act on.
 *
 * A successful build emitted a couple of hundred lines of task headers, dist listings and tool
 * chatter, so finding a real warning meant knowing which lines were structural first. Here the
 * default is silence: a line reaching the terminal is a warning, an error, or the summary.
 *
 * Nothing is discarded. The full stream is always written to the log file named in the summary,
 * and a failing build prints all of it, unfiltered, because the interesting line is then just as
 * likely to be a stack frame as a recognised warning.
 */

import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..')
const logPath = join(rootDir, 'node_modules/.vite/last-build.log')

// The workspace root is a member, so `vp run -r build` selects it and runs this script again as a
// task. A bare `vp run` guards itself against that; this has to do the same, or the nested run
// fights the outer one over its IPC socket and tasks die with "Failed to spawn process".
if (process.env.VP_RUN) {
	process.exit(0)
}

// Vite+ announces each task as `~/package$ command`. Dropped before anything is matched, because
// the command itself carries words like `--logLevel warn` that would otherwise read as a warning.
const TASK_HEADER = /^~\/\S*\$ /

// Matched against the line with its `[package#task]` prefix removed, so a package name containing
// one of these words cannot make every one of its lines look interesting. Deliberately two
// patterns: the diagnostic codes are upper case and must stay case-sensitive, or `[doctype]` in a
// listed filename reads as one.
const INTERESTING_WORD = /\b(warning|warn|error|failed|failure|deprecated|deprecation)\b/i
const INTERESTING_MARK = /^\*\*\*|✗|✖|\[[A-Z][A-Z_]{2,}\]/

// vp's own closing line, which the summary below restates.
const RUN_SUMMARY = /^vp run: \d+\/\d+ cache hit/

// `[package#task] ~/package$ command ◉ cache hit, replaying`, the only place the stream says which
// package a task belongs to and whether it ran. There is no matching completion line, so a package
// counts as built the moment one of its tasks misses, and the exit code says whether it worked.
const TASK_LINE = /^\[([^#\]]+)#[^\]]*\]\s+~\/\S*\$ /
const CACHE_HIT = '◉ cache hit'

const strip = line => line.replace(/\x1b\[[0-9;]*m/g, '')
const body = line =>
	strip(line)
		.replace(/^\[[^\]]+\]\s*/, '')
		.trim()

const colour = process.stdout.isTTY && !process.env.NO_COLOR
const paint = (code, text) => (colour ? `\x1b[${code}m${text}\x1b[0m` : text)
const green = text => paint('32', text)
const yellow = text => paint('33', text)
const dim = text => paint('2', text)

// Resolved rather than taken off PATH so no shell is involved: passing an argument array with
// `shell: true` is deprecated, and the shell would be quoting these for no reason.
const requireFromRoot = createRequire(join(rootDir, 'package.json'))
const viteplusManifest = requireFromRoot.resolve('vite-plus/package.json')
const vpBin = join(dirname(viteplusManifest), requireFromRoot(viteplusManifest).bin.vp)

const child = spawn(process.execPath, [vpBin, 'run', '--log', 'labeled', '-r', 'build'], {
	cwd: rootDir,
	stdio: ['inherit', 'pipe', 'pipe'],
})

const transcript = []
const seen = new Map()
const packages = new Map()
let cacheLine = ''
const startedAt = Date.now()

const consume = stream => {
	let pending = ''
	stream.setEncoding('utf8')
	stream.on('data', chunk => {
		pending += chunk
		const lines = pending.split('\n')
		pending = lines.pop() ?? ''
		for (const line of lines) handle(line)
	})
	stream.on('end', () => {
		if (pending) handle(pending)
	})
}

function handle(line) {
	transcript.push(line)
	const text = body(line)
	if (RUN_SUMMARY.test(text)) {
		cacheLine = text.replace(/\s*\(Run .*$/, '').replace(/\.\s*$/, '')
		return
	}

	const plain = strip(line)
	const task = TASK_LINE.exec(plain)
	if (task) {
		const entry = packages.get(task[1]) ?? { tasks: 0, ran: 0 }
		entry.tasks += 1
		if (!plain.includes(CACHE_HIT)) entry.ran += 1
		packages.set(task[1], entry)
	}

	if (!text || TASK_HEADER.test(text)) return
	if (!INTERESTING_WORD.test(text) && !INTERESTING_MARK.test(text)) return

	// The compiler-mismatch notice is one fact repeated once per package; count it instead.
	const previous = seen.get(text)
	if (previous) {
		previous.count += 1
		return
	}
	seen.set(text, { count: 1, line: strip(line), text })
}

consume(child.stdout)
consume(child.stderr)

child.on('close', code => {
	mkdirSync(dirname(logPath), { recursive: true })
	writeFileSync(logPath, `${transcript.join('\n')}\n`, 'utf8')

	if (code !== 0) {
		process.stdout.write(`${transcript.join('\n')}\n`)
		process.stderr.write(`\nBuild failed. Full log: ${logPath}\n`)
		process.exit(code ?? 1)
	}

	const built = [...packages].filter(([, entry]) => entry.ran > 0)
	const cached = packages.size - built.length
	const width = Math.max(0, ...built.map(([name]) => name.length))
	for (const [name, entry] of built) {
		const tasks = `${entry.ran} ${entry.ran === 1 ? 'task' : 'tasks'}`
		process.stdout.write(`${green('✓')} ${name.padEnd(width)}  ${dim(tasks)}\n`)
	}

	for (const { count, line, text } of seen.values()) {
		// A notice raised by several packages belongs to none of them, so the prefix would name an
		// arbitrary one of the thirteen.
		process.stdout.write(yellow(count > 1 ? `! ${text} (in ${count} packages)` : `! ${body(line)}`) + '\n')
	}

	const seconds = ((Date.now() - startedAt) / 1000).toFixed(1)
	const unchanged = cached > 0 ? `, ${cached} unchanged` : ''
	process.stdout.write(`${green('Build ok')} in ${seconds}s${unchanged}. ${dim(`Full log: ${logPath}`)}\n`)
})
