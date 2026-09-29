<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

function addToCart(product) {
  const item = cart.value.find((item) => item.id === product.id)

  if (item) {
    item.quantity++
    return
  }

  cart.value.push({
    id: product.id,
    name: product.name,
    variant: '',
    price: product.price,
    quantity: 1,
    image: product.image,
  })
}
</script>

<template>
  <article
    class="group overflow-hidden rounded border border-border bg-white p-2 transition hover:border-primary"
  >
    <div class="flex items-center justify-center overflow-hidden rounded bg-slate-50">
      <img
        src="https://placehold.co/600x600"
        :alt="product.name"
        class="object-cover aspect-auto w-full mix-blend-multiply transition duration-200 group-hover:scale-105"
      />
    </div>

    <div class="mt-2 space-y-1">
      <h3 class="truncate text-sm font-semibold leading-5 text-slate-800" :title="product.name">
        {{ product.name }}
      </h3>

      <div class="flex items-center justify-between gap-2">
        <span class="text-sm font-semibold text-body"> ${{ product.price }} </span>

        <span class="shrink-0 text-xs font-medium text-muted"> Qty: {{ product.stock }} </span>
      </div>
    </div>
  </article>
</template>
