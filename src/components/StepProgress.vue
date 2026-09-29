<script setup>
defineProps({
  current: {
    type: Number,
    default: 1,
  },
})

const steps = [
  {
    number: 1,
    title: 'Basic Information',
    description: 'Product details',
  },
  {
    number: 2,
    title: 'Pricing',
    description: 'Set product price',
  },
  {
    number: 3,
    title: 'Variants',
    description: 'Add product variants',
  },
  {
    number: 4,
    title: 'Media',
    description: 'Upload product images',
  },
  {
    number: 5,
    title: 'SEO',
    description: 'Search engine optimization',
  },
]
</script>

<template>
  <div class="rounded-xl border border-slate-200 bg-white px-4 py-5">
    <div class="relative">
      <div class="absolute left-[7%] right-[7%] top-4 hidden h-px bg-slate-200 sm:block" />

      <div class="relative grid grid-cols-2 gap-5 sm:grid-cols-5">
        <div
          v-for="step in steps"
          :key="step.number"
          class="relative flex flex-col items-center text-center"
        >
          <div
            class="relative z-10 flex size-8 items-center justify-center rounded-full border text-sm font-medium"
            :class="
              step.number <= current
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-slate-300 bg-white text-slate-500'
            "
          >
            <UIcon v-if="step.number < current" name="i-lucide-check" class="size-4" />

            <span v-else>
              {{ step.number }}
            </span>
          </div>

          <p
            class="mt-2 text-sm font-medium"
            :class="step.number === current ? 'text-indigo-600' : 'text-slate-700'"
          >
            {{ step.title }}
          </p>

          <p class="mt-0.5 text-sm text-slate-400">
            {{ step.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
