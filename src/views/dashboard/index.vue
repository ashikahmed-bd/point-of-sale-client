<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import Default from '@/layouts/Default.vue'
import SalesOverview from '@/components/charts/SalesOverview.vue'

const appStore = useAppStore()

const loadDashboard = async () => {
  await appStore.getDashboard()
}

onMounted(() => {
  loadDashboard()
})

const date = ref({
  start: new Date(2024, 5, 1),
  end: new Date(2024, 5, 17),
})

const formatDate = (date) => {
  if (!date) return ''

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date)
}

const dateRange = computed(() => {
  if (!date.value?.start || !date.value?.end) {
    return 'Select date range'
  }

  return `${formatDate(date.value.start)} - ${formatDate(date.value.end)}`
})
</script>

<template>
  <Default>
    <main class="space-y-4">
      <section class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Welcome back, <span class="text-primary">Buyzin Express</span>
          </h1>

          <p class="mt-1 text-sm text-slate-500">
            Here's what's happening with your business today.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <UPopover>
            <button
              type="button"
              class="flex h-10 items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-primary/40 hover:bg-slate-50"
            >
              <UIcon name="i-lucide-calendar-days" class="size-4 text-primary" />

              <span class="whitespace-nowrap">
                {{ dateRange }}
              </span>

              <UIcon name="i-lucide-chevron-down" class="size-4 text-slate-400" />
            </button>

            <template #content>
              <div class="p-3">
                <UCalendar v-model="date" range :number-of-months="2" color="primary" />
              </div>
            </template>
          </UPopover>
        </div>
      </section>

      <!-- Main Business Statistics -->
      <section class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <!-- Total Sales -->
        <div class="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
          <div class="flex items-center gap-3">
            <div
              class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600"
            >
              <UIcon name="i-lucide-shopping-cart" class="size-6" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-slate-500">Total Sales</p>
              <h3 class="mt-1 text-xl font-bold tracking-tight text-slate-900">৳ 45,850</h3>
            </div>
          </div>
        </div>

        <!-- Total Purchases -->
        <div class="rounded-xl border border-sky-100 bg-sky-50/40 p-4">
          <div class="flex items-center gap-3">
            <div
              class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600"
            >
              <UIcon name="i-lucide-package" class="size-6" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-slate-500">Total Purchases</p>
              <h3 class="mt-1 text-xl font-bold tracking-tight text-slate-900">৳ 28,400</h3>
            </div>
          </div>
        </div>

        <!-- Gross Profit -->
        <div class="rounded-xl border border-violet-100 bg-violet-50/40 p-4">
          <div class="flex items-center gap-3">
            <div
              class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600"
            >
              <UIcon name="i-lucide-chart-no-axes-combined" class="size-6" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-slate-500">Gross Profit</p>
              <h3 class="mt-1 text-xl font-bold tracking-tight text-slate-900">৳ 17,450</h3>
            </div>
          </div>
        </div>

        <!-- Total Expenses -->
        <div class="rounded-xl border border-orange-100 bg-orange-50/40 p-4">
          <div class="flex items-center gap-3">
            <div
              class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600"
            >
              <UIcon name="i-lucide-wallet" class="size-6" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-slate-500">Total Expenses</p>
              <h3 class="mt-1 text-xl font-bold tracking-tight text-slate-900">৳ 4,200</h3>
            </div>
          </div>
        </div>

        <!-- Net Profit -->
        <div class="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
          <div class="flex items-center gap-3">
            <div
              class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600"
            >
              <UIcon name="i-lucide-banknote" class="size-6" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-slate-500">Net Profit</p>
              <h3 class="mt-1 text-xl font-bold tracking-tight text-slate-900">৳ 13,250.00</h3>
            </div>
          </div>
        </div>
      </section>

      <!-- Inventory & Contacts Statistics -->
      <section class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total Products -->
        <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <div
            class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600"
          >
            <UIcon name="i-lucide-box" class="size-6" />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-slate-500">Total Products</p>
            <h3 class="mt-1 text-xl font-bold text-slate-900">1,240</h3>
            <p class="mt-1 text-xs text-slate-400">Products in inventory</p>
          </div>
        </div>

        <!-- Low Stock Products -->
        <div class="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/40 p-4">
          <div
            class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600"
          >
            <UIcon name="i-lucide-triangle-alert" class="size-6" />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-slate-500">Low Stock Products</p>
            <h3 class="mt-1 text-xl font-bold text-slate-900">28</h3>
            <p class="mt-1 text-xs text-amber-600">Restock recommended</p>
          </div>
        </div>

        <!-- Out of Stock -->
        <div class="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/40 p-4">
          <div
            class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600"
          >
            <UIcon name="i-lucide-circle-x" class="size-6" />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-slate-500">Out of Stock</p>
            <h3 class="mt-1 text-xl font-bold text-slate-900">12</h3>
            <p class="mt-1 text-xs text-rose-600">Products unavailable</p>
          </div>
        </div>

        <!-- Total Customers -->
        <div class="flex items-center gap-3 rounded-xl border border-cyan-100 bg-cyan-50/40 p-4">
          <div
            class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600"
          >
            <UIcon name="i-lucide-users" class="size-6" />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-slate-500">Total Customers</p>
            <h3 class="mt-1 text-xl font-bold text-slate-900">386</h3>
            <p class="mt-1 text-xs text-slate-400">Registered customers</p>
          </div>
        </div>
      </section>

      <section>
        <SalesOverview />
      </section>

      <section>
        <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div class="flex items-center gap-2">
              <div
                class="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600"
              >
                <UIcon name="i-lucide-clipboard-list" class="size-4" />
              </div>

              <h3 class="text-sm font-semibold text-slate-800">Recent Orders</h3>
            </div>

            <button
              type="button"
              class="text-sm font-medium text-primary transition hover:underline"
            >
              View All
            </button>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-slate-100 bg-slate-50/60">
                  <th class="px-4 py-2 text-left text-sm font-medium text-slate-500">#</th>

                  <th class="px-4 py-2 text-left text-sm font-medium text-slate-500">Buyer</th>

                  <th class="px-4 py-2 text-left text-sm font-medium text-slate-500">Products</th>

                  <th class="px-4 py-2 text-left text-sm font-medium text-slate-500">Amount</th>

                  <th class="px-4 py-2 text-left text-sm font-medium text-slate-500">Status</th>

                  <th class="px-4 py-2 text-left text-sm font-medium text-slate-500">Date</th>

                  <th class="px-4 py-2 text-left text-sm font-medium text-slate-500">Action</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-slate-100">
                <!-- Order 1 -->
                <tr class="transition hover:bg-slate-50/50">
                  <td class="whitespace-nowrap px-4 py-2.5 text-sm text-slate-500">
                    BZ-ORD-2024-0126
                  </td>

                  <td class="whitespace-nowrap px-4 py-2.5 text-sm font-medium text-slate-700">
                    Global Office Inc.
                  </td>

                  <td class="whitespace-nowrap px-4 py-2.5 text-sm text-slate-500">5 items</td>

                  <td class="whitespace-nowrap px-4 py-2.5 text-sm font-medium text-slate-700">
                    $1,350.00
                  </td>

                  <td class="px-4 py-2.5">
                    <span
                      class="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-sm font-medium text-emerald-600"
                    >
                      Delivered
                    </span>
                  </td>

                  <td class="whitespace-nowrap px-4 py-2.5 text-sm text-slate-500">Jun 17, 2024</td>

                  <td class="px-4 py-2.5">
                    <button
                      type="button"
                      class="inline-flex items-center rounded-md border border-blue-200 px-3 py-1 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                    >
                      View
                    </button>
                  </td>
                </tr>

                <!-- Order 2 -->
                <tr class="transition hover:bg-slate-50/50">
                  <td class="whitespace-nowrap px-4 py-2.5 text-sm text-slate-500">
                    BZ-ORD-2024-0118
                  </td>

                  <td class="whitespace-nowrap px-4 py-2.5 text-sm font-medium text-slate-700">
                    BuildRight Contractors
                  </td>

                  <td class="whitespace-nowrap px-4 py-2.5 text-sm text-slate-500">3 items</td>

                  <td class="whitespace-nowrap px-4 py-2.5 text-sm font-medium text-slate-700">
                    $2,400.00
                  </td>

                  <td class="px-4 py-2.5">
                    <span
                      class="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-sm font-medium text-emerald-600"
                    >
                      Delivered
                    </span>
                  </td>

                  <td class="whitespace-nowrap px-4 py-2.5 text-sm text-slate-500">Jun 01, 2024</td>

                  <td class="px-4 py-2.5">
                    <button
                      type="button"
                      class="inline-flex items-center rounded-md border border-blue-200 px-3 py-1 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                    >
                      View
                    </button>
                  </td>
                </tr>

                <!-- Order 3 -->
                <tr class="transition hover:bg-slate-50/50">
                  <td class="whitespace-nowrap px-4 py-2.5 text-sm text-slate-500">
                    BZ-ORD-2024-0102
                  </td>

                  <td class="whitespace-nowrap px-4 py-2.5 text-sm font-medium text-slate-700">
                    TechNova Solutions
                  </td>

                  <td class="whitespace-nowrap px-4 py-2.5 text-sm text-slate-500">4 items</td>

                  <td class="whitespace-nowrap px-4 py-2.5 text-sm font-medium text-slate-700">
                    $3,120.00
                  </td>

                  <td class="px-4 py-2.5">
                    <span
                      class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-600"
                    >
                      Processing
                    </span>
                  </td>

                  <td class="whitespace-nowrap px-4 py-2.5 text-sm text-slate-500">May 12, 2024</td>

                  <td class="px-4 py-2.5">
                    <button
                      type="button"
                      class="inline-flex items-center rounded-md border border-blue-200 px-3 py-1 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                    >
                      View
                    </button>
                  </td>
                </tr>

                <!-- Order 4 -->
                <tr class="transition hover:bg-slate-50/50">
                  <td class="whitespace-nowrap px-4 py-2.5 text-sm text-slate-500">
                    BZ-ORD-2024-0098
                  </td>

                  <td class="whitespace-nowrap px-4 py-2.5 text-sm font-medium text-slate-700">
                    OfficeMart Ltd.
                  </td>

                  <td class="whitespace-nowrap px-4 py-2.5 text-sm text-slate-500">2 items</td>

                  <td class="whitespace-nowrap px-4 py-2.5 text-sm font-medium text-slate-700">
                    $980.00
                  </td>

                  <td class="px-4 py-2.5">
                    <span
                      class="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-sm font-medium text-orange-600"
                    >
                      Shipped
                    </span>
                  </td>

                  <td class="whitespace-nowrap px-4 py-2.5 text-sm text-slate-500">May 11, 2024</td>

                  <td class="px-4 py-2.5">
                    <button
                      type="button"
                      class="inline-flex items-center rounded-md border border-blue-200 px-3 py-1 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                    >
                      View
                    </button>
                  </td>
                </tr>

                <!-- Order 5 -->
                <tr class="transition hover:bg-slate-50/50">
                  <td class="whitespace-nowrap px-4 py-2.5 text-sm text-slate-500">
                    BZ-ORD-2024-0091
                  </td>

                  <td class="whitespace-nowrap px-4 py-2.5 text-sm font-medium text-slate-700">
                    Alpha Engineering
                  </td>

                  <td class="whitespace-nowrap px-4 py-2.5 text-sm text-slate-500">6 items</td>

                  <td class="whitespace-nowrap px-4 py-2.5 text-sm font-medium text-slate-700">
                    $4,800.00
                  </td>

                  <td class="px-4 py-2.5">
                    <span
                      class="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-sm font-medium text-amber-600"
                    >
                      Pending
                    </span>
                  </td>

                  <td class="whitespace-nowrap px-4 py-2.5 text-sm text-slate-500">May 08, 2024</td>

                  <td class="px-4 py-2.5">
                    <button
                      type="button"
                      class="inline-flex items-center rounded-md border border-blue-200 px-3 py-1 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                    >
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <div class="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
          <!-- Top Selling Products -->
          <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div>
                <h3 class="text-sm font-semibold text-slate-800">Top Selling Products</h3>
                <p class="mt-0.5 text-xs text-slate-400">Best performing products this month</p>
              </div>

              <button
                type="button"
                class="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View All
                <UIcon name="i-lucide-arrow-up-right" class="size-4" />
              </button>
            </div>

            <!-- Product List -->
            <div class="divide-y divide-slate-100">
              <!-- Product 1 -->
              <div class="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600"
                >
                  <UIcon name="i-lucide-headphones" class="size-5" />
                </div>

                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-slate-800">Wireless Headphones</p>
                  <p class="mt-0.5 text-xs text-slate-400">SKU: WH-001</p>
                  <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div class="h-full w-full rounded-full bg-primary"></div>
                  </div>
                </div>

                <div class="shrink-0 text-right">
                  <p class="text-sm font-semibold text-slate-800">148 sold</p>
                  <p class="mt-1 text-xs text-emerald-600">৳ 74,000</p>
                </div>
              </div>

              <!-- Product 2 -->
              <div class="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600"
                >
                  <UIcon name="i-lucide-mouse" class="size-5" />
                </div>

                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-slate-800">Wireless Mouse</p>
                  <p class="mt-0.5 text-xs text-slate-400">SKU: WM-002</p>
                  <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div class="h-full w-[78%] rounded-full bg-primary"></div>
                  </div>
                </div>

                <div class="shrink-0 text-right">
                  <p class="text-sm font-semibold text-slate-800">115 sold</p>
                  <p class="mt-1 text-xs text-emerald-600">৳ 34,500</p>
                </div>
              </div>

              <!-- Product 3 -->
              <div class="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600"
                >
                  <UIcon name="i-lucide-keyboard" class="size-5" />
                </div>

                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-slate-800">Mechanical Keyboard</p>
                  <p class="mt-0.5 text-xs text-slate-400">SKU: MK-003</p>
                  <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div class="h-full w-[62%] rounded-full bg-primary"></div>
                  </div>
                </div>

                <div class="shrink-0 text-right">
                  <p class="text-sm font-semibold text-slate-800">92 sold</p>
                  <p class="mt-1 text-xs text-emerald-600">৳ 46,000</p>
                </div>
              </div>

              <!-- Product 4 -->
              <div class="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"
                >
                  <UIcon name="i-lucide-usb" class="size-5" />
                </div>

                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-slate-800">USB Flash Drive 64GB</p>
                  <p class="mt-0.5 text-xs text-slate-400">SKU: USB-004</p>
                  <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div class="h-full w-[45%] rounded-full bg-primary"></div>
                  </div>
                </div>

                <div class="shrink-0 text-right">
                  <p class="text-sm font-semibold text-slate-800">67 sold</p>
                  <p class="mt-1 text-xs text-emerald-600">৳ 13,400</p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div
              class="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-4 py-3"
            >
              <span class="text-xs text-slate-500">Total units sold</span>
              <span class="text-sm font-semibold text-slate-800">422 units</span>
            </div>
          </div>

          <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div>
                <h3 class="text-sm font-semibold text-slate-800">Low Stock Products</h3>
                <p class="mt-0.5 text-xs text-slate-400">Products that need restocking</p>
              </div>

              <button
                type="button"
                class="inline-flex items-center gap-1 text-sm font-medium text-primary transition hover:underline"
              >
                View All
                <UIcon name="i-lucide-arrow-up-right" class="size-4" />
              </button>
            </div>

            <!-- Product List -->
            <div class="divide-y divide-slate-100">
              <!-- Product 1 -->
              <div class="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600"
                >
                  <UIcon name="i-lucide-package" class="size-5" />
                </div>

                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-slate-800">Wireless Mouse</p>
                  <p class="mt-0.5 text-xs text-slate-400">SKU: WM-001</p>

                  <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div class="h-full w-[20%] rounded-full bg-amber-500"></div>
                  </div>
                </div>

                <div class="shrink-0 text-right">
                  <p class="text-sm font-semibold text-amber-600">4 pcs</p>
                  <p class="mt-0.5 text-xs text-slate-400">Min: 20</p>
                  <span
                    class="mt-1.5 inline-flex rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700"
                  >
                    Low Stock
                  </span>
                </div>
              </div>

              <!-- Product 2 -->
              <div class="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600"
                >
                  <UIcon name="i-lucide-package" class="size-5" />
                </div>

                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-slate-800">USB Keyboard</p>
                  <p class="mt-0.5 text-xs text-slate-400">SKU: KB-002</p>

                  <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div class="h-full w-[10%] rounded-full bg-rose-500"></div>
                  </div>
                </div>

                <div class="shrink-0 text-right">
                  <p class="text-sm font-semibold text-rose-600">2 pcs</p>
                  <p class="mt-0.5 text-xs text-slate-400">Min: 20</p>
                  <span
                    class="mt-1.5 inline-flex rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-700"
                  >
                    Critical
                  </span>
                </div>
              </div>

              <!-- Product 3 -->
              <div class="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600"
                >
                  <UIcon name="i-lucide-package" class="size-5" />
                </div>

                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-slate-800">HDMI Cable 2M</p>
                  <p class="mt-0.5 text-xs text-slate-400">SKU: HC-003</p>

                  <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div class="h-full w-[30%] rounded-full bg-amber-500"></div>
                  </div>
                </div>

                <div class="shrink-0 text-right">
                  <p class="text-sm font-semibold text-amber-600">6 pcs</p>
                  <p class="mt-0.5 text-xs text-slate-400">Min: 20</p>
                  <span
                    class="mt-1.5 inline-flex rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700"
                  >
                    Low Stock
                  </span>
                </div>
              </div>

              <!-- Product 4 -->
              <div class="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50">
                <div
                  class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600"
                >
                  <UIcon name="i-lucide-package" class="size-5" />
                </div>

                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-slate-800">128GB SSD</p>
                  <p class="mt-0.5 text-xs text-slate-400">SKU: SSD-004</p>

                  <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div class="h-full w-[15%] rounded-full bg-rose-500"></div>
                  </div>
                </div>

                <div class="shrink-0 text-right">
                  <p class="text-sm font-semibold text-rose-600">3 pcs</p>
                  <p class="mt-0.5 text-xs text-slate-400">Min: 20</p>
                  <span
                    class="mt-1.5 inline-flex rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-700"
                  >
                    Critical
                  </span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div
              class="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-4 py-3"
            >
              <p class="text-xs text-slate-500">Showing 4 low stock products</p>

              <button
                type="button"
                class="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <UIcon name="i-lucide-clipboard-list" class="size-4" />
                Create Purchase
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </Default>
</template>

<style scoped></style>
