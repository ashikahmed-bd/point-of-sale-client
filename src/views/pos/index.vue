<script setup>
import ProductCard from '@/components/ProductCard.vue'
import Default from '@/layouts/Default.vue'
import { computed, ref } from 'vue'

const categories = [
  { label: 'All', icon: 'i-lucide-grid-2x2' },
  { label: 'Electronics', icon: 'i-lucide-smartphone' },
  { label: 'Groceries', icon: 'i-lucide-shopping-basket' },
  { label: 'Fashion', icon: 'i-lucide-shirt' },
  { label: 'Home & Living', icon: 'i-lucide-house' },
  { label: 'Beauty', icon: 'i-lucide-sparkles' },
  { label: 'Sports', icon: 'i-lucide-dumbbell' },
  { label: 'Others', icon: 'i-lucide-box' },
]

const products = [
  {
    id: 1,
    name: 'iPhone 15',
    category: 'Electronics',
    price: 120000,
    stock: 12,
    image:
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 2,
    name: 'Samsung Galaxy A54',
    category: 'Electronics',
    price: 45000,
    stock: 8,
    image:
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 3,
    name: 'T-Shirt (Cotton)',
    category: 'Fashion',
    price: 450,
    stock: 120,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 4,
    name: 'Nike Sneakers',
    category: 'Sports',
    price: 4500,
    stock: 28,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 5,
    name: 'Headphone (BT)',
    category: 'Electronics',
    price: 2200,
    stock: 42,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 6,
    name: 'Dettol Handwash',
    category: 'Beauty',
    price: 250,
    stock: 65,
    image:
      'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 7,
    name: 'Premium Rice 2kg',
    category: 'Groceries',
    price: 320,
    stock: 50,
    image:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 8,
    name: 'Cooking Oil 1L',
    category: 'Groceries',
    price: 180,
    stock: 100,
    image:
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 9,
    name: 'Sugar 1kg',
    category: 'Groceries',
    price: 120,
    stock: 80,
    image:
      'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 10,
    name: 'Colgate Toothpaste',
    category: 'Beauty',
    price: 160,
    stock: 72,
    image:
      'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 11,
    name: 'Paracetamol 500mg',
    category: 'Others',
    price: 45,
    stock: 100,
    image:
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 12,
    name: 'LED Bulb 9W',
    category: 'Home & Living',
    price: 150,
    stock: 95,
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=300&q=80',
  },
]

const cart = ref([
  {
    id: 3,
    name: 'T-Shirt (Cotton)',
    variant: 'Size: M, Color: Black',
    price: 450,
    quantity: 2,
    image: products[2].image,
  },
  {
    id: 6,
    name: 'Dettol Handwash',
    variant: '500 ml',
    price: 250,
    quantity: 1,
    image: products[5].image,
  },
  {
    id: 7,
    name: 'Premium Rice 2 kg',
    variant: '',
    price: 320,
    quantity: 3,
    image: products[6].image,
  },
  {
    id: 10,
    name: 'Colgate Toothpaste',
    variant: '100 gm',
    price: 160,
    quantity: 1,
    image: products[9].image,
  },
  {
    id: 12,
    name: 'LED Bulb 9W',
    variant: '',
    price: 150,
    quantity: 4,
    image: products[11].image,
  },
])

const activeCategory = ref('All')
const search = ref('')
const customer = ref('')
const discount = ref(0)
const receivedAmount = ref(3013)
const selectedPayment = ref('Cash')

const filteredProducts = computed(() => {
  return products.filter((product) => {
    const categoryMatch =
      activeCategory.value === 'All' || product.category === activeCategory.value

    const searchMatch = product.name.toLowerCase().includes(search.value.toLowerCase())

    return categoryMatch && searchMatch
  })
})

const subtotal = computed(() => {
  return cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
})

const vat = computed(() => {
  return Math.round((subtotal.value - discount.value) * 0.05)
})

const grandTotal = computed(() => {
  return subtotal.value - discount.value + vat.value
})

const change = computed(() => {
  return Math.max(receivedAmount.value - grandTotal.value, 0)
})

