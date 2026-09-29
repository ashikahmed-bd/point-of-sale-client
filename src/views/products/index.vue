<script setup>
import Default from '@/layouts/Default.vue'

import { computed, ref } from 'vue'

const search = ref('')
const category = ref('')
const status = ref('')

const stats = [
  {
    label: 'Total Products',
    value: '248',
    icon: 'i-lucide-package',
    bg: 'bg-blue-50',
    color: 'text-blue-600',
  },
  {
    label: 'Active Products',
    value: '221',
    icon: 'i-lucide-circle-check',
    bg: 'bg-emerald-50',
    color: 'text-emerald-600',
  },
  {
    label: 'Low Stock',
    value: '14',
    icon: 'i-lucide-triangle-alert',
    bg: 'bg-amber-50',
    color: 'text-amber-600',
  },
  {
    label: 'Out of Stock',
    value: '7',
    icon: 'i-lucide-package-x',
    bg: 'bg-red-50',
    color: 'text-red-600',
  },
]

const products = [
  {
    id: 1,
    name: 'Apple MacBook Air M3',
    brand: 'Apple',
    sku: 'MBA-M3-256',
    barcode: '8901234567890',
    category: 'Electronics',
    selling_price: 129900,
    compare_price: 139900,
    cost_price: 118000,
    stock: 24,
    min_stock: 5,
    max_stock: 50,
    status: 'active',
    has_variants: true,
    variants: 3,
    image: 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=200',
  },
  {
    id: 2,
    name: 'Logitech MX Master 3S',
    brand: 'Logitech',
    sku: 'LGT-MX3S-BLK',
    barcode: '8901234567891',
    category: 'Accessories',
    selling_price: 8950,
    compare_price: 9990,
    cost_price: 7200,
    stock: 48,
    min_stock: 10,
    max_stock: 80,
    status: 'active',
    has_variants: true,
    variants: 2,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=200',
  },
  {
    id: 3,
    name: 'Samsung 55" Crystal UHD TV',
    brand: 'Samsung',
    sku: 'SAM-TV-55CU',
    barcode: '8901234567892',
    category: 'Electronics',
    selling_price: 64900,
    compare_price: 69900,
    cost_price: 58000,
    stock: 8,
    min_stock: 10,
    max_stock: 30,
    status: 'active',
    has_variants: false,
    variants: 0,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200',
  },
  {
    id: 4,
    name: 'Premium Laptop Stand',
    brand: 'Buyzin',
    sku: 'BZN-LS-001',
    barcode: '8901234567893',
    category: 'Accessories',
    selling_price: 2450,
    compare_price: null,
    cost_price: 1700,
    stock: 63,
    min_stock: 10,
    max_stock: 100,
    status: 'active',
    has_variants: false,
    variants: 0,
    image: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=200',
  },
  {
    id: 5,
    name: 'Nike Air Max 270',
    brand: 'Nike',
    sku: 'NK-AM270-001',
    barcode: '8901234567894',
    category: 'Sports',
    selling_price: 15900,
    compare_price: 17900,
    cost_price: 12800,
    stock: 3,
    min_stock: 5,
    max_stock: 40,
    status: 'active',
    has_variants: true,
    variants: 6,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
  },
  {
    id: 6,
    name: 'Wireless Mechanical Keyboard',
    brand: 'Keychron',
    sku: 'KCH-K8-PRO',
    barcode: '8901234567895',
    category: 'Accessories',
    selling_price: 11200,
    compare_price: 12500,
    cost_price: 8900,
    stock: 0,
    min_stock: 5,
    max_stock: 30,
    status: 'inactive',
    has_variants: true,
    variants: 4,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200',
  },
  {
    id: 7,
    name: 'Smart LED Desk Lamp',
    brand: 'Philips',
    sku: 'PHL-LAMP-001',
    barcode: '8901234567896',
    category: 'Home & Living',
    selling_price: 3250,
    compare_price: 3800,
    cost_price: 2400,
    stock: 18,
    min_stock: 5,
    max_stock: 50,
    status: 'draft',
    has_variants: false,
    variants: 0,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200',
  },
  {
    id: 8,
    name: 'Anker 20W USB-C Charger',
    brand: 'Anker',
    sku: 'ANK-20W-PD',
    barcode: '8901234567897',
    category: 'Accessories',
    selling_price: 1890,
    compare_price: 2190,
    cost_price: 1350,
    stock: 72,
    min_stock: 15,
    max_stock: 100,
    status: 'active',
    has_variants: false,
    variants: 0,
    image: 'https://images.unsplash.com/photo-1609592424875-6c3a3e2d1e7f?w=200',
  },
]

