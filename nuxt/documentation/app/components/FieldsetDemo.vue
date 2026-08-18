<script setup lang="ts">
import { ref } from 'vue'
import { AFieldset, ATextInput } from '@stonecrop/aform'

// Direct imports, not via AForm/schema resolution — same as CheckboxDemo.vue and CurrencyDemo.vue.
// AFieldset's default slot is filled directly with plain fields instead of relying on its built-in
// `<AForm :schema="schema" />` fallback, so no schema-string resolution is involved here either.
// `schema` is still a required prop on AFieldset, but it's unused once the slot is overridden — an
// empty array satisfies the prop without powering any rendering.
const firstName = ref('')
const lastName = ref('')
const email = ref('')
</script>

<template>
	<div class="stonecrop-demo">
		<AFieldset label="Contact Information" :collapsible="true" :schema="[]" v-slot="{ collapsed }">
			<div v-show="!collapsed" class="stonecrop-demo__fields">
				<ATextInput v-model="firstName" label="First Name" uuid="fieldset-demo-first-name" />
				<ATextInput v-model="lastName" label="Last Name" uuid="fieldset-demo-last-name" />
				<ATextInput v-model="email" label="Email" uuid="fieldset-demo-email" />
			</div>
		</AFieldset>
		<p class="stonecrop-demo__state">Click the legend to collapse or expand the fieldset.</p>
	</div>
</template>

<style scoped>
.stonecrop-demo__fields {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	width: 100%;
}

.stonecrop-demo__state {
	margin: 1.5rem 0 0;
	font-size: 0.85em;
}
</style>
