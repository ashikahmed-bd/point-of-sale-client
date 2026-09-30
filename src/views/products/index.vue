<script setup>
import Default from '@/layouts/Default.vue'

const products = [
  {
    id: 1,
    name: 'Real Madrid Home Jersey 2025/26',
    details: 'Size: S, M, L, XL · Color: White',
    category: 'Jerseys',
    brand: 'Adidas',
    sku: 'RM-2026-H',
    price: '৳ 5,500',
    oldPrice: '৳ 6,500',
    stock: 42,
    status: 'In Stock',
  },
  {
    id: 2,
    name: 'Barcelona Home Jersey 2025/26',
    details: 'Size: S, M, L, XL · Color: Blue',
    category: 'Jerseys',
    brand: 'Nike',
    sku: 'BAR-2026-H',
    price: '৳ 5,200',
    oldPrice: '৳ 6,000',
    stock: 36,
    status: 'In Stock',
  },
  {
    id: 3,
    name: 'Nike T-Shirt (Cotton)',
    details: 'Size: S, M, L, XL · Color: Black',
    category: 'T-Shirts',
    brand: 'Nike',
    sku: 'NK-TS-001',
    price: '৳ 1,200',
    oldPrice: '',
    stock: 120,
    status: 'In Stock',
  },
  {
    id: 4,
    name: 'Adidas Running Shoe',
    details: 'Size: 40, 41, 42 · Color: White',
    category: 'Shoes',
    brand: 'Adidas',
    sku: 'AD-RUN-001',
    price: '৳ 6,800',
    oldPrice: '',
    stock: 25,
    status: 'Low Stock',
  },
  {
    id: 5,
    name: 'Adidas Football',
    details: 'Size: 5 · Color: White/Blue',
    category: 'Accessories',
    brand: 'Adidas',
    sku: 'AD-FB-001',
    price: '৳ 2,100',
    oldPrice: '',
    stock: 58,
    status: 'In Stock',
  },
  {
    id: 6,
    name: 'Nike Sneaker',
    details: 'Size: 42, 43, 44 · Color: Red',
    category: 'Shoes',
    brand: 'Nike',
    sku: 'NK-SN-001',
    price: '৳ 11,200',
    oldPrice: '',
    stock: 0,
    status: 'Out of Stock',
  },
  {
    id: 7,
    name: 'Headphone',
    details: 'Color: Black',
    category: 'Electronics',
    brand: 'Sony',
    sku: 'SY-HP-001',
    price: '৳ 10,500',
    oldPrice: '৳ 12,000',
    stock: 42,
    status: 'In Stock',
  },
  {
    id: 8,
    name: 'Adidas Backpack',
    details: 'Color: Black',
    category: 'Accessories',
    brand: 'Adidas',
    sku: 'AD-BP-001',
    price: '৳ 3,800',
    oldPrice: '',
    stock: 15,
    status: 'Low Stock',
  },
  {
    id: 9,
    name: 'Sports Bottle',
    details: 'Volume: 750ml · Color: Blue',
    category: 'Accessories',
    brand: 'Generic',
    sku: 'SP-BT-001',
    price: '৳ 950',
    oldPrice: '',
    stock: 64,
    status: 'In Stock',
  },
  {
    id: 10,
    name: 'Cricket Bat',
    details: 'Size: Full · Color: Brown',
    category: 'Accessories',
    brand: 'SS',
    sku: 'SS-CB-001',
    price: '৳ 8,900',
    oldPrice: '',
    stock: 12,
    status: 'Low Stock',
  },
]

const stats = [
  {
    title: 'Total Products',
    value: '1,240',
    change: '+12%',
    icon: 'i-lucide-box',
    class: 'bg-primary/10 text-primary',
  },
  {
    title: 'Low Stock',
    value: '28',
    change: '+5%',
    icon: 'i-lucide-triangle-alert',
    class: 'bg-orange-50 text-orange-500',
  },
  {
    title: 'Out of Stock',
    value: '12',
    change: '+8%',
    icon: 'i-lucide-circle-x',
    class: 'bg-red-50 text-red-500',
  },
  {
    title: 'Active Products',
    value: '1,180',
    change: '+10%',
    icon: 'i-lucide-tag',
    class: 'bg-violet-50 text-violet-500',
  },
]

const statusClass = (status) => {
  if (status === 'In Stock') {
    return 'bg-emerald-50 text-emerald-600'
  }

  if (status === 'Low Stock') {
    return 'bg-orange-50 text-orange-600'
  }

  return 'bg-red-50 text-red-600'
}

const stockClass = (stock) => {
  if (!stock) return 'bg-slate-200'
  if (stock <= 25) return 'bg-orange-500'
  return 'bg-emerald-500'
}

const stockWidth = (stock) => {
  if (!stock) return '0%'
  return `${Math.min(stock, 100)}%`
}
</script>

