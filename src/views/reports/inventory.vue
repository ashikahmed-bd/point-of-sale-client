<template>
  <Default>
    <main class="space-y-6 p-4">
      <!-- Page Header -->
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Inventory Reports</h1>
          <p class="mt-1 text-sm text-gray-500">
            Monitor stock levels, inventory value and product availability.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="exportCSV"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <UIcon name="i-lucide-download" class="size-4" />
            Export CSV
          </button>

          <button
            @click="printReport"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            <UIcon name="i-lucide-printer" class="size-4" />
            Print Report
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.title"
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ stat.title }}
              </p>
              <h2 class="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
                {{ stat.value }}
              </h2>
              <p class="mt-2 text-xs text-gray-500">
                {{ stat.description }}
              </p>
            </div>

            <div
              class="flex size-11 items-center justify-center rounded-xl"
              :class="stat.iconClass"
            >
              <UIcon :name="stat.icon" class="size-5" />
            </div>
          </div>
        </div>
      </div>

      <!-- Stock Overview -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="mb-5">
            <h2 class="font-semibold text-gray-900 dark:text-white">Stock Overview</h2>
            <p class="mt-1 text-sm text-gray-500">Product availability summary</p>
          </div>

          <div class="space-y-5">
            <div>
              <div class="mb-2 flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-300">In Stock</span>
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ inStockCount }}
                </span>
              </div>
              <div class="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <div
                  class="h-full rounded-full bg-emerald-500"
                  :style="{ width: percentage(inStockCount) + '%' }"
                ></div>
              </div>
            </div>

            <div>
              <div class="mb-2 flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-300">Low Stock</span>
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ lowStockCount }}
                </span>
              </div>
              <div class="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <div
                  class="h-full rounded-full bg-amber-500"
                  :style="{ width: percentage(lowStockCount) + '%' }"
                ></div>
              </div>
            </div>

            <div>
              <div class="mb-2 flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-300">Out of Stock</span>
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ outOfStockCount }}
                </span>
              </div>
              <div class="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <div
                  class="h-full rounded-full bg-rose-500"
                  :style="{ width: percentage(outOfStockCount) + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <div class="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-info" class="size-4 text-primary" />
              <p class="text-sm text-gray-600 dark:text-gray-300">
                {{ lowStockCount + outOfStockCount }} products need attention.
              </p>
            </div>
          </div>
        </section>

        <!-- Category Summary -->
        <section
          class="rounded-xl border border-gray-200 bg-white p-5 xl:col-span-2 dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="mb-5">
            <h2 class="font-semibold text-gray-900 dark:text-white">Inventory by Category</h2>
            <p class="mt-1 text-sm text-gray-500">Stock quantity and value by product category</p>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full min-w-[500px] text-left text-sm">
              <thead>
                <tr
                  class="border-b border-gray-200 text-xs uppercase text-gray-500 dark:border-gray-700"
                >
                  <th class="pb-3 font-medium">Category</th>
                  <th class="pb-3 text-right font-medium">Products</th>
                  <th class="pb-3 text-right font-medium">Units</th>
                  <th class="pb-3 text-right font-medium">Stock Value</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="category in categorySummary"
                  :key="category.name"
                  class="border-b border-gray-100 last:border-0 dark:border-gray-700"
                >
                  <td class="py-4 font-medium text-gray-800 dark:text-gray-200">
                    {{ category.name }}
                  </td>
                  <td class="py-4 text-right text-gray-600 dark:text-gray-300">
                    {{ category.products }}
                  </td>
                  <td class="py-4 text-right text-gray-600 dark:text-gray-300">
                    {{ category.units.toLocaleString() }}
                  </td>
                  <td class="py-4 text-right font-medium text-gray-900 dark:text-white">
                    {{ formatCurrency(category.value) }}
                  </td>
                </tr>

                <tr v-if="categorySummary.length === 0">
                  <td colspan="4" class="py-8 text-center text-gray-500">
                    No category data available.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- Inventory Table -->
      <section
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
      >
        <div
          class="flex flex-col justify-between gap-4 border-b border-gray-200 p-5 lg:flex-row lg:items-center dark:border-gray-700"
        >
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Stock Details</h2>
            <p class="mt-1 text-sm text-gray-500">
              Detailed product inventory and valuation report
            </p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <div class="relative">
              <UIcon
                name="i-lucide-search"
                class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
              />
              <input
                v-model="search"
                type="text"
                placeholder="Search products..."
                class="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-56 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <select
              v-model="selectedCategory"
              class="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>

            <select
              v-model="selectedStatus"
              class="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <option value="">All Stock Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[900px] text-left text-sm">
            <thead class="bg-gray-50 dark:bg-gray-900/50">
              <tr class="text-xs uppercase tracking-wide text-gray-500">
                <th class="px-5 py-4 font-medium">Product</th>
                <th class="px-5 py-4 font-medium">SKU</th>
                <th class="px-5 py-4 font-medium">Category</th>
                <th class="px-5 py-4 text-right font-medium">Stock Qty</th>
                <th class="px-5 py-4 text-right font-medium">Min. Stock</th>
                <th class="px-5 py-4 text-right font-medium">Unit Cost</th>
                <th class="px-5 py-4 text-right font-medium">Stock Value</th>
                <th class="px-5 py-4 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="product in filteredProducts"
                :key="product.sku"
                class="border-b border-gray-100 last:border-0 hover:bg-gray-50/70 dark:border-gray-700 dark:hover:bg-gray-700/20"
              >
                <td class="px-5 py-4">
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ product.name }}
                  </div>
                  <div class="mt-1 text-xs text-gray-500">
                    {{ product.unit }}
                  </div>
                </td>

                <td class="px-5 py-4 text-gray-500">
                  {{ product.sku }}
                </td>

                <td class="px-5 py-4 text-gray-600 dark:text-gray-300">
                  {{ product.category }}
                </td>

                <td class="px-5 py-4 text-right font-medium text-gray-900 dark:text-white">
                  {{ product.quantity.toLocaleString() }}
                </td>

                <td class="px-5 py-4 text-right text-gray-500">
                  {{ product.minStock }}
                </td>

                <td class="px-5 py-4 text-right text-gray-600 dark:text-gray-300">
                  {{ formatCurrency(product.cost) }}
                </td>

                <td class="px-5 py-4 text-right font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(product.quantity * product.cost) }}
                </td>

                <td class="px-5 py-4">
                  <span
                    class="inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="statusClass(product)"
                  >
                    {{ stockStatus(product) }}
                  </span>
                </td>
              </tr>

              <tr v-if="filteredProducts.length === 0">
                <td colspan="8" class="px-5 py-12 text-center">
                  <UIcon name="i-lucide-package-search" class="mx-auto size-8 text-gray-400" />
                  <p class="mt-2 font-medium text-gray-700 dark:text-gray-200">No products found</p>
                  <p class="mt-1 text-sm text-gray-500">Try changing your search or filters.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="flex flex-col justify-between gap-2 border-t border-gray-200 px-5 py-4 text-sm text-gray-500 sm:flex-row sm:items-center dark:border-gray-700"
        >
          <p>Showing {{ filteredProducts.length }} of {{ products.length }} products</p>
          <p>
            Filtered stock value:
            <span class="font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(filteredStockValue) }}
            </span>
          </p>
        </div>
      </section>
    </main>
  </Default>
