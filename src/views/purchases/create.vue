<script setup>
import { onMounted, reactive, ref } from 'vue'
import Default from '@/layouts/Default.vue'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import { useSupplierStore } from '@/stores/supplier'
import { useStoreStore } from '@/stores/store'
import { usePurchaseStore } from '@/stores/purchase'

const productStore = useProductStore()
const supplierStore = useSupplierStore()
const storeStore = useStoreStore()
const purchaseStore = usePurchaseStore()

const { products, product } = storeToRefs(productStore)
const { suppliers } = storeToRefs(supplierStore)
const { stores } = storeToRefs(storeStore)

const search = reactive({
  keywords: '10039604',
})
const searchProducts = async () => {
  await productStore.search(search)

  // Initialize purchase-specific input values
  products.value?.data?.forEach((product) => {
    product.quantity = Number(product.quantity ?? product.min_stock) || 1
    product.unit_cost = Number(product.unit_cost ?? product.cost_price) || 0
    product.discount = Number(product.discount) || 0
    product.tax = Number(product.tax) || 0
  })
}

const loadProduct = async (item) => {
  await productStore.show(item.id)
}

const purchase = reactive({
  supplier_id: '',
  store_id: '',
  purchase_date: new Date().toISOString().slice(0, 10),
  expected_date: new Date().toISOString().slice(0, 10),
  reference: '',
  note: '',
})

const submit = async () => {
  const payload = {
    ...purchase,
    subtotal: purchaseStore.subtotal,
    discount: purchaseStore.discount,
    tax: purchaseStore.tax,
    shipping: purchaseStore.shipping,
    charge: purchaseStore.charge,
    total: purchaseStore.total,
    paid: purchaseStore.paid,
    items: purchaseStore.items,
  }
  await purchaseStore.store(payload)
}

const selectedOptions = ref({})
const selectedVariant = ref({})

