<template>
<fieldset
>
	<label
		@click="toggleCollapse($event)"
		@submit="toggleCollapse($event)"
	>
		{{ label }}
		<CollapseButton	
			v-if="collapsible"
			:collapsed="collapsed"
			
		/>
	</label>
	<AForm 
		v-show="!collapsed"
		:schema="schema"
		:data="formData"
	/>
	
</fieldset>
</template>
<script>
import { ref, defineComponent } from 'vue'
import CollapseButton from './../base/CollapseButton.vue'
import AForm from './../AForm.vue'

export default defineComponent({
	name: 'AFieldset',
	components: { AForm, CollapseButton },
	props: ['value', 'schema', 'key', 'label', 'collapsible'],
	setup (props, context) {
		const formData = ref(props.data || {})
		let collapsed = ref(false)
		let collapsible = ref(props.collapsible)

		function toggleCollapse(e){
			e.preventDefault()
			if(!collapsible){
				return
			}
			collapsed.value = !collapsed.value
		}
		return { formData, collapsed, toggleCollapse, collapsible }
	}
})
</script>
<style scoped>
fieldset{
	width: 100%;
	margin-right: 2ch;
	border: 1px solid transparent;
	border-bottom: 1px solid var(--primary-color);
}
label {
	width: 100%;
	height: 1.15rem;
	border: 1px solid transparent;
	padding-bottom: .5rem;
	font-size: 110%;
	font-weight: 600;
	user-select: none;
}
.collapse-button {
	float: right;
}
</style>