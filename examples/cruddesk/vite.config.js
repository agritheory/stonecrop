import vue from '@vitejs/plugin-vue'

module.exports = {
	plugins: [vue()],
	optimizeDeps: {
		exclude: ['@sedum/atable', '@sedum/aform', '@sedum/stonecrop'],
	},
}
