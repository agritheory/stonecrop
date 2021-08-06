import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

module.exports = {
	build: {
		lib: {
			entry: resolve(__dirname, '../src/index.js'),
			name: '@sedum/atable'
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue'
				}
			}
		}
	},
	plugins: [vue()]
}

// const resolveSCSSPath = () =>{
//   if(__dirname.endsWith('dev')){
//     return resolve(__dirname, 'variables.scss')
//   } else if(__dirname.endsWith('src')){
//     return resolve(__dirname, './../dev/variables.scss')
//   }
// }

// const config = defineConfig({
//   plugins: [
//     createVuePlugin({}),
//   ],
//   css: {
//     preprocessorOptions: {
//       scss: { additionalData: `@import "${resolveSCSSPath()}";` },
//     },
//   },
//   build: {
//     lib: {
//       entry: resolve(__dirname, './../src/index.js'),
//       name: 'beam-ui'
//     },
//     rollupOptions: {
//       external: ['vue'],
//       output: {
//         dir: './dist/',
//         globals: {
//           vue: 'Vue'
//         }
//       }
//     }
//   }
// })

// export default config