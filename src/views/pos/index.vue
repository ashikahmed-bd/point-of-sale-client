<script setup>
import ProductCard from '@/components/ProductCard.vue'
import { useBrandStore } from '@/stores/brand'
import { useCartStore } from '@/stores/cart'
import { useCategoryStore } from '@/stores/category'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'

const categoryStore = useCategoryStore()
const brandStore = useBrandStore()
const productStore = useProductStore()
const cartStore = useCartStore()

const { categories } = storeToRefs(categoryStore)
const { brands } = storeToRefs(brandStore)
const { products } = storeToRefs(productStore)
const { items } = storeToRefs(cartStore)

const loadCategories = async () => {
  await categoryStore.all()
}

const loadBrands = async () => {
  await brandStore.all()
}

const loadProducts = async () => {
  await productStore.all()
}

onMounted(() => {
  loadCategories()
  loadBrands()
  loadProducts()
})

const form = reactive({
  category_id: null,
  brand_id: null,
})
</script>

<template>
  <div class="min-h-screen">
    <main class="grid h-[calc(100vh-30px)] grid-cols-[minmax(0,1fr)_350px] gap-4">
      <section class="flex min-h-0 min-w-0 flex-col rounded-2xl bg-white">
        <header class="shrink-0 border-b border-slate-100">
          <div class="flex items-center justify-between gap-3 px-4 py-3">
            <div class="min-w-0">
              <h1 class="text-sm font-semibold text-slate-900">Point of Sale</h1>
              <p class="mt-1 text-xs text-slate-400">Select products to add to cart</p>
            </div>

            <div
              class="flex shrink-0 items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500"
            >
              <UIcon name="i-lucide-shopping-cart" class="size-4" />

              Cart
            </div>
          </div>

          <!-- Search -->
          <div class="px-4 pb-3">
            <div class="relative">
              <UIcon
                name="i-lucide-search"
                class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                placeholder="Search products..."
                class="h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-50"
              />
            </div>
          </div>

          <!-- Filters -->
          <div class="grid grid-cols-2 gap-2 px-4 pb-3">
            <select
              v-model="form.category_id"
              class="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-50"
            >
              <option value="">All Categories</option>

              <option v-for="category in categories.data" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>

            <select
              v-model="form.brand_id"
              class="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-50"
            >
              <option value="">All Brands</option>

              <option v-for="brand in brands.data" :key="brand.id" :value="brand.id">
                {{ brand.name }}
              </option>
            </select>
          </div>
        </header>

        <!-- Product List -->
        <div class="min-h-0 flex-1 overflow-y-auto p-3 scrollbar-none">
          <div
            class="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
          >
            <ProductCard v-for="product in products.data" :key="product.id" :product="product" />
          </div>
        </div>
      </section>

      <aside class="sticky top-3 flex h-[calc(100vh-80px)] flex-col rounded-2xl bg-white">
        <header class="shrink-0 border-b border-slate-100 p-3">
          <div class="mb-3 flex items-center justify-between">
            <div>
              <h2 class="text-sm font-semibold text-slate-800">Current Order</h2>

              <p class="mt-1 text-xs text-slate-400">Customer & cart</p>
            </div>

            <button
              type="button"
              class="flex size-8 items-center justify-center rounded border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
            >
              <UIcon name="i-lucide-trash-2" class="size-4" />
            </button>
          </div>

          <!-- Customer -->
          <div class="flex gap-2">
            <button
              type="button"
              class="flex size-9 shrink-0 items-center justify-center rounded-md bg-violet-50 text-violet-600"
            >
              <UIcon name="i-lucide-user-round" class="size-4" />
            </button>

            <input
              type="text"
              value="Walk-in Customer"
              class="h-9 min-w-0 flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-50"
            />

            <button
              type="button"
              class="flex size-9 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
            >
              <UIcon name="i-lucide-user-plus" class="size-4" />
            </button>
          </div>
        </header>

        <!-- Cart Items -->
        <div class="min-h-0 flex-1 overflow-y-auto px-3 scrollbar-none">
          <div class="divide-y divide-slate-100">
            <article v-for="value in 10" :key="value" class="flex items-center gap-3 py-3">
              <!-- Image -->
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-md bg-slate-100"
              >
                <UIcon name="i-lucide-package" class="size-4 text-slate-400" />
              </div>

              <!-- Info -->
              <div class="min-w-0 flex-1">
                <h3 class="truncate text-sm font-semibold leading-5 text-slate-800">
                  Laptop Stand
                </h3>

                <span class="mt-1 block text-xs text-slate-400"> ৳39.99 × 2 </span>

                <!-- Quantity -->
                <div
                  class="mt-2 inline-flex items-center overflow-hidden rounded border border-slate-200"
                >
                  <button
                    type="button"
                    class="flex size-7 items-center justify-center text-slate-400 transition hover:bg-slate-50 hover:text-red-500"
                  >
                    <UIcon name="i-lucide-minus" class="size-3.5" />
                  </button>

                  <span
                    class="flex h-7 min-w-8 items-center justify-center border-x border-slate-200 px-2 text-xs font-semibold text-slate-700"
                  >
                    2
                  </span>

                  <button
                    type="button"
                    class="flex size-7 items-center justify-center text-slate-400 transition hover:bg-slate-50 hover:text-emerald-600"
                  >
                    <UIcon name="i-lucide-plus" class="size-3.5" />
                  </button>
                </div>
              </div>

              <!-- Price -->
              <div class="flex shrink-0 flex-col items-end gap-2">
                <strong class="text-sm font-bold text-slate-800"> ৳79.98 </strong>

                <button type="button" class="text-slate-400 transition hover:text-red-500">
                  <UIcon name="i-lucide-x" class="size-4" />
                </button>
              </div>
            </article>
          </div>
        </div>

        <!-- Summary -->
        <div class="shrink-0">
          <div class="space-y-2 px-3 py-3">
            <div class="flex items-center justify-between text-sm">
              <span class="text-slate-500"> Subtotal </span>
              <span class="font-semibold text-slate-700"> ৳14,700 </span>
            </div>

            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-1">
                <span class="text-slate-500"> Discount </span>

                <button
                  type="button"
                  class="flex size-6 items-center justify-center rounded text-slate-400 transition hover:bg-violet-50 hover:text-violet-600"
                >
                  <UIcon name="i-lucide-percent" class="size-3.5" />
                </button>
              </div>

              <span class="font-semibold text-red-500"> - ৳550 </span>
            </div>

            <div class="flex items-center justify-between text-sm">
              <span class="text-slate-500">
                Tax
                <span class="text-xs"> (VAT 5%) </span>
              </span>

              <span class="font-semibold text-slate-700"> ৳707.50 </span>
            </div>

            <div
              class="flex items-center justify-between border-t border-dashed border-slate-200 pt-2"
            >
              <span class="text-sm font-bold text-slate-800"> Grand Total </span>

              <span class="text-base font-bold text-violet-600"> ৳14,857 </span>
            </div>
          </div>

          <!-- Payment -->
          <div class="space-y-3 border-t border-slate-100 px-3 pb-3 pt-3">
            <label class="block text-sm font-medium text-slate-500"> Payment Method </label>

            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                class="flex h-9 items-center justify-center gap-2 rounded-md border border-violet-600 bg-violet-50 text-xs font-semibold text-violet-600"
              >
                <UIcon name="i-lucide-banknote" class="size-4" />

                Cash
              </button>

              <button
                type="button"
                class="flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-500 transition hover:border-violet-300 hover:text-violet-600"
              >
                <UIcon name="i-lucide-credit-card" class="size-4" />

                Card
              </button>

              <button
                type="button"
                class="flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-500 transition hover:border-violet-300 hover:text-violet-600"
              >
                <UIcon name="i-lucide-building-2" class="size-4" />

                Bank
              </button>
            </div>

            <div>
              <div class="mb-2 flex items-center justify-between">
                <label class="text-sm font-medium text-slate-500"> Received Amount </label>

                <span class="text-sm font-medium text-slate-500"> Change </span>
              </div>

              <div class="flex gap-2">
                <div class="relative min-w-0 flex-1">
                  <span
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400"
                  >
                    ৳
                  </span>

                  <input
                    type="number"
                    value="15000"
                    class="h-9 w-full rounded-md border border-slate-200 bg-white pl-7 pr-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-50"
                  />
                </div>

                <div
                  class="flex items-center justify-center rounded-md border border-emerald-100 bg-emerald-50 px-3 text-sm font-bold text-emerald-600"
                >
                  ৳142.50
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </main>

    <!-- Footer -->
    <footer
      class="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 bg-white px-3 py-2"
    >
      <!-- Left -->
      <div class="flex min-w-0 items-center gap-2">
        <div class="mr-2 hidden items-center gap-2 border-r border-slate-200 pr-3 xl:flex">
          <span class="size-2 rounded-full bg-emerald-500"></span>

          <span class="whitespace-nowrap text-xs text-slate-500"> Online · synced </span>
        </div>

        <RouterLink
          :to="{ name: 'dashboard' }"
          class="flex h-9 shrink-0 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <UIcon name="i-lucide-house" class="size-4" />

          <span class="hidden sm:inline"> Home </span>
        </RouterLink>

        <button
          type="button"
          class="flex h-9 shrink-0 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <UIcon name="i-lucide-refresh-cw" class="size-4" />

          <span class="hidden sm:inline"> Reset </span>
        </button>

        <button
          type="button"
          class="hidden h-9 shrink-0 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 md:flex"
        >
          <UIcon name="i-lucide-file-clock" class="size-4" />

          Recent
        </button>

        <button
          type="button"
          class="flex h-9 shrink-0 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <UIcon name="i-lucide-pause-circle" class="size-4" />

          <span class="hidden sm:inline"> Hold </span>
        </button>
      </div>

      <!-- Right -->
      <div class="flex shrink-0 items-center gap-3">
        <div class="hidden text-right sm:block">
          <span class="block text-xs font-medium uppercase tracking-wide text-slate-400">
            Total
          </span>

          <span class="text-base font-bold text-slate-900"> ৳14,857 </span>
        </div>

        <button
          type="button"
          class="flex h-10 items-center justify-center gap-2 rounded-md bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700 active:scale-[0.98]"
        >
          <UIcon name="i-lucide-credit-card" class="size-4" />

          Pay Now
        </button>
      </div>
    </footer>
  </div>
</template>
