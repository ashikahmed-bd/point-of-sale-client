<script setup>
import Default from '@/layouts/Default.vue'

const adjustments = [
  {
    id: 'ADJ-00021',
    date: '29 Sep 2026, 10:42 AM',
    product: 'Real Madrid Home Jersey 2025/26',
    sku: 'RM-HOME-2526',
    type: 'Stock In',
    quantity: 20,
    before: 22,
    after: 42,
    reason: 'New Purchase',
    reference: 'PO-00048',
    user: 'Admin',
    status: 'Completed',
  },
  {
    id: 'ADJ-00020',
    date: '29 Sep 2026, 09:18 AM',
    product: 'Barcelona Away Jersey 2025/26',
    sku: 'BAR-AWAY-2526',
    type: 'Stock Out',
    quantity: 6,
    before: 14,
    after: 8,
    reason: 'Damaged Items',
    reference: 'DMG-00012',
    user: 'Rahim',
    status: 'Completed',
  },
  {
    id: 'ADJ-00019',
    date: '28 Sep 2026, 04:35 PM',
    product: 'Kookaburra Cricket Ball',
    sku: 'KKB-BALL-001',
    type: 'Stock In',
    quantity: 30,
    before: 37,
    after: 67,
    reason: 'Purchase',
    reference: 'PO-00047',
    user: 'Admin',
    status: 'Completed',
  },
  {
    id: 'ADJ-00018',
    date: '28 Sep 2026, 02:12 PM',
    product: 'Nike Training Backpack',
    sku: 'NK-BAG-001',
    type: 'Stock Out',
    quantity: 4,
    before: 20,
    after: 16,
    reason: 'Manual Adjustment',
    reference: 'ADJ-00018',
    user: 'Karim',
    status: 'Completed',
  },
  {
    id: 'ADJ-00017',
    date: '27 Sep 2026, 11:26 AM',
    product: 'Adidas Predator Elite',
    sku: 'AD-PRED-ELT',
    type: 'Stock In',
    quantity: 10,
    before: 4,
    after: 14,
    reason: 'Opening Stock',
    reference: 'OPEN-00006',
    user: 'Admin',
    status: 'Completed',
  },
  {
    id: 'ADJ-00016',
    date: '27 Sep 2026, 09:48 AM',
    product: 'Football Training Cone Set',
    sku: 'FT-CONE-001',
    type: 'Stock Out',
    quantity: 7,
    before: 10,
    after: 3,
    reason: 'Damaged Items',
    reference: 'DMG-00011',
    user: 'Rahim',
    status: 'Completed',
  },
  {
    id: 'ADJ-00015',
    date: '26 Sep 2026, 03:16 PM',
    product: 'SS Ton Cricket Bat',
    sku: 'SS-TON-001',
    type: 'Stock Out',
    quantity: 5,
    before: 5,
    after: 0,
    reason: 'Sales Correction',
    reference: 'COR-00008',
    user: 'Karim',
    status: 'Completed',
  },
  {
    id: 'ADJ-00014',
    date: '26 Sep 2026, 10:05 AM',
    product: 'Nike Mercurial Vapor 16',
    sku: 'NK-MV16-001',
    type: 'Stock In',
    quantity: 12,
    before: 12,
    after: 24,
    reason: 'New Purchase',
    reference: 'PO-00046',
    user: 'Admin',
    status: 'Completed',
  },
]

const summary = [
  {
    title: 'Total Adjustments',
    value: '128',
    icon: 'i-lucide-sliders-horizontal',
  },
  {
    title: 'Stock Added',
    value: '+846',
    icon: 'i-lucide-arrow-down-to-line',
  },
  {
    title: 'Stock Removed',
    value: '-392',
    icon: 'i-lucide-arrow-up-from-line',
  },
  {
    title: 'Today',
    value: '8',
    icon: 'i-lucide-calendar-days',
  },
]
</script>

