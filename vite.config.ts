import { defineConfig } from 'vite-plus'

// The Vite+ workspace root. Rush still installs and still gates CI; `vp` only runs scripts.
//
// Members come from `package.json#workspaces`, which pnpm ignores. Do not restate them in a root
// `pnpm-workspace.yaml` while `common/autoinstallers/` exists: autoinstallers run pnpm from their
// own folder, which has no workspace file, so pnpm walks up, adopts the whole repo and relinks
// every project away from Rush's store. `rush check`/`list`/`update`/`rebuild` stay green through
// it; only a cold `install-autoinstaller` fails, which is what CI runs.
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
