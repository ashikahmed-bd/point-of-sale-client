<script setup>
import { computed, ref } from 'vue'
import Default from '@/layouts/Default.vue'

const search = ref('')
const statusFilter = ref('')
const dateFilter = ref('')

const warehouses = [
  { id: 1, name: 'Main Warehouse' },
  { id: 2, name: 'Branch Warehouse' },
  { id: 3, name: 'Dhaka Warehouse' },
]

const products = ref([
  { id: 1, name: 'Paracetamol 500mg', sku: 'MED-001', stock: 250 },
  { id: 2, name: 'Vitamin C 1000mg', sku: 'SUP-002', stock: 100 },
  { id: 3, name: 'Amoxicillin 250mg', sku: 'MED-003', stock: 80 },
  { id: 4, name: 'Cough Syrup 100ml', sku: 'SYR-004', stock: 120 },
  { id: 5, name: 'Hand Sanitizer 500ml', sku: 'PCS-005', stock: 60 },
])

const transfers = ref([
  {
    id: 1,
    reference: 'TRF-0001',
    product: 'Paracetamol 500mg',
    sku: 'MED-001',
    from: 'Main Warehouse',
    to: 'Branch Warehouse',
    quantity: 25,
    status: 'Completed',
    date: '2026-10-11',
    createdBy: 'Admin',
  },
  {
    id: 2,
    reference: 'TRF-0002',
    product: 'Vitamin C 1000mg',
    sku: 'SUP-002',
    from: 'Main Warehouse',
    to: 'Dhaka Warehouse',
    quantity: 15,
    status: 'Pending',
    date: '2026-10-11',
    createdBy: 'Admin',
  },
  {
    id: 3,
    reference: 'TRF-0003',
    product: 'Amoxicillin 250mg',
    sku: 'MED-003',
    from: 'Branch Warehouse',
    to: 'Main Warehouse',
    quantity: 10,
    status: 'In Transit',
    date: '2026-10-10',
    createdBy: 'Manager',
  },
  {
    id: 4,
    reference: 'TRF-0004',
    product: 'Cough Syrup 100ml',
    sku: 'SYR-004',
    from: 'Main Warehouse',
    to: 'Branch Warehouse',
    quantity: 20,
    status: 'Completed',
    date: '2026-10-09',
    createdBy: 'Admin',
  },
  {
    id: 5,
    reference: 'TRF-0005',
    product: 'Hand Sanitizer 500ml',
    sku: 'PCS-005',
    from: 'Dhaka Warehouse',
    to: 'Branch Warehouse',
    quantity: 8,
    status: 'Cancelled',
    date: '2026-10-08',
    createdBy: 'Manager',
  },
])

const form = ref({
  productId: '',
  from: 'Main Warehouse',
  to: 'Branch Warehouse',
  quantity: '',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
})

const selectedProduct = computed(() =>
  products.value.find((p) => p.id === Number(form.value.productId)),
)

const filteredTransfers = computed(() =>
  transfers.value.filter((transfer) => {
    const term = search.value.toLowerCase()

    const matchesSearch = `${transfer.reference} ${transfer.product} ${transfer.sku}`
      .toLowerCase()
      .includes(term)

    const matchesStatus = !statusFilter.value || transfer.status === statusFilter.value

    const matchesDate = !dateFilter.value || transfer.date === dateFilter.value

    return matchesSearch && matchesStatus && matchesDate
  }),
)

const stats = computed(() => [
  {
    title: 'Total Transfers',
    value: transfers.value.length,
    icon: 'i-lucide-arrow-left-right',
    color: 'text-primary bg-primary/10',
  },
  {
    title: 'Pending Transfers',
    value: transfers.value.filter((t) => t.status === 'Pending').length,
    icon: 'i-lucide-clock',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    title: 'In Transit',
    value: transfers.value.filter((t) => t.status === 'In Transit').length,
    icon: 'i-lucide-truck',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    title: 'Completed Transfers',
    value: transfers.value.filter((t) => t.status === 'Completed').length,
    icon: 'i-lucide-circle-check',
    color: 'text-green-600 bg-green-50',
  },
])

