import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDataStore = defineStore('data', () => {
	const records = ref<Record<string, any>[]>([])
	const record = ref<Record<string, any>>({})
	return { records, record }
})
