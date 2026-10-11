<script setup>
import { computed, ref } from 'vue'
import Default from '@/layouts/Default.vue'

const search = ref('')
const category = ref('')
const warehouse = ref('')
const expiryStatus = ref('')
const fromDate = ref('')
const toDate = ref('')

const today = new Date()
today.setHours(0, 0, 0, 0)

function dateOffset(days) {
  const date = new Date(today)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const products = ref([
  {
    id: 1,
    name: 'Paracetamol 500mg',
    sku: 'MED-001',
    batch: 'PCM-2025-01',
    category: 'Medicine',
    warehouse: 'Main Warehouse',
    quantity: 120,
    cost: 2.5,
    expiryDate: dateOffset(-15),
  },
  {
    id: 2,
    name: 'Vitamin C 1000mg',
    sku: 'SUP-002',
    batch: 'VTC-2025-04',
    category: 'Supplement',
    warehouse: 'Main Warehouse',
    quantity: 45,
    cost: 12,
    expiryDate: dateOffset(-5),
  },
  {
    id: 3,
    name: 'Amoxicillin 250mg',
    sku: 'MED-003',
    batch: 'AMX-2025-02',
    category: 'Medicine',
    warehouse: 'Branch Warehouse',
    quantity: 30,
    cost: 6,
    expiryDate: dateOffset(0),
  },
  {
    id: 4,
    name: 'Cough Syrup 100ml',
    sku: 'SYR-004',
    batch: 'CS-2025-06',
    category: 'Syrup',
    warehouse: 'Main Warehouse',
    quantity: 18,
    cost: 50,
    expiryDate: dateOffset(7),
  },
  {
    id: 5,
    name: 'Hand Sanitizer 500ml',
    sku: 'PCS-005',
    batch: 'HS-2025-03',
    category: 'Personal Care',
    warehouse: 'Branch Warehouse',
    quantity: 24,
    cost: 85,
    expiryDate: dateOffset(20),
  },
  {
    id: 6,
    name: 'Antiseptic Solution',
    sku: 'MED-012',
    batch: 'AS-2025-05',
    category: 'Medicine',
    warehouse: 'Main Warehouse',
    quantity: 16,
    cost: 70,
    expiryDate: dateOffset(45),
  },
  {
    id: 7,
    name: 'Multivitamin Tablet',
    sku: 'SUP-010',
    batch: 'MVT-2025-09',
    category: 'Supplement',
    warehouse: 'Branch Warehouse',
    quantity: 60,
    cost: 9,
    expiryDate: dateOffset(-30),
  },
  {
    id: 8,
    name: 'Eye Drops 10ml',
    sku: 'MED-015',
    batch: 'ED-2025-02',
    category: 'Medicine',
    warehouse: 'Main Warehouse',
    quantity: 12,
    cost: 40,
    expiryDate: dateOffset(12),
  },
])

function daysUntilExpiry(product) {
  const expiry = new Date(`${product.expiryDate}T00:00:00`)
  return Math.ceil((expiry.getTime() - today.getTime()) / 86400000)
}

function getExpiryStatus(product) {
  const days = daysUntilExpiry(product)

  if (days < 0) return 'Expired'
  if (days <= 7) return 'Critical'
  if (days <= 30) return 'Expiring Soon'
  return 'Good'
}

const expiredProducts = computed(() =>
  products.value.filter((product) => daysUntilExpiry(product) < 0),
)

const expiringSoonProducts = computed(() =>
  products.value.filter((product) => {
    const days = daysUntilExpiry(product)
    return days >= 0 && days <= 30
  }),
)

const stats = computed(() => [
  {
    title: 'Expired Products',
    value: expiredProducts.value.length,
    icon: 'i-lucide-circle-alert',
    color: 'text-red-600 bg-red-50',
  },
  {
    title: 'Expiring in 7 Days',
    value: products.value.filter((p) => {
      const days = daysUntilExpiry(p)
      return days >= 0 && days <= 7
    }).length,
    icon: 'i-lucide-calendar-clock',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    title: 'Expiring in 30 Days',
    value: expiringSoonProducts.value.length,
    icon: 'i-lucide-calendar-days',
    color: 'text-orange-600 bg-orange-50',
  },
  {
    title: 'Expired Stock Value',
    value:
      '৳' +
      expiredProducts.value
        .reduce((sum, p) => sum + p.quantity * p.cost, 0)
        .toLocaleString('en-BD', { maximumFractionDigits: 2 }),
    icon: 'i-lucide-wallet',
    color: 'text-primary bg-primary/10',
  },
])

const filteredProducts = computed(() =>
  products.value
    .filter((product) => {
      const term = search.value.toLowerCase()

      const matchesSearch = `${product.name} ${product.sku} ${product.batch}`
        .toLowerCase()
        .includes(term)

      const matchesCategory = !category.value || product.category === category.value

      const matchesWarehouse = !warehouse.value || product.warehouse === warehouse.value

      const matchesStatus = !expiryStatus.value || getExpiryStatus(product) === expiryStatus.value

      const matchesFrom = !fromDate.value || product.expiryDate >= fromDate.value

      const matchesTo = !toDate.value || product.expiryDate <= toDate.value

      return (
        matchesSearch &&
        matchesCategory &&
        matchesWarehouse &&
        matchesStatus &&
        matchesFrom &&
        matchesTo
      )
    })
    .sort((a, b) => a.expiryDate.localeCompare(b.expiryDate)),
)

function clearFilters() {
  search.value = ''
  category.value = ''
  warehouse.value = ''
  expiryStatus.value = ''
  fromDate.value = ''
  toDate.value = ''
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function markAsDisposed(product) {
  const confirmed = window.confirm(`Dispose ${product.name} (Batch: ${product.batch})?`)

  if (!confirmed) return

  products.value = products.value.filter((item) => item.id !== product.id)
}
</script>

<template>
  <Default>
    <main class="space-y-4 p-4">
      <!-- Page Header -->
      <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Expired Products</h1>

            <span
              class="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400"
            >
              {{ expiredProducts.length }} expired
            </span>
          </div>

          <p class="mt-1 text-sm text-gray-500">
            Monitor product expiry dates, identify expired batches, and manage stock disposal.
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
            @click="alert('Connect this button to your inventory export endpoint.')"
          >
            <UIcon name="i-lucide-download" class="size-4" />
            Export Report
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

      <!-- Expiry Alert -->
      <div
        v-if="expiredProducts.length"
        class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/10"
      >
        <UIcon name="i-lucide-triangle-alert" class="mt-0.5 size-5 shrink-0 text-red-600" />

        <div>
          <p class="text-sm font-medium text-red-800 dark:text-red-300">
            Expired stock requires attention
          </p>
          <p class="mt-1 text-sm text-red-700 dark:text-red-400">
            {{ expiredProducts.length }} products have passed their expiry date. Review these
            batches and follow your stock disposal policy.
          </p>
        </div>
      </div>

      <!-- Products Table -->
      <section
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
      >
        <div
          class="flex flex-col justify-between gap-3 border-b border-gray-100 p-4 dark:border-gray-800 sm:flex-row sm:items-center"
        >
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Product Expiry List</h2>
            <p class="mt-1 text-xs text-gray-500">
              Search products and filter by expiry date, warehouse, or status.
            </p>
          </div>

          <span
            class="w-fit rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            {{ filteredProducts.length }} results
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
              placeholder="Search product, SKU or batch..."
              class="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <select
            v-model="category"
            class="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Categories</option>
            <option>Medicine</option>
            <option>Supplement</option>
            <option>Syrup</option>
            <option>Personal Care</option>
          </select>

          <select
            v-model="warehouse"
            class="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Warehouses</option>
            <option>Main Warehouse</option>
            <option>Branch Warehouse</option>
          </select>

          <select
            v-model="expiryStatus"
            class="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Expiry Status</option>
            <option>Expired</option>
            <option>Critical</option>
            <option>Expiring Soon</option>
            <option>Good</option>
          </select>

          <div>
            <label class="mb-1 block text-xs text-gray-500">Expiry From</label>
            <input
              v-model="fromDate"
              type="date"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs text-gray-500">Expiry To</label>
            <input
              v-model="toDate"
              type="date"
              :min="fromDate || undefined"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/70">
              <tr>
                <th class="px-4 py-3 font-medium">#</th>
                <th class="px-4 py-3 font-medium">Product</th>
                <th class="px-4 py-3 font-medium">Batch No.</th>
                <th class="px-4 py-3 font-medium">Warehouse</th>
                <th class="px-4 py-3 text-right font-medium">Quantity</th>
                <th class="px-4 py-3 font-medium">Expiry Date</th>
                <th class="px-4 py-3 font-medium">Time Remaining</th>
                <th class="px-4 py-3 text-right font-medium">Stock Value</th>
                <th class="px-4 py-3 font-medium">Status</th>
                <th class="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="(product, index) in filteredProducts"
                :key="product.id"
                class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40"
              >
                <td class="px-4 py-4 text-gray-500">{{ index + 1 }}</td>

                <td class="px-4 py-4">
                  <p class="font-medium text-gray-800 dark:text-gray-100">
                    {{ product.name }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500">
                    {{ product.sku }} · {{ product.category }}
                  </p>
                </td>

                <td class="px-4 py-4">
                  <span
                    class="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {{ product.batch }}
                  </span>
                </td>

                <td class="px-4 py-4 text-gray-500">
                  {{ product.warehouse }}
                </td>

                <td class="px-4 py-4 text-right font-medium text-gray-800 dark:text-gray-200">
                  {{ product.quantity }}
                </td>

                <td
                  class="whitespace-nowrap px-4 py-4"
                  :class="
                    daysUntilExpiry(product) < 0
                      ? 'font-medium text-red-600'
                      : 'text-gray-600 dark:text-gray-300'
                  "
                >
                  {{ formatDate(product.expiryDate) }}
                </td>

                <td class="px-4 py-4">
                  <span
                    class="whitespace-nowrap text-xs font-medium"
                    :class="{
                      'text-red-600': daysUntilExpiry(product) < 0,
                      'text-amber-600':
                        daysUntilExpiry(product) >= 0 && daysUntilExpiry(product) <= 7,
                      'text-orange-600':
                        daysUntilExpiry(product) > 7 && daysUntilExpiry(product) <= 30,
                      'text-green-600': daysUntilExpiry(product) > 30,
                    }"
                  >
                    <template v-if="daysUntilExpiry(product) < 0">
                      Expired {{ Math.abs(daysUntilExpiry(product)) }} days ago
                    </template>
                    <template v-else-if="daysUntilExpiry(product) === 0"> Expires today </template>
                    <template v-else> {{ daysUntilExpiry(product) }} days left </template>
                  </span>
                </td>

                <td
                  class="whitespace-nowrap px-4 py-4 text-right font-medium text-gray-800 dark:text-gray-200"
                >
                  ৳{{
                    (product.quantity * product.cost).toLocaleString('en-BD', {
                      maximumFractionDigits: 2,
                    })
                  }}
                </td>

                <td class="px-4 py-4">
                  <span
                    class="inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="{
                      'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400':
                        getExpiryStatus(product) === 'Expired',
                      'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400':
                        getExpiryStatus(product) === 'Critical',
                      'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400':
                        getExpiryStatus(product) === 'Expiring Soon',
                      'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400':
                        getExpiryStatus(product) === 'Good',
                    }"
                  >
                    {{ getExpiryStatus(product) }}
                  </span>
                </td>

                <td class="px-4 py-4 text-right">
                  <button
                    v-if="getExpiryStatus(product) === 'Expired'"
                    type="button"
                    class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20"
                    @click="markAsDisposed(product)"
                  >
                    <UIcon name="i-lucide-trash-2" class="size-3.5" />
                    Dispose
                  </button>

                  <button
                    v-else
                    type="button"
                    class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:border-primary hover:text-primary dark:border-gray-700 dark:text-gray-300"
                    @click="
                      alert(`Batch: ${product.batch}\nExpiry: ${formatDate(product.expiryDate)}`)
                    "
                  >
                    <UIcon name="i-lucide-eye" class="size-3.5" />
                    Details
                  </button>
                </td>
              </tr>

              <tr v-if="filteredProducts.length === 0">
                <td colspan="10" class="px-4 py-12 text-center">
                  <UIcon name="i-lucide-calendar-check" class="mx-auto size-9 text-gray-300" />
                  <p class="mt-2 font-medium text-gray-700 dark:text-gray-300">
                    No matching products found
                  </p>
                  <p class="mt-1 text-sm text-gray-500">
                    Try changing the search keyword or filters.
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

        <!-- Footer -->
        <div
          class="flex flex-col justify-between gap-2 border-t border-gray-100 px-4 py-3 text-sm text-gray-500 dark:border-gray-800 sm:flex-row sm:items-center"
        >
          <span> Showing {{ filteredProducts.length }} of {{ products.length }} products </span>
          <span class="text-xs"> Expiry status is calculated using the current date. </span>
        </div>
      </section>
    </main>
  </Default>
</template>
