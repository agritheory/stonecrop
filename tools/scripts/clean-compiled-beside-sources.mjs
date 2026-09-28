#!/usr/bin/env node
/**
 * Delete compiler output that landed beside `src/runtime` sources (usually via a stale
 * `dist/runtime` symlink during cached stub replays). Safe: only removes files that have a
 * matching `.ts`/`.vue` sibling — see compiled-beside-sources.mjs.
 */
import { unlinkSync } from 'node:fs'
import { join } from 'node:path'

import { compiledBesideSources } from './compiled-beside-sources.mjs'

const packageDir = process.argv[2] ?? process.cwd()
const runtimeDir = join(packageDir, 'src/runtime')

for (const relativePath of compiledBesideSources(runtimeDir)) {
	unlinkSync(join(runtimeDir, relativePath))
}
