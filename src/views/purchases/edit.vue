<script setup>
import { onMounted, reactive } from 'vue'
import Default from '@/layouts/Default.vue'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import { useSupplierStore } from '@/stores/supplier'
import { useStoreStore } from '@/stores/store'

const productStore = useProductStore()
const supplierStore = useSupplierStore()
const storeStore = useStoreStore()

const { products } = storeToRefs(productStore)
const { suppliers } = storeToRefs(supplierStore)
const { stores } = storeToRefs(storeStore)

const search = reactive({
  keywords: '',
})
const searchProducts = async () => {
  await productStore.search(search)
}

const purchase = reactive({
  supplier_id: '',
  store_id: '',
  purchase_date: new Date().toISOString().slice(0, 10),
  expected_date: new Date().toISOString().slice(0, 10),
  reference: '',
  note: '',

  currency: 'BDT',
  discount: 0,
  tax: 0,
  shipping: 0,
  paid_amount: 0,

  items: [],
})

const addProduct = (product) => {
  const existing = purchase.items.find((item) => item.id === product.id)

  if (existing) {
    existing.quantity = Number(product.min_stock)
    existing.unit_cost = Number(product.cost_price)
    return
  }

  purchase.items.push({
    id: product.id,
    name: product.name,
    sku: product.sku,
    quantity: Number(product.min_stock),
    unit_cost: Number(product.cost_price),
    tax: 0,
  })
}

onMounted(async () => {
  await supplierStore.search('')
  await storeStore.search('')
})
</script>

