<script setup>
import { computed, reactive, ref } from 'vue'
import { useCartStore } from '@/stores/cart'

const toast = useToast()
const cartStore = useCartStore()

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const form = reactive({
  product_id: null,
  variant_id: null,
  quantity: 1,
  serial_number: null,
})

const selectedOptions = ref({})

const selectOption = (attribute, option) => {
  selectedOptions.value[attribute.slug] = option.name

  const variant = props.product.variants?.find((variant) =>
    props.product.attributes.every(
      (attribute) => variant.options?.[attribute.slug] === selectedOptions.value[attribute.slug],
    ),
  )

  form.variant_id = variant?.id ?? null
}

const addToCart = async (product) => {
  const response = await cartStore.add(product)

  if (response.data?.success) {
    await cartStore.getCart()

    new Audio('/pos.wav').play()

    // Show success message
    toast.add({
      title: 'Success',
      description: response.data.message,
      color: 'success',
    })
  }

  // if (product.has_variants || product.track_serial_number) {
  //   cartStore.dialog = true
  //   return
  // }
}

const maxStock = computed(() => {
  if (form.variant_id) {
    const variant = props.product.variants?.find((item) => item.id === form.variant_id)

    return variant?.stock ?? 0
  }

  return props.product.stock ?? 0
})
</script>

<template>
  <article
    @click="addToCart(props.product)"
    class="group cursor-pointer overflow-hidden rounded border border-border bg-white transition hover:border-primary"
  >
    <div class="flex aspect-square items-center justify-center overflow-hidden bg-gray-50 p-2.5">
      <img :src="product.cover_url" :alt="product.name" class="h-full w-full object-contain" />
    </div>

    <div class="space-y-1.5 p-2.5">
      <h3 class="truncate text-sm font-medium text-heading" :title="product.name">
        {{ product.name }}
      </h3>

      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-primary">
            {{ $currency(product.price) }}
          </p>

          <p v-if="product.base_price" class="truncate text-xs text-gray-400 line-through">
            {{ $currency(product.base_price) }}
          </p>
        </div>

        <div class="shrink-0 text-right">
          <p class="text-2xs font-medium text-muted">Stock {{ product.stock }}</p>

          <p
            class="inline-block rounded-full border border-primary/20 bg-primary/10 px-1.5 text-2xs text-body"
          >
            <template v-if="product.has_variants"> {{ product.variants_count }} Variants </template>
            <template v-else> Sold {{ product.sold_count }} </template>
          </p>
        </div>
      </div>
    </div>
  </article>
</template>