</template>

<script setup>
import { computed, ref } from 'vue'
import Default from '@/layouts/Default.vue'

const search = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')

const products = ref([
  {
    name: 'Wireless Mouse',
    sku: 'PRD-1001',
    category: 'Accessories',
    quantity: 120,
    minStock: 20,
    cost: 450,
    unit: 'Piece',
  },
  {
    name: 'Mechanical Keyboard',
    sku: 'PRD-1002',
    category: 'Accessories',
    quantity: 8,
    minStock: 10,
    cost: 1800,
    unit: 'Piece',
  },
  {
    name: 'USB-C Cable',
    sku: 'PRD-1003',
    category: 'Cables',
    quantity: 250,
    minStock: 30,
    cost: 120,
    unit: 'Piece',
  },
  {
    name: 'HDMI Cable',
    sku: 'PRD-1004',
    category: 'Cables',
    quantity: 0,
    minStock: 15,
    cost: 200,
    unit: 'Piece',
  },
  {
    name: 'Laptop Stand',
    sku: 'PRD-1005',
    category: 'Office Supplies',
    quantity: 45,
    minStock: 10,
    cost: 750,
    unit: 'Piece',
  },
  {
    name: 'Webcam HD',
    sku: 'PRD-1006',
    category: 'Electronics',
    quantity: 5,
    minStock: 8,
    cost: 2200,
    unit: 'Piece',
  },
  {
    name: 'Power Bank',
    sku: 'PRD-1007',
    category: 'Electronics',
    quantity: 65,
    minStock: 15,
    cost: 1100,
    unit: 'Piece',
  },
  {
    name: 'Laptop Bag',
    sku: 'PRD-1008',
    category: 'Bags',
    quantity: 32,
    minStock: 10,
    cost: 950,
    unit: 'Piece',
  },
])

