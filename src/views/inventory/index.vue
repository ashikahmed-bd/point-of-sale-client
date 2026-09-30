<script setup>
import Default from '@/layouts/Default.vue'

const products = [
  {
    id: '01',
    name: 'Real Madrid Home Jersey 2025/26',
    sku: 'RM-HOME-2526',
    category: 'Jerseys',
    stock: 42,
    min_stock: 10,
    cost_price: 4200,
    selling_price: 5500,
    status: 'In Stock',
  },
  {
    id: '02',
    name: 'Barcelona Away Jersey 2025/26',
    sku: 'BAR-AWAY-2526',
    category: 'Jerseys',
    stock: 8,
    min_stock: 10,
    cost_price: 3900,
    selling_price: 5200,
    status: 'Low Stock',
  },
  {
    id: '03',
    name: 'Nike Mercurial Vapor 16',
    sku: 'NK-MV16-001',
    category: 'Football Boots',
    stock: 24,
    min_stock: 8,
    cost_price: 8500,
    selling_price: 11500,
    status: 'In Stock',
  },
  {
    id: '04',
    name: 'Adidas Predator Elite',
    sku: 'AD-PRED-ELT',
    category: 'Football Boots',
    stock: 4,
    min_stock: 8,
    cost_price: 9200,
    selling_price: 12500,
    status: 'Low Stock',
  },
  {
    id: '05',
    name: 'SS Ton Cricket Bat',
    sku: 'SS-TON-001',
    category: 'Cricket Bats',
    stock: 0,
    min_stock: 5,
    cost_price: 7800,
    selling_price: 9900,
    status: 'Out of Stock',
  },
  {
    id: '06',
    name: 'Kookaburra Cricket Ball',
    sku: 'KKB-BALL-001',
    category: 'Cricket',
    stock: 67,
    min_stock: 20,
    cost_price: 850,
    selling_price: 1200,
    status: 'In Stock',
  },
  {
    id: '07',
    name: 'Nike Training Backpack',
    sku: 'NK-BAG-001',
    category: 'Accessories',
    stock: 16,
    min_stock: 8,
    cost_price: 2200,
    selling_price: 3200,
    status: 'In Stock',
  },
  {
    id: '08',
    name: 'Football Training Cone Set',
    sku: 'FT-CONE-001',
    category: 'Accessories',
    stock: 3,
    min_stock: 10,
    cost_price: 650,
    selling_price: 950,
    status: 'Low Stock',
  },
]

const stockMovements = [
  {
    product: 'Real Madrid Home Jersey 2025/26',
    type: 'Stock In',
    quantity: '+20',
    date: 'Today, 10:42 AM',
  },
  {
    product: 'Barcelona Away Jersey 2025/26',
    type: 'Stock Out',
    quantity: '-6',
    date: 'Today, 09:18 AM',
  },
  {
    product: 'Kookaburra Cricket Ball',
    type: 'Stock In',
    quantity: '+30',
    date: 'Yesterday, 04:35 PM',
  },
  {
    product: 'Nike Training Backpack',
    type: 'Stock Out',
    quantity: '-4',
    date: 'Yesterday, 02:12 PM',
  },
]
</script>

