import { defineConfig } from 'vite-plus'

// The Vite+ workspace root. Members come from `pnpm-workspace.yaml`, which both pnpm and `vp` read.
//
// No `run.tasks` block: `vp run -r <script>` already orders packages by the workspace dependency
// graph declared in each package.json, and automatic tracking already fingerprints each script's
// real inputs and outputs.

// Names every package's `no-underscore-dangle` allows: Node's module globals, and the markers Vue and
// CASL set on objects this code inspects.
const sharedUnderscoreNames = ['__dirname', '__filename', '__v_isReactive', '__caslSubjectType__']

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
			'tools/api-reports/**',
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

	// Oxlint reads this block, not `oxlint.config.ts` — Vite+ does not look for that file, so while the
	// config lived there, `vp lint` ran Oxlint's defaults, where every rule only warns. Nested configs
	// are not read in Vite+ mode either, so what each package used to set in its own config is an
	// override below, keyed by its directory.
	lint: {
		// `vue` is on everywhere rather than per Vue package: an override that names its own plugins
		// replaces these for its files, and the test override below would then drop `vue` from every
		// Vue package's tests. Its rules fire only on Vue code, and enabling it everywhere reports
		// nothing new outside the Vue packages.
		plugins: ['typescript', 'unicorn', 'oxc', 'import', 'promise', 'vitest', 'vue'],

		categories: {
			correctness: 'error',
			suspicious: 'warn',
			perf: 'warn',
		},

		options: {
			reportUnusedDisableDirectives: 'warn',
			typeAware: true,
		},

		env: {
			browser: true,
			builtin: true,
			node: true,
			vitest: true,
			vue: true,
		},

		ignorePatterns: [
			'**/dist/**',
			'**/build/**',
			'**/coverage/**',
			'**/temp/**',
			'**/node_modules/**',
			'**/*.config.ts',
			'**/*.config.js',
			// Nuxt packages still use ESLint (depend on @nuxt/eslint-config).
			'nuxt/**',
			'nuxt_grafserv/**',
		],

		rules: {
			// eslint built-in fires before TS sees `_`-prefix patterns; use the TS-aware variant below.
			'eslint/no-unused-vars': 'off',
			'import/no-cycle': ['error', { maxDepth: 3 }],
			// CSS/asset side-effect imports are legitimate.
			'import/no-unassigned-import': ['error', { allow: ['**/*.css', '**/*.scss', '**/*.sass'] }],
			'no-console': ['error', { allow: ['warn', 'error', 'debug', 'info'] }],
			'no-underscore-dangle': ['error', { allow: [...sharedUnderscoreNames, '_root'] }],
			'typescript/no-unsafe-type-assertion': 'error',
			'typescript/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
		},

		overrides: [
			// One per package that sets anything of its own. A package's `no-underscore-dangle` list
			// replaces the root one rather than adding to it, so a name one package reaches into stays
			// an error everywhere else. These come before the test override so that it still wins for
			// each package's tests.
			{
				files: ['aform/**'],
				rules: {
					'eslint/no-shadow': 'error',
					'no-underscore-dangle': ['error', { allow: sharedUnderscoreNames }],
				},
			},
			{
				files: ['atable/**'],
				rules: {
					'no-underscore-dangle': 'error',
				},
			},
			{
				files: ['beam/**'],
				rules: {
					'no-underscore-dangle': ['error', { allow: sharedUnderscoreNames }],
					'typescript/consistent-return': 'error',
				},
			},
			{
				files: ['casl_middleware/**'],
				rules: {
					'no-underscore-dangle': ['error', { allow: sharedUnderscoreNames }],
				},
			},
			{
				files: ['desktop/**'],
				rules: {
					'no-underscore-dangle': ['error', { allow: ['_root'] }],
				},
			},
			{
				files: ['graphql_client/**'],
				rules: {
					'no-console': 'error',
					'no-underscore-dangle': 'error',
				},
			},
			{
				files: ['graphql_middleware/**'],
				rules: {
					'no-console': 'error',
					'no-underscore-dangle': ['error', { allow: [...sharedUnderscoreNames, '_attributeName', '__rules'] }],
				},
			},
			{
				files: ['node_editor/**'],
				rules: {
					'eslint/no-shadow': 'error',
					'no-underscore-dangle': ['error', { allow: sharedUnderscoreNames }],
				},
			},
			{
				files: ['schema/**'],
				rules: {
					'no-underscore-dangle': [
						'error',
						{
							allow: [
								...sharedUnderscoreNames,
								// GraphQL conversion metadata fields — intentional API convention
								'_unmapped',
								'_graphqlType',
								'_graphqlTypeName',
								'_isLink',
							],
						},
					],
				},
			},
			{
				files: ['stonecrop/**'],
				rules: {
					'no-underscore-dangle': [
						'error',
						{
							allow: [
								...sharedUnderscoreNames,
								'_root',
								'_ancestorIndex',
								'_ancestorIndexDirty',
								'_ensureAncestorIndex',
								'_client',
								'_operationLogConfig',
								'_operationLogStore',
								'_context',
								'_stonecrop',
								'_mockComponent',
								'_secondReload',
								'_hstStore',
								'_batchId',
								'_store',
								'_redo',
							],
						},
					],
				},
			},
			{
				files: ['utilities/**'],
				rules: {
					'no-console': 'error',
					'no-underscore-dangle': 'error',
				},
			},
			{
				files: ['**/tests/**', '**/*.{test,spec}.{ts,tsx,js,mjs}'],
				rules: {
					// A fixture built beside its cases is clearer than one hoisted away from it, and a
					// test's collections are small enough that the lookup cost is not real.
					// `no-await-in-loop` is deliberately not here: the sequential sites each carry a
					// reason, and turning it off orphans those and stops the rule catching new ones.
					'unicorn/consistent-function-scoping': 'off',
					'unicorn/prefer-set-has': 'off',
					'no-console': 'off',
					'typescript/no-unsafe-type-assertion': 'off',
					'typescript/unbound-method': 'off',
					'vitest/expect-expect': 'warn',
					'vitest/no-conditional-expect': 'error',
					'vitest/no-disabled-tests': 'warn',
					'vitest/no-focused-tests': 'error',
					'vitest/require-mock-type-parameters': 'off',
					// The rule reads `expect(actual)` as the whole signature, but Vitest's `expect` declares
					// `<T>(actual: T, message?: string)`. That message is what makes an assertion explain
					// itself on failure, and every report here is against correct code.
					'vitest/valid-expect': 'off',
				},
			},
			{
				// Command-line scripts: printing is what they are for. `_nodes` is TSDoc's own API,
				// which doc-gen walks.
				files: ['tools/**'],
				rules: {
					'no-console': 'off',
					'no-underscore-dangle': ['error', { allow: [...sharedUnderscoreNames, '_root', '_nodes'] }],
				},
			},
		],
	},
})
