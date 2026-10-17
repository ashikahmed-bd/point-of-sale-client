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
  options: {
    type: Array,
    default: () => [],
  },
  required: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: 'Select option',
  },
  error: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
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
    </label>
    <select
      v-model="modelValue"
      :disabled="disabled"
      :required="required"
      :aria-invalid="!!error"
      :class="[
        'w-full rounded border bg-white px-3 py-1.5 text-sm text-gray-800',
        'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100',
        'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
        error ? 'border-danger focus:border-danger' : 'border-gray-300 focus:border-primary',
      ]"
    >
      <option value="" disabled>
        {{ props.placeholder }}
      </option>

      <option v-for="option in options" :key="option.id" :value="option.id">
        {{ option.name }}
      </option>
    </select>
    <small v-if="error" class="text-danger">{{ error[0] }}</small>
  </div>
</template>

<style scoped>
/* <BaseSelect label="Status" v-model="form.collection_id"
    :options="brands.map(brand => ({ id: brand.id, name: brand.name }))" /> */
</style>