const filteredProducts = computed(() => {
  const query = search.value.toLowerCase().trim()

  return products.filter((product) => {
    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.barcode?.toLowerCase().includes(query)

    const matchesCategory = !category.value || product.category === category.value

    const matchesStatus = !status.value || product.status === status.value

    return matchesSearch && matchesCategory && matchesStatus
  })
})
</script>

<template>
  <Default>
    <main class="p-4">
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-lg font-semibold text-slate-900">Products</h1>
          <p class="mt-0.5 text-xs text-slate-500">Manage your products, inventory and pricing</p>
        </div>

        <button
          type="button"
          class="flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary/90"
        >
          <UIcon name="i-lucide-plus" class="size-4" />
          Add Product
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-slate-500">
                {{ stat.label }}
              </p>

              <p class="mt-1 text-lg font-bold text-slate-900">
                {{ stat.value }}
              </p>
            </div>

            <div class="flex size-8 items-center justify-center rounded-lg" :class="stat.bg">
              <UIcon :name="stat.icon" class="size-4" :class="stat.color" />
            </div>
          </div>
        </div>
      </div>

      <!-- Products Card -->
      <section class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <!-- Toolbar -->
        <div class="border-b border-slate-100 p-3">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <!-- Search -->
            <div class="relative w-full lg:max-w-sm">
              <UIcon
                name="i-lucide-search"
                class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              />

              <input
                v-model="search"
                type="search"
                placeholder="Search products, SKU or barcode..."
                class="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap items-center gap-2">
              <select
                v-model="category"
                class="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-primary"
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Sports">Sports</option>
              </select>

              <select
                v-model="status"
                class="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-primary"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </select>

              <button
                type="button"
                class="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <UIcon name="i-lucide-sliders-horizontal" class="size-3.5" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full min-w-[1100px]">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/70">
                <th class="w-10 px-4 py-2.5 text-left">
                  <input type="checkbox" class="size-3.5 rounded border-slate-300" />
                </th>

                <th
                  class="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                >
                  Product
                </th>

                <th
                  class="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                >
                  SKU / Barcode
                </th>

                <th
                  class="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                >
                  Category
                </th>

                <th
                  class="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                >
                  Price
                </th>

                <th
                  class="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                >
                  Stock
                </th>

                <th
                  class="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                >
                  Status
                </th>

                <th class="w-12 px-3 py-2.5"></th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="product in filteredProducts"
                :key="product.id"
                class="transition hover:bg-slate-50/60"
              >
                <!-- Checkbox -->
                <td class="px-4 py-3">
                  <input type="checkbox" class="size-3.5 rounded border-slate-300" />
                </td>

                <!-- Product -->
                <td class="px-3 py-3">
                  <div class="flex min-w-[280px] items-center gap-3">
                    <div
                      class="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                    >
                      <img
                        v-if="product.image"
                        :src="product.image"
                        :alt="product.name"
                        class="size-full object-cover"
                      />

                      <UIcon v-else name="i-lucide-image" class="size-5 text-slate-300" />
                    </div>

                    <div class="min-w-0">
                      <p class="truncate text-sm font-semibold text-slate-800">
                        {{ product.name }}
                      </p>

                      <div class="mt-1 flex items-center gap-2">
                        <span class="text-[11px] text-slate-400">
                          {{ product.brand }}
                        </span>

                        <span
                          v-if="product.has_variants"
                          class="rounded bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-600"
                        >
                          {{ product.variants }} variants
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- SKU -->
                <td class="px-3 py-3">
                  <div class="space-y-1">
                    <p class="font-mono text-xs font-medium text-slate-700">
                      {{ product.sku }}
                    </p>

                    <p class="font-mono text-[10px] text-slate-400">
                      {{ product.barcode || 'No barcode' }}
                    </p>
                  </div>
                </td>

                <!-- Category -->
                <td class="px-3 py-3">
                  <span class="text-xs text-slate-600">
                    {{ product.category }}
                  </span>
                </td>

                <!-- Price -->
                <td class="px-3 py-3">
                  <div>
                    <p class="text-sm font-semibold text-slate-800">
                      ৳{{ product.selling_price.toLocaleString() }}
                    </p>

                    <p v-if="product.compare_price" class="text-[11px] text-slate-400 line-through">
                      ৳{{ product.compare_price.toLocaleString() }}
                    </p>
                  </div>
                </td>

                <!-- Stock -->
                <td class="px-3 py-3">
                  <div class="min-w-[100px]">
                    <div class="flex items-center justify-between">
                      <span
                        class="text-xs font-semibold"
                        :class="
                          product.stock <= product.min_stock ? 'text-red-600' : 'text-slate-700'
                        "
                      >
                        {{ product.stock }}
                      </span>

                      <span class="text-[10px] text-slate-400">
                        / {{ product.max_stock || '∞' }}
                      </span>
                    </div>

                    <div class="mt-1 h-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        class="h-full rounded-full"
                        :class="
                          product.stock <= product.min_stock
                            ? 'bg-red-500'
                            : product.stock <= 20
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                        "
                        :style="{
                          width: `${Math.min(
                            (product.stock / (product.max_stock || 100)) * 100,
                            100,
                          )}%`,
                        }"
                      />
                    </div>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-3 py-3">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold"
                    :class="{
                      'bg-emerald-50 text-emerald-600': product.status === 'active',
                      'bg-amber-50 text-amber-600': product.status === 'draft',
                      'bg-slate-100 text-slate-500': product.status === 'inactive',
                    }"
                  >
                    <span
                      class="size-1.5 rounded-full"
                      :class="{
                        'bg-emerald-500': product.status === 'active',
                        'bg-amber-500': product.status === 'draft',
                        'bg-slate-400': product.status === 'inactive',
                      }"
                    />

                    {{ product.status }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="px-3 py-3 text-right">
                  <button
                    type="button"
                    class="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <UIcon name="i-lucide-ellipsis" class="size-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty -->
        <div
          v-if="!filteredProducts.length"
          class="flex min-h-60 flex-col items-center justify-center"
        >
          <div class="flex size-10 items-center justify-center rounded-full bg-slate-100">
            <UIcon name="i-lucide-package-search" class="size-5 text-slate-400" />
          </div>

          <p class="mt-3 text-sm font-medium text-slate-700">No products found</p>

          <p class="mt-1 text-xs text-slate-400">Try changing your search or filters</p>
        </div>

        <!-- Footer -->
        <div
          class="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p class="text-xs text-slate-500">
            Showing
            <span class="font-semibold text-slate-700">
              {{ filteredProducts.length }}
            </span>
            of
            <span class="font-semibold text-slate-700">
              {{ products.length }}
            </span>
            products
          </p>

          <div class="flex items-center gap-1">
            <button
              type="button"
              class="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50"
            >
              <UIcon name="i-lucide-chevron-left" class="size-4" />
            </button>

            <button
              type="button"
              class="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-white"
            >
              1
            </button>

            <button
              type="button"
              class="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
            >
              2
            </button>

            <button
              type="button"
              class="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <UIcon name="i-lucide-chevron-right" class="size-4" />
            </button>
          </div>
        </div>
      </section>
    </main>
  </Default>
</template>
