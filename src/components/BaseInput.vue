<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  min: {
    type: [String, Number],
    default: undefined,
  },
  max: {
    type: [String, Number],
    default: undefined,
  },
  step: {
    type: [String, Number],
    default: undefined,
  },
  autocomplete: {
    type: String,
    default: undefined,
  },
})

const emit = defineEmits(['update:modelValue'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="mb-1.5 block text-sm font-medium capitalize text-body">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
      <span v-else class="ml-1 text-xs font-normal text-muted"> (Optional) </span>
    </label>

    <input
      v-model="modelValue"
      :type="type"
      :placeholder="props.placeholder"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :min="min"
      :max="max"
      :step="step"
      :autocomplete="autocomplete"
      :aria-invalid="!!error"
      :class="[
        'w-full rounded border bg-white px-3 py-1.5 text-sm text-body',
        'placeholder:text-gray-400',
        'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100',
        'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
        'read-only:cursor-default read-only:bg-gray-50',
        error ? 'border-danger focus:border-danger' : 'border-gray-300 focus:border-primary',
      ]"
    />

    <small v-if="error" class="text-danger">{{ error[0] }}</small>
  </div>
</template>

<style scoped>
/* <BaseInput
  v-model="form.quantity"
  type="number"
  label="Quantity"
  placeholder="Enter quantity"
  :min="1"
  :step="1"
  required
/> */
</style>
