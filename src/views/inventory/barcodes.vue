<script setup>
import { computed, ref } from 'vue'
import Default from '@/layouts/Default.vue'

const search = ref('')
const filterStatus = ref('All')
const showGenerator = ref(false)
const generatedBarcode = ref(null)

const products = ref([
  {
    id: 1,
    name: 'Wireless Mouse',
    sku: 'PRD-1001',
    barcode: '8901234567890',
    category: 'Electronics',
    price: 850,
    status: 'Generated',
  },
  {
    id: 2,
    name: 'USB Keyboard',
    sku: 'PRD-1002',
    barcode: '8901234567891',
    category: 'Electronics',
    price: 1200,
    status: 'Generated',
  },
  {
    id: 3,
    name: 'Cotton T-Shirt',
    sku: 'PRD-1003',
    barcode: '',
    category: 'Clothing',
    price: 550,
    status: 'Missing',
  },
  {
    id: 4,
    name: 'Water Bottle',
    sku: 'PRD-1004',
    barcode: '8901234567893',
    category: 'Accessories',
    price: 350,
    status: 'Generated',
  },
  {
    id: 5,
    name: 'Notebook A5',
    sku: 'PRD-1005',
    barcode: '',
    category: 'Stationery',
    price: 120,
    status: 'Missing',
  },
])

const form = ref({
  productId: '',
  quantity: 1,
})

const filteredProducts = computed(() => {
  const query = search.value.toLowerCase().trim()

  return products.value.filter((product) => {
    const matchesSearch = [product.name, product.sku, product.barcode, product.category].some(
      (value) => value.toLowerCase().includes(query),
    )

    const matchesStatus = filterStatus.value === 'All' || product.status === filterStatus.value

    return matchesSearch && matchesStatus
  })
})

const generatedCount = computed(
  () => products.value.filter((product) => product.status === 'Generated').length,
)

const missingCount = computed(
  () => products.value.filter((product) => product.status === 'Missing').length,
)

const selectedProduct = computed(() =>
  products.value.find((product) => product.id === Number(form.value.productId)),
)

function generateBarcode() {
  if (!selectedProduct.value) {
    alert('Please select a product.')
    return
  }

  if (
    !Number.isInteger(Number(form.value.quantity)) ||
    Number(form.value.quantity) < 1 ||
    Number(form.value.quantity) > 500
  ) {
    alert('Quantity must be between 1 and 500.')
    return
  }

  let barcode = selectedProduct.value.barcode

  if (!barcode) {
    barcode = `200${String(selectedProduct.value.id).padStart(10, '0')}`
    selectedProduct.value.barcode = barcode
    selectedProduct.value.status = 'Generated'
  }

  generatedBarcode.value = {
    ...selectedProduct.value,
    quantity: Number(form.value.quantity),
  }

  showGenerator.value = false
}

function printBarcode() {
  if (!generatedBarcode.value) return

  window.print()
}

function openBarcode(product) {
  if (!product.barcode) {
    form.value.productId = String(product.id)
    form.value.quantity = 1
    showGenerator.value = true
    return
  }

  generatedBarcode.value = {
    ...product,
    quantity: 1,
  }
}
</script>

