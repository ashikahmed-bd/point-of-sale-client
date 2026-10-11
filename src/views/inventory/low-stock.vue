<script setup>
import { computed, ref } from 'vue'
import Default from '@/layouts/Default.vue'

const search = ref('')
const category = ref('')
const warehouse = ref('')
const priority = ref('')

const products = ref([
  {
    id: 1,
    name: 'Vitamin C 1000mg',
    sku: 'SUP-002',
    category: 'Supplement',
    warehouse: 'Main Warehouse',
    stock: 12,
    minStock: 20,
    price: 15,
  },
  {
    id: 2,
    name: 'Amoxicillin 250mg',
    sku: 'MED-003',
    category: 'Medicine',
    warehouse: 'Main Warehouse',
    stock: 5,
    minStock: 25,
    price: 8,
  },
  {
    id: 3,
    name: 'Hand Sanitizer 500ml',
    sku: 'PCS-005',
    category: 'Personal Care',
    warehouse: 'Branch Warehouse',
    stock: 8,
    minStock: 15,
    price: 120,
  },
  {
    id: 4,
    name: 'Ibuprofen 400mg',
    sku: 'MED-007',
    category: 'Medicine',
    warehouse: 'Branch Warehouse',
    stock: 10,
    minStock: 20,
    price: 4,
  },
  {
    id: 5,
    name: 'Multivitamin Tablet',
    sku: 'SUP-010',
    category: 'Supplement',
    warehouse: 'Main Warehouse',
    stock: 7,
    minStock: 30,
    price: 12,
  },
  {
    id: 6,
    name: 'Cotton Bandage',
    sku: 'MED-011',
    category: 'Medicine',
    warehouse: 'Main Warehouse',
    stock: 3,
    minStock: 20,
    price: 35,
  },
  {
    id: 7,
    name: 'Antiseptic Solution',
    sku: 'MED-012',
    category: 'Medicine',
    warehouse: 'Branch Warehouse',
    stock: 15,
    minStock: 25,
    price: 95,
  },
  {
    id: 8,
    name: 'Face Mask Pack',
    sku: 'SAFE-013',
    category: 'Safety',
    warehouse: 'Main Warehouse',
    stock: 18,
    minStock: 40,
    price: 80,
  },
])

const lowStockProducts = computed(() =>
  products.value.filter((product) => product.stock > 0 && product.stock <= product.minStock),
)

const stats = computed(() => [
  {
    title: 'Low Stock Products',
    value: lowStockProducts.value.length,
    icon: 'i-lucide-package-search',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    title: 'Critical Stock',
    value: lowStockProducts.value.filter((p) => p.stock <= p.minStock * 0.25).length,
    icon: 'i-lucide-circle-alert',
    color: 'text-red-600 bg-red-50',
  },
  {
    title: 'Total Units Remaining',
    value: lowStockProducts.value.reduce((sum, p) => sum + p.stock, 0).toLocaleString(),
    icon: 'i-lucide-box',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    title: 'Estimated Restock Cost',
    value:
      '৳' +
      lowStockProducts.value
        .reduce((sum, p) => sum + Math.max(p.minStock - p.stock, 0) * p.price, 0)
        .toLocaleString('en-BD'),
    icon: 'i-lucide-wallet',
    color: 'text-primary bg-primary/10',
  },
])

const filteredProducts = computed(() =>
  lowStockProducts.value.filter((product) => {
    const term = search.value.toLowerCase()
    const matchesSearch = `${product.name} ${product.sku}`.toLowerCase().includes(term)
    const matchesCategory = !category.value || product.category === category.value
    const matchesWarehouse = !warehouse.value || product.warehouse === warehouse.value
    const matchesPriority =
      !priority.value ||
      (priority.value === 'Critical' && product.stock <= product.minStock * 0.25) ||
      (priority.value === 'Low' && product.stock > product.minStock * 0.25)

    return matchesSearch && matchesCategory && matchesWarehouse && matchesPriority
  }),
)

function clearFilters() {
  search.value = ''
  category.value = ''
  warehouse.value = ''
  priority.value = ''
}

function getPriority(product) {
  return product.stock <= product.minStock * 0.25 ? 'Critical' : 'Low'
}

function getStockPercentage(product) {
  return Math.min((product.stock / product.minStock) * 100, 100)
}

function restock(product) {
  // Navigate to purchase creation or open your restock workflow here.
  alert(`Restock requested for ${product.name}. Connect this action to your purchase workflow.`)
}
</script>

