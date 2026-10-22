<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import Default from '@/layouts/Default.vue'
import { usePurchaseReturnStore } from '@/stores/purchase-return'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const purchaseReturns = usePurchaseReturnStore()
const { item } = storeToRefs(purchaseReturns)

const loading = ref(true)
const saving = ref(false)

const form = reactive({
  purchase_id: null,
  return_date: '',
  reference: '',
  note: '',
  items: [],
})

const subtotal = computed(() =>
  form.items.reduce((sum, row) => sum + Number(row.quantity || 0) * Number(row.unit_cost || 0), 0),
)

const discount = computed(() => form.items.reduce((sum, row) => sum + Number(row.discount || 0), 0))

const tax = computed(() => form.items.reduce((sum, row) => sum + Number(row.tax || 0), 0))

const total = computed(() => Math.max(0, subtotal.value - discount.value + tax.value))

const rowTotal = (row) =>
  Math.max(
    0,
    Number(row.quantity || 0) * Number(row.unit_cost || 0) -
      Number(row.discount || 0) +
      Number(row.tax || 0),
  )

const formatDateInput = (value) => {
  if (!value) return ''
  return String(value).slice(0, 10)
}

const loadForm = (data) => {
  if (!data) return

  form.purchase_id = data.purchase_id ?? data.purchase?.id ?? null
  form.return_date = formatDateInput(data.return_date)
  form.reference = data.reference ?? ''
  form.note = data.note ?? ''
  form.items = (data.items ?? []).map((row) => ({
    id: row.id,
    product_id: row.product_id ?? row.product?.id ?? null,
    variant_id: row.variant_id ?? row.variant?.id ?? null,
    product: row.product ?? null,
    variant: row.variant ?? null,
    quantity: Number(row.quantity ?? 0),
    unit_cost: Number(row.unit_cost ?? 0),
    discount: Number(row.discount ?? 0),
    tax: Number(row.tax ?? 0),
    total: Number(row.total ?? 0),
    reason: row.reason ?? '',
  }))
}

onMounted(async () => {
  try {
    await purchaseReturns.show(route.params.id)
    loadForm(item.value)
  } finally {
    loading.value = false
  }
})

watch(item, (value) => {
  if (value && !form.items.length) loadForm(value)
})

const removeItem = (index) => {
  form.items.splice(index, 1)
}

