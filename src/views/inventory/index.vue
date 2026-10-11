<script setup>
import { computed, ref } from 'vue'
import Default from '@/layouts/Default.vue'

const search = ref('')
const category = ref('')
const warehouse = ref('')
const status = ref('')
const selectedProduct = ref('')
const selectedWarehouse = ref('Main Warehouse')
const adjustmentType = ref('Increase')
const quantity = ref('')
const reason = ref('')
const notes = ref('')

const products = ref([
  {
    id: 1,
    name: 'Paracetamol 500mg',
    sku: 'MED-001',
    category: 'Medicine',
    warehouse: 'Main Warehouse',
    stock: 250,
    minStock: 20,
    price: 2.5,
  },
  {
    id: 2,
    name: 'Vitamin C 1000mg',
    sku: 'SUP-002',
    category: 'Supplement',
    warehouse: 'Main Warehouse',
    stock: 12,
    minStock: 20,
    price: 15,
  },
  {
    id: 3,
    name: 'Amoxicillin 250mg',
    sku: 'MED-003',
    category: 'Medicine',
    warehouse: 'Main Warehouse',
    stock: 0,
    minStock: 10,
    price: 8,
  },
  {
    id: 4,
    name: 'Cough Syrup 100ml',
    sku: 'SYR-004',
    category: 'Syrup',
    warehouse: 'Main Warehouse',
    stock: 120,
    minStock: 15,
    price: 65,
  },
  {
    id: 5,
    name: 'Hand Sanitizer 500ml',
    sku: 'PCS-005',
    category: 'Personal Care',
    warehouse: 'Branch Warehouse',
    stock: 8,
    minStock: 15,
    price: 120,
  },
  {
    id: 6,
    name: 'Surgical Mask',
    sku: 'SAFE-006',
    category: 'Safety',
    warehouse: 'Main Warehouse',
    stock: 500,
    minStock: 50,
    price: 5,
  },
  {
    id: 7,
    name: 'Ibuprofen 400mg',
    sku: 'MED-007',
    category: 'Medicine',
    warehouse: 'Branch Warehouse',
    stock: 10,
    minStock: 20,
    price: 4,
  },
  {
    id: 8,
    name: 'Aloe Vera Gel',
    sku: 'PCS-008',
    category: 'Personal Care',
    warehouse: 'Main Warehouse',
    stock: 200,
    minStock: 25,
    price: 85,
  },
  {
    id: 9,
    name: 'Omeprazole 20mg',
    sku: 'MED-009',
    category: 'Medicine',
    warehouse: 'Main Warehouse',
    stock: 0,
    minStock: 10,
    price: 3,
  },
  {
    id: 10,
    name: 'Multivitamin Tablet',
    sku: 'SUP-010',
    category: 'Supplement',
    warehouse: 'Branch Warehouse',
    stock: 75,
    minStock: 20,
    price: 12,
  },
])

const stats = computed(() => [
  {
    title: 'Total Products',
    value: products.value.length,
    icon: 'i-lucide-box',
    color: 'text-primary bg-primary/10',
  },
  {
    title: 'Total Stock Units',
    value: products.value.reduce((sum, product) => sum + product.stock, 0).toLocaleString(),
    icon: 'i-lucide-package',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    title: 'Low Stock',
    value: products.value.filter((p) => p.stock > 0 && p.stock <= p.minStock).length,
    icon: 'i-lucide-trending-down',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    title: 'Out of Stock',
    value: products.value.filter((p) => p.stock === 0).length,
    icon: 'i-lucide-circle-alert',
    color: 'text-red-600 bg-red-50',
  },
])

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const matchesSearch = `${product.name} ${product.sku}`
      .toLowerCase()
      .includes(search.value.toLowerCase())
    const matchesCategory = !category.value || product.category === category.value
    const matchesWarehouse = !warehouse.value || product.warehouse === warehouse.value
    const matchesStatus =
      !status.value ||
      (status.value === 'In Stock' && product.stock > product.minStock) ||
      (status.value === 'Low Stock' && product.stock > 0 && product.stock <= product.minStock) ||
      (status.value === 'Out of Stock' && product.stock === 0)

    return matchesSearch && matchesCategory && matchesWarehouse && matchesStatus
  })
})

const selected = computed(() =>
  products.value.find((product) => product.id === Number(selectedProduct.value)),
)

function stockStatus(product) {
  if (product.stock === 0) return 'Out of Stock'
  if (product.stock <= product.minStock) return 'Low Stock'
  return 'In Stock'
}

function clearFilters() {
  search.value = ''
  category.value = ''
  warehouse.value = ''
  status.value = ''
}

function resetAdjustment() {
  selectedProduct.value = ''
  selectedWarehouse.value = 'Main Warehouse'
  adjustmentType.value = 'Increase'
  quantity.value = ''
  reason.value = ''
  notes.value = ''
}

function updateStock() {
  if (
    !selected.value ||
    !selectedWarehouse.value ||
    !quantity.value ||
    Number(quantity.value) <= 0 ||
    !reason.value
  ) {
    alert('Please fill in all required fields correctly.')
    return
  }

  const product = selected.value
  const amount = Number(quantity.value)

  if (adjustmentType.value === 'Decrease' && product.stock < amount) {
    alert('Stock cannot be less than zero.')
    return
  }

  if (adjustmentType.value === 'Increase') product.stock += amount
  else if (adjustmentType.value === 'Decrease') product.stock -= amount
  else product.stock = amount

  product.warehouse = selectedWarehouse.value

  alert('Stock updated successfully.')
  resetAdjustment()
}
</script>