const categories = computed(() =>
  [...new Set(products.value.map((product) => product.category))].sort(),
)

const stockStatus = (product) => {
  if (product.quantity === 0) return 'Out of Stock'
  if (product.quantity <= product.minStock) return 'Low Stock'
  return 'In Stock'
}

const statusClass = (product) => {
  const status = stockStatus(product)

  if (status === 'In Stock') {
    return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
  }

  if (status === 'Low Stock') {
    return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
  }

  return 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
}

const inStockCount = computed(
  () => products.value.filter((product) => stockStatus(product) === 'In Stock').length,
)

const lowStockCount = computed(
  () => products.value.filter((product) => stockStatus(product) === 'Low Stock').length,
)

const outOfStockCount = computed(
  () => products.value.filter((product) => product.quantity === 0).length,
)

const totalUnits = computed(() =>
  products.value.reduce((total, product) => total + product.quantity, 0),
)

const totalStockValue = computed(() =>
  products.value.reduce((total, product) => total + product.quantity * product.cost, 0),
)

const stats = computed(() => [
  {
    title: 'Total Products',
    value: products.value.length.toLocaleString(),
    description: `${categories.value.length} product categories`,
    icon: 'i-lucide-package',
    iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  },
  {
    title: 'Total Stock Value',
    value: formatCurrency(totalStockValue.value),
    description: 'Based on unit cost',
    icon: 'i-lucide-wallet',
    iconClass: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
  },
  {
    title: 'Low Stock',
    value: lowStockCount.value.toLocaleString(),
    description: 'At or below minimum stock',
    icon: 'i-lucide-trending-down',
    iconClass: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  },
  {
    title: 'Out of Stock',
    value: outOfStockCount.value.toLocaleString(),
    description: 'Products with zero quantity',
    icon: 'i-lucide-circle-alert',
    iconClass: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
  },
])

const categorySummary = computed(() => {
  return categories.value.map((name) => {
    const items = products.value.filter((product) => product.category === name)

    return {
      name,
      products: items.length,
      units: items.reduce((total, product) => total + product.quantity, 0),
      value: items.reduce((total, product) => total + product.quantity * product.cost, 0),
    }
  })
})

const filteredProducts = computed(() => {
  const query = search.value.trim().toLowerCase()

  return products.value.filter((product) => {
    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)

    const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value

    const matchesStatus = !selectedStatus.value || stockStatus(product) === selectedStatus.value

    return matchesSearch && matchesCategory && matchesStatus
  })
})

const filteredStockValue = computed(() =>
  filteredProducts.value.reduce((total, product) => total + product.quantity * product.cost, 0),
)

function percentage(count) {
  if (!products.value.length) return 0
  return Math.round((count / products.value.length) * 100)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 2,
  }).format(amount)
}

function exportCSV() {
  const headers = [
    'Product',
    'SKU',
    'Category',
    'Stock Quantity',
    'Minimum Stock',
    'Unit',
    'Unit Cost',
    'Stock Value',
    'Status',
  ]

  const rows = filteredProducts.value.map((product) => [
    product.name,
    product.sku,
    product.category,
    product.quantity,
    product.minStock,
    product.unit,
    product.cost,
    product.quantity * product.cost,
    stockStatus(product),
  ])

  const escapeCSV = (value) => `"${String(value).replace(/"/g, '""')}"`

  const csv = [headers, ...rows].map((row) => row.map(escapeCSV).join(',')).join('\r\n')

  const blob = new Blob(['\uFEFF' + csv], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'inventory-report.csv'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function printReport() {
  window.print()
}
</script>

<style>
@media print {
  body {
    background: white !important;
  }

  button,
  input,
  select {
    display: none !important;
  }

  main {
    padding: 0 !important;
  }

  section {
    break-inside: avoid;
  }
}
</style>
