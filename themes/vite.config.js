import { resolve } from 'path'
import { defineConfig } from 'vite'

const projectRootDir = resolve(__dirname)

export default defineConfig({
	build: {
		cssCodeSplit: true,
		lib: {
			name: '@stonecrop/themes',
			entry: {
				agritheory: resolve(projectRootDir, 'agritheory/index.ts'),
				dark: resolve(projectRootDir, 'dark/index.ts'),
				default: resolve(projectRootDir, 'default/index.ts'),
				excel: resolve(projectRootDir, 'excel/index.ts'),
				legal: resolve(projectRootDir, 'legal/index.ts'),
				verdant: resolve(projectRootDir, 'verdant/index.ts'),
				vue: resolve(projectRootDir, 'vue/index.ts'),
			},
		},
	},
})
