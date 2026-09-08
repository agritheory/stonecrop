import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..')

/**
 * The members declared in the text of pnpm-workspace.yaml.
 *
 * Scoped to the block under `packages:`, because every `- name` in the file also collects the
 * entries under `peerDependencyRules`, which are dependency names rather than members.
 *
 * Blank and comment lines inside the block are skipped rather than ending it. A comment at column
 * zero is ordinary YAML and otherwise reads as the next top-level key, which truncates the list
 * without saying so.
 *
 * Throws rather than returning nothing. A caller reads an empty list as no work to do, so a parse
 * that silently found none passes the caller's check having inspected nothing.
 *
 * Split from the reader below so a spec can drive all three rules. The real file exercises only
 * the first: its own comment sits after the last member, and it is never empty.
 */
export function parseWorkspaceMembers(yaml) {
	const members = []
	let inPackages = false

	for (const line of yaml.split('\n')) {
		if (line.startsWith('packages:')) {
			inPackages = true
			continue
		}
		if (!inPackages) continue

		const entry = line.match(/^\s+-\s+(\S+)\s*$/)
		if (entry) members.push(entry[1])
		else if (line.trim() !== '' && !line.trimStart().startsWith('#')) break
	}

	if (members.length === 0) throw new Error('Parsed no members from pnpm-workspace.yaml')
	return members
}

/**
 * The workspace members, read from the file that defines them so a new one is covered
 * automatically.
 */
export function workspaceMembers() {
	return parseWorkspaceMembers(readFileSync(join(rootDir, 'pnpm-workspace.yaml'), 'utf8'))
}
