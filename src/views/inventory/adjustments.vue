<script setup>
import { computed, ref } from 'vue'
import Default from '@/layouts/Default.vue'

const search = ref('')
const adjustmentTypeFilter = ref('')
const warehouseFilter = ref('')
const dateFilter = ref('')

const products = ref([
  { id: 1, name: 'Paracetamol 500mg', sku: 'MED-001', stock: 250 },
  { id: 2, name: 'Vitamin C 1000mg', sku: 'SUP-002', stock: 50 },
  { id: 3, name: 'Amoxicillin 250mg', sku: 'MED-003', stock: 0 },
  { id: 4, name: 'Cough Syrup 100ml', sku: 'SYR-004', stock: 120 },
  { id: 5, name: 'Hand Sanitizer 500ml', sku: 'PCS-005', stock: 35 },
])

const adjustments = ref([
  {
    id: 1,
    reference: 'ADJ-0001',
    product: 'Paracetamol 500mg',
    sku: 'MED-001',
    warehouse: 'Main Warehouse',
    type: 'Increase',
    quantity: 50,
    before: 200,
    after: 250,
    reason: 'Stock Count Correction',
    date: '2026-10-11',
    user: 'Admin',
  },
  {
    id: 2,
    reference: 'ADJ-0002',
    product: 'Vitamin C 1000mg',
    sku: 'SUP-002',
    warehouse: 'Main Warehouse',
    type: 'Decrease',
    quantity: 10,
    before: 60,
    after: 50,
    reason: 'Damaged Goods',
    date: '2026-10-10',
    user: 'Admin',
  },
  {
    id: 3,
    reference: 'ADJ-0003',
    product: 'Amoxicillin 250mg',
    sku: 'MED-003',
    warehouse: 'Branch Warehouse',
    type: 'Decrease',
    quantity: 5,
    before: 5,
    after: 0,
    reason: 'Expired Products',
    date: '2026-10-09',
    user: 'Manager',
  },
  {
    id: 4,
    reference: 'ADJ-0004',
    product: 'Cough Syrup 100ml',
    sku: 'SYR-004',
    warehouse: 'Main Warehouse',
    type: 'Increase',
    quantity: 20,
    before: 100,
    after: 120,
    reason: 'Stock Count Correction',
    date: '2026-10-08',
    user: 'Admin',
  },
  {
    id: 5,
    reference: 'ADJ-0005',
    product: 'Hand Sanitizer 500ml',
    sku: 'PCS-005',
    warehouse: 'Branch Warehouse',
    type: 'Decrease',
    quantity: 15,
    before: 50,
    after: 35,
    reason: 'Damaged Goods',
    date: '2026-10-07',
    user: 'Manager',
  },
])

const form = ref({
  productId: '',
  warehouse: 'Main Warehouse',
  type: 'Increase',
  quantity: '',
  reason: '',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
})

const selectedProduct = computed(() =>
  products.value.find((product) => product.id === Number(form.value.productId)),
)

const currentStock = computed(() => selectedProduct.value?.stock ?? 0)

const previewStock = computed(() => {
  const quantity = Number(form.value.quantity) || 0

  if (form.value.type === 'Increase') return currentStock.value + quantity
  if (form.value.type === 'Decrease') return currentStock.value - quantity
  return quantity
})

const stats = computed(() => [
  {
    title: 'Total Adjustments',
    value: adjustments.value.length,
    icon: 'i-lucide-clipboard-list',
    color: 'text-primary bg-primary/10',
  },
  {
    title: 'Stock Increased',
    value: adjustments.value.filter((a) => a.type === 'Increase').length,
    icon: 'i-lucide-trending-up',
    color: 'text-green-600 bg-green-50',
  },
  {
    title: 'Stock Decreased',
    value: adjustments.value.filter((a) => a.type === 'Decrease').length,
    icon: 'i-lucide-trending-down',
    color: 'text-red-600 bg-red-50',
  },
  {
    title: 'Net Quantity Change',
    value: adjustments.value.reduce(
      (sum, a) => sum + (a.type === 'Increase' ? a.quantity : -a.quantity),
      0,
    ),
    icon: 'i-lucide-scale',
    color: 'text-blue-600 bg-blue-50',
  },
])