<template>
  <Default>
    <main class="space-y-4">
      <nav class="flex items-center justify-between gap-4">
        <div class="flex items-start gap-3">
          <div>
            <h1 class="text-xl font-bold text-slate-900">Create Purchase</h1>
            <p class="mt-1 text-sm text-slate-500">
              Add a new supplier purchase and manage inventory costs.
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="$router.push('/purchases')"
          class="bg-white px-4 py-2 text-sm font-medium rounded"
        >
          Back
        </button>
      </nav>

      <div class="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div class="space-y-4">
          <section class="rounded-2xl bg-white p-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
              <BaseSelect
                label="Supplier"
                v-model="purchase.supplier_id"
                :options="
                  suppliers?.data?.map((supplier) => ({
                    id: supplier.id,
                    name: supplier.name,
                  }))
                "
                placeholder="Select supplier"
                :required="true"
                error=""
              />

              <BaseInput
                label="Purchase Date"
                type="date"
                v-model="purchase.purchase_date"
                placeholder="Select date"
                :required="true"
                error=""
              />

              <BaseSelect
                label="Store"
                v-model="purchase.store_id"
                :options="
                  stores?.data?.map((store) => ({
                    id: store.id,
                    name: store.name,
                  }))
                "
                placeholder="Select store"
                :required="true"
                error=""
              />

              <BaseInput
                label="Expected Date"
                type="date"
                v-model="purchase.expected_date"
                placeholder="Select date"
                :required="true"
                error=""
              />

              <BaseInput
                v-model="purchase.reference"
                label="Reference"
                placeholder="Enter reference number"
              />
              <BaseInput label="Notes" v-model="purchase.note" placeholder="Enter notes" />
            </div>
          </section>

          {{ purchase }}

          <section class="rounded-2xl bg-white p-4 space-y-4">
            <div class="mb-4">
              <h2 class="text-base font-bold text-title">Add Product</h2>
              <p class="mt-1 text-sm text-body">
                Search and select products to add them to your purchase.
              </p>
            </div>

            <div class="relative w-full">
              <UIcon
                name="i-lucide-search"
                class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              />

              <input
                v-model="search.keywords"
                type="search"
                @input="searchProducts"
                placeholder="Search product by name, code, SKU or scan barcode..."
                class="w-full rounded border border-border bg-slate-50 py-2 pl-9 pr-16 text-sm text-body outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

              <div
                class="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-xs font-medium text-muted sm:flex"
              >
                <UIcon name="i-lucide-command" class="size-3" />
                <span>K</span>
              </div>
            </div>

            <table v-if="search.keywords.trim()">
              <thead>
                <th>Product</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Action</th>
              </thead>
              <tbody>
                <tr v-for="product in products.data" :key="product.id">
                  <td>
                    <div class="flex min-w-0 items-center gap-3">
                      <div
                        class="flex shrink-0 items-center justify-center rounded border border-slate-200 bg-white text-3xl"
                      >
                        <img
                          :src="product.cover_url"
                          :alt="product.name"
                          class="size-10 object-cover"
                        />
                      </div>
                      <div class="min-w-0">
                        <h3 class="truncate text-sm font-semibold text-title">
                          {{ product.name }}
                        </h3>
                        <p class="mt-1 text-xs leading-5 text-body">Code: {{ product.code }}</p>
                      </div>
                    </div>
                  </td>
                  <td>{{ product.sku }}</td>
                  <td>
                    <input
                      v-model.number="product.min_stock"
                      type="number"
                      min="1"
                      placeholder="e.g. 12"
                      class="w-28 rounded border border-border px-2 py-1.5 outline-none focus:border-primary"
                    />
                  </td>

                  <td>
                    <input
                      v-model.number="product.cost_price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 1250"
                      class="w-28 rounded border border-border px-2 py-1.5 outline-none focus:border-primary"
                    />
                  </td>

                  <td>
                    <button
                      type="button"
                      class="rounded bg-primary px-4 py-1.5 text-white disabled:cursor-not-allowed disabled:opacity-50"
                      :disabled="product.min_stock < 1"
                      @click="addProduct(product)"
                    >
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- Items -->
          <section class="bg-white rounded-2xl">
            <div class="flex flex-wrap items-center justify-between gap-4 p-4">
              <div>
                <h2 class="font-bold text-slate-900">Purchase Items</h2>
                <p class="mt-1 text-xs text-slate-500">2 products · 8 total units</p>
              </div>
              <button
                type="button"
                @click="purchase.items = []"
                class="text-sm font-medium text-red-500 transition-colors hover:text-red-700"
              >
                Clear All
              </button>
            </div>

            <div class="overflow-x-auto px-2.5">
              <table>
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Product</th>
                    <th>Serial Numbers</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(item, index) in purchase.items" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <div>
                        <p class="font-semibold text-title">{{ item.name }}</p>
                        <p class="text-xs text-body">{{ item.sku }}</p>
                      </div>
                    </td>
                    <td>
                      <span
                        class="rounded bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                      >
                        5 serials
                      </span>
                      <span class="ml-1 text-slate-400">⌃</span>
                    </td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ $currency(Number(item.unit_cost)) }}</td>
                    <td>{{ $currency(Number(item.unit_cost * item.quantity)) }}</td>
                    <td>
                      <span class="text-slate-500">✎　</span>
                      <span class="text-red-500">▤</span>
                    </td>
                  </tr>

                  <!-- Serials -->
                  <tr>
                    <td colspan="7" class="bg-slate-50/70 px-4 pb-4 pt-1">
                      <div class="rounded-xl border border-slate-200 bg-white p-3">
                        <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h3 class="text-sm font-semibold text-slate-900">Serial Numbers (5)</h3>
                            <p class="mt-1 text-xs text-slate-500">
                              Assign a unique serial number to each unit.
                            </p>
                          </div>
                          <button
                            class="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600"
                          >
                            + Add Serial Numbers
                          </button>
                        </div>

                        <table class="w-full text-left text-xs">
                          <thead class="bg-slate-50 text-slate-500">
                            <tr>
                              <th class="rounded-l-lg px-3 py-3">#</th>
                              <th class="px-3 py-3">Serial Number</th>
                              <th class="px-3 py-3">IMEI</th>
                              <th class="px-3 py-3">Barcode</th>
                              <th class="px-3 py-3">Status</th>
                              <th class="rounded-r-lg px-3 py-3">Action</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-slate-100">
                            <tr>
                              <td class="px-3 py-3">1</td>
                              <td class="px-3 py-3 font-medium">DELL-001</td>
                              <td class="px-3 py-3 text-slate-500">—</td>
                              <td class="px-3 py-3 text-slate-500">—</td>
                              <td class="px-3 py-3">
                                <span
                                  class="rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-700"
                                  >In Stock</span
                                >
                              </td>
                              <td class="px-3 py-3 text-red-500">Delete</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside class="space-y-5">
          <section class="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 class="border-b border-slate-100 pb-4 font-bold text-slate-900">
              Purchase Summary
            </h2>

            <div class="space-y-4 py-4 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-500">Items</span>
                <span class="font-semibold">2 products / 8 units</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Subtotal</span>
                <span class="font-semibold">৳ 570,000</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Discount</span>
                <span class="rounded-lg border border-slate-200 px-3 py-2">৳ 0</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Shipping</span>
                <span class="rounded-lg border border-slate-200 px-3 py-2">৳ 0</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Other Charge</span>
                <span class="rounded-lg border border-slate-200 px-3 py-2">৳ 0</span>
              </div>
            </div>

            <div class="flex items-center justify-between rounded-xl bg-blue-50 p-4">
              <span class="text-sm font-semibold text-slate-800">Total Amount</span>
              <span class="text-xl font-bold text-blue-600">৳ 570,000</span>
            </div>
          </section>

          <!-- Payment -->
          <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 class="mb-4 font-bold text-slate-900">Payment</h2>

            <div class="mb-4">
              <p class="mb-2 text-sm text-slate-500">Paid Amount</p>
              <div class="rounded-lg border border-slate-200 px-3 py-3 text-sm font-medium">
                ৳ 570,000
              </div>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-500">Due Amount</span>
              <span class="font-bold text-emerald-600">৳ 0</span>
            </div>
          </section>

          <!-- Notes -->
          <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 class="mb-3 font-bold text-slate-900">Additional Note</h2>
            <div class="min-h-28 rounded-lg border border-slate-200 p-3 text-sm text-slate-400">
              Write purchase notes...
            </div>
          </section>

          <!-- Actions -->
          <section class="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <button
              class="w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm"
            >
              Save Purchase (F2)
            </button>
            <button
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
            >
              ↺ Reset
            </button>
          </section>
        </aside>
      </div>
    </main>
  </Default>
</template>
