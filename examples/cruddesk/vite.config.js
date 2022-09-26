import vue from '@vitejs/plugin-vue'

module.exports = {
	plugins: [vue()],
	optimizeDeps: {
		exclude: ['@agritheory/atable', '@agritheory/aform', '@agritheory/stonecrop'],
	},
}
