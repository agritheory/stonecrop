<template>
	<fieldset>
		<legend @click="toggleCollapse($event)" @submit="toggleCollapse($event)">
			{{ label }}
			<CollapseButton v-if="collapsible" :collapsed="collapsed" />
		</legend>
		<AForm v-show="!collapsed" :schema="schema" :data="formData" />
	</fieldset>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import CollapseButton from '@/components/base/CollapseButton.vue'
import AForm from '@/components/AForm.vue'

export default defineComponent({
	name: 'AFieldset',
	components: { AForm, CollapseButton },
	props: {
		schema: {
			type: Array,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		collapsible: {
			type: Boolean,
		},
		value: { required: false },
	},
	setup(props) {
		const formData = ref(props.data || [])
		let collapsed = ref(false)
		let collapsible = ref(props.collapsible)

		function toggleCollapse(e: Event) {
			e.preventDefault()
			if (!collapsible.value) {
				return
			}
			collapsed.value = !collapsed.value
		}
		return { formData, collapsed, toggleCollapse }
	},
})
</script>

<style scoped>
fieldset {
	width: 100%;
	margin-right: 2ch;
	border: 1px solid transparent;
	border-bottom: 1px solid var(--gray-50);
}
legend {
	width: 100%;
	height: 1.15rem;
	border: 1px solid transparent;
	padding-bottom: 0.5rem;
	font-size: 110%;
	font-weight: 600;
	user-select: none;
}
.collapse-button {
	float: right;
}
</style>
