<template>
	<!--
    AFieldsetLoading
    A convenience wrapper around AFormLoading that pre-sets isFieldset=true.
    Use this wherever <AFieldset> would normally render while its data is loading.

    When the schema is available before the data, pass `fields` and `legend` so
    that the labels and fieldset title are rendered immediately. All inputs will
    be rendered as disabled until the parent replaces this component with the
    real AFieldset once data has loaded.

    Example (schema known, data still loading):
      <AFieldsetLoading
        legend="Address"
        :fields="[
          { fieldname: 'street', label: 'Street' },
          { fieldname: 'city',   label: 'City' },
          { fieldname: 'zip',    label: 'Zip Code' },
        ]"
      />

    Example (schema not yet available):
      <AFieldsetLoading :fieldCount="6" />
  -->
	<AFormLoading v-bind="$attrs" :is-fieldset="true" :field-count="fieldCount" :fields="fields" :legend="legend" />
</template>

<script setup lang="ts">
import AFormLoading, { type FieldDescriptor } from '../AFormLoading.vue'

defineOptions({ name: 'AFieldsetLoading' })

const {
	fieldCount = 4,
	fields,
	legend,
} = defineProps<{
	fieldCount?: number
	fields?: FieldDescriptor[]
	legend?: string
}>()
</script>