<template>
  <Default>
    <main class="space-y-4 p-4">
      <!-- Page Header -->
      <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Inventory Management</h1>
          <p class="mt-1 text-sm text-gray-500">
            Manage product stock, warehouses and stock adjustments.
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
              document?.getElementById('stock-adjustment')?.scrollIntoView({ behavior: 'smooth' })
            "
          >
            <UIcon name="i-lucide-plus" class="size-4" />
            Adjust Stock
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
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">{{ item.title }}</p>
              <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {{ item.value }}
              </p>
            </div>
            <div :class="['flex size-11 items-center justify-center rounded-xl', item.color]">
              <UIcon :name="item.icon" class="size-5" />
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 items-start gap-4 2xl:grid-cols-3">
        <!-- Inventory Table -->
        <section
          class="min-w-0 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 2xl:col-span-2"
        >
          <div
            class="flex flex-col justify-between gap-3 border-b border-gray-100 p-4 dark:border-gray-800 sm:flex-row sm:items-center"
          >
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Product Inventory</h2>
              <p class="mt-1 text-xs text-gray-500">View and manage your current stock.</p>
            </div>
            <span
              class="w-fit rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              {{ filteredProducts.length }} products
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
                placeholder="Search products..."
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
              v-model="status"
              class="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Status</option>
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
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
                  <th class="px-4 py-3 text-right font-medium">Stock</th>
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
                  <td class="px-4 py-3 text-gray-500">{{ index + 1 }}</td>

                  <td class="px-4 py-3">
                    <p class="font-medium text-gray-800 dark:text-gray-100">
                      {{ product.name }}
                    </p>
                    <p class="mt-0.5 text-xs text-gray-500">{{ product.category }}</p>
                  </td>

                  <td class="px-4 py-3 text-gray-500">{{ product.sku }}</td>

                  <td class="px-4 py-3 text-gray-500">
                    {{ product.warehouse }}
                  </td>

                  <td
                    class="px-4 py-3 text-right font-semibold"
                    :class="
                      product.stock === 0
                        ? 'text-red-600'
                        : product.stock <= product.minStock
                          ? 'text-amber-600'
                          : 'text-gray-800 dark:text-gray-200'
                    "
                  >
                    {{ product.stock }}
                  </td>

                  <td class="px-4 py-3">
                    <span
                      :class="{
                        'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400':
                          stockStatus(product) === 'In Stock',
                        'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400':
                          stockStatus(product) === 'Low Stock',
                        'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400':
                          stockStatus(product) === 'Out of Stock',
                      }"
                      class="inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium"
                    >
                      {{ stockStatus(product) }}
                    </span>
                  </td>

                  <td class="px-4 py-3 text-right">
                    <button
                      type="button"
                      class="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:border-primary hover:text-primary dark:border-gray-700 dark:text-gray-300"
                    >
                      Adjust
                    </button>
                  </td>
                </tr>

                <tr v-if="filteredProducts.length === 0">
                  <td colspan="7" class="px-4 py-12 text-center">
                    <UIcon name="i-lucide-search-x" class="mx-auto size-8 text-gray-300" />
                    <p class="mt-2 text-sm text-gray-500">No products found.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            class="flex flex-col justify-between gap-2 border-t border-gray-100 px-4 py-3 text-sm text-gray-500 dark:border-gray-800 sm:flex-row sm:items-center"
          >
            <span>Showing {{ filteredProducts.length }} of {{ products.length }} products</span>
            <span class="text-xs">Stock quantities update locally in this demo.</span>
          </div>
        </section>

        <!-- Stock Adjustment Form -->
        <section
          id="stock-adjustment"
          class="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
        >
          <div class="flex items-center gap-3 border-b border-gray-100 p-4 dark:border-gray-800">
            <div
              class="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
            >
              <UIcon name="i-lucide-package-plus" class="size-5" />
            </div>
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Adjust Stock</h2>
              <p class="mt-1 text-xs text-gray-500">Update product stock quantity.</p>
            </div>
          </div>

          <form class="space-y-4 p-4" @submit.prevent="updateStock">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Product <span class="text-red-500">*</span>
              </label>
              <select
                v-model="selectedProduct"
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
                v-model="selectedWarehouse"
                required
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option>Main Warehouse</option>
                <option>Branch Warehouse</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Stock
                </label>
                <input
                  :value="selected ? selected.stock : 0"
                  readonly
                  class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Adjustment Type <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="adjustmentType"
                  class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option>Increase</option>
                  <option>Decrease</option>
                  <option>Set Exact</option>
                </select>
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantity <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="quantity"
                type="number"
                min="1"
                step="1"
                required
                placeholder="Enter quantity"
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reason <span class="text-red-500">*</span>
              </label>
              <select
                v-model="reason"
                required
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select reason</option>
                <option>Purchase Received</option>
                <option>Sales Return</option>
                <option>Damaged Goods</option>
                <option>Expired Products</option>
                <option>Stock Count Correction</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Notes
              </label>
              <textarea
                v-model="notes"
                rows="3"
                placeholder="Enter additional notes..."
                class="w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div
              class="flex gap-2 rounded-lg bg-blue-50 p-3 text-xs leading-5 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
            >
              <UIcon name="i-lucide-info" class="mt-0.5 size-4 shrink-0" />
              <p>
                Stock changes are shown in this demo only. Connect the form to your Laravel API to
                persist adjustments.
              </p>
            </div>

            <div class="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                @click="resetAdjustment"
              >
                <UIcon name="i-lucide-rotate-ccw" class="size-4" />
                Reset
              </button>

              <button
                type="submit"
                class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
              >
                <UIcon name="i-lucide-save" class="size-4" />
                Update Stock
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  </Default>
</template>
