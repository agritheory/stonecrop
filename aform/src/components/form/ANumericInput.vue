<template>
  <ATextInput
    :label="label"
    :readOnly="readOnly"
    :uuid="uuid"
    :validation="validation"
    v-model="amount"
  />
</template>
<script>


export default {
	name: 'ANumericInput',
  props: {
    value: { required: false },
    required: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    uuid: {
      type: Number,
      default: 0,
    },
    validation: {
      type: Object,
      default: () => ({errorMessage: '&nbsp;'}),
    }
  },
  data(){
    return {
      amount: '',
    }
  },
  methods: {
    update(value) {
      this.$emit("update:value", value);
    },
  }
};
</script>
<style scoped>
</style>