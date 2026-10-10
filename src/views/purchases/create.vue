<script setup>
import { computed, reactive } from 'vue'
import Default from '@/layouts/Default.vue'

const purchase = reactive({
  purchase_no: '',
  date: new Date().toISOString().slice(0, 10),
  supplier_id: '',
  status: 'received',
  currency: 'BDT',
  discount: 0,
  tax: 0,
  shipping: 0,
  paid_amount: 0,
  note: '',
  items: [
    {
      id: 1,
      product_id: '',
      name: '',
      sku: '',
      quantity: 1,
      unit_cost: 0,
      discount: 0,
      tax: 0,
    },
  ],
})

const suppliers = [
  { label: 'Rahim Traders', value: '1' },
  { label: 'Karim Enterprise', value: '2' },
  { label: 'Fashion Wholesale', value: '3' },
]

const products = [
  { id: '1', name: 'Premium Cotton T-Shirt', sku: 'TSH-001', unit_cost: 500 },
  { id: '2', name: 'Classic Slim Fit Shirt', sku: 'SHT-001', unit_cost: 650 },
  { id: '3', name: 'Men Premium Denim Jeans', sku: 'JNS-001', unit_cost: 850 },
]

const subtotal = computed(() =>
  purchase.items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.unit_cost || 0),
    0,
  ),
)

const total = computed(() =>
  Math.max(
    0,
    subtotal.value -
      Number(purchase.discount || 0) +
      Number(purchase.tax || 0) +
      Number(purchase.shipping || 0),
  ),
)

const dueAmount = computed(() => Math.max(0, total.value - Number(purchase.paid_amount || 0)))

function currency(value) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: purchase.currency,
    maximumFractionDigits: 2,
  }).format(Number(value || 0))
}

function addItem() {
  purchase.items.push({
    id: Date.now(),
    product_id: '',
    name: '',
    sku: '',
    quantity: 1,
    unit_cost: 0,
    discount: 0,
    tax: 0,
  })
}

function selectProduct(item) {
  const product = products.find((product) => product.id === item.product_id)

  if (!product) return

  item.name = product.name
  item.sku = product.sku
  item.unit_cost = product.unit_cost
}

function removeItem(index) {
  purchase.items.splice(index, 1)
}

function createPurchase() {
  const payload = {
    ...purchase,
    subtotal: subtotal.value,
    total: total.value,
    due_amount: dueAmount.value,
    items: purchase.items.map((item) => ({
      product_id: item.product_id,
      name: item.name,
      sku: item.sku,
      quantity: Number(item.quantity),
      unit_cost: Number(item.unit_cost),
      discount: Number(item.discount || 0),
      tax: Number(item.tax || 0),
      total: Math.max(
        0,
        Number(item.quantity || 0) * Number(item.unit_cost || 0) -
          Number(item.discount || 0) +
          Number(item.tax || 0),
      ),
    })),
  }

  // Connect your purchase store/API here.
  console.log('Create purchase payload:', payload)
}
</script>