const update = async () => {
  saving.value = true

  try {
    await purchaseReturns.update(route.params.id, {
      purchase_id: form.purchase_id,
      return_date: form.return_date,
      reference: form.reference || null,
      note: form.note || null,
      subtotal: subtotal.value,
      discount: discount.value,
      tax: tax.value,
      shipping: Number(item.value?.shipping ?? 0),
      charge: Number(item.value?.charge ?? 0),
      total: total.value + Number(item.value?.shipping ?? 0) + Number(item.value?.charge ?? 0),
      items: form.items.map((row) => ({
        id: row.id,
        product_id: row.product_id,
        variant_id: row.variant_id,
        quantity: Number(row.quantity || 0),
        unit_cost: Number(row.unit_cost || 0),
        discount: Number(row.discount || 0),
        tax: Number(row.tax || 0),
        total: rowTotal(row),
        reason: row.reason || null,
      })),
    })

    await router.push({
      name: 'purchase-returns.show',
      params: { id: route.params.id },
    })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Default>
    <main class="space-y-4">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="mt-2 text-2xl font-semibold text-title">Edit Purchase Return</h1>
          <p class="mt-1 text-sm text-body">
            Update return information and returned product quantities.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="$router.back()"
            class="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>

      <div
        v-if="loading"
        class="rounded-xl border border-gray-200 bg-white p-8 text-center text-body"
      >
        Loading purchase return...
      </div>

      <template v-else-if="item">
        <div
          v-if="item.status !== 'draft'"
          class="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800"
        >
          Only draft purchase returns can be edited.
        </div>

        <section class="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
          <div>
            <h2 class="text-base font-semibold text-title">Return Information</h2>
            <p class="mt-1 text-sm text-body">Update the basic details for this return.</p>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-title">Purchase</label>
              <input
                :value="item.purchase?.purchase_no || '—'"
                type="text"
                disabled
                class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-title">Return Date *</label>
              <input
                v-model="form.return_date"
                type="date"
                required
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-title focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-title">Return No.</label>
              <input
                :value="item.return_no || '—'"
                type="text"
                disabled
                class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-title">Reference</label>
              <input
                v-model="form.reference"
                type="text"
                placeholder="Reference number (optional)"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-title focus:border-green-500 focus:outline-none"
              />
            </div>

            <div class="md:col-span-2">
              <label class="mb-1.5 block text-sm font-medium text-title">Note</label>
              <textarea
                v-model="form.note"
                rows="3"
                placeholder="Optional note"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-title focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>
        </section>

        <section class="rounded-xl border border-gray-200 bg-white">
          <div class="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-base font-semibold text-title">Return Items</h2>
              <p class="mt-1 text-sm text-body">
                Edit quantities, prices, discounts, tax, and item reasons.
              </p>
            </div>
            <span class="w-fit rounded bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700">
              {{ form.items.length }} {{ form.items.length === 1 ? 'Product' : 'Products' }}
            </span>
          </div>

          <div class="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Cost</th>
                  <th>Discount</th>
                  <th>Tax</th>
                  <th>Total</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(row, index) in form.items"
                  :key="row.id || `${row.product_id}-${index}`"
                >
                  <td>
                    <div class="flex items-center gap-3">
                      <img
                        v-if="row.product?.cover_url"
                        :src="row.product.cover_url"
                        :alt="row.product?.name || 'Product'"
                        class="h-12 w-12 shrink-0 rounded bg-gray-50 object-cover"
                      />
                      <div class="min-w-0">
                        <p class="font-medium text-title">
                          {{ row.product?.name || 'Unknown Product' }}
                        </p>
                        <p class="mt-1 text-xs text-body">Code: {{ row.product?.code || '—' }}</p>
                      </div>
                    </div>
                  </td>

                  <td>
                    <input
                      v-model.number="row.quantity"
                      type="number"
                      min="1"
                      class="w-20 rounded border border-gray-300 px-2 py-1.5 text-sm"
                    />
                  </td>

                  <td>
                    <input
                      v-model.number="row.unit_cost"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-28 rounded border border-gray-300 px-2 py-1.5 text-sm"
                    />
                  </td>

                  <td>
                    <input
                      v-model.number="row.discount"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-24 rounded border border-gray-300 px-2 py-1.5 text-sm"
                    />
                  </td>

                  <td>
                    <input
                      v-model.number="row.tax"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-24 rounded border border-gray-300 px-2 py-1.5 text-sm"
                    />
                  </td>

                  <td class="whitespace-nowrap font-medium text-title">
                    {{ $currency(rowTotal(row)) }}
                  </td>

                  <td>
                    <input
                      v-model="row.reason"
                      type="text"
                      placeholder="Reason"
                      class="w-40 rounded border border-gray-300 px-2 py-1.5 text-sm"
                    />
                  </td>

                  <td>
                    <button
                      type="button"
                      @click="removeItem(index)"
                      class="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>

                <tr v-if="!form.items.length">
                  <td colspan="8" class="py-8 text-center text-body">No return items found.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="px-4">
            <div class="ml-auto max-w-xs space-y-4 py-4">
              <div class="flex justify-between gap-4 text-sm">
                <span class="text-gray-500">Subtotal</span>
                <span class="font-medium text-gray-900">{{ $currency(subtotal) }}</span>
              </div>

              <div class="flex justify-between gap-4 text-sm">
                <span class="text-gray-500">Discount</span>
                <span class="font-medium text-gray-900">− {{ $currency(discount) }}</span>
              </div>

              <div class="flex justify-between gap-4 text-sm">
                <span class="text-gray-500">Tax</span>
                <span class="font-medium text-gray-900">{{ $currency(tax) }}</span>
              </div>

              <div class="flex justify-between gap-4 text-sm">
                <span class="text-gray-500">Shipping</span>
                <span class="font-medium text-gray-900">{{ $currency(item.shipping) }}</span>
              </div>

              <div class="flex justify-between gap-4 text-sm">
                <span class="text-gray-500">Other Charges</span>
                <span class="font-medium text-gray-900">{{ $currency(item.charge) }}</span>
              </div>

              <div class="border-t border-gray-200 pt-4">
                <div class="flex items-center justify-between gap-4">
                  <span class="font-semibold text-gray-900">Grand Total</span>
                  <span class="text-xl font-bold text-gray-900">
                    {{ $currency(total + Number(item.shipping || 0) + Number(item.charge || 0)) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="$router.back()"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            :disabled="saving || item.status !== 'draft'"
            @click="update"
            class="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ saving ? 'Updating...' : 'Update Return' }}
          </button>
        </div>
      </template>

      <div v-else class="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <h2 class="text-lg font-semibold text-title">Purchase return not found</h2>
        <p class="mt-2 text-sm text-body">The requested return could not be loaded.</p>
        <button
          type="button"
          @click="$router.back()"
          class="mt-5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Go Back
        </button>
      </div>
    </main>
  </Default>
</template>
