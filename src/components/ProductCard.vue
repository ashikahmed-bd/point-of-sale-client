<script setup>
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const addToCart = async (product) => {
  await cartStore.add(product)
  await cartStore.getCart()

  const audio = new Audio('/pos.wav')
  await audio.play()
}
</script>

<template>
  <article
    @click="addToCart(product)"
    class="group relative cursor-pointer overflow-hidden rounded border border-border bg-white transition hover:border-primary"
  >
    <div
      class="relative flex aspect-square items-center justify-center overflow-hidden bg-gray-50 p-2.5 transition"
    >
      <img
        :src="product.cover_url"
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
          <p class="truncate text-sm font-semibold text-primary">
            {{ $currency(product.price) }}
          </p>

          <p v-if="product.base_price" class="truncate text-xs text-gray-400 line-through">
            {{ $currency(product.base_price) }}
          </p>
        </div>

        <div v-if="product.track_stock" class="shrink-0 text-right">
          <p class="text-xs font-medium text-muted">Stock {{ product.stock }}</p>
          <p class="bg-slate-100 px-2 py-0.5 text-2xs text-body border rounded-full">4 Variants</p>
        </div>
      </div>
    </div>
  </article>
</template>
