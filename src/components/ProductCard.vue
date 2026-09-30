<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const addToCart = async (product) => {
  await cartStore.add(product)
}
</script>

<template>
  <article
    @click="addToCart(product)"
    class="group relative cursor-pointer overflow-hidden rounded-md border border-gray-200 bg-white transition hover:border-violet-300"
  >
    <div
      class="relative flex aspect-square items-center justify-center overflow-hidden bg-gray-50 p-3"
    >
      <img
        src="https://placehold.co/600x600"
        :alt="product.name"
        class="h-full w-full object-contain mix-blend-multiply transition duration-300 group-hover:scale-105"
      />
    </div>

    <div class="space-y-1.5 p-2.5">
      <h3 class="truncate text-sm font-medium text-heading" :title="product.name">
        {{ product.name }}
      </h3>

      <div class="flex items-end justify-between gap-2">
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-primary">৳{{ product.selling_price }}</p>

          <p v-if="product.compare_price" class="truncate text-xs text-gray-400 line-through">
            ৳{{ product.compare_price }}
          </p>
        </div>

        <div v-if="product.track_stock" class="shrink-0 text-right">
          <p class="text-xs text-gray-400">Stock</p>
          <p class="text-xs font-medium text-gray-600">
            {{ product.max_stock }}
          </p>
        </div>
      </div>
    </div>
  </article>
</template>