<template>
  <Default>
    <main class="space-y-4 p-4">
      <!-- Header -->
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Barcodes</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Generate, manage and print product barcode labels.
          </p>
        </div>

        <button
          type="button"
          @click="showGenerator = !showGenerator"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <UIcon name="i-lucide-scan-barcode" class="size-4" />
          Generate Barcode
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ products.length }}
              </h2>
            </div>
            <div class="rounded-lg bg-blue-50 p-3 dark:bg-blue-500/10">
              <UIcon name="i-lucide-package" class="size-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500">Products in the catalog</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Generated</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ generatedCount }}
              </h2>
            </div>
            <div class="rounded-lg bg-green-50 p-3 dark:bg-green-500/10">
              <UIcon
                name="i-lucide-check-circle"
                class="size-6 text-green-600 dark:text-green-400"
              />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500">Products with barcodes</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Missing Barcodes</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ missingCount }}
              </h2>
            </div>
            <div class="rounded-lg bg-orange-50 p-3 dark:bg-orange-500/10">
              <UIcon
                name="i-lucide-alert-circle"
                class="size-6 text-orange-600 dark:text-orange-400"
              />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500">Need barcode assignment</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Barcode Coverage</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ products.length ? Math.round((generatedCount / products.length) * 100) : 0 }}%
              </h2>
            </div>
            <div class="rounded-lg bg-purple-50 p-3 dark:bg-purple-500/10">
              <UIcon
                name="i-lucide-chart-no-axes-column"
                class="size-6 text-purple-600 dark:text-purple-400"
              />
            </div>
          </div>
          <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              class="h-full rounded-full bg-primary transition-all"
              :style="{
                width: `${products.length ? (generatedCount / products.length) * 100 : 0}%`,
              }"
            />
          </div>
        </div>
      </div>

      <!-- Generator Form -->
      <div
        v-if="showGenerator"
        class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="mb-5 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Generate Product Barcode
            </h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Select a product and the number of labels to prepare.
            </p>
          </div>

          <button
            type="button"
            @click="showGenerator = false"
            class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close form"
          >
            <UIcon name="i-lucide-x" class="size-5" />
          </button>
        </div>

        <form @submit.prevent="generateBarcode" class="space-y-5">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Product <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.productId"
                required
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="" disabled>Select a product</option>
                <option v-for="product in products" :key="product.id" :value="String(product.id)">
                  {{ product.name }} ({{ product.sku }})
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Number of Labels
              </label>
              <input
                v-model.number="form.quantity"
                type="number"
                min="1"
                max="500"
                required
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div
            v-if="selectedProduct"
            class="flex flex-wrap items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/60"
          >
            <UIcon name="i-lucide-package" class="size-5 text-gray-500" />
            <div>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ selectedProduct.name }}
              </p>
              <p class="mt-1 text-xs text-gray-500">
                SKU: {{ selectedProduct.sku }} · {{ selectedProduct.category }}
              </p>
            </div>
            <span class="ml-auto font-semibold text-gray-900 dark:text-white">
              ৳{{ selectedProduct.price.toLocaleString() }}
            </span>
          </div>

          <div class="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
            <button
              type="button"
              @click="showGenerator = false"
              class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              <UIcon name="i-lucide-scan-barcode" class="size-4" />
              Generate
            </button>
          </div>
        </form>
      </div>

      <!-- Barcode Preview -->
      <div
        v-if="generatedBarcode"
        class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 print:border-0 print:p-0"
      >
        <div
          class="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center print:hidden"
        >
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Barcode Preview</h2>
            <p class="mt-1 text-sm text-gray-500">
              {{ generatedBarcode.quantity }} label(s) prepared
            </p>
          </div>

          <div class="flex gap-2">
            <button
              type="button"
              @click="generatedBarcode = null"
              class="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Close
            </button>

            <button
              type="button"
              @click="printBarcode"
              class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              <UIcon name="i-lucide-printer" class="size-4" />
              Print Labels
            </button>
          </div>
        </div>

        <div class="flex flex-wrap gap-4">
          <div
            v-for="index in Math.min(generatedBarcode.quantity, 12)"
            :key="`${generatedBarcode.id}-${index}`"
            class="barcode-label flex w-56 flex-col items-center rounded-lg border border-dashed border-gray-300 p-4 text-center dark:border-gray-700"
          >
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ generatedBarcode.name }}
            </p>
            <p class="mt-1 text-xs text-gray-500">SKU: {{ generatedBarcode.sku }}</p>

            <div class="barcode-lines my-3 h-12 w-full" aria-label="Decorative barcode preview" />

            <p class="font-mono text-sm tracking-widest text-gray-900 dark:text-white">
              {{ generatedBarcode.barcode }}
            </p>
            <p class="mt-2 text-sm font-bold text-gray-900 dark:text-white">
              ৳{{ generatedBarcode.price.toLocaleString() }}
            </p>
          </div>
        </div>

        <p class="mt-3 text-xs text-gray-500 print:hidden">
          Preview uses decorative barcode lines. Use a barcode-generation library for
          scanner-readable labels.
        </p>
      </div>

      <!-- Barcode List -->
      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col gap-4 border-b border-gray-200 p-4 dark:border-gray-800 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Product Barcode List</h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ filteredProducts.length }} products found
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
                type="search"
                placeholder="Search product or SKU..."
                class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-64 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <select
              v-model="filterStatus"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option>All</option>
              <option value="Generated">Generated</option>
              <option value="Missing">Missing</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead
              class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/60 dark:text-gray-400"
            >
              <tr>
                <th class="px-5 py-4 font-semibold">Product</th>
                <th class="px-5 py-4 font-semibold">SKU</th>
                <th class="px-5 py-4 font-semibold">Barcode Number</th>
                <th class="px-5 py-4 font-semibold">Category</th>
                <th class="px-5 py-4 text-right font-semibold">Price</th>
                <th class="px-5 py-4 font-semibold">Status</th>
                <th class="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="product in filteredProducts"
                :key="product.id"
                class="transition hover:bg-gray-50/70 dark:hover:bg-gray-800/40"
              >
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"
                    >
                      <UIcon name="i-lucide-package" class="size-5 text-primary" />
                    </div>
                    <span class="font-semibold text-gray-900 dark:text-white">
                      {{ product.name }}
                    </span>
                  </div>
                </td>

                <td class="px-5 py-4 font-mono text-xs text-gray-600 dark:text-gray-400">
                  {{ product.sku }}
                </td>

                <td class="px-5 py-4">
                  <span
                    v-if="product.barcode"
                    class="font-mono text-xs text-gray-700 dark:text-gray-300"
                  >
                    {{ product.barcode }}
                  </span>
                  <span v-else class="text-xs text-gray-400">Not assigned</span>
                </td>

                <td class="px-5 py-4 text-gray-600 dark:text-gray-400">
                  {{ product.category }}
                </td>

                <td class="px-5 py-4 text-right font-semibold text-gray-900 dark:text-white">
                  ৳{{ product.price.toLocaleString() }}
                </td>

                <td class="px-5 py-4">
                  <span
                    :class="
                      product.status === 'Generated'
                        ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                        : 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400'
                    "
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                  >
                    <span
                      :class="product.status === 'Generated' ? 'bg-green-500' : 'bg-orange-500'"
                      class="size-1.5 rounded-full"
                    />
                    {{ product.status }}
                  </span>
                </td>

                <td class="px-5 py-4">
                  <div class="flex justify-end">
                    <button
                      type="button"
                      @click="openBarcode(product)"
                      :title="product.barcode ? 'Preview barcode' : 'Generate barcode'"
                      class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
                    >
                      <UIcon
                        :name="product.barcode ? 'i-lucide-eye' : 'i-lucide-scan-barcode'"
                        class="size-4"
                      />
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="filteredProducts.length === 0">
                <td colspan="7" class="px-5 py-14 text-center">
                  <UIcon name="i-lucide-scan-barcode" class="mx-auto size-10 text-gray-300" />
                  <p class="mt-3 font-medium text-gray-700 dark:text-gray-300">No products found</p>
                  <p class="mt-1 text-sm text-gray-500">Try changing your search or filter.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="flex flex-col gap-2 border-t border-gray-200 px-5 py-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
        >
          <p>Showing {{ filteredProducts.length }} of {{ products.length }} products</p>
          <p>Barcode Management</p>
        </div>
      </div>
    </main>
  </Default>
</template>

<style>
.barcode-lines {
  background: repeating-linear-gradient(
    90deg,
    #111827 0,
    #111827 2px,
    transparent 2px,
    transparent 4px,
    #111827 4px,
    #111827 5px,
    transparent 5px,
    transparent 8px,
    #111827 8px,
    #111827 12px,
    transparent 12px,
    transparent 14px
  );
}

@media print {
  body * {
    visibility: hidden !important;
  }

  .barcode-label,
  .barcode-label * {
    visibility: visible !important;
  }

  .barcode-label {
    break-inside: avoid;
    border: 1px solid #ddd !important;
    color: #111827 !important;
  }

  .barcode-label p {
    color: #111827 !important;
  }
}
</style>
