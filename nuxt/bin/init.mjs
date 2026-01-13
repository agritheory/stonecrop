#!/usr/bin/env node
/**
 * @stonecrop/nuxt CLI entry point
 *
 * Usage:
 *   npx @stonecrop/nuxt init          # Interactive mode
 *   npx @stonecrop/nuxt init --help   # Show help
 */

import { defineCommand, runMain } from 'citty'
import consola from 'consola'
import { createJiti } from 'jiti'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Use jiti to load TypeScript CLI code
const jiti = createJiti(import.meta.url, {
	interopDefault: true,
	esmResolve: true,
})

const { runInstaller } = await jiti.import(join(__dirname, '..', 'src', 'cli', 'index.ts'))

const main = defineCommand({
	meta: {
		name: 'stonecrop-nuxt',
		version: '0.6.3',
		description: 'Install Stonecrop modules into your Nuxt project',
	},
	subCommands: {
		init: defineCommand({
			meta: {
				name: 'init',
				description: 'Initialize Stonecrop in your Nuxt project',
			},
			args: {
				frontend: {
					type: 'boolean',
					description: 'Install @stonecrop/nuxt frontend module',
					default: false,
				},
				'graphql-client': {
					type: 'boolean',
					description: 'Install @stonecrop/graphql-client',
					default: false,
				},
				graphql: {
					type: 'boolean',
					description: 'Install @stonecrop/nuxt-grafserv GraphQL server',
					default: false,
				},
				casl: {
					type: 'boolean',
					description: 'Install @stonecrop/casl-middleware authorization',
					default: false,
				},
				rockfoil: {
					type: 'boolean',
					description: 'Install @stonecrop/rockfoil PostGraphile middleware',
					default: false,
				},
				doctypes: {
					type: 'boolean',
					description: 'Scaffold sample doctypes',
					default: false,
				},
				cwd: {
					type: 'string',
					description: 'Working directory (defaults to current directory)',
					default: process.cwd(),
				},
				yes: {
					type: 'boolean',
					alias: 'y',
					description: 'Skip confirmation prompts',
					default: false,
				},
			},
			async run({ args }) {
				try {
					await runInstaller({
						cwd: args.cwd,
						features: {
							frontend: args.frontend,
							graphqlClient: args['graphql-client'],
							graphql: args.graphql,
							casl: args.casl,
							rockfoil: args.rockfoil,
							doctypes: args.doctypes,
						},
						skipConfirm: args.yes,
					})
				} catch (error) {
					consola.error('Installation failed:', error)
					process.exit(1)
				}
			},
		}),
	},
})

runMain(main)