<template>
  <Default>
    <main class="space-y-4 p-4">
      <!-- Page Header -->
      <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Low Stock Products</h1>
            <span
              class="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            >
              {{ lowStockProducts.length }} items
            </span>
          </div>
          <p class="mt-1 text-sm text-gray-500">
            Monitor products below their minimum stock level and plan restocking.
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
            @click="alert('Connect this button to your purchase creation route.')"
          >
            <UIcon name="i-lucide-shopping-cart" class="size-4" />
            Create Purchase
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

      <!-- Stock Alert -->
      <div
        class="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/10"
      >
        <UIcon name="i-lucide-triangle-alert" class="mt-0.5 size-5 shrink-0 text-amber-600" />
        <div>
          <p class="text-sm font-medium text-amber-800 dark:text-amber-300">Stock level alert</p>
          <p class="mt-1 text-sm text-amber-700 dark:text-amber-400">
            {{ stats[0].value }} products are at or below their minimum stock level. Review the list
            and arrange replenishment to avoid stockouts.
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
            <h2 class="font-semibold text-gray-900 dark:text-white">Products Requiring Restock</h2>
            <p class="mt-1 text-xs text-gray-500">
              Products are listed when current stock is at or below minimum stock.
            </p>
          </div>

          <span
            class="w-fit rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            {{ filteredProducts.length }} results
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
              placeholder="Search product or SKU..."
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
            <option>Personal Care</option>
            <option>Safety</option>
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
            v-model="priority"
            class="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Priorities</option>
            <option>Critical</option>
            <option>Low</option>
          </select>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/70">
              <tr>
                <th class="px-4 py-3 font-medium">#</th>
                <th class="px-4 py-3 font-medium">Product</th>
                <th class="px-4 py-3 font-medium">SKU</th>
                <th class="px-4 py-3 font-medium">Warehouse</th>
                <th class="px-4 py-3 font-medium">Stock Level</th>
                <th class="px-4 py-3 text-right font-medium">Minimum</th>
                <th class="px-4 py-3 font-medium">Priority</th>
                <th class="px-4 py-3 text-right font-medium">Restock Qty</th>
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
                  <p class="mt-1 text-xs text-gray-500">{{ product.category }}</p>
                </td>

                <td class="px-4 py-4 text-gray-500">{{ product.sku }}</td>

                <td class="px-4 py-4 text-gray-500">{{ product.warehouse }}</td>

                <td class="px-4 py-4">
                  <div class="w-32">
                    <div class="mb-1.5 flex items-center justify-between gap-2">
                      <span
                        class="font-semibold"
                        :class="
                          getPriority(product) === 'Critical' ? 'text-red-600' : 'text-amber-600'
                        "
                      >
                        {{ product.stock }} units
                      </span>
                      <span class="text-xs text-gray-400">
                        {{ Math.round(getStockPercentage(product)) }}%
                      </span>
                    </div>
                    <div class="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                      <div
                        class="h-full rounded-full"
                        :class="getPriority(product) === 'Critical' ? 'bg-red-500' : 'bg-amber-500'"
                        :style="{ width: `${getStockPercentage(product)}%` }"
                      />
                    </div>
                  </div>
                </td>

                <td class="px-4 py-4 text-right text-gray-600 dark:text-gray-300">
                  {{ product.minStock }}
                </td>

                <td class="px-4 py-4">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="
                      getPriority(product) === 'Critical'
                        ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    "
                  >
                    <span
                      class="size-1.5 rounded-full"
                      :class="getPriority(product) === 'Critical' ? 'bg-red-500' : 'bg-amber-500'"
                    />
                    {{ getPriority(product) }}
                  </span>
                </td>

                <td class="px-4 py-4 text-right font-medium text-gray-800 dark:text-gray-200">
                  {{ Math.max(product.minStock - product.stock, 0) }}
                </td>

                <td class="px-4 py-4 text-right">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20"
                    @click="restock(product)"
                  >
                    <UIcon name="i-lucide-shopping-cart" class="size-3.5" />
                    Restock
                  </button>
                </td>
              </tr>

              <tr v-if="filteredProducts.length === 0">
                <td colspan="9" class="px-4 py-12 text-center">
                  <UIcon name="i-lucide-package-check" class="mx-auto size-9 text-gray-300" />
                  <p class="mt-2 font-medium text-gray-700 dark:text-gray-300">
                    No low-stock products found
                  </p>
                  <p class="mt-1 text-sm text-gray-500">
                    Try changing your filters or search keyword.
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
          <span>
            Showing {{ filteredProducts.length }} of {{ lowStockProducts.length }} low-stock
            products
          </span>
          <span class="text-xs"> Restock quantity = Minimum stock − Current stock </span>
        </div>
      </section>
    </main>
  </Default>
</template>
