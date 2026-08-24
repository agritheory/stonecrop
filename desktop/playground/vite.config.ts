import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [vue()],
	resolve: {
		// This app lives inside the package it consumes, so there is no workspace symlink for
		// `@stonecrop/desktop` to resolve through. Point at the same `dist/` files the package's
		// `exports` map does, rather than at `src/`: the app then stays byte-identical to what an
		// outside consumer writes, at the cost of `rushx build` in `desktop/` being a prerequisite.
		alias: [
			{
				find: '@stonecrop/desktop/styles',
				replacement: fileURLToPath(new URL('../dist/desktop.css', import.meta.url)),
			},
			{ find: /^@stonecrop\/desktop$/, replacement: fileURLToPath(new URL('../dist/desktop.js', import.meta.url)) },
		],
	},
	server: {
		fs: {
			// Reach the pnpm store under the repo root; unchanged by the move, since the project
			// root is still two levels down from it.
			allow: ['../..'],
		},
	},
})