<template>
  <Default>
    <main class="p-4 sm:p-5">
      <div class="mx-auto max-w-7xl">
        <div class="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div class="mb-1 flex items-center gap-2 text-xs text-slate-400">
              <span>Inventory</span>

              <UIcon name="i-lucide-chevron-right" class="h-3.5 w-3.5" />

              <span class="text-slate-600"> Stock Overview </span>
            </div>

            <h1 class="text-lg font-bold text-slate-900">Stock Overview</h1>

            <p class="mt-0.5 text-sm text-slate-500">
              Monitor inventory levels, stock health and product availability
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <UIcon name="i-lucide-download" class="h-4 w-4" />

              Export
            </button>

            <button
              type="button"
              class="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              <UIcon name="i-lucide-package-plus" class="h-4 w-4" />

              Stock Adjustment
            </button>
          </div>
        </div>

        <div class="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-xl border border-slate-200 bg-white p-4">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-medium text-slate-500">Total Products</p>

                <p class="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">128</p>

                <p class="mt-1 text-xs text-slate-400">Across all categories</p>
              </div>

              <div
                class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600"
              >
                <UIcon name="i-lucide-package" class="h-4.5 w-4.5" />
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-slate-200 bg-white p-4">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-medium text-slate-500">Total Stock Units</p>

                <p class="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">1,846</p>

                <p class="mt-1 text-xs text-emerald-600">
                  <span class="font-semibold">+8.4%</span>
                  from last month
                </p>
              </div>

              <div
                class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600"
              >
                <UIcon name="i-lucide-boxes" class="h-4.5 w-4.5" />
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-slate-200 bg-white p-4">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-medium text-slate-500">Low Stock</p>

                <p class="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">12</p>

                <p class="mt-1 text-xs text-amber-600">Needs attention</p>
              </div>

              <div
                class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600"
              >
                <UIcon name="i-lucide-triangle-alert" class="h-4.5 w-4.5" />
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-slate-200 bg-white p-4">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-medium text-slate-500">Stock Value</p>

                <p class="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">৳82.4K</p>

                <p class="mt-1 text-xs text-slate-400">At cost price</p>
              </div>

              <div
                class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"
              >
                <UIcon name="i-lucide-wallet" class="h-4.5 w-4.5" />
              </div>
            </div>
          </div>
        </div>

        <div class="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section class="rounded-xl border border-slate-200 bg-white">
            <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 class="text-sm font-bold text-slate-900">Stock Health</h2>

                <p class="mt-0.5 text-xs text-slate-500">Current inventory distribution</p>
              </div>

              <button type="button" class="text-xs font-semibold text-primary hover:underline">
                View Details
              </button>
            </div>

            <div class="p-5">
              <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div class="rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-medium text-slate-500"> In Stock </span>

                    <span class="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>

                  <p class="mt-3 text-2xl font-bold text-slate-900">103</p>

                  <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div class="h-full w-[80%] rounded-full bg-emerald-500" />
                  </div>

                  <p class="mt-2 text-[11px] text-slate-400">80.5% of products</p>
                </div>

                <div class="rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-medium text-slate-500"> Low Stock </span>

                    <span class="h-2 w-2 rounded-full bg-amber-500" />
                  </div>

                  <p class="mt-3 text-2xl font-bold text-slate-900">12</p>

                  <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div class="h-full w-[9%] rounded-full bg-amber-500" />
                  </div>

                  <p class="mt-2 text-[11px] text-slate-400">9.4% of products</p>
                </div>

                <div class="rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-medium text-slate-500"> Out of Stock </span>

                    <span class="h-2 w-2 rounded-full bg-red-500" />
                  </div>

                  <p class="mt-3 text-2xl font-bold text-slate-900">13</p>

                  <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div class="h-full w-[10%] rounded-full bg-red-500" />
                  </div>

                  <p class="mt-2 text-[11px] text-slate-400">10.1% of products</p>
                </div>
              </div>
            </div>
          </section>

          <section class="rounded-xl border border-slate-200 bg-white">
            <div class="border-b border-slate-100 px-5 py-4">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-sm font-bold text-slate-900">Quick Actions</h2>

                  <p class="mt-0.5 text-xs text-slate-500">Manage your inventory</p>
                </div>

                <UIcon name="i-lucide-zap" class="h-4 w-4 text-primary" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 p-4">
              <button
                type="button"
                class="flex flex-col items-start rounded-lg border border-slate-200 p-3 text-left transition hover:border-primary/30 hover:bg-primary/5"
              >
                <UIcon name="i-lucide-plus-circle" class="h-4 w-4 text-primary" />

                <span class="mt-2 text-xs font-semibold text-slate-700"> Add Stock </span>
              </button>

              <button
                type="button"
                class="flex flex-col items-start rounded-lg border border-slate-200 p-3 text-left transition hover:border-primary/30 hover:bg-primary/5"
              >
                <UIcon name="i-lucide-minus-circle" class="h-4 w-4 text-primary" />

                <span class="mt-2 text-xs font-semibold text-slate-700"> Remove Stock </span>
              </button>

              <button
                type="button"
                class="flex flex-col items-start rounded-lg border border-slate-200 p-3 text-left transition hover:border-primary/30 hover:bg-primary/5"
              >
                <UIcon name="i-lucide-history" class="h-4 w-4 text-primary" />

                <span class="mt-2 text-xs font-semibold text-slate-700"> Stock History </span>
              </button>

              <button
                type="button"
                class="flex flex-col items-start rounded-lg border border-slate-200 p-3 text-left transition hover:border-primary/30 hover:bg-primary/5"
              >
                <UIcon name="i-lucide-file-warning" class="h-4 w-4 text-primary" />

                <span class="mt-2 text-xs font-semibold text-slate-700"> Low Stock </span>
              </button>
            </div>
          </section>
        </div>

        <div class="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section class="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div
              class="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <h2 class="text-sm font-bold text-slate-900">Inventory</h2>

                <p class="mt-0.5 text-xs text-slate-500">Product stock levels</p>
              </div>

              <div class="flex items-center gap-2">
                <div class="relative">
                  <UIcon
                    name="i-lucide-search"
                    class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Search products..."
                    class="h-9 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:w-52"
                  />
                </div>

                <select
                  class="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-primary"
                >
                  <option>All Stock</option>

                  <option>In Stock</option>

                  <option>Low Stock</option>

                  <option>Out of Stock</option>
                </select>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full min-w-[800px] text-left">
                <thead class="bg-slate-50/80">
                  <tr class="border-b border-slate-100">
                    <th
                      class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Product
                    </th>

                    <th
                      class="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Category
                    </th>

                    <th
                      class="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Stock
                    </th>

                    <th
                      class="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Cost
                    </th>

                    <th
                      class="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Value
                    </th>

                    <th
                      class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-slate-100">
                  <tr
                    v-for="product in products"
                    :key="product.id"
                    class="transition hover:bg-slate-50/60"
                  >
                    <td class="px-5 py-3.5">
                      <div class="flex items-center gap-3">
                        <div
                          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400"
                        >
                          <UIcon name="i-lucide-package" class="h-4 w-4" />
                        </div>

                        <div class="min-w-0">
                          <p class="truncate text-sm font-semibold text-slate-800">
                            {{ product.name }}
                          </p>

                          <p class="mt-0.5 text-xs text-slate-400">
                            {{ product.sku }}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td class="px-3 py-3.5">
                      <span class="text-sm text-slate-500">
                        {{ product.category }}
                      </span>
                    </td>

                    <td class="px-3 py-3.5 text-right">
                      <p
                        class="text-sm font-bold"
                        :class="{
                          'text-slate-800': product.stock > product.min_stock,
                          'text-amber-600': product.stock > 0 && product.stock <= product.min_stock,
                          'text-red-600': product.stock === 0,
                        }"
                      >
                        {{ product.stock }}
                      </p>

                      <p class="mt-0.5 text-[11px] text-slate-400">Min {{ product.min_stock }}</p>
                    </td>

                    <td class="px-3 py-3.5 text-right">
                      <span class="text-sm text-slate-600">
                        ৳{{ product.cost_price.toLocaleString() }}
                      </span>
                    </td>

                    <td class="px-3 py-3.5 text-right">
                      <span class="text-sm font-semibold text-slate-700">
                        ৳{{ (product.cost_price * product.stock).toLocaleString() }}
                      </span>
                    </td>

                    <td class="px-5 py-3.5 text-right">
                      <span
                        v-if="product.status === 'In Stock'"
                        class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600"
                      >
                        <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        In Stock
                      </span>

                      <span
                        v-else-if="product.status === 'Low Stock'"
                        class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600"
                      >
                        <span class="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        Low Stock
                      </span>

                      <span
                        v-else
                        class="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600"
                      >
                        <span class="h-1.5 w-1.5 rounded-full bg-red-500" />
                        Out of Stock
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="flex items-center justify-between border-t border-slate-100 px-5 py-3.5">
              <p class="text-xs text-slate-500">
                Showing
                <span class="font-semibold text-slate-700">8</span>
                of
                <span class="font-semibold text-slate-700">128</span>
                products
              </p>

              <div class="flex items-center gap-1">
                <button
                  type="button"
                  disabled
                  class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-300"
                >
                  <UIcon name="i-lucide-chevron-left" class="h-4 w-4" />
                </button>

                <button
                  type="button"
                  class="flex h-8 min-w-8 items-center justify-center rounded-lg bg-primary px-2 text-xs font-semibold text-white"
                >
                  1
                </button>

                <button
                  type="button"
                  class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                >
                  <UIcon name="i-lucide-chevron-right" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          <section class="rounded-xl border border-slate-200 bg-white">
            <div class="border-b border-slate-100 px-5 py-4">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-sm font-bold text-slate-900">Recent Movements</h2>

                  <p class="mt-0.5 text-xs text-slate-500">Latest stock activity</p>
                </div>

                <button type="button" class="text-xs font-semibold text-primary hover:underline">
                  View All
                </button>
              </div>
            </div>

            <div class="divide-y divide-slate-100">
              <div
                v-for="movement in stockMovements"
                :key="`${movement.product}-${movement.date}`"
                class="flex gap-3 px-5 py-4"
              >
                <div
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  :class="
                    movement.type === 'Stock In'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-red-50 text-red-600'
                  "
                >
                  <UIcon
                    :name="
                      movement.type === 'Stock In'
                        ? 'i-lucide-arrow-down-to-line'
                        : 'i-lucide-arrow-up-from-line'
                    "
                    class="h-4 w-4"
                  />
                </div>

                <div class="min-w-0 flex-1">
                  <p class="truncate text-xs font-semibold text-slate-800">
                    {{ movement.product }}
                  </p>

                  <div class="mt-1 flex items-center justify-between gap-2">
                    <span class="text-[11px] text-slate-400">
                      {{ movement.date }}
                    </span>

                    <span
                      class="text-xs font-bold"
                      :class="movement.type === 'Stock In' ? 'text-emerald-600' : 'text-red-600'"
                    >
                      {{ movement.quantity }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </Default>
</template>