<template>
  <Default>
    <main class="p-4">
      <div class="mx-auto max-w-7xl">
        <!-- Page Header -->
        <div class="mb-4 flex items-center justify-between gap-4">
          <div>
            <h1 class="text-sm font-semibold text-body">Products</h1>

            <p class="mt-1 text-sm text-body/60">Manage your products, stock, pricing and more.</p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-body transition hover:bg-slate-50"
            >
              <UIcon name="i-lucide-upload" class="size-4" />

              Import
            </button>

            <button
              type="button"
              class="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-body transition hover:bg-slate-50"
            >
              <UIcon name="i-lucide-download" class="size-4" />

              Export
            </button>

            <RouterLink
              :to="{ name: 'products.create' }"
              class="flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-white transition hover:bg-primary/90"
            >
              <UIcon name="i-lucide-plus" class="size-4" />

              Add Product
            </RouterLink>
          </div>
        </div>

        <!-- Stats -->
        <div class="mb-3 grid grid-cols-4 gap-3">
          <div
            v-for="stat in stats"
            :key="stat.title"
            class="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
          >
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-lg"
              :class="stat.class"
            >
              <UIcon :name="stat.icon" class="size-5" />
            </div>

            <div class="min-w-0">
              <p class="text-sm text-body/60">
                {{ stat.title }}
              </p>

              <div class="mt-0.5 flex items-center gap-2">
                <span class="text-sm font-semibold text-body">
                  {{ stat.value }}
                </span>

                <span class="text-sm font-medium text-emerald-600">
                  {{ stat.change }}
                </span>
              </div>

              <p class="mt-0.5 text-xs text-body/40">vs last month</p>
            </div>
          </div>
        </div>

        <!-- Products -->
        <section class="overflow-hidden rounded-lg border border-slate-200 bg-white px-4 py-6">
          <div class="flex items-center gap-2 border-b border-slate-100 p-2">
            <div class="relative flex-1">
              <UIcon
                name="i-lucide-search"
                class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-body/40"
              />

              <input
                type="text"
                placeholder="Search products by name, SKU or barcode..."
                class="h-9 w-full rounded-md border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-sm text-body outline-none transition placeholder:text-body/40 focus:border-primary focus:bg-white"
              />
            </div>

            <select
              class="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-body outline-none focus:border-primary"
            >
              <option>All Categories</option>
              <option>Jerseys</option>
              <option>T-Shirts</option>
              <option>Shoes</option>
              <option>Accessories</option>
            </select>

            <select
              class="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-body outline-none focus:border-primary"
            >
              <option>All Brands</option>
              <option>Adidas</option>
              <option>Nike</option>
              <option>Puma</option>
              <option>Sony</option>
            </select>

            <select
              class="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-body outline-none focus:border-primary"
            >
              <option>All Status</option>
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>

            <button
              type="button"
              class="flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm text-body transition hover:bg-slate-50"
            >
              <UIcon name="i-lucide-list-filter" class="size-4" />

              Filter
            </button>

            <button type="button" class="px-1 text-sm text-primary hover:underline">Reset</button>
          </div>

          <div class="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="product in products" :key="product.id">
                  <td>
                    <div class="flex items-center gap-3">
                      <div
                        class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                      >
                        <UIcon name="i-lucide-image" class="size-4 text-body/30" />
                      </div>

                      <div class="min-w-0">
                        <p class="truncate text-sm font-medium text-body">
                          {{ product.name }}
                        </p>

                        <p class="mt-0.5 truncate text-xs text-body/50">
                          {{ product.details }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td>
                    {{ product.category }}
                  </td>

                  <td>
                    {{ product.brand }}
                  </td>

                  <td class="font-mono text-xs text-body/60">
                    {{ product.sku }}
                  </td>

                  <td>
                    <div class="whitespace-nowrap text-sm font-medium text-body">
                      {{ product.price }}
                    </div>

                    <div
                      v-if="product.oldPrice"
                      class="whitespace-nowrap text-xs text-body/40 line-through"
                    >
                      {{ product.oldPrice }}
                    </div>
                  </td>

                  <td>
                    <div class="w-16">
                      <div class="mb-1 text-sm text-body">
                        {{ product.stock }}
                      </div>

                      <div class="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          class="h-full rounded-full"
                          :class="stockClass(product.stock)"
                          :style="{
                            width: stockWidth(product.stock),
                          }"
                        />
                      </div>
                    </div>
                  </td>

                  <td>
                    <span
                      class="inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium"
                      :class="statusClass(product.status)"
                    >
                      {{ product.status }}
                    </span>
                  </td>

                  <td>
                    <div class="flex items-center gap-1">
                      <button
                        type="button"
                        class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-body/60 transition hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                      >
                        <UIcon name="i-lucide-eye" class="size-4" />
                      </button>

                      <button
                        type="button"
                        class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-body/60 transition hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                      >
                        <UIcon name="i-lucide-pencil" class="size-4" />
                      </button>

                      <button
                        type="button"
                        class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-body/60 transition hover:border-primary/20 hover:bg-slate-50 hover:text-primary"
                      >
                        <UIcon name="i-lucide-more-horizontal" class="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-between border-t border-slate-100 px-3 py-3">
            <p class="text-sm text-body/60">Showing 1 to 10 of 1,240 products</p>

            <div class="flex items-center gap-4">
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-body/50 hover:bg-slate-50"
                >
                  <UIcon name="i-lucide-chevron-left" class="size-4" />
                </button>

                <button
                  type="button"
                  class="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-medium text-white"
                >
                  1
                </button>

                <button
                  v-for="page in [2, 3, 4, 5]"
                  :key="page"
                  type="button"
                  class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-sm text-body hover:bg-slate-50"
                >
                  {{ page }}
                </button>

                <span class="px-1 text-sm text-body/40"> ... </span>

                <button
                  type="button"
                  class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-sm text-body hover:bg-slate-50"
                >
                  124
                </button>

                <button
                  type="button"
                  class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-body hover:bg-slate-50"
                >
                  <UIcon name="i-lucide-chevron-right" class="size-4" />
                </button>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-sm text-body/60"> Show </span>

                <select
                  class="h-8 rounded-md border border-slate-200 bg-white px-2 text-sm text-body outline-none focus:border-primary"
                >
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>

                <span class="text-sm text-body/60"> per page </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </Default>
</template>
