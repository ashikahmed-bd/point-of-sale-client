<script setup>
import DraftSales from '@/components/DraftSales.vue'
import ProductCard from '@/components/ProductCard.vue'
import RecentSales from '@/components/RecentSales.vue'
import { useAuthStore } from '@/stores/auth'
import { useBrandStore } from '@/stores/brand'
import { useCartStore } from '@/stores/cart'
import { useCategoryStore } from '@/stores/category'
import { useCustomerStore } from '@/stores/customer'
import { useProductStore } from '@/stores/product'
import { useSaleStore } from '@/stores/sale'
import { storeToRefs } from 'pinia'
import { onMounted, reactive } from 'vue'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()
const categoryStore = useCategoryStore()
const brandStore = useBrandStore()
const productStore = useProductStore()
const cartStore = useCartStore()
const customerStore = useCustomerStore()
const saleStore = useSaleStore()

const { categories } = storeToRefs(categoryStore)
const { brands } = storeToRefs(brandStore)
const { products } = storeToRefs(productStore)
const { cart } = storeToRefs(cartStore)
const { customers } = storeToRefs(customerStore)

const loadCategories = async () => {
  await categoryStore.all()
}

const loadBrands = async () => {
  await brandStore.all()
}

const loadProducts = async () => {
  await productStore.all()
}

const loadCart = async () => {
  await cartStore.index()
}

const loadCustomers = async () => {
  await customerStore.all()
}

onMounted(() => {
  loadCategories()
  loadBrands()
  loadProducts()
  loadCart()
  loadCustomers()
})

const search = reactive({
  category_id: '',
  brand_id: '',
  keywords: '',
})

const customer = reactive({
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  postcode: '',
  opening_balance: 0,
  credit_limit: null,
  notes: '',
})

const addCustomer = async (close) => {
  await customerStore.store(customer)
  close()
  await loadCustomers()
}

const form = reactive({
  customer_id: '',
  payable: 0,
  shipping: '',
})

const discount = reactive({
  amount: '',
  type: 'fixed',
})

const addDiscount = async () => {
  await cartStore.discount(discount)
  loadCart()
}

const addShipping = async (close) => {
  await cartStore.shipping(form.shipping)

  close()
  loadCart()
  form.shipping = 0
}

const placeOrder = async () => {
  await saleStore.store(form)
}
</script>