<template>
  <Default>
    <div class="space-y-5">
      <!-- Header -->
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div class="mb-1 flex items-center gap-2 text-xs text-slate-500">
            <NuxtLink to="/inventory" class="hover:text-primary"> Inventory </NuxtLink>

            <UIcon name="i-lucide-chevron-right" class="h-3.5 w-3.5" />

            <span class="text-slate-700">Stock Adjustments</span>
          </div>

          <h1 class="text-xl font-bold text-slate-900">Stock Adjustments</h1>

          <p class="mt-1 text-sm text-slate-500">
            Track and manage all inventory stock adjustments.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <UIcon name="i-lucide-download" class="h-4 w-4" />
            Export
          </button>

          <NuxtLink
            to="/inventory/adjustments/create"
            class="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            <UIcon name="i-lucide-plus" class="h-4 w-4" />
            New Adjustment
          </NuxtLink>
        </div>
      </div>

      <!-- Summary -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="item in summary"
          :key="item.title"
          class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-slate-500">
                {{ item.title }}
              </p>

              <p class="mt-1 text-xl font-bold text-slate-900">
                {{ item.value }}
              </p>
            </div>

            <div
              class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600"
            >
              <UIcon :name="item.icon" class="h-4.5 w-4.5" />
            </div>
          </div>
        </div>
      </div>

      <!-- Main Card -->
      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <!-- Filters -->
        <div class="border-b border-slate-200 p-4">
          <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div class="relative w-full xl:max-w-sm">
              <UIcon
                name="i-lucide-search"
                class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search adjustment, product or SKU..."
                class="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <select
                class="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option>All Types</option>
                <option>Stock In</option>
                <option>Stock Out</option>
              </select>

              <select
                class="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option>All Reasons</option>
                <option>New Purchase</option>
                <option>Damaged Items</option>
                <option>Manual Adjustment</option>
                <option>Opening Stock</option>
              </select>

              <select
                class="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option>All Status</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full min-w-[1050px] text-left text-sm">
            <thead class="bg-slate-50 text-xs font-semibold text-slate-500">
              <tr>
                <th class="px-4 py-3">Adjustment</th>

                <th class="px-4 py-3">Product</th>

                <th class="px-4 py-3">Type</th>

                <th class="px-4 py-3 text-center">Quantity</th>

                <th class="px-4 py-3">Stock</th>

                <th class="px-4 py-3">Reason</th>

                <th class="px-4 py-3">User</th>

                <th class="px-4 py-3">Status</th>

                <th class="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="item in adjustments"
                :key="item.id"
                class="transition hover:bg-slate-50/70"
              >
                <!-- Adjustment -->
                <td class="px-4 py-3.5">
                  <div class="font-semibold text-slate-800">
                    {{ item.id }}
                  </div>

                  <div class="mt-0.5 text-xs text-slate-400">
                    {{ item.date }}
                  </div>
                </td>

                <!-- Product -->
                <td class="px-4 py-3.5">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"
                    >
                      <UIcon name="i-lucide-package" class="h-4 w-4" />
                    </div>

                    <div class="min-w-0">
                      <p class="truncate font-medium text-slate-800">
                        {{ item.product }}
                      </p>

                      <p class="mt-0.5 text-xs text-slate-400">SKU: {{ item.sku }}</p>
                    </div>
                  </div>
                </td>

                <!-- Type -->
                <td class="px-4 py-3.5">
                  <span
                    v-if="item.type === 'Stock In'"
                    class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                  >
                    <UIcon name="i-lucide-arrow-down-to-line" class="h-3.5 w-3.5" />
                    Stock In
                  </span>

                  <span
                    v-else
                    class="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700"
                  >
                    <UIcon name="i-lucide-arrow-up-from-line" class="h-3.5 w-3.5" />
                    Stock Out
                  </span>
                </td>

                <!-- Quantity -->
                <td class="px-4 py-3.5 text-center">
                  <span
                    :class="[
                      'font-bold',
                      item.type === 'Stock In' ? 'text-emerald-600' : 'text-rose-600',
                    ]"
                  >
                    {{ item.type === 'Stock In' ? '+' : '-' }}{{ item.quantity }}
                  </span>
                </td>

                <!-- Stock -->
                <td class="px-4 py-3.5">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-slate-700">
                      {{ item.before }}
                    </span>

                    <UIcon name="i-lucide-arrow-right" class="h-3.5 w-3.5 text-slate-400" />

                    <span class="font-bold text-slate-900">
                      {{ item.after }}
                    </span>
                  </div>
                </td>

                <!-- Reason -->
                <td class="px-4 py-3.5">
                  <div class="text-slate-700">
                    {{ item.reason }}
                  </div>

                  <div class="mt-0.5 text-xs text-slate-400">
                    {{ item.reference }}
                  </div>
                </td>

                <!-- User -->
                <td class="px-4 py-3.5">
                  <div class="flex items-center gap-2">
                    <div
                      class="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
                    >
                      {{ item.user.charAt(0) }}
                    </div>

                    <span class="text-slate-700">
                      {{ item.user }}
                    </span>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-4 py-3.5">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {{ item.status }}
                  </span>
                </td>

                <!-- Action -->
                <td class="px-4 py-3.5">
                  <div class="flex justify-end">
                    <button
                      type="button"
                      class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <UIcon name="i-lucide-eye" class="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <UIcon name="i-lucide-more-horizontal" class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty footer / Pagination -->
        <div
          class="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p class="text-xs text-slate-500">
            Showing <span class="font-semibold text-slate-700">1–8</span> of
            <span class="font-semibold text-slate-700">128</span> adjustments
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
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-white"
            >
              1
            </button>

            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              2
            </button>

            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              3
            </button>

            <span class="px-1 text-xs text-slate-400">...</span>

            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              16
            </button>

            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <UIcon name="i-lucide-chevron-right" class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Default>
</template>
