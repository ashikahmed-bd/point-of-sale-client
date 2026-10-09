<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: 'i-lucide-inbox',
  },

  title: {
    type: String,
    default: 'No data found',
  },

  description: {
    type: String,
    default: 'There is nothing to display right now.',
  },

  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center rounded-2xl bg-white px-4 py-10 text-center"
  >
    <div class="mb-4 flex size-16 items-center justify-center rounded-full bg-light">
      <Icon :name="props.icon" class="size-8 text-body" />
    </div>

    <h2 class="text-lg font-semibold text-title">{{ props.title }}</h2>

    <p class="mt-2 max-w-md text-sm text-body">
      {{ props.description }}
    </p>
    <slot />
  </div>
</template>
