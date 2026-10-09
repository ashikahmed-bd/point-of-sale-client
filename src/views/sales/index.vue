<script setup>
import Default from '@/layouts/Default.vue'

import { useSaleStore } from '@/stores/sale'
import { storeToRefs } from 'pinia'
import { onMounted, reactive } from 'vue'

const saleStore = useSaleStore()

const { sales } = storeToRefs(saleStore)

const filters = reactive({
  search: '',
  date: '',
  payment: '',
  status: '',
  page: 1,
})

onMounted(async () => {
  await saleStore.all(filters)
})
</script>

<template>
  <Default>
    <main class="space-y-4">
      <!-- Header -->
      <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-sm font-semibold text-body">Sales</h1>
          <p class="mt-1 text-sm text-body/60">
            Manage sales, transactions, payments and invoices.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-body transition hover:bg-slate-50"
          >
            <UIcon name="i-lucide-download" class="size-4" />
            Export
          </button>

          <RouterLink
            :to="{ name: 'pos' }"
            class="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            <UIcon name="i-lucide-plus" class="size-4" />
            New Sale
          </RouterLink>
        </div>
      </div>

      <!-- Sales Table -->
      <section class="bg-white overflow-hidden rounded-xl border border-border px-4 py-6">
        <div class="flex items-center justify-between gap-6">
          <!-- Search -->
          <div class="relative">
            <UIcon
              name="i-lucide-search"
              class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-body/40"
            />

            <input
              type="search"
              placeholder="Search invoice, customer or transaction..."
              class="w-full rounded border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-body outline-none transition placeholder:text-body/40 focus:border-primary"
            />
          </div>

          <div class="flex items-center gap-4">
            <!-- Date -->
            <select
              class="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-body outline-none focus:border-primary"
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
            </select>

            <!-- Payment -->
            <select
              class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-body outline-none focus:border-primary"
            >
              <option value="">All Payments</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </select>

            <!-- Status -->
            <select
              class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-body outline-none focus:border-primary"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </select>
            <button
              type="button"
              class="flex items-center justify-center rounded border border-slate-200 p-2 transition hover:border-primary/30 bg-primary/5 text-primary active:scale-95"
            >
              <UIcon name="i-lucide-search" class="size-5" />
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Method</th>
                <th>Total</th>
                <th>Status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="sale in sales.data" :key="sale.id">
                <td>
                  <span class="text-sm font-medium text-primary hover:underline">
                    #{{ sale.invoice_no }}
                  </span>
                </td>

                <td>
                  <div class="flex items-center gap-2">
                    <div
                      class="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-body"
                    >
                      {{ sale.customer?.name?.charAt(0) || 'W' }}
                    </div>

                    <div>
                      <p class="whitespace-nowrap text-sm font-medium text-body">
                        {{ sale.customer?.name || 'Walk-in Customer' }}
                      </p>
                      <p class="mt-0.5 text-xs text-body/50">
                        {{ sale.customer?.phone || '—' }}
                      </p>
                    </div>
                  </div>
                </td>

                <td>{{ sale.items_count ?? '—' }} items</td>

                <td>
                  <span class="text-sm text-body/70">
                    {{ $date(sale.created_at) }}
                  </span>
                </td>

                <td>
                  <span
                    class="inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium capitalize"
                    :class="
                      sale.payment === 'paid'
                        ? 'bg-emerald-50 text-emerald-700'
                        : sale.payment === 'partial'
                          ? 'bg-amber-50 text-amber-700'
                          : sale.payment === 'refunded'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-rose-50 text-rose-700'
                    "
                  >
                    {{ sale.payment ?? '—' }}
                  </span>
                </td>

                <td>
                  {{ sale.account?.name ?? '—' }}
                </td>

                <td class="text-right">
                  <span class="text-sm font-semibold text-body">
                    {{ $currency(sale.total) }}
                  </span>
                </td>

                <td>
                  <span
                    class="inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium capitalize"
                    :class="
                      sale.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : sale.status === 'pending'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                    "
                  >
                    {{ sale.status || '—' }}
                  </span>
                </td>

                <td>
                  <div class="flex items-center justify-end gap-1">
                    <RouterLink
                      :to="{ name: 'sales.view', params: { id: sale.id } }"
                      title="View sale"
                      class="flex items-center justify-center rounded-md border border-slate-200 p-2 text-body/60 transition hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                    >
                      <UIcon name="i-lucide-eye" class="size-4" />
                    </RouterLink>

                    <button
                      type="button"
                      title="Print invoice"
                      class="flex items-center justify-center rounded-md border border-slate-200 p-2 text-body/60 transition hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                    >
                      <UIcon name="i-lucide-printer" class="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="flex justify-center py-8">
            <UPagination
              v-model:page="filters.page"
              show-edges
              :sibling-count="1"
              :total="sales?.meta?.total"
              :items-per-page="sales?.meta?.per_page"
            />
          </div>
        </div>
      </section>
    </main>
  </Default>
</template>