<template>
  <Default>
    <main class="space-y-5 p-4">
      <!-- Page Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-start gap-3">
          <button
            type="button"
            @click="$router.push('/purchases')"
            class="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            <UIcon name="i-lucide-arrow-left" class="size-5" />
          </button>

          <div>
            <h1 class="text-xl font-bold text-slate-900">Create Purchase</h1>
            <p class="mt-1 text-sm text-slate-500">
              Add a new supplier purchase and manage inventory costs.
            </p>
          </div>
        </div>

        <span
          class="inline-flex w-fit items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary"
        >
          <UIcon name="i-lucide-file-plus" class="size-4" />
          New Purchase
        </span>
      </div>

      <form class="space-y-5" @submit.prevent="createPurchase">
        <!-- Purchase Information -->
        <section class="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div class="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
            <div
              class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
            >
              <UIcon name="i-lucide-file-text" class="size-5" />
            </div>
            <div>
              <h2 class="font-semibold text-slate-900">Purchase Information</h2>
              <p class="mt-1 text-sm text-slate-500">Enter the basic purchase details</p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">Purchase Number</label>
              <input
                v-model="purchase.purchase_no"
                type="text"
                placeholder="Auto-generated"
                class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              <p class="text-xs text-slate-400">Leave blank to generate automatically.</p>
            </div>

            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">
                Purchase Date <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="purchase.date"
                type="date"
                required
                class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">
                Supplier <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="purchase.supplier_id"
                required
                class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="" disabled>Select supplier</option>
                <option v-for="supplier in suppliers" :key="supplier.value" :value="supplier.value">
                  {{ supplier.label }}
                </option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">
                Status <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="purchase.status"
                required
                class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="draft">Draft</option>
                <option value="ordered">Ordered</option>
                <option value="received">Received</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Purchase Items -->
        <section class="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div
            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
              >
                <UIcon name="i-lucide-package" class="size-5" />
              </div>
              <div>
                <h2 class="font-semibold text-slate-900">Purchase Items</h2>
                <p class="mt-1 text-sm text-slate-500">Select products and enter quantities</p>
              </div>
            </div>

            <button
              type="button"
              @click="addItem"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
            >
              <UIcon name="i-lucide-plus" class="size-4" />
              Add Product
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-slate-50">
                <tr>
                  <th
                    class="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    #
                  </th>
                  <th
                    class="min-w-64 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Product
                  </th>
                  <th
                    class="min-w-32 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Unit Cost
                  </th>
                  <th
                    class="min-w-28 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Quantity
                  </th>
                  <th
                    class="min-w-32 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Discount
                  </th>
                  <th
                    class="min-w-32 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Tax
                  </th>
                  <th
                    class="min-w-32 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Total
                  </th>
                  <th
                    class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y divide-slate-100">
                <tr v-for="(item, index) in purchase.items" :key="item.id" class="align-top">
                  <td class="px-4 py-4 text-sm text-slate-500">{{ index + 1 }}</td>

                  <td class="px-4 py-4">
                    <select
                      v-model="item.product_id"
                      required
                      @change="selectProduct(item)"
                      class="form__control"
                    >
                      <option value="" disabled>Select product</option>
                      <option v-for="product in products" :key="product.id" :value="product.id">
                        {{ product.name }} ({{ product.sku }})
                      </option>
                    </select>
                    <p v-if="item.name" class="mt-1.5 text-xs text-slate-500">
                      SKU: {{ item.sku }}
                    </p>
                  </td>

                  <td class="px-4 py-4">
                    <input
                      v-model.number="item.unit_cost"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      class="form__control"
                    />
                  </td>

                  <td class="px-4 py-4">
                    <input
                      v-model.number="item.quantity"
                      type="number"
                      min="0.001"
                      step="0.001"
                      required
                      class="form__control"
                    />
                  </td>

                  <td class="px-4 py-4">
                    <input
                      v-model.number="item.discount"
                      type="number"
                      min="0"
                      step="0.01"
                      class="form__control"
                    />
                  </td>

                  <td class="px-4 py-4">
                    <input
                      v-model.number="item.tax"
                      type="number"
                      min="0"
                      step="0.01"
                      class="form__control"
                    />
                  </td>

                  <td
                    class="whitespace-nowrap px-4 py-4 text-right text-sm font-semibold text-slate-800"
                  >
                    {{
                      currency(
                        Math.max(
                          0,
                          Number(item.quantity || 0) * Number(item.unit_cost || 0) -
                            Number(item.discount || 0) +
                            Number(item.tax || 0),
                        ),
                      )
                    }}
                  </td>

                  <td class="px-4 py-4 text-center">
                    <button
                      type="button"
                      :disabled="purchase.items.length === 1"
                      @click="removeItem(index)"
                      class="inline-flex size-9 items-center justify-center rounded-lg text-rose-500 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-30"
                      title="Remove item"
                    >
                      <UIcon name="i-lucide-trash-2" class="size-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="border-t border-slate-200 bg-slate-50 px-5 py-3">
            <div class="flex flex-wrap items-center justify-between gap-3 text-sm">
              <span class="text-slate-500">
                Product lines:
                <strong class="text-slate-800">{{ purchase.items.length }}</strong>
              </span>
              <span class="text-slate-500">
                Total quantity:
                <strong class="text-slate-800">
                  {{
                    purchase.items
                      .reduce((sum, item) => sum + Number(item.quantity || 0), 0)
                      .toLocaleString('en-BD')
                  }}
                </strong>
              </span>
            </div>
          </div>
        </section>

        <!-- Note and Summary -->
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section class="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div class="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
              <div
                class="flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"
              >
                <UIcon name="i-lucide-notebook-text" class="size-5" />
              </div>
              <div>
                <h2 class="font-semibold text-slate-900">Purchase Note</h2>
                <p class="mt-1 text-sm text-slate-500">Additional information</p>
              </div>
            </div>

            <div class="p-5">
              <textarea
                v-model="purchase.note"
                rows="5"
                placeholder="Enter purchase notes..."
                class="w-full resize-y rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
              ></textarea>
            </div>
          </section>

          <section class="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div class="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
              <div
                class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
              >
                <UIcon name="i-lucide-calculator" class="size-5" />
              </div>
              <div>
                <h2 class="font-semibold text-slate-900">Purchase Summary</h2>
                <p class="mt-1 text-sm text-slate-500">Review totals and payment</p>
              </div>
            </div>

            <div class="space-y-4 p-5">
              <div class="flex items-center justify-between gap-4 text-sm">
                <span class="text-slate-500">Subtotal</span>
                <span class="font-semibold text-slate-800">{{ currency(subtotal) }}</span>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Overall Discount</label>
                  <input
                    v-model.number="purchase.discount"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Overall Tax</label>
                  <input
                    v-model.number="purchase.tax"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Shipping</label>
                  <input
                    v-model.number="purchase.shipping"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Paid Amount</label>
                  <input
                    v-model.number="purchase.paid_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div class="space-y-3 border-t border-dashed border-slate-200 pt-4">
                <div class="flex items-center justify-between gap-4">
                  <span class="font-semibold text-slate-900">Grand Total</span>
                  <span class="text-xl font-bold text-slate-900">{{ currency(total) }}</span>
                </div>

                <div class="flex items-center justify-between gap-4 text-sm">
                  <span class="text-slate-500">Paid Amount</span>
                  <span class="font-semibold text-emerald-700">
                    {{ currency(purchase.paid_amount) }}
                  </span>
                </div>

                <div
                  class="flex items-center justify-between gap-4 rounded-lg bg-rose-50 px-4 py-3"
                >
                  <span class="text-sm font-semibold text-rose-700">Outstanding Due</span>
                  <span class="text-lg font-bold text-rose-700">{{ currency(dueAmount) }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Actions -->
        <div
          class="flex flex-col-reverse gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p class="text-xs leading-5 text-slate-500">
            Check the supplier, products and payment details before creating.
          </p>

          <div class="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              @click="$router.push('/purchases')"
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              <UIcon name="i-lucide-plus-circle" class="size-4" />
              Create Purchase
            </button>
          </div>
        </div>
      </form>
    </main>
  </Default>
</template>
