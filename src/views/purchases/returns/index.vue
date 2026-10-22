<script setup>
import { onMounted } from 'vue'
import Default from '@/layouts/Default.vue'
import { usePurchaseReturnStore } from '@/stores/purchase-return'
import { storeToRefs } from 'pinia'

const purchaseReturns = usePurchaseReturnStore()
const { items } = storeToRefs(purchaseReturns)

const loadReturns = async () => {
  await purchaseReturns.all()
}

onMounted(() => {
  loadReturns()
})
</script>

<template>
  <Default>
    <main class="space-y-4">
      <div class="flex items-center justify-between gap-4">
        <div class="block">
          <h1 class="text-2xl font-bold tracking-tight text-title">Purchase Returns</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage supplier returns, purchase adjustments and credit notes.
          </p>
        </div>

        <button
          type="button"
          @click="
            $router.push({
              name: 'purchase-returns.create',
            })
          "
          class="inline-flex items-center justify-center gap-2 rounded bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Create Return
        </button>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Returns</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">20</h2>
            </div>
            <div class="rounded-lg bg-blue-50 p-3 dark:bg-blue-500/10">
              <UIcon
                name="i-lucide-package-minus"
                class="size-6 text-blue-600 dark:text-blue-400"
              />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500">All supplier return records</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Pending Returns</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">22</h2>
            </div>
            <div class="rounded-lg bg-orange-50 p-3 dark:bg-orange-500/10">
              <UIcon name="i-lucide-clock-3" class="size-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500">Awaiting review</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Completed Returns</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">50</h2>
            </div>
            <div class="rounded-lg bg-green-50 p-3 dark:bg-green-500/10">
              <UIcon
                name="i-lucide-check-circle"
                class="size-6 text-green-600 dark:text-green-400"
              />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500">Processed supplier returns</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Returned Value</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">2500</h2>
            </div>
            <div class="rounded-lg bg-purple-50 p-3 dark:bg-purple-500/10">
              <UIcon name="i-lucide-wallet" class="size-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500">Completed returns only</p>
        </div>
      </div>

      <div class="overflow-hidden rounded-xl bg-white">
        <div class="border-b border-gray-200 p-5">
          <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">All Returns</h2>
              <p class="mt-1 text-sm text-gray-500">
                View, search and manage purchase return records.
              </p>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <div class="relative">
                <svg
                  class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="7" stroke-width="2" />
                  <path stroke-linecap="round" stroke-width="2" d="m16 16 4 4" />
                </svg>
                <input
                  type="search"
                  placeholder="Search return number..."
                  class="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 sm:w-64"
                />
              </div>

              <select
                class="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-green-500"
              >
                <option>All Statuses</option>
                <option>Draft</option>
                <option>Returned</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>

              <input
                type="date"
                class="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-green-500"
              />
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <EmptyState v-if="!items.data" />

          <table v-else class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th class="px-5 py-4 font-semibold">Return Details</th>
                <th class="px-5 py-4 font-semibold">Purchase No.</th>
                <th class="px-5 py-4 font-semibold">Return Date</th>
                <th class="px-5 py-4 text-center font-semibold">Items</th>
                <th class="px-5 py-4 text-right font-semibold">Total Amount</th>
                <th class="px-5 py-4 text-center font-semibold">Status</th>
                <th class="px-5 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100">
              <tr v-for="item in items.data" :key="item.id" class="transition hover:bg-gray-50">
                <!-- Return Details -->
                <td class="px-5 py-4">
                  <p class="font-semibold text-gray-900">
                    {{ item.return_no }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500">Ref: {{ item.reference || '—' }}</p>
                </td>

                <!-- Original Purchase -->
                <td class="px-5 py-4">
                  <RouterLink
                    v-if="item.purchase?.id"
                    :to="{ name: 'purchases.show', params: { id: item.purchase.id } }"
                    class="font-medium text-blue-600 hover:text-blue-800"
                  >
                    {{ item.purchase.purchase_no }}
                  </RouterLink>

                  <span v-else class="text-body">—</span>

                  <p class="mt-1 text-body">
                    {{ item.purchase?.reference || '—' }}
                  </p>
                </td>

                <td class="px-5 py-4 whitespace-nowrap text-body">
                  {{ $date(item.return_date) }}
                </td>

                <td class="px-5 py-4 text-center">
                  <span class="rounded bg-gray-100 px-2.5 py-1 font-medium text-body">
                    {{ item.items?.length ?? 0 }}
                    {{ item.items?.length === 1 ? 'product' : 'products' }}
                  </span>

                  <p class="mt-1 text-xs text-body">
                    Qty:
                    {{
                      (item.items ?? []).reduce(
                        (total, product) => total + Number(product.quantity),
                        0,
                      )
                    }}
                  </p>
                </td>

                <td class="px-5 py-4 text-right whitespace-nowrap">
                  <p class="font-semibold text-gray-900">
                    {{ $currency(item.total) }}
                  </p>
                </td>

                <td class="px-5 py-4 text-center">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium capitalize"
                    :class="{
                      'bg-amber-50 text-amber-700': item.status === 'draft',
                      'bg-green-50 text-green-700': ['completed', 'returned'].includes(item.status),
                      'bg-blue-50 text-blue-700': item.status === 'approved',
                      'bg-red-50 text-red-700': item.status === 'cancelled',
                      'bg-gray-100 text-gray-700': ![
                        'draft',
                        'completed',
                        'returned',
                        'approved',
                        'cancelled',
                      ].includes(item.status),
                    }"
                  >
                    <span
                      class="h-1.5 w-1.5 rounded-full"
                      :class="{
                        'bg-amber-500': item.status === 'draft',
                        'bg-green-500': ['completed', 'returned'].includes(item.status),
                        'bg-blue-500': item.status === 'approved',
                        'bg-red-500': item.status === 'cancelled',
                        'bg-gray-500': ![
                          'draft',
                          'completed',
                          'returned',
                          'approved',
                          'cancelled',
                        ].includes(item.status),
                      }"
                    ></span>

                    {{ item.status }}
                  </span>
                </td>

                <td class="px-4 py-2.5">
                  <div class="flex items-center justify-center gap-1">
                    <RouterLink
                      :to="{ name: 'purchase-returns.show', params: { id: item.id } }"
                      title="View details"
                      class="rounded p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      <UIcon name="i-lucide-eye" class="size-4" />
                    </RouterLink>

                    <RouterLink
                      v-if="item.status === 'draft'"
                      :to="{ name: 'purchase-returns.edit', params: { id: item.id } }"
                      title="Edit return"
                      class="rounded p-2 text-gray-500 transition hover:bg-green-50 hover:text-green-600"
                    >
                      <UIcon name="i-lucide-pencil" class="size-4" />
                    </RouterLink>

                    <button
                      v-if="item.status === 'draft'"
                      type="button"
                      @click=""
                      title="Delete return"
                      class="rounded p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <UIcon name="i-lucide-trash-2" class="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          class="flex flex-col gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p class="text-sm text-gray-500">
            Showing <span class="font-medium text-gray-900">1–10</span> of
            <span class="font-medium text-gray-900">128</span> returns
          </p>

          <div class="flex items-center gap-2">
            <button
              class="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50"
            >
              Previous
            </button>
            <button class="rounded-lg bg-green-600 px-3.5 py-2 text-sm font-semibold text-white">
              1
            </button>
            <button
              class="rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              2
            </button>
            <button
              class="rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              3
            </button>
            <button
              class="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  </Default>
</template>
