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
    <main>
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

      <!-- Stats -->
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
          <div class="flex items-start gap-3">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600"
            >
              <UIcon name="i-lucide-shopping-bag" class="size-5" />
            </div>

            <div class="min-w-0">
              <p class="text-sm font-medium text-slate-500">Total Orders</p>

              <p class="mt-1 text-xl font-bold tracking-tight text-slate-900">248</p>

              <div class="mt-1 flex items-center gap-1">
                <UIcon name="i-lucide-arrow-up" class="size-3.5 text-emerald-500" />

                <span class="text-sm font-semibold text-emerald-600"> 12% </span>

                <span class="text-sm text-slate-400"> vs last month </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Sales -->
        <div class="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
          <div class="flex items-start gap-3">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600"
            >
              <UIcon name="i-lucide-dollar-sign" class="size-5" />
            </div>

            <div class="min-w-0">
              <p class="text-sm font-medium text-slate-500">Total Sales</p>

              <p class="mt-1 text-xl font-bold tracking-tight text-slate-900">$18,540.00</p>

              <div class="mt-1 flex items-center gap-1">
                <UIcon name="i-lucide-arrow-up" class="size-3.5 text-emerald-500" />

                <span class="text-sm font-semibold text-emerald-600"> 28% </span>

                <span class="text-sm text-slate-400"> vs last month </span>
              </div>
            </div>
          </div>
        </div>

        <!-- New Customers -->
        <div class="rounded-xl border border-violet-100 bg-violet-50/40 p-4">
          <div class="flex items-start gap-3">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600"
            >
              <UIcon name="i-lucide-users" class="size-5" />
            </div>

            <div class="min-w-0">
              <p class="text-sm font-medium text-slate-500">New Customers</p>

              <p class="mt-1 text-xl font-bold tracking-tight text-slate-900">36</p>

              <div class="mt-1 flex items-center gap-1">
                <UIcon name="i-lucide-arrow-up" class="size-3.5 text-emerald-500" />

                <span class="text-sm font-semibold text-emerald-600"> 20% </span>

                <span class="text-sm text-slate-400"> vs last month </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Views -->
        <div class="rounded-xl border border-orange-100 bg-orange-50/40 p-4">
          <div class="flex items-start gap-3">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600"
            >
              <UIcon name="i-lucide-eye" class="size-5" />
            </div>

            <div class="min-w-0">
              <p class="text-sm font-medium text-slate-500">Product Views</p>

              <p class="mt-1 text-xl font-bold tracking-tight text-slate-900">5,420</p>

              <div class="mt-1 flex items-center gap-1">
                <UIcon name="i-lucide-arrow-up" class="size-3.5 text-emerald-500" />

                <span class="text-sm font-semibold text-emerald-600"> 15% </span>

                <span class="text-sm text-slate-400"> vs last month </span>
              </div>
            </div>
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
          <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div class="flex items-center gap-2">
                <div
                  class="flex size-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600"
                >
                  <UIcon name="i-lucide-chart-no-axes-combined" class="size-4" />
                </div>

                <h3 class="text-sm font-semibold text-slate-800">Top Selling Products</h3>
              </div>

              <button
                type="button"
                class="text-sm font-medium text-primary transition hover:underline"
              >
                View All
              </button>
            </div>

            <!-- Product Table -->
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-slate-100 bg-slate-50/60">
                    <th class="w-12 px-4 py-2 text-left text-sm font-medium text-slate-500">#</th>

                    <th class="px-4 py-2 text-left text-sm font-medium text-slate-500">Product</th>

                    <th class="px-4 py-2 text-right text-sm font-medium text-slate-500">Orders</th>

                    <th class="px-4 py-2 text-right text-sm font-medium text-slate-500">Revenue</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-slate-100">
                  <!-- Product 1 -->
                  <tr class="transition hover:bg-slate-50/50">
                    <td class="px-4 py-2.5 text-sm text-slate-500">1</td>

                    <td class="px-4 py-2.5">
                      <div class="flex items-center gap-3">
                        <div
                          class="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                        >
                          <UIcon name="i-lucide-armchair" class="size-4 text-slate-400" />
                        </div>

                        <span class="text-sm font-medium text-slate-700">
                          Office Chair - Ergonomic
                        </span>
                      </div>
                    </td>

                    <td class="whitespace-nowrap px-4 py-2.5 text-right text-sm text-slate-600">
                      86
                    </td>

                    <td
                      class="whitespace-nowrap px-4 py-2.5 text-right text-sm font-medium text-slate-700"
                    >
                      $8,600
                    </td>
                  </tr>

                  <!-- Product 2 -->
                  <tr class="transition hover:bg-slate-50/50">
                    <td class="px-4 py-2.5 text-sm text-slate-500">2</td>

                    <td class="px-4 py-2.5">
                      <div class="flex items-center gap-3">
                        <div
                          class="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                        >
                          <UIcon name="i-lucide-table-2" class="size-4 text-slate-400" />
                        </div>

                        <span class="text-sm font-medium text-slate-700">
                          Office Desk - Modern
                        </span>
                      </div>
                    </td>

                    <td class="whitespace-nowrap px-4 py-2.5 text-right text-sm text-slate-600">
                      52
                    </td>

                    <td
                      class="whitespace-nowrap px-4 py-2.5 text-right text-sm font-medium text-slate-700"
                    >
                      $6,240
                    </td>
                  </tr>

                  <!-- Product 3 -->
                  <tr class="transition hover:bg-slate-50/50">
                    <td class="px-4 py-2.5 text-sm text-slate-500">3</td>

                    <td class="px-4 py-2.5">
                      <div class="flex items-center gap-3">
                        <div
                          class="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                        >
                          <UIcon name="i-lucide-archive" class="size-4 text-slate-400" />
                        </div>

                        <span class="text-sm font-medium text-slate-700"> Filing Cabinet </span>
                      </div>
                    </td>

                    <td class="whitespace-nowrap px-4 py-2.5 text-right text-sm text-slate-600">
                      38
                    </td>

                    <td
                      class="whitespace-nowrap px-4 py-2.5 text-right text-sm font-medium text-slate-700"
                    >
                      $3,800
                    </td>
                  </tr>

                  <!-- Product 4 -->
                  <tr class="transition hover:bg-slate-50/50">
                    <td class="px-4 py-2.5 text-sm text-slate-500">4</td>

                    <td class="px-4 py-2.5">
                      <div class="flex items-center gap-3">
                        <div
                          class="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                        >
                          <UIcon name="i-lucide-monitor" class="size-4 text-slate-400" />
                        </div>

                        <span class="text-sm font-medium text-slate-700"> LED Monitor 24" </span>
                      </div>
                    </td>

                    <td class="whitespace-nowrap px-4 py-2.5 text-right text-sm text-slate-600">
                      24
                    </td>

                    <td
                      class="whitespace-nowrap px-4 py-2.5 text-right text-sm font-medium text-slate-700"
                    >
                      $2,880
                    </td>
                  </tr>

                  <!-- Product 5 -->
                  <tr class="transition hover:bg-slate-50/50">
                    <td class="px-4 py-2.5 text-sm text-slate-500">5</td>

                    <td class="px-4 py-2.5">
                      <div class="flex items-center gap-3">
                        <div
                          class="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                        >
                          <UIcon name="i-lucide-presentation" class="size-4 text-slate-400" />
                        </div>

                        <span class="text-sm font-medium text-slate-700"> Conference Table </span>
                      </div>
                    </td>

                    <td class="whitespace-nowrap px-4 py-2.5 text-right text-sm text-slate-600">
                      18
                    </td>

                    <td
                      class="whitespace-nowrap px-4 py-2.5 text-right text-sm font-medium text-slate-700"
                    >
                      $2,700
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h3 class="text-sm font-semibold text-slate-800">Latest Messages</h3>

              <button
                type="button"
                class="text-sm font-medium text-primary transition hover:underline"
              >
                View All
              </button>
            </div>

            <!-- Messages -->
            <div class="divide-y divide-slate-100">
              <!-- Global Office -->
              <div class="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50">
                <!-- Avatar -->
                <div
                  class="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"
                >
                  GO
                </div>

                <!-- Content -->
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between gap-2">
                    <p class="truncate text-sm font-semibold text-slate-800">Global Office Inc.</p>

                    <span class="shrink-0 text-sm text-slate-400"> 10:30 AM </span>
                  </div>

                  <div class="mt-0.5 flex items-center justify-between gap-2">
                    <p class="truncate text-sm text-slate-400">
                      Hi, can you provide bulk pricing...
                    </p>

                    <span
                      class="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"
                    >
                      2
                    </span>
                  </div>
                </div>
              </div>

              <!-- BuildRight -->
              <div class="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50">
                <div
                  class="flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white"
                >
                  BR
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between gap-2">
                    <p class="truncate text-sm font-semibold text-slate-800">
                      BuildRight Contractors
                    </p>

                    <span class="shrink-0 text-sm text-slate-400"> Yesterday </span>
                  </div>

                  <div class="mt-0.5 flex items-center justify-between gap-2">
                    <p class="truncate text-sm text-slate-400">
                      Please share the latest catalog...
                    </p>

                    <span
                      class="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"
                    >
                      1
                    </span>
                  </div>
                </div>
              </div>

              <!-- TechNova -->
              <div class="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50">
                <div
                  class="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white"
                >
                  TN
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between gap-2">
                    <p class="truncate text-sm font-semibold text-slate-800">TechNova Solutions</p>

                    <span class="shrink-0 text-sm text-slate-400"> Jun 17 </span>
                  </div>

                  <p class="mt-0.5 truncate text-sm text-slate-400">
                    Thank you for the quick response!
                  </p>
                </div>
              </div>

              <!-- OfficeMart -->
              <div class="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50">
                <div
                  class="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white"
                >
                  OM
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between gap-2">
                    <p class="truncate text-sm font-semibold text-slate-800">OfficeMart Ltd.</p>

                    <span class="shrink-0 text-sm text-slate-400"> Jun 16 </span>
                  </div>

                  <p class="mt-0.5 truncate text-sm text-slate-400">Can you confirm the stock...</p>
                </div>
              </div>

              <!-- Alpha Engineering -->
              <div class="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50">
                <div
                  class="flex size-9 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-semibold text-white"
                >
                  AE
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between gap-2">
                    <p class="truncate text-sm font-semibold text-slate-800">Alpha Engineering</p>

                    <span class="shrink-0 text-sm text-slate-400"> Jun 15 </span>
                  </div>

                  <p class="mt-0.5 truncate text-sm text-slate-400">
                    We need a quotation for 50 units.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </Default>
</template>

<style scoped></style>
