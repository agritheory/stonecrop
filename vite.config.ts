import { defineConfig } from 'vite-plus'

// The Vite+ workspace root. Rush still installs and still gates CI; `vp` only runs scripts.
//
// `cache: true` looks equivalent but caches nothing — its `tasks` half covers only entries in a
// `tasks` map, and every task here is a package.json script, which `scripts` governs.
export default defineConfig({
	run: {
		cache: {
			scripts: true,
		},
	},
})
