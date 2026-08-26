import { defineConfig } from 'vite-plus'

// The Vite+ workspace root. Members come from `pnpm-workspace.yaml`, which both pnpm and `vp` read.
//
// `cache: true` looks equivalent but caches nothing — its `tasks` half covers only entries in a
// `tasks` map, and every task here is a package.json script, which `scripts` governs.
//
// No `run.tasks` block: `vp run -r <script>` already orders packages by the workspace dependency
// graph declared in each package.json, which is what Rush's `upstream` phase dependency did, and
// automatic tracking already fingerprints each script's real inputs and outputs.
export default defineConfig({
	run: {
		cache: {
			scripts: true,
		},
	},
})
