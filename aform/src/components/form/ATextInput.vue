<template>
  <div>
    <label :for="uuid">{{ label }} </label>
    <input
      :value="value"
      :required="required"
      :id="uuid"
      :disabled="readOnly"
      @input="update($event.target.value)"
    />
    <p v-show="validation.errorMessage" v-html="validation.errorMessage"></p>
  </div>
</template>

<script>
export default {
	name: 'ATextInput',
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
  methods: {
    update(value) {
      this.$emit("update:value", value);
    },
  }
};
</script>
<style scoped>
div {
  min-width: 40ch;
  border: 1px solid transparent;
  padding: 0rem;
  margin: 0rem;
  margin-right: 1ch;
}
input {
  width: 100%;
  outline: 1px solid transparent;
  border: 1px solid var(--primary-color);
  padding: 0rem;
  margin: 0rem;
  min-height: 1.15rem;
}
p, label {
  width: 100%;
  display: block;
  min-height: 1.15rem;
  padding: 0rem;
  margin: 0rem;
  border: 1px solid transparent;
}
input:focus {
  outline: 1px solid var(--primary-color);
}
</style>
