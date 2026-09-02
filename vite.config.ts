import { defineConfig } from 'vite-plus'

// The Vite+ workspace root. Members come from `pnpm-workspace.yaml`, which both pnpm and `vp` read.
//
// `cache: true` looks equivalent but caches nothing — its `tasks` half covers only entries in a
// `tasks` map, and every task here is a package.json script, which `scripts` governs.
//
// No `run.tasks` block: `vp run -r <script>` already orders packages by the workspace dependency
// graph declared in each package.json, and automatic tracking already fingerprints each script's
// real inputs and outputs.
export default defineConfig({
	run: {
		cache: {
			scripts: true,
		},
	},

	// Oxfmt reads this block, not `.oxfmtrc.json` — Vite+ recommends against that file and does not
	// look for it. Every style option below is carried over from `.prettierrc.cjs` unchanged, so the
	// reformat is attributable to Oxfmt alone. Prettier's `insertPragma` and `requirePragma` have no
	// equivalent; both were `false`, which is the default either way.
	fmt: {
		arrowParens: 'avoid',
		bracketSameLine: true,
		bracketSpacing: true,
		embeddedLanguageFormatting: 'auto',
		htmlWhitespaceSensitivity: 'css',
		jsxSingleQuote: false,
		printWidth: 120,
		proseWrap: 'preserve',
		quoteProps: 'as-needed',
		semi: false,
		singleQuote: true,
		tabWidth: 2,
		trailingComma: 'es5',
		useTabs: true,
		vueIndentScriptAndStyle: false,

		// `sortPackageJson` stays at its default of true, which is what retires `sort-package-json`.
		// Running both is not an option: the two orderings are documented as incompatible, so each
		// tool would undo the other on every commit.

		// Oxfmt reads `.gitignore` on its own, so these are only what `.prettierignore` added on top
		// of it — the other 129 lines of that file were a hand-synced copy of `.gitignore`.
		ignorePatterns: [
			// api-extractor writes these and a `git diff --exit-code` asserts them byte-for-byte.
			'common/reviews/**',
			'**/CHANGELOG.*',
			'pnpm-lock.yaml',
			'yarn.lock',
			'package-lock.json',
			'shrinkwrap.json',
			'.github/**',

			// Markdown stays unformatted: a formatter rewrites fenced code blocks, and this repo's
			// markdown is end-user documentation.
			'**/*.md',

			// Rewritten by nuxt-graphql-middleware (downloadSchema) on every dev boot, so the
			// downloaded formatting is the canonical one.
			'nuxt/playground/schema.graphql',

			// Machine-written by the schema CLI (`generate`) and the DocBuilder Save handler, both as
			// `JSON.stringify(_, null, '\t')` — the exact bytes the generation oracle asserts. A
			// formatter would re-inline short arrays and fight both writers on every save.
			'**/doctypes/*.json',
		],
	},
})