function clearFilters() {
  search.value = ''
  statusFilter.value = ''
  dateFilter.value = ''
}

function resetForm() {
  form.value = {
    productId: '',
    from: 'Main Warehouse',
    to: 'Branch Warehouse',
    quantity: '',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  }
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function statusClass(status) {
  return {
    'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400': status === 'Pending',
    'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400': status === 'In Transit',
    'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400': status === 'Completed',
    'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400': status === 'Cancelled',
  }
}

function createTransfer() {
  const quantity = Number(form.value.quantity)

  if (
    !selectedProduct.value ||
    !form.value.from ||
    !form.value.to ||
    form.value.from === form.value.to ||
    !Number.isInteger(quantity) ||
    quantity <= 0 ||
    !form.value.date
  ) {
    alert('Please fill in all required fields and select different warehouses.')
    return
  }

  if (quantity > selectedProduct.value.stock) {
    alert('Transfer quantity cannot exceed the available demo stock.')
    return
  }

  if (form.value.date > new Date().toISOString().slice(0, 10)) {
    alert('Transfer date cannot be in the future.')
    return
  }

  const nextId = Math.max(0, ...transfers.value.map((t) => t.id)) + 1

  transfers.value.unshift({
    id: nextId,
    reference: `TRF-${String(nextId).padStart(4, '0')}`,
    product: selectedProduct.value.name,
    sku: selectedProduct.value.sku,
    from: form.value.from,
    to: form.value.to,
    quantity,
    status: 'Pending',
    date: form.value.date,
    createdBy: 'Admin',
    notes: form.value.notes,
  })

  alert('Transfer request created successfully.')
  resetForm()
}
</script>

<template>
  <Default>
    <main class="space-y-4 p-4">
      <!-- Page Header -->
      <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Stock Transfers</h1>
          <p class="mt-1 text-sm text-gray-500">
            Transfer inventory between warehouses and track transfer status.
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
              document?.getElementById('transfer-form')?.scrollIntoView({ behavior: 'smooth' })
            "
          >
            <UIcon name="i-lucide-plus" class="size-4" />
            New Transfer
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

      <!-- Transfer Information -->
      <div
        class="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/10"
      >
        <UIcon name="i-lucide-info" class="mt-0.5 size-5 shrink-0 text-blue-600" />
        <div>
          <p class="text-sm font-medium text-blue-800 dark:text-blue-300">
            Warehouse transfer workflow
          </p>
          <p class="mt-1 text-sm text-blue-700 dark:text-blue-400">
            New transfers start as Pending. Confirm dispatch and receipt in your backend workflow
            before changing warehouse stock.
          </p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 items-start gap-4 2xl:grid-cols-3">
        <!-- Transfer History -->
        <section
          class="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 2xl:col-span-2"
        >
          <div
            class="flex flex-col justify-between gap-3 border-b border-gray-100 p-4 dark:border-gray-800 sm:flex-row sm:items-center"
          >
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Transfer History</h2>
              <p class="mt-1 text-xs text-gray-500">
                Review transfers, quantities, source and destination warehouses.
              </p>
            </div>

            <span
              class="w-fit rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              {{ filteredTransfers.length }} records
            </span>
          </div>

          <!-- Filters -->
          <div class="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
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
              v-model="statusFilter"
              class="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Statuses</option>
              <option>Pending</option>
              <option>In Transit</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>

            <input
              v-model="dateFilter"
              type="date"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/70">
                <tr>
                  <th class="px-4 py-3 font-medium">Reference</th>
                  <th class="px-4 py-3 font-medium">Product</th>
                  <th class="px-4 py-3 font-medium">Warehouse Route</th>
                  <th class="px-4 py-3 text-right font-medium">Quantity</th>
                  <th class="px-4 py-3 font-medium">Date</th>
                  <th class="px-4 py-3 font-medium">Status</th>
                  <th class="px-4 py-3 font-medium">Created By</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr
                  v-for="transfer in filteredTransfers"
                  :key="transfer.id"
                  class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40"
                >
                  <td class="whitespace-nowrap px-4 py-4">
                    <span class="font-medium text-primary">
                      {{ transfer.reference }}
                    </span>
                  </td>

                  <td class="px-4 py-4">
                    <p class="font-medium text-gray-800 dark:text-gray-100">
                      {{ transfer.product }}
                    </p>
                    <p class="mt-1 text-xs text-gray-500">{{ transfer.sku }}</p>
                  </td>

                  <td class="px-4 py-4">
                    <div class="flex items-center gap-2">
                      <span class="truncate text-xs text-gray-600 dark:text-gray-300">
                        {{ transfer.from }}
                      </span>
                      <UIcon name="i-lucide-arrow-right" class="size-4 shrink-0 text-primary" />
                      <span class="truncate text-xs text-gray-600 dark:text-gray-300">
                        {{ transfer.to }}
                      </span>
                    </div>
                  </td>

                  <td class="px-4 py-4 text-right font-semibold text-gray-800 dark:text-gray-200">
                    {{ transfer.quantity }}
                  </td>

                  <td class="whitespace-nowrap px-4 py-4 text-gray-500">
                    {{ formatDate(transfer.date) }}
                  </td>

                  <td class="px-4 py-4">
                    <span
                      class="inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium"
                      :class="statusClass(transfer.status)"
                    >
                      {{ transfer.status }}
                    </span>
                  </td>

                  <td class="px-4 py-4 text-gray-500">
                    {{ transfer.createdBy }}
                  </td>
                </tr>

                <tr v-if="filteredTransfers.length === 0">
                  <td colspan="7" class="px-4 py-12 text-center">
                    <UIcon name="i-lucide-arrow-left-right" class="mx-auto size-9 text-gray-300" />
                    <p class="mt-2 font-medium text-gray-700 dark:text-gray-300">
                      No transfers found
                    </p>
                    <p class="mt-1 text-sm text-gray-500">
                      Try changing your search keyword or filters.
                    </p>
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
            <span>Showing {{ filteredTransfers.length }} of {{ transfers.length }} transfers</span>
            <span class="text-xs">Newest transfers appear first.</span>
          </div>
        </section>

        <!-- Create Transfer Form -->
        <section
          id="transfer-form"
          class="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
        >
          <div class="flex items-center gap-3 border-b border-gray-100 p-4 dark:border-gray-800">
            <div
              class="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
            >
              <UIcon name="i-lucide-truck" class="size-5" />
            </div>

            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">New Stock Transfer</h2>
              <p class="mt-1 text-xs text-gray-500">Move stock between warehouses.</p>
            </div>
          </div>

          <form class="space-y-4 p-4" @submit.prevent="createTransfer">
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
                From Warehouse <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.from"
                required
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option v-for="item in warehouses" :key="item.id" :value="item.name">
                  {{ item.name }}
                </option>
              </select>
            </div>

            <div class="flex justify-center">
              <div
                class="flex size-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800"
              >
                <UIcon name="i-lucide-arrow-down" class="size-4" />
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                To Warehouse <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.to"
                required
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option v-for="item in warehouses" :key="item.id" :value="item.name">
                  {{ item.name }}
                </option>
              </select>
              <p v-if="form.from === form.to" class="mt-1.5 text-xs text-red-500">
                Source and destination must be different.
              </p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Available Stock
                </label>
                <input
                  :value="selectedProduct ? selectedProduct.stock : 0"
                  readonly
                  class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quantity <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="form.quantity"
                  type="number"
                  min="1"
                  :max="selectedProduct?.stock || undefined"
                  step="1"
                  required
                  placeholder="Enter qty"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div
              v-if="selectedProduct && Number(form.quantity) > selectedProduct.stock"
              class="rounded-lg bg-red-50 p-3 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-400"
            >
              Transfer quantity exceeds the available demo stock.
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Transfer Date <span class="text-red-500">*</span>
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
                placeholder="Add transfer notes..."
                class="w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div
              class="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-xs leading-5 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
            >
              <UIcon name="i-lucide-info" class="mt-0.5 size-4 shrink-0" />
              <p>
                A new transfer starts as Pending. This demo creates a request but does not deduct
                stock or update destination inventory.
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
                :disabled="form.from === form.to"
                class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <UIcon name="i-lucide-send" class="size-4" />
                Create Transfer
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  </Default>
</template>
