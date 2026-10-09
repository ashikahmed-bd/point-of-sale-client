<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'submit',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button
    :type="type"
    :disabled="loading"
    :class="[
      'inline-flex items-center justify-center rounded bg-primary px-4 py-1.5 text-gray-100 transition hover:opacity-90 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
      loading ? 'cursor-not-allowed' : 'cursor-pointer',
    ]"
  >
    <UIcon v-if="loading" name="i-lucide-loader" class="mr-2 size-5 animate-spin" />

    <span v-if="loading"> Please wait... </span>

    <slot v-else />
  </button>
</template>

<style scoped></style>