function increase(item) {
  item.quantity++
}

function decrease(item) {
  if (item.quantity <= 1) {
    removeItem(item)
    return
  }

  item.quantity--
}

function removeItem(item) {
  cart.value = cart.value.filter((cartItem) => cartItem.id !== item.id)
}

function clearCart() {
  cart.value = []
}

function applyDiscount() {
  discount.value = discount.value === 0 ? 100 : 0
}

function formatPrice(price) {
  return `৳ ${price.toLocaleString()}`
}
</script>

<template>
  <Default>
    <main class="h-[calc(100vh-20px)] bg-slate-50">
      <div class="grid h-full min-h-0 grid-cols-[minmax(0,1fr)_360px] gap-3">
        <!-- Left -->
        <section class="flex min-h-0 min-w-0 flex-col space-y-4">
          <!-- Search -->
          <div class="mb-3 shrink-0">
            <div class="relative">
              <UIcon
                name="i-lucide-search"
                class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              />

              <input
                v-model="search"
                type="search"
                placeholder="Search products..."
                class="w-full rounded border border-slate-200 bg-white px-2.5 py-2 pl-9 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Categories -->
          <div class="flex shrink-0 items-center gap-2 overflow-x-auto scrollbar">
            <button
              v-for="category in categories"
              :key="category.label"
              type="button"
              @click="activeCategory = category.label"
              class="flex h-8 shrink-0 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition"
              :class="
                activeCategory === category.label
                  ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600'
              "
            >
              <UIcon :name="category.icon" class="size-3.5" />
              {{ category.label }}
            </button>
          </div>

          <!-- Products -->
          <div class="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-none">
            <div class="grid grid-cols-3 gap-2.5 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              <ProductCard
                v-for="product in filteredProducts"
                :key="product.id"
                :product="product"
              />
            </div>
          </div>
        </section>

        <!-- Right / Sticky Cart -->
        <aside
          class="sticky top-0 h-full min-h-0 overflow-hidden rounded border border-border bg-white"
        >
          <div class="flex h-full min-h-0 flex-col">
            <!-- Header -->
            <div
              class="flex shrink-0 items-center justify-between border-b border-dashed border-border px-3 py-2.5"
            >
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <h2 class="text-sm font-bold leading-5 text-body">Order Summary</h2>

                  <span
                    class="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-semibold leading-4 text-body"
                  >
                    4 Items
                  </span>
                </div>

                <span class="block truncate text-xs leading-4 text-muted"> #POS-2026-3015 </span>
              </div>

              <button
                type="button"
                title="Clear cart"
                class="ml-3 flex size-7 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-500 transition-colors hover:bg-red-100 hover:text-red-600"
              >
                <UIcon name="i-lucide-trash-2" class="size-3.5" />
              </button>
            </div>

            <!-- Customer -->
            <div class="shrink-0 border-b border-slate-100 p-2.5">
              <div class="flex gap-2">
                <button
                  type="button"
                  class="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600"
                >
                  <UIcon name="i-lucide-user-round" class="size-4" />
                </button>

                <input
                  type="text"
                  value="Walk-in Customer"
                  class="h-8 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                />

                <button
                  type="button"
                  class="flex size-8 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:border-blue-300 hover:text-blue-600"
                >
                  <UIcon name="i-lucide-user-plus" class="size-4" />
                </button>
              </div>
            </div>

            <!-- Cart Items -->
            <div class="min-h-0 flex-1 overflow-y-auto px-3 scrollbar-none">
              <div class="divide-y divide-slate-100">
                <article v-for="value in 10" :key="value" class="flex items-center gap-2.5 py-2.5">
                  <div class="min-w-0 flex-1">
                    <h3 class="truncate text-xs font-semibold leading-4 text-slate-800">
                      Laptop Stand
                    </h3>

                    <span class="mt-0.5 block text-xs font-medium text-slate-400">
                      ৳39.99 x 2
                    </span>
                  </div>

                  <div
                    class="flex shrink-0 items-center rounded border border-slate-200 bg-slate-50"
                  >
                    <button
                      type="button"
                      class="flex size-6 items-center justify-center text-slate-500 transition hover:text-red-500"
                    >
                      <UIcon name="i-lucide-minus" class="size-3" />
                    </button>

                    <span
                      class="flex min-w-6 items-center justify-center text-xs font-semibold text-slate-700"
                    >
                      2
                    </span>

                    <button
                      type="button"
                      class="flex size-6 items-center justify-center text-slate-500 transition hover:text-emerald-600"
                    >
                      <UIcon name="i-lucide-plus" class="size-3" />
                    </button>
                  </div>

                  <div class="flex w-16 shrink-0 flex-col items-end">
                    <strong class="text-xs font-bold text-slate-800"> ৳79.98 </strong>

                    <button
                      type="button"
                      class="mt-0.5 text-xs font-medium text-red-400 transition hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              </div>
            </div>

            <!-- Summary / Checkout -->
            <div class="shrink-0 space-y-2 border-t border-dashed border-border">
              <div class="space-y-1.5 px-3 py-2.5">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-500">Subtotal</span>
                  <span class="font-semibold text-slate-700">৳14,700</span>
                </div>

                <div class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-1">
                    <span class="text-slate-500">Discount</span>

                    <button
                      type="button"
                      title="Add discount"
                      class="flex size-5 items-center justify-center rounded text-danger transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      <UIcon name="i-lucide-percent" class="size-3.5" />
                    </button>
                  </div>

                  <span class="font-semibold text-red-500">- ৳550</span>
                </div>

                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-500"> Tax <span class="text-xs">(VAT 5%)</span> </span>

                  <span class="font-semibold text-slate-700"> ৳707.50 </span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-sm font-bold text-body"> Grand Total </span>

                  <span class="text-lg font-bold text-primary"> ৳14,857 </span>
                </div>
              </div>

              <!-- Payment Method -->
              <div class="px-2.5">
                <label class="mb-1.5 block text-xs font-medium text-slate-500">
                  Payment Method
                </label>

                <div class="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    class="flex h-9 items-center justify-center gap-1.5 rounded-md border border-primary bg-primary/5 px-2 text-xs font-semibold text-primary"
                  >
                    <UIcon name="i-lucide-banknote" class="size-3.5" />
                    Cash
                  </button>

                  <button
                    type="button"
                    class="flex h-9 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 transition hover:border-primary/40 hover:text-primary"
                  >
                    <UIcon name="i-lucide-credit-card" class="size-3.5" />
                    Card
                  </button>

                  <button
                    type="button"
                    class="flex h-9 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 transition hover:border-primary/40 hover:text-primary"
                  >
                    <UIcon name="i-lucide-smartphone" class="size-3.5" />
                    Mobile
                  </button>

                  <button
                    type="button"
                    class="flex h-9 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 transition hover:border-primary/40 hover:text-primary"
                  >
                    <UIcon name="i-lucide-building-2" class="size-3.5" />
                    Bank
                  </button>
                </div>
              </div>

              <div class="px-3">
                <div class="mb-1 flex items-center justify-between">
                  <label class="text-xs font-medium text-slate-500"> Received Amount </label>

                  <span class="text-xs font-medium text-slate-500"> Change </span>
                </div>

                <div class="flex gap-2">
                  <div class="relative min-w-0 flex-1">
                    <span
                      class="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500"
                    >
                      ৳
                    </span>

                    <input
                      type="number"
                      value="15000"
                      class="h-9 w-full rounded-md border border-slate-200 bg-white pl-6 pr-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                    />
                  </div>

                  <div
                    class="flex h-9 w-24 shrink-0 items-center justify-center rounded-md border border-emerald-100 bg-emerald-50 text-xs font-bold text-emerald-600"
                  >
                    ৳142.50
                  </div>
                </div>
              </div>

              <div class="p-3">
                <button
                  type="button"
                  class="flex w-full items-center justify-center gap-2 rounded bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
                >
                  <UIcon name="i-lucide-circle-check" class="size-4" />
                  Confirm Sale
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  </Default>
</template>