<template>
  <div class="min-h-dvh bg-slate-200">
    <main class="grid min-h-0 grid-cols-1 gap-3 px-3 py-3 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <section class="flex min-h-0 min-w-0 flex-col rounded-xl bg-white">
        <header class="sticky top-0 z-10 rounded-t-xl border-b bg-white">
          <div class="flex items-center justify-between gap-3 px-4 py-3">
            <UDropdownMenu
              :items="
                authStore.stores.map((store) => ({
                  ...store,
                  onSelect: () => authStore.setStore(store),
                }))
              "
              :popper="{ placement: 'bottom-end' }"
            >
              <button type="button" class="flex items-center gap-2 transition hover:bg-slate-50">
                <span
                  class="flex size-10 items-center justify-center rounded bg-violet-50 text-primary"
                >
                  <UIcon name="i-lucide-store" class="size-8" />
                </span>

                <span class="hidden text-left sm:block">
                  <span class="block text-sm font-normal text-body"> Store </span>

                  <span class="block max-w-32 truncate text-xs font-medium text-slate-700">
                    {{ authStore.store?.name }}
                  </span>
                </span>

                <UIcon name="i-lucide-chevron-down" class="size-4 text-body" />
              </button>

              <template #item="{ item }">
                <div class="flex w-full items-center gap-2">
                  <UIcon name="i-lucide-store" class="size-4 text-body" />

                  <span class="flex-1 truncate">
                    {{ item.name }}
                  </span>

                  <UIcon
                    v-if="authStore.store?.id === item.id"
                    name="i-lucide-check"
                    class="size-4 text-primary"
                  />
                </div>
              </template>
            </UDropdownMenu>

            <div class="flex items-center gap-2">
              <RouterLink
                :to="{ name: 'dashboard' }"
                class="flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              >
                <UIcon name="i-lucide-house" class="size-4" />
                <span class="hidden sm:inline">Home</span>
              </RouterLink>

              <button
                type="button"
                class="flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              >
                <UIcon name="i-lucide-file-pen-line" class="size-4" />
                <span class="hidden sm:inline">Draft</span>
              </button>

              <RecentSales />

              <DraftSales />
            </div>
          </div>
        </header>

        <div class="shrink-0 px-4 py-2.5">
          <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <select v-model="search.category_id" class="form__select">
              <option value="">All Categories</option>
              <option v-for="category in categories.data" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>

            <select v-model="search.brand_id" class="form__select">
              <option value="">All Brands</option>
              <option v-for="brand in brands.data" :key="brand.id" :value="brand.id">
                {{ brand.name }}
              </option>
            </select>

            <div class="relative sm:col-span-2 lg:col-span-1">
              <UIcon
                name="i-lucide-search"
                class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                v-model="search.keywords"
                placeholder="Search products..."
                class="form__control pl-9"
              />
            </div>
          </div>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto px-4 py-2 scrollbar-none">
          <div
            class="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
          >
            <ProductCard v-for="product in products.data" :key="product.id" :product="product" />
          </div>
        </div>
      </section>

      <!-- Cart -->
      <aside
        class="sticky top-2 flex min-h-0 max-h-[calc(100dvh-1rem)] flex-col rounded-xl bg-white px-4 py-2.5"
      >
        <header class="shrink-0 border-b border-border py-2.5">
          <div class="flex items-center gap-2">
            <UModal
              title="Add Customer"
              description="Create a new customer profile"
              :close="{
                color: 'primary',
                variant: 'outline',
                class: 'rounded-full',
              }"
              :ui="{
                content: 'z-30 sm:max-w-xl mb-16',
              }"
            >
              <button
                type="button"
                class="flex shrink-0 items-center justify-center rounded-md border border-slate-200 p-2 text-slate-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                title="Add Customer"
              >
                <UIcon name="i-lucide-user-plus" class="size-4" />
              </button>

              <template #body>
                <div class="space-y-4">
                  <div class="grid grid-cols-2 gap-3">
                    <BaseInput
                      v-model="customer.name"
                      label="Name"
                      placeholder="Enter customer name"
                      :required="true"
                      error=""
                    />

                    <BaseInput
                      v-model="customer.phone"
                      label="Phone"
                      placeholder="Enter phone number"
                      :required="true"
                      error=""
                    />

                    <BaseInput
                      v-model="customer.email"
                      label="Email"
                      type="email"
                      placeholder="Enter email address"
                      :required="false"
                      error=""
                    />

                    <BaseInput
                      v-model="customer.postcode"
                      label="Postcode"
                      placeholder="Enter postcode"
                      :required="false"
                      error=""
                    />
                  </div>

                  <BaseInput
                    v-model="customer.address"
                    label="Address"
                    placeholder="Enter address"
                    :required="true"
                    error=""
                  />

                  <div class="grid grid-cols-2 gap-3">
                    <BaseInput
                      v-model="customer.city"
                      label="City"
                      placeholder="Enter city"
                      :required="false"
                      error=""
                    />

                    <BaseInput
                      v-model="customer.state"
                      label="State"
                      placeholder="Enter state"
                      :required="false"
                      error=""
                    />
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <BaseInput
                      v-model="customer.opening_balance"
                      label="Opening Balance"
                      type="number"
                      placeholder="0.00"
                      :required="false"
                      error=""
                    />

                    <BaseInput
                      v-model="customer.credit_limit"
                      label="Credit Limit"
                      type="number"
                      placeholder="0.00"
                      :required="false"
                      error=""
                    />
                  </div>

                  <BaseTextarea
                    label="Notes"
                    v-model="customer.notes"
                    placeholder="Add notes..."
                    :required="false"
                    error=""
                  />
                </div>
              </template>

              <template #footer="{ close }">
                <div class="flex w-full justify-end gap-2">
                  <UButton color="neutral" variant="outline" label="Cancel" @click="close" />

                  <UButton
                    @click="addCustomer(close)"
                    color="primary"
                    label="Submit"
                    icon="i-lucide-user-plus"
                  />
                </div>
              </template>
            </UModal>

            <USelectMenu
              v-model="form.customer_id"
              value-key="value"
              icon="i-lucide-search"
              :items="
                customers.data?.map((customer) => ({
                  label: `${customer.name} - ${customer.phone}`,
                  value: customer.id,
                }))
              "
              placeholder="Walk-in Customer"
              class="min-w-0 flex-1"
            />
          </div>
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto py-2 scrollbar-none">
          <div class="space-y-1">
            <template v-if="cart">
              <article
                v-for="item in cart.items"
                :key="item.id"
                class="bg-slate-100 rounded flex items-start gap-2 px-2 py-1.5"
              >
                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <h3 class="truncate text-sm font-medium text-heading">
                        {{ item.name }}
                      </h3>

                      <p class="mt-0.5 text-xs text-slate-400">
                        {{ $currency(item.price) }} x {{ item.quantity }}

                        <span
                          v-if="item.tax_rate > 0"
                          class="ml-1.5 before:mr-1.5 before:content-['·']"
                        >
                          {{ item.tax_rate }}% tax
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      @click="cartStore.remove(item.id)"
                      class="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <UIcon name="i-lucide-trash-2" class="size-4" />
                    </button>
                  </div>

                  <div class="flex items-center justify-between gap-2">
                    <div class="inline-flex items-center">
                      <button
                        type="button"
                        class="flex size-7 items-center justify-center text-slate-500 transition hover:bg-slate-50 hover:text-red-500"
                      >
                        <UIcon name="i-lucide-minus" class="size-3.5" />
                      </button>

                      <span
                        class="flex min-w-8 items-center justify-center text-xs font-semibold text-body"
                      >
                        {{ item.quantity }}
                      </span>

                      <button
                        type="button"
                        class="flex size-7 items-center justify-center transition hover:bg-slate-50 hover:text-emerald-600"
                      >
                        <UIcon name="i-lucide-plus" class="size-3.5" />
                      </button>
                    </div>

                    <span class="text-sm font-semibold"> {{ $currency(item.total) }} </span>
                  </div>
                </div>
              </article>
            </template>
            <template v-else>
              <article class="flex min-h-20 items-center justify-center py-6">
                <div class="flex flex-col items-center justify-center gap-3 text-center">
                  <div class="flex rounded-full bg-primary/10 p-3">
                    <UIcon name="i-lucide-shopping-bag" class="size-8 text-primary" />
                  </div>

                  <div>
                    <p class="text-sm font-medium text-slate-700">Your cart is empty</p>
                    <p class="mt-1 text-xs text-slate-400">Add items to your cart to get started</p>
                  </div>
                </div>
              </article>
            </template>
          </div>
        </div>

        <div class="bg-white shrink-0">
          <div class="flex items-center gap-2 py-2">
            <div class="relative flex-1">
              <UIcon
                name="i-lucide-tag"
                class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                v-model="discount.amount"
                placeholder="Enter discount"
                class="w-full rounded border border-border bg-slate-50 py-2 pl-9 pr-16 text-sm text-body outline-none transition placeholder:text-slate-400"
              />

              <select
                v-model="discount.type"
                class="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer rounded text-xs text-muted font-medium outline-none appearance"
              >
                <option value="fixed">Fixed</option>
                <option value="percent">Percent</option>
              </select>
            </div>

            <button
              type="button"
              @click="addDiscount"
              class="shrink-0 rounded bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Apply
            </button>
          </div>
          <div class="space-y-0.5 py-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-body">Subtotal</span>
              <span class="text-body">
                {{ $currency(cartStore.cart?.subtotal) }}
              </span>
            </div>

            <div class="flex items-center justify-between text-sm">
              <span class="text-body">Discount</span>
              <span class="text-danger"> - {{ $currency(cartStore.cart?.discount) }} </span>
            </div>

            <div class="flex items-center justify-between text-sm">
              <span class="text-body"> Tax </span>
              <span class="text-body">
                {{ $currency(cartStore.cart?.tax) }}
              </span>
            </div>

            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-1">
                <span class="text-body">Shipping</span>

                <UModal
                  title="Add Shipping Charge"
                  :close="{
                    color: 'primary',
                    variant: 'outline',
                    class: 'rounded-full',
                  }"
                >
                  <button
                    type="button"
                    class="flex items-center justify-center rounded p-1 text-body transition hover:bg-primary/5 hover:text-primary"
                    title="Add shipping"
                  >
                    <UIcon name="i-lucide-truck" class="size-3.5" />
                  </button>

                  <template #body>
                    <BaseInput
                      v-model="form.shipping"
                      label="Shipping"
                      type="number"
                      placeholder="Enter shipping charge"
                    />
                  </template>

                  <template #footer="{ close }">
                    <div class="flex justify-end gap-2">
                      <UButton color="neutral" variant="outline" label="Cancel" @click="close" />

                      <UButton
                        color="primary"
                        label="Apply"
                        icon="i-lucide-check"
                        @click="addShipping(close)"
                      />
                    </div>
                  </template>
                </UModal>
              </div>

              <span class="text-body">
                {{ $currency(cartStore.cart?.shipping) }}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-body"> Grand Total </span>
              <span class="text-base font-bold text-primary">
                {{ $currency(cartStore.cart?.total) }}
              </span>
            </div>
          </div>

          <div class="space-y-2.5">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-xs font-medium text-slate-500"> Received Amount </label>

                <span class="text-xs font-medium text-slate-500"> Change </span>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <input
                  v-model.number="form.payable"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  class="w-full rounded border border-border bg-white px-4 py-1.5 text-sm font-semibold text-body outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                <div
                  class="flex items-center justify-end rounded border border-emerald-100 bg-emerald-50 px-3 text-sm font-bold text-emerald-600"
                >
                  {{ $currency(Math.max(Number(form.payable) - Number(cartStore.cart?.total), 0)) }}
                </div>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-red-600"> Due Amount </span>
                <span class="text-sm font-bold text-red-600">
                  {{ $currency(Math.max(Number(cartStore.cart?.total) - Number(form.payable), 0)) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="py-2.5">
          <button
            type="button"
            @click="placeOrder"
            class="w-full flex items-center justify-center gap-2 rounded bg-primary py-2.5 text-sm font-semibold text-white"
          >
            <UIcon v-if="saleStore.loading" name="i-lucide-loader" class="size-4" />
            <UIcon v-else name="i-lucide-credit-card" class="size-4" />
            <span>Pay Now</span>
          </button>
        </div>
      </aside>
    </main>
  </div>
</template>
