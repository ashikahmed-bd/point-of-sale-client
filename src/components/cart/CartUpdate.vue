<script setup>
import { useCartStore } from '@/stores/cart'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import { onMounted, reactive } from 'vue'

const cartStore = useCartStore()
const productStore = useProductStore()
const { product } = storeToRefs(productStore)

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const form = reactive({
  quantity: 1,
  variant_id: null,
  meta: {
    serials: [],
  },
})

const attributeSelected = (attribute, option) => {
  // Selected attribute update
  form.meta[attribute.slug] = option.name

  // Selected attributes wise variant
  const selectedOptions = form.meta

  const variant = (product.value?.variants ?? []).find((variant) => {
    return Object.entries(variant.options ?? {}).every(
      ([key, value]) => selectedOptions[key] === value,
    )
  })

  form.variant_id = variant?.id ?? null
}

const selectedSerial = (serial, checked) => {
  const exists = form.meta.serials.some((item) => item.id === serial.id)

  if (checked) {
    if (exists) return

    if (form.meta.serials.length >= form.quantity) {
      return
    }

    form.meta.serials.push({
      id: serial.id,
      serial_number: serial.serial_number,
    })
  } else {
    form.meta.serials = form.meta.serials.filter((item) => item.id !== serial.id)
  }
}

const update = async () => {
  await cartStore.update(props.item.id, form)
}

const loadProduct = async () => {
  await productStore.show(props.item?.product?.id)
}
onMounted(async () => {
  await loadProduct()

  const cartItem = cartStore.cart?.items?.find((item) => item.id === props.item?.id)

  if (cartItem) {
    form.quantity = cartItem.quantity
    form.variant_id = cartItem.variant_id
    form.meta = {
      ...cartItem.meta,
      serials: cartItem.meta?.serials ?? [],
    }
  }
})
</script>

<template>
  <UModal scrollable v-model:open="cartStore.dialog">
    <template #content>
      <div class="space-y-4 px-4 py-5">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-base font-bold text-slate-900">Select Serial Number</h2>
          <button @click="cartStore.dialog = false" type="button">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="flex items-center gap-3">
          <div
            class="flex shrink-0 items-center justify-center rounded border border-border bg-slate-50"
          >
            <img
              :src="props.item?.product.cover_url"
              :alt="props.item?.name"
              class="size-16 object-contain"
            />
          </div>

          <div class="min-w-0 flex-1 space-y-0.5">
            <h3 class="text-sm font-semibold text-slate-900">{{ props.item?.name }}</h3>
            <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
              <template v-for="(value, key) in item.meta" :key="key">
                <span v-if="key !== 'serials' && value != null">
                  {{ key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) }}:
                  {{ value }}
                </span>
              </template>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <span class="text-sm font-bold text-slate-900">৳ 75,000</span>
              <span class="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                Available: 5
              </span>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <div
            v-for="attribute in productStore.product?.attributes ?? []"
            :key="attribute.id"
            class="space-y-2"
          >
            <h3 class="text-xs font-semibold text-slate-700">
              {{ attribute.name }}
            </h3>

            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in attribute.options"
                :key="option.id"
                type="button"
                @click="attributeSelected(attribute, option)"
                :class="[
                  'rounded-md border px-2 py-1.5 text-sm transition',
                  form.meta[attribute.slug] === option.name
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-400',
                ]"
              >
                {{ option.name }}
              </button>
            </div>
          </div>
        </div>

        <div class="mb-3 grid grid-cols-[120px_1fr] items-end gap-4">
          <div class="flex items-center overflow-hidden rounded border border-border">
            <button
              type="button"
              class="flex w-8 shrink-0 items-center justify-center text-sm text-body hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="form.quantity <= 1"
              @click="form.quantity = Math.max(1, Number(form.quantity) - 1)"
            >
              <UIcon name="i-lucide-minus" class="size-4" />
            </button>

            <input
              v-model.number="form.quantity"
              type="number"
              min="1"
              step="1"
              class="bg-transparent appearance-none font-medium min-w-0 outline-none py-2 text-center text-xs"
              @input="form.quantity = Math.max(1, Math.floor(Number(form.quantity) || 1))"
            />

            <button
              type="button"
              class="flex w-8 shrink-0 items-center justify-center text-sm text-body hover:text-success"
              @click="form.quantity = Number(form.quantity || 1) + 1"
            >
              <UIcon name="i-lucide-plus" class="size-4" />
            </button>
          </div>

          <div class="rounded border border-border bg-blue-50 px-3 py-2 text-xs text-primary">
            Please select {{ form.quantity }} serial number(s). Selected:
            {{ form.meta.serials.length }} / {{ form.quantity }}
          </div>
        </div>

        <div class="flex items-center gap-2 rounded border border-border px-2.5 py-2">
          <UIcon name="i-lucide-search" class="size-4 shrink-0" />

          <input
            type="text"
            placeholder="Search or scan serial number (S/N) or IMEI..."
            class="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
          />
          <UIcon name="i-lucide-scan-line" class="size-4" />
        </div>

        <div class="overflow-y-auto rounded border border-border">
          <table class="w-full table-fixed text-left">
            <thead class="bg-slate-100 text-xs font-semibold text-slate-700">
              <tr>
                <th class="w-7 px-1.5 py-2">
                  <input type="checkbox" class="h-3 w-3 rounded border-slate-300 accent-blue-600" />
                </th>

                <th class="w-[25%] px-1 py-2">Serial Number</th>
                <th class="w-[19%] px-1 py-2">Status</th>
                <th class="w-[27%] px-1 py-2">Warranty</th>
                <th class="px-1 py-2">Purchase Date</th>
              </tr>
            </thead>

            <tbody v-if="product?.serials" class="divide-y divide-slate-200 text-xs text-slate-700">
              <tr v-for="serial in product?.serials" :key="serial.id">
                <td class="px-1.5 py-2">
                  <input
                    type="checkbox"
                    class="h-3 w-3 rounded accent-primary"
                    :checked="form.meta.serials.some((item) => item.id === serial.id)"
                    :disabled="
                      !form.meta.serials.some((item) => item.id === serial.id) &&
                      form.meta.serials.length >= form.quantity
                    "
                    @change="selectedSerial(serial, $event.target.checked)"
                  />
                </td>

                <td class="px-1 py-2 font-semibold">{{ serial.serial_number }}</td>

                <td class="px-1 py-2">
                  <span
                    class="whitespace-nowrap rounded px-1.5 py-1 text-[9px] font-medium capitalize"
                    :class="
                      serial.status === 'in_stock'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-600'
                    "
                  >
                    {{ serial.status.replaceAll('_', ' ') }}
                  </span>
                </td>

                <td class="px-1 py-1.5">
                  <div>
                    {{ serial.warranty_end_date ? 'Warranty' : 'No warranty' }}
                  </div>

                  <div class="text-[10px] text-slate-500">
                    {{ serial.warranty_end_date ?? 'N/A' }}
                  </div>
                </td>

                <td class="whitespace-nowrap px-1 py-2">
                  {{ serial.purchase_date ?? 'N/A' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <footer class="flex items-center justify-end gap-2">
          <button
            type="button"
            @click="cartStore.dialog = false"
            class="rounded-md border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            @click="update"
            :disabled="cartStore.loading"
            class="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/70 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UIcon
              v-if="cartStore.loading"
              name="i-lucide-loader-circle"
              class="h-4 w-4 animate-spin"
            />

            <span>{{ cartStore.loading ? 'Updating...' : 'Update' }}</span>
          </button>
        </footer>
      </div>
    </template>
  </UModal>
</template>
