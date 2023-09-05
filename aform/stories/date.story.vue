<template>
	<Story title="ADatePicker">
		<ADatePicker readonly="false" v-model="unsetDate" />
		<ADatePicker readonly="false" v-model="defaultDate" />
	</Story>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import ADatePicker from '@/components/form/ADatePicker.vue'

let unsetDate = ref(undefined)
let defaultDate = ref(new Date().setDate(new Date().getDate() - 2))
</script>
