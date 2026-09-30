import { mkdtemp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { installDoctypes } from '../../src/cli/installers/doctypes'

vi.mock('consola', () => ({
	default: { start: vi.fn(), info: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn() },
}))

// A real directory: what matters is which files end up in the app's doctypes/.
let app: string
beforeEach(async () => {
	app = await mkdtemp(join(tmpdir(), 'stonecrop-doctypes-'))
})
afterEach(async () => {
	await rm(app, { recursive: true, force: true })
})

describe('installDoctypes', { tags: ['unit', 'nuxt'] }, () => {
	it('scaffolds the sample doctypes under lowercase names', async () => {
		expect(await installDoctypes({ cwd: app })).toBe(true)
		expect((await readdir(join(app, 'doctypes'))).sort()).toEqual(['project.json', 'task.json'])
		expect(await readFile(join(app, 'doctypes', 'task.json'), 'utf-8')).toBe(
			await readFile(join(__dirname, '../../templates/task.json'), 'utf-8')
		)
	})

	it('leaves an app scaffolded with the old names alone, rather than adding a second copy', async () => {
		await mkdir(join(app, 'doctypes'))
		await writeFile(join(app, 'doctypes', 'Project.json'), '{"name":"Project","fields":[]}')
		await writeFile(join(app, 'doctypes', 'Task.json'), '{"name":"Task","fields":[]}')

		expect(await installDoctypes({ cwd: app })).toBe(true)

		expect((await readdir(join(app, 'doctypes'))).sort()).toEqual(['Project.json', 'Task.json'])
		expect(await readFile(join(app, 'doctypes', 'Project.json'), 'utf-8')).toBe('{"name":"Project","fields":[]}')
	})
})
