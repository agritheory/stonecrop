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
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
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

// The same prefix on any line, not only a task header, so a warning can name the package that
// raised it. `body` strips this before matching, which is why it is read from the raw line.
const LINE_SOURCE = /^\[([^#\]]+)#/

// eslint-disable-next-line no-control-regex -- the ANSI introducer is a control character by definition
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

// The denominator for the progress line. Only the list under `packages:`, because taking every
// `- name` in the file also collects the entries under `peerDependencyRules`, which are dependency
// names rather than members.
function workspaceMemberCount() {
	const lines = readFileSync(join(rootDir, 'pnpm-workspace.yaml'), 'utf8').split('\n')
	let members = 0
	for (const line of lines.slice(lines.findIndex(entry => entry.startsWith('packages:')) + 1)) {
		if (/^\S/.test(line)) break
		if (/^\s*-\s+\S/.test(line)) members += 1
	}
	return members
}

// A progress display must never be why a build fails, so a list this cannot read costs the
// denominator and nothing else.
let memberCount = 0
try {
	memberCount = workspaceMemberCount()
} catch {
	memberCount = 0
}

// Resolved rather than taken off PATH so no shell is involved: passing an argument array with
// `shell: true` is deprecated, and the shell would be quoting these for no reason.
const requireFromRoot = createRequire(join(rootDir, 'package.json'))
const viteplusManifest = requireFromRoot.resolve('vite-plus/package.json')
const vpBin = join(dirname(viteplusManifest), requireFromRoot(viteplusManifest).bin.vp)

// Ahead of the task specifier, because vp appends anything following it to the task's own command:
// `-r build --no-cache` runs `vite build --no-cache`, which clears dist and then fails.
const forwardedFlags = process.argv.slice(2)

const child = spawn(process.execPath, [vpBin, 'run', '--log', 'labeled', ...forwardedFlags, '-r', 'build'], {
	cwd: rootDir,
	stdio: ['inherit', 'pipe', 'pipe'],
})

const transcript = []
const seen = new Map()
const packages = new Map()
const startedAt = Date.now()

// Held back for a moment so a fully cached build, which finishes in well under a second, prints
// its summary and nothing else.
const QUIET_MS = 1000
const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
const progress = process.stdout.isTTY
let frame = 0
let current = ''
let statusShown = false

const renderStatus = () => {
	if (!progress || Date.now() - startedAt < QUIET_MS) return
	const counted = memberCount > 0 ? `${packages.size}/${memberCount}` : `${packages.size}`
	const text = `${FRAMES[frame % FRAMES.length]} ${current} · ${counted}`
	// Truncated while still plain, then painted whole. Measuring a string that already carries
	// colour codes counts them as width, and the line wraps on a narrow terminal after all.
	//
	// `||`, not `??`: a terminal that reports no size gives 0 rather than undefined, and the
	// resulting `slice(0, -1)` quietly drops the last character of every line.
	process.stdout.write(`\r${dim(text.slice(0, (process.stdout.columns || 80) - 1))}\x1b[K`)
	statusShown = true
}

const ticker = progress ? setInterval(() => ((frame += 1), renderStatus()), 100) : null
ticker?.unref()

const clearStatus = () => {
	if (ticker) clearInterval(ticker)
	if (statusShown) process.stdout.write('\r\x1b[K')
	statusShown = false
}

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
	if (RUN_SUMMARY.test(text)) return

	const plain = strip(line)
	const task = TASK_LINE.exec(plain)
	if (task) {
		const known = packages.has(task[1])
		const entry = packages.get(task[1]) ?? { tasks: 0, ran: 0 }
		entry.tasks += 1
		if (!plain.includes(CACHE_HIT)) entry.ran += 1
		packages.set(task[1], entry)
		if (!known) {
			current = task[1]
			renderStatus()
		}
	}

	if (!text || TASK_HEADER.test(text)) return
	if (!INTERESTING_WORD.test(text) && !INTERESTING_MARK.test(text)) return

	// One notice is often the same fact raised by many packages, so it is recorded once against
	// every package that raised it. Counting alone left a single package's warning naming nothing.
	const source = LINE_SOURCE.exec(plain)?.[1]
	const previous = seen.get(text)
	if (previous) {
		if (source) previous.sources.add(source)
		return
	}
	seen.set(text, { sources: new Set(source ? [source] : []), text })
}

consume(child.stdout)
consume(child.stderr)

child.on('close', code => {
	clearStatus()
	mkdirSync(dirname(logPath), { recursive: true })
	writeFileSync(logPath, `${transcript.join('\n')}\n`, 'utf8')

	if (code !== 0) {
		process.stdout.write(`${transcript.join('\n')}\n`)
		process.stderr.write(`\nBuild failed. Full log: ${logPath}\n`)
		process.exit(code ?? 1)
	}

	const built = [...packages].filter(([, entry]) => entry.ran > 0)

	if (built.length > 0) {
		const width = Math.max(...built.map(([name]) => name.length))
		for (const [name, entry] of built) {
			const tasks = `${entry.ran} ${entry.ran === 1 ? 'task' : 'tasks'}`
			process.stdout.write(`${green('✓')} ${name.padEnd(width)}  ${dim(tasks)}\n`)
		}
	}

	const notices = [...seen.values()].map(({ sources, text }) => ({
		label: sources.size === 1 ? [...sources][0] : sources.size === 0 ? '' : `${sources.size} packages`,
		text,
	}))
	const labelWidth = Math.max(0, ...notices.map(notice => notice.label.length))
	for (const { label, text } of notices) {
		process.stdout.write(yellow(`! ${label.padEnd(labelWidth)}  ${text}`) + '\n')
	}

	const seconds = ((Date.now() - startedAt) / 1000).toFixed(1)
	const outcome =
		built.length === 0
			? `Build ok in ${seconds}s, nothing changed`
			: built.length === packages.size
				? `Built all ${packages.size} packages in ${seconds}s`
				: `Rebuilt ${built.length} of ${packages.size} packages in ${seconds}s`
	process.stdout.write(`${green(outcome)}. ${dim(`Full log: ${logPath}`)}\n`)
})
