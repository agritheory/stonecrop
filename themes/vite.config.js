import { resolve } from 'path'
import { defineConfig } from 'vite'

const projectRootDir = resolve(__dirname)

export default defineConfig({
	build: {
		cssCodeSplit: true,
		lib: {
			name: '@stonecrop/themes',
			entry: {
				default: resolve(projectRootDir, 'default/index.ts'),
			},
		},
	},
})