const attributeSelected = (attribute, option) => {
  // Save selected option
  selectedOptions.value[attribute.slug] = option.name

  // Find matching variant
  const variant = (product.value?.variants ?? []).find((variant) =>
    Object.entries(variant.options ?? {}).every(
      ([key, value]) => selectedOptions.value[key] === value,
    ),
  )
  console.log('Variant:', variant)

  selectedVariant.value = variant ?? null
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
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Discount</th>
                <th>Tax</th>
                <th>Action</th>
              </thead>
              <tbody>
                <template v-for="product in products.data" :key="product.id">
                  <tr>
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

                    <td>
                      <input
                        v-model.number="product.quantity"
                        type="number"
                        min="1"
                        class="w-20 rounded border border-border px-2 py-1.5 outline-none focus:border-primary"
                      />
                    </td>

                    <td>
                      <input
                        v-model.number="product.unit_cost"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-20 rounded border border-border px-2 py-1.5 outline-none focus:border-primary"
                      />
                    </td>

                    <td>
                      <input
                        v-model.number="product.discount"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-20 rounded border border-border px-2 py-1.5 outline-none focus:border-primary"
                      />
                    </td>

                    <td>
                      <input
                        v-model.number="product.tax"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-20 rounded border border-border px-2 py-1.5 outline-none focus:border-primary"
                      />
                    </td>

                    <td>
                      <button
                        v-if="!product.attributes?.length"
                        :disabled="Number(product.quantity) < 1"
                        @click="purchaseStore.addItem(product)"
                      >
                        Add
                      </button>

                      <button
                        v-else
                        type="button"
                        class="flex items-center gap-2 rounded bg-primary px-4 py-1.5 text-white disabled:cursor-not-allowed disabled:opacity-50"
                        @click="loadProduct(product)"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                  <!-- attributes -->
                  <tr v-if="product?.attributes?.length">
                    <td colspan="6" class="bg-slate-100 p-4">
                      <div class="space-y-2.5">
                        <div
                          v-for="attribute in product.attributes"
                          :key="attribute.id"
                          class="space-y-2"
                        >
                          <h3 class="text-xs font-semibold text-slate-700">
                            {{ attribute.name }}
                          </h3>

                          <div class="flex flex-wrap gap-2">
                            <button
                              v-for="option in attribute.options"
                              :key="option.id"
                              type="button"
                              @click="attributeSelected(attribute, option)"
                              :class="[
                                'rounded border px-2 py-1 text-sm transition',
                                selectedOptions[attribute.slug] === option.name
                                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                                  : 'border-gray-200 hover:border-gray-400',
                              ]"
                            >
                              {{ option.name }}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div class="flex items-center justify-between">
                        <h3 class="text-sm text-body">
                          Variant:
                          <span class="font-semibold text-title">
                            {{ selectedVariant?.name ?? 'Select attributes' }}
                          </span>
                        </h3>

                        <button
                          type="button"
                          @click="
                            () => {
                              console.log('Input values:', {
                                quantity: product.quantity,
                                unit_cost: product.unit_cost,
                                discount: product.discount,
                                tax: product.tax,
                              })

                              purchaseStore.addItem({
                                ...product,
                                variant_id: selectedVariant?.id ?? '',
                                quantity: Number(product.quantity ?? 1),
                                unit_cost: Number(product.unit_cost ?? product.cost_price ?? 0),
                                discount: Number(product.discount ?? 0),
                                tax: Number(product.tax ?? 0),
                                meta: { ...selectedOptions },
                              })
                            }
                          "
                          :disabled="!selectedVariant || Number(product.quantity) < 1"
                          class="rounded bg-primary-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Add Variant
                        </button>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </section>

          <!-- Items -->
          <section class="bg-white rounded-2xl">
            <div class="flex flex-wrap items-center justify-between gap-4 p-4">
              <div>
                <h2 class="font-bold text-title">Purchase Items</h2>
                <p class="mt-1 text-xs text-body">
                  Add products, select variants, and manage quantities and costs.
                </p>
              </div>
              <button
                type="button"
                @click="purchaseStore.$reset()"
                class="text-sm font-medium text-red-500 transition-colors hover:text-red-700"
              >
                Clear All
              </button>
            </div>

            <div class="overflow-x-auto px-2.5">
              <EmptyState v-if="!purchaseStore?.items?.length" />

              <table v-else class="w-full">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Qty</th>
                    <th>Base Price</th>
                    <th>Selling</th>
                    <th>Purchase</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  <template v-for="(item, index) in purchaseStore?.items" :key="item.id">
                    <tr>
                      <td>{{ index + 1 }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.sku }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>{{ $currency(Number(item.base_price)) }}</td>
                      <td>{{ $currency(Number(item.price)) }}</td>
                      <td>{{ $currency(Number(item.unit_cost)) }}</td>
                      <td>{{ $currency(Number(item.unit_cost) * Number(item.quantity)) }}</td>

                      <td>
                        <div class="flex items-center gap-1">
                          <button
                            type="button"
                            @click="purchaseStore.removeItem(item.id)"
                            class="inline-flex size-8 items-center justify-center rounded text-body transition-colors hover:bg-red-50 hover:text-red-600 active:scale-95"
                            title="Remove item"
                          >
                            <UIcon name="i-lucide-trash-2" class="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    <!-- Accordion -->
                    <tr>
                      <td colspan="9">
                        <UAccordion
                          :items="[
                            {
                              label: 'Serial Numbers',
                              value: item.id,
                            },
                          ]"
                          :ui="{
                            root: 'border-b border-gray-100',
                            trigger:
                              'flex w-full items-center justify-between gap-2 px-3 py-2 text-xs font-medium text-body hover:bg-gray-50',
                            content: 'px-2.5',
                          }"
                          @update:model-value="loadProduct(item)"
                        >
                          <template #body>
                            <div class="space-y-4 rounded-b-lg bg-gray-50">
                              <!-- Serials -->
                              <div class="bg-white rounded border border-border">
                                <div
                                  class="flex items-center justify-between border-b border-border px-4 py-2.5"
                                >
                                  <h4 class="text-sm font-semibold text-title">
                                    Serials ({{ item.serials?.length ?? 0 }})
                                  </h4>

                                  <button
                                    type="button"
                                    @click="purchaseStore.addSerial(item)"
                                    class="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-title transition-colors hover:bg-gray-50"
                                  >
                                    <UIcon name="i-lucide-plus" class="size-3.5" />
                                    Add Serial
                                  </button>
                                </div>

                                <div class="overflow-x-auto">
                                  <table class="w-full">
                                    <thead>
                                      <tr class="bg-gray-50">
                                        <th class="px-3 py-2 text-left text-xs">#</th>
                                        <th class="px-3 py-2 text-left text-xs">Serial Number</th>
                                        <th class="px-3 py-2 text-left text-xs">IMEI (Optional)</th>
                                        <th class="px-3 py-2 text-left text-xs">Status</th>
                                        <th class="px-3 py-2 text-left text-xs">Condition</th>
                                        <th class="px-3 py-2 text-left text-xs">Note</th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      <tr
                                        v-for="(serial, index) in item.serials"
                                        :key="serial.id"
                                        class="border-t border-gray-100 transition-colors hover:bg-gray-50/70"
                                      >
                                        <td class="px-3 py-2 text-xs text-body">
                                          {{ index + 1 }}
                                        </td>

                                        <td class="px-3 py-2 text-xs font-medium text-title">
                                          {{ serial.serial_number || '-' }}
                                        </td>

                                        <td class="px-3 py-2 text-xs text-body">
                                          {{ serial.imei || '-' }}
                                        </td>

                                        <td class="px-3 py-2 text-xs text-body">
                                          {{ serial.barcode || '-' }}
                                        </td>

                                        <td class="px-3 py-2">
                                          <span
                                            class="inline-flex rounded px-2 py-1 text-xs"
                                            :class="{
                                              'bg-green-50 text-green-700':
                                                serial.status === 'in_stock',
                                              'bg-yellow-50 text-yellow-700':
                                                serial.status === 'reserved',
                                              'bg-blue-50 text-blue-700': serial.status === 'sold',
                                              'bg-gray-100 text-gray-600': !serial.status,
                                            }"
                                          >
                                            {{ serial.status?.replaceAll('_', ' ') || 'Pending' }}
                                          </span>
                                        </td>

                                        <td class="px-3 py-2 text-xs text-body">
                                          {{ serial.note || '-' }}
                                        </td>
                                      </tr>

                                      <!-- Empty State -->
                                      <tr v-if="!item.serials?.length">
                                        <td colspan="6" class="px-3 py-8 text-center">
                                          <UIcon
                                            name="i-lucide-scan-barcode"
                                            class="mx-auto mb-2 size-6 text-gray-400"
                                          />

                                          <p class="text-sm font-medium text-title">
                                            No serial numbers found
                                          </p>

                                          <p class="mt-1 text-xs text-body">
                                            Add serial numbers for this product.
                                          </p>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </template>
                        </UAccordion>
                      </td>
                    </tr>
                  </template>

                  <!-- Empty Products -->
                  <tr v-if="!purchaseStore?.items?.length">
                    <td colspan="9" class="px-4 py-10 text-center text-sm text-body">
                      No products added yet.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside class="space-y-5">
          <section class="rounded-2xl bg-white p-4">
            <div class="flex items-center justify-between gap-4 py-2 border-b border-border">
              <h2 class="font-bold text-title">Purchase Summary</h2>
              <span class="font-semibold text-title">
                {{ purchaseStore?.items?.length ?? 0 }} items
              </span>
            </div>

            <div class="space-y-2 py-4 text-sm">
              <div class="flex justify-between">
                <span class="text-body">Subtotal</span>
                <span class="font-semibold text-title">
                  {{ $currency(purchaseStore?.subtotal) }}
                </span>
              </div>

              <div class="flex items-center justify-between gap-4">
                <label for="discount" class="text-body">Discount</label>
                <input
                  id="discount"
                  v-model.number="purchaseStore.discount"
                  type="number"
                  min="0"
                  placeholder="0.00"
                  class="w-32 rounded border border-border px-2 py-1.5 text-right text-sm font-semibold text-title outline-none"
                />
              </div>

              <div class="flex items-center justify-between gap-4">
                <label for="discount" class="text-body">Tax</label>
                <input
                  id="discount"
                  v-model.number="purchaseStore.tax"
                  type="number"
                  min="0"
                  placeholder="0.00"
                  class="w-32 rounded border border-border px-2 py-1.5 text-right text-sm font-semibold text-title outline-none"
                />
              </div>

              <div class="flex items-center justify-between gap-4">
                <label for="shipping" class="text-body">Shipping</label>
                <input
                  id="shipping"
                  v-model.number="purchaseStore.shipping"
                  type="number"
                  min="0"
                  placeholder="0.00"
                  class="w-32 rounded border border-border px-2 py-1.5 text-right text-sm font-semibold text-title outline-none"
                />
              </div>

              <div class="flex items-center justify-between gap-4">
                <label for="charge" class="text-body">Other Charge</label>
                <input
                  id="charge"
                  v-model.number="purchaseStore.charge"
                  type="number"
                  min="0"
                  placeholder="0.00"
                  class="w-32 rounded border border-border px-2 py-1.5 text-right text-sm font-semibold text-title outline-none"
                />
              </div>
            </div>

            <div class="flex items-center justify-between rounded-xl bg-blue-50 p-4">
              <span class="text-sm font-semibold text-title">Total Amount</span>
              <span class="text-xl font-bold text-primary">
                {{ $currency(purchaseStore.total) }}
              </span>
            </div>
          </section>

          <!-- Payment -->
          <section class="rounded-2xl bg-white p-4">
            <h2 class="mb-4 font-bold text-slate-900">Payment</h2>

            <div class="mb-4">
              <label for="paid" class="mb-2 block text-sm text-slate-500"> Paid Amount </label>

              <input
                id="paid"
                v-model.number="purchaseStore.paid"
                type="number"
                min="0"
                :max="purchaseStore.total"
                placeholder="0.00"
                class="w-full rounded border border-border px-3 py-3 text-sm font-medium outline-none transition focus:border-primary"
              />
            </div>

            <div class="mb-3 flex items-center justify-between">
              <span class="text-sm text-slate-500">Due Amount</span>
              <span class="font-bold text-emerald-600">
                {{ $currency(purchaseStore.due) }}
              </span>
            </div>
            <button
              @click="submit"
              class="w-full rounded bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              Save Purchase
            </button>
          </section>
        </aside>
      </div>
    </main>
  </Default>
</template>