const filteredAdjustments = computed(() =>
  adjustments.value.filter((adjustment) => {
    const term = search.value.toLowerCase()

    const matchesSearch = `${adjustment.reference} ${adjustment.product} ${adjustment.sku}`
      .toLowerCase()
      .includes(term)

    const matchesType =
      !adjustmentTypeFilter.value || adjustment.type === adjustmentTypeFilter.value

    const matchesWarehouse =
      !warehouseFilter.value || adjustment.warehouse === warehouseFilter.value

    const matchesDate = !dateFilter.value || adjustment.date === dateFilter.value

    return matchesSearch && matchesType && matchesWarehouse && matchesDate
  }),
)

function clearFilters() {
  search.value = ''
  adjustmentTypeFilter.value = ''
  warehouseFilter.value = ''
  dateFilter.value = ''
}

function resetForm() {
  form.value = {
    productId: '',
    warehouse: 'Main Warehouse',
    type: 'Increase',
    quantity: '',
    reason: '',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  }
}

function formatDate(date) {
  if (!date) return '-'

  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function saveAdjustment() {
  const quantity = Number(form.value.quantity)

  if (
    !selectedProduct.value ||
    !form.value.warehouse ||
    !form.value.type ||
    !Number.isInteger(quantity) ||
    quantity <= 0 ||
    !form.value.reason ||
    !form.value.date
  ) {
    alert('Please fill in all required fields correctly.')
    return
  }

  if (form.value.type === 'Decrease' && quantity > currentStock.value) {
    alert('Adjustment quantity cannot exceed current stock.')
    return
  }

  if (form.value.date > new Date().toISOString().slice(0, 10)) {
    alert('Adjustment date cannot be in the future.')
    return
  }

  const product = selectedProduct.value
  const before = product.stock
  let after = before

  if (form.value.type === 'Increase') after = before + quantity
  else if (form.value.type === 'Decrease') after = before - quantity
  else after = quantity

  const reference = `ADJ-${String(Math.max(0, ...adjustments.value.map((a) => a.id)) + 1).padStart(
    4,
    '0',
  )}`

  product.stock = after

  adjustments.value.unshift({
    id: Math.max(0, ...adjustments.value.map((a) => a.id)) + 1,
    reference,
    product: product.name,
    sku: product.sku,
    warehouse: form.value.warehouse,
    type:
      form.value.type === 'Set Exact'
        ? after >= before
          ? 'Increase'
          : 'Decrease'
        : form.value.type,
    quantity: Math.abs(after - before),
    before,
    after,
    reason: form.value.reason,
    date: form.value.date,
    user: 'Admin',
    notes: form.value.notes,
  })

  alert(`Stock adjustment ${reference} created successfully.`)
  resetForm()
}
</script>

<template>
  <Default>
    <main class="space-y-4 p-4">
      <!-- Page Header -->
      <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Stock Adjustments</h1>
          <p class="mt-1 text-sm text-gray-500">
            Record stock corrections, damaged goods, expired items and other inventory changes.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            @click="clearFilters"
          >
            <UIcon name="i-lucide-rotate-ccw" class="size-4" />
            Reset Filters
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            @click="
              document?.getElementById('adjustment-form')?.scrollIntoView({ behavior: 'smooth' })
            "
          >
            <UIcon name="i-lucide-plus" class="size-4" />
            New Adjustment
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="item in stats"
          :key="item.title"
          class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm text-gray-500">{{ item.title }}</p>
              <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {{ item.value }}
              </p>
            </div>

            <div
              :class="['flex size-11 shrink-0 items-center justify-center rounded-xl', item.color]"
            >
              <UIcon :name="item.icon" class="size-5" />
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 items-start gap-4 2xl:grid-cols-3">
        <!-- Adjustment History -->
        <section
          class="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 2xl:col-span-2"
        >
          <div
            class="flex flex-col justify-between gap-3 border-b border-gray-100 p-4 dark:border-gray-800 sm:flex-row sm:items-center"
          >
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Adjustment History</h2>
              <p class="mt-1 text-xs text-gray-500">Track every inventory quantity correction.</p>
            </div>

            <span
              class="w-fit rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              {{ filteredAdjustments.length }} records
            </span>
          </div>

          <!-- Filters -->
          <div class="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
            <div class="relative">
              <UIcon
                name="i-lucide-search"
                class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
              />
              <input
                v-model="search"
                type="text"
                placeholder="Search reference, product..."
                class="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <select
              v-model="adjustmentTypeFilter"
              class="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Types</option>
              <option>Increase</option>
              <option>Decrease</option>
            </select>

            <select
              v-model="warehouseFilter"
              class="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Warehouses</option>
              <option>Main Warehouse</option>
              <option>Branch Warehouse</option>
            </select>

            <input
              v-model="dateFilter"
              type="date"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full min-w-[900px] text-left text-sm">
              <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/70">
                <tr>
                  <th class="px-4 py-3 font-medium">Reference</th>
                  <th class="px-4 py-3 font-medium">Product</th>
                  <th class="px-4 py-3 font-medium">Type</th>
                  <th class="px-4 py-3 text-right font-medium">Change</th>
                  <th class="px-4 py-3 text-right font-medium">Before</th>
                  <th class="px-4 py-3 text-right font-medium">After</th>
                  <th class="px-4 py-3 font-medium">Reason</th>
                  <th class="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr
                  v-for="adjustment in filteredAdjustments"
                  :key="adjustment.id"
                  class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40"
                >
                  <td class="whitespace-nowrap px-4 py-4">
                    <span class="font-medium text-primary">
                      {{ adjustment.reference }}
                    </span>
                    <p class="mt-1 text-xs text-gray-400">{{ adjustment.user }}</p>
                  </td>

                  <td class="px-4 py-4">
                    <p class="font-medium text-gray-800 dark:text-gray-100">
                      {{ adjustment.product }}
                    </p>
                    <p class="mt-1 text-xs text-gray-500">{{ adjustment.sku }}</p>
                  </td>

                  <td class="px-4 py-4">
                    <span
                      class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                      :class="
                        adjustment.type === 'Increase'
                          ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      "
                    >
                      <UIcon
                        :name="
                          adjustment.type === 'Increase'
                            ? 'i-lucide-trending-up'
                            : 'i-lucide-trending-down'
                        "
                        class="mr-1 size-3.5"
                      />
                      {{ adjustment.type }}
                    </span>
                  </td>

                  <td
                    class="px-4 py-4 text-right font-semibold"
                    :class="adjustment.type === 'Increase' ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ adjustment.type === 'Increase' ? '+' : '-' }}{{ adjustment.quantity }}
                  </td>

                  <td class="px-4 py-4 text-right text-gray-500">
                    {{ adjustment.before }}
                  </td>

                  <td class="px-4 py-4 text-right font-medium text-gray-800 dark:text-gray-200">
                    {{ adjustment.after }}
                  </td>

                  <td class="px-4 py-4">
                    <span class="text-gray-600 dark:text-gray-300">
                      {{ adjustment.reason }}
                    </span>
                    <p class="mt-1 text-xs text-gray-400">{{ adjustment.warehouse }}</p>
                  </td>

                  <td class="whitespace-nowrap px-4 py-4 text-gray-500">
                    {{ formatDate(adjustment.date) }}
                  </td>
                </tr>

                <tr v-if="filteredAdjustments.length === 0">
                  <td colspan="8" class="px-4 py-12 text-center">
                    <UIcon name="i-lucide-clipboard-list" class="mx-auto size-9 text-gray-300" />
                    <p class="mt-2 font-medium text-gray-700 dark:text-gray-300">
                      No adjustments found
                    </p>
                    <p class="mt-1 text-sm text-gray-500">Try another search keyword or filter.</p>
                    <button
                      type="button"
                      class="mt-3 text-sm font-medium text-primary hover:underline"
                      @click="clearFilters"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            class="flex flex-col justify-between gap-2 border-t border-gray-100 px-4 py-3 text-sm text-gray-500 dark:border-gray-800 sm:flex-row sm:items-center"
          >
            <span
              >Showing {{ filteredAdjustments.length }} of
              {{ adjustments.length }} adjustments</span
            >
            <span class="text-xs">Newest adjustments appear first.</span>
          </div>
        </section>

        <!-- New Adjustment Form -->
        <section
          id="adjustment-form"
          class="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
        >
          <div class="flex items-center gap-3 border-b border-gray-100 p-4 dark:border-gray-800">
            <div
              class="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
            >
              <UIcon name="i-lucide-sliders-horizontal" class="size-5" />
            </div>

            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">New Adjustment</h2>
              <p class="mt-1 text-xs text-gray-500">Correct the current stock quantity.</p>
            </div>
          </div>

          <form class="space-y-4 p-4" @submit.prevent="saveAdjustment">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Product <span class="text-red-500">*</span>
              </label>

              <select
                v-model="form.productId"
                required
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select product</option>
                <option v-for="product in products" :key="product.id" :value="String(product.id)">
                  {{ product.name }} ({{ product.sku }})
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Warehouse <span class="text-red-500">*</span>
              </label>

              <select
                v-model="form.warehouse"
                required
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option>Main Warehouse</option>
                <option>Branch Warehouse</option>
              </select>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Adjustment Type <span class="text-red-500">*</span>
              </label>

              <select
                v-model="form.type"
                required
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option>Increase</option>
                <option>Decrease</option>
                <option>Set Exact</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Stock
                </label>
                <input
                  :value="currentStock"
                  readonly
                  class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ form.type === 'Set Exact' ? 'New Stock' : 'Quantity' }}
                  <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="form.quantity"
                  type="number"
                  min="1"
                  step="1"
                  required
                  placeholder="Enter qty"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div
              class="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/60"
            >
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Stock after adjustment</span>
                <span
                  class="font-semibold"
                  :class="previewStock < 0 ? 'text-red-600' : 'text-gray-900 dark:text-white'"
                >
                  {{ selectedProduct && quantity !== '' ? previewStock : '—' }}
                </span>
              </div>
              <p v-if="previewStock < 0 && selectedProduct" class="mt-1 text-xs text-red-600">
                Quantity cannot reduce stock below zero.
              </p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reason <span class="text-red-500">*</span>
              </label>

              <select
                v-model="form.reason"
                required
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select reason</option>
                <option>Stock Count Correction</option>
                <option>Damaged Goods</option>
                <option>Expired Products</option>
                <option>Lost or Missing</option>
                <option>Opening Stock Correction</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Adjustment Date <span class="text-red-500">*</span>
              </label>

              <input
                v-model="form.date"
                type="date"
                :max="new Date().toISOString().slice(0, 10)"
                required
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Notes
              </label>

              <textarea
                v-model="form.notes"
                rows="3"
                placeholder="Add adjustment notes..."
                class="w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div
              class="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-xs leading-5 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
            >
              <UIcon name="i-lucide-info" class="mt-0.5 size-4 shrink-0" />
              <p>
                Confirm the physical stock count before saving an adjustment. This demo stores
                changes only in the current page state.
              </p>
            </div>

            <div class="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                @click="resetForm"
              >
                <UIcon name="i-lucide-rotate-ccw" class="size-4" />
                Reset
              </button>

              <button
                type="submit"
                class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
              >
                <UIcon name="i-lucide-save" class="size-4" />
                Save Adjustment
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  </Default>
</template>
