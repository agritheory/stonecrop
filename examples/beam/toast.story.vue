<template>
	<Story>
		<Variant title="toast">
			<template #controls>
				<HstText v-model="toastMsg" title="Toast Message" />
				<HstSelect
					v-model="toastType"
					:title="'Type'"
					:options="{
						default: 'default',
						success: 'success',
						error: 'error',
						warning: 'warning',
					}" />
				<HstSelect
					v-model="toastPosition"
					:title="'Position'"
					:options="{
						top: 'top',
						'top-right': 'top-right',
						'top-left': 'top-left',
						bottom: 'bottom',
						'bottom-right': 'bottom-right',
						'bottom-left': 'bottom-left',
					}" />
				<HstSlider v-model="toastTime" :step="0.5" :min="0" :max="20" title="Duration (Seconds)" />
			</template>
			<BeamModal @confirmmodal="confirmModal" @closemodal="closeModal" :showModal="showModal">
				<Confirm @confirmmodal="confirmModal" @closemodal="closeModal" />
			</BeamModal>
			<Navbar @click="showNotification">
				<template #title>
					<BeamHeading>Items to Receive</BeamHeading>
				</template>
				<template #navbaraction>Show Notification</template>
			</Navbar>
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type ToastPosition, useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'

const showModal = ref(false)

// Start Toast //
const toast = useToast()
const toastType = ref('default')
const toastTime = ref(3)
const toastMsg = ref('Toast Message.')
const toastPosition = ref<ToastPosition>('top')

const showNotification = () => {
	toast.open({
		message: toastMsg.value,
		type: toastType.value,
		position: toastPosition.value,
		duration: toastTime.value * 1000,
	})
}
// End Toast //

const confirmModal = () => (showModal.value = false)
const closeModal = () => (showModal.value = false)
</script>
