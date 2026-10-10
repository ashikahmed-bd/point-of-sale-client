<script setup>
import { reactive, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import Default from '@/layouts/Default.vue'
import { usePurchaseStore } from '@/stores/purchase'

const purchaseStore = usePurchaseStore()

const { purchases } = storeToRefs(purchaseStore)

const filters = reactive({
  search: '',
  status: '',
  page: 1,
})

const getPurchases = async () => {
  await purchaseStore.all(filters)
}

onMounted(() => {
  getPurchases()
})
</script>
<template>
  <Default>
    <main class="space-y-4 p-4">
      <!-- Header -->
      <div class="flex items-center justify-between gap-4">
        <div>
          <div class="mb-2 flex items-center gap-2 text-xs text-slate-500">
            <span>Dashboard</span>
            <span>/</span>
            <span class="text-primary">Purchases</span>
          </div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">Purchases</h1>

          <p class="mt-1 text-sm text-slate-500">
            Manage your purchase orders and supplier invoices.
          </p>
        </div>

        <button
          type="button"
          @click="$router.push({ name: 'purchases.create' })"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <UIcon name="i-lucide-plus" class="size-4" />
          New Purchase
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-xl border border-slate-200 bg-white p-5">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-slate-500">Total Purchases</p>
            <div
              class="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"
            >
              <UIcon name="i-lucide-shopping-bag" class="size-5" />
            </div>
          </div>

          <h2 class="mt-4 text-2xl font-bold text-slate-900">
            {{ $currency(250) }}
          </h2>

          <p class="mt-2 text-xs text-slate-500">
            {{ purchases.data?.length ?? 0 }} purchase invoices
          </p>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-5">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-slate-500">Total Paid</p>
            <div
              class="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"
            >
              <UIcon name="i-lucide-circle-check" class="size-5" />
            </div>
          </div>

          <h2 class="mt-4 text-2xl font-bold text-slate-900">
            {{ $currency(1200) }}
          </h2>

          <p class="mt-2 text-xs text-emerald-600">Payments completed or received</p>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-5">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-slate-500">Total Due</p>
            <div
              class="flex size-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600"
            >
              <UIcon name="i-lucide-wallet" class="size-5" />
            </div>
          </div>

          <h2 class="mt-4 text-2xl font-bold text-slate-900">
            {{ $currency(1200) }}
          </h2>

          <p class="mt-2 text-xs text-rose-600">Outstanding supplier balance</p>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-5">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-slate-500">Total Invoices</p>
            <div
              class="flex size-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600"
            >
              <UIcon name="i-lucide-file-text" class="size-5" />
            </div>
          </div>

          <h2 class="mt-4 text-2xl font-bold text-slate-900">
            {{ purchases.data?.length ?? 0 }}
          </h2>

          <p class="mt-2 text-xs text-slate-500">All purchase transactions</p>
        </div>
      </div>

      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div
          class="flex flex-col gap-4 border-b border-slate-200 p-5 xl:flex-row xl:items-center xl:justify-between"
        >
          <div>
            <h2 class="text-base font-semibold text-slate-900">Purchase List</h2>
            <p class="mt-1 text-sm text-slate-500">View and manage all your purchases.</p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <div class="relative">
              <UIcon
                name="i-lucide-search"
                class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              />

              <input
                v-model="filters.search"
                @change="getPurchases"
                type="text"
                placeholder="Search invoice, supplier..."
                class="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:w-64"
              />
            </div>

            <select
              v-model="filters.status"
              @change="getPurchases"
              class="rounded border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-primary"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="ordered">Ordered</option>
              <option value="received">Received</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded border border-border px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <UIcon name="i-lucide-rotate-ccw" class="size-4" />
              Reset
            </button>
          </div>
        </div>

        <div class="overflow-x-auto px-4">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Supplier</th>
                <th>Items</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="purchase in purchases.data"
                :key="purchase.id"
                class="transition hover:bg-slate-50/70"
              >
                <td>
                  <span class="text-sm font-semibold text-primary">
                    {{ purchase.purchase_no }}
                  </span>
                </td>

                <td>{{ $date(purchase.date) }}</td>

                <td>
                  <div class="flex items-center gap-3">
                    <div
                      class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold uppercase text-primary"
                    >
                      {{ purchase.supplier?.name?.charAt(0) || 'W' }}
                    </div>

                    <div>
                      <p class="text-sm font-medium text-slate-800">
                        {{ purchase.supplier?.name || 'Walk-in Supplier' }}
                      </p>
                      <p class="text-xs text-slate-500">
                        {{ purchase.supplier?.company_name || purchase.supplier?.phone || '—' }}
                      </p>
                    </div>
                  </div>
                </td>

                <td>
                  <span
                    class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                  >
                    {{ purchase.items?.length || 0 }}
                    {{ purchase.items?.length === 1 ? 'item' : 'items' }}
                  </span>
                </td>

                <td>{{ $currency(purchase.total) }}</td>
                <td>{{ $currency(purchase.paid_amount) }}</td>
                <td>{{ $currency(purchase.due_amount) }}</td>

                <td>
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
                    :class="{
                      'bg-emerald-50 text-emerald-700 ring-emerald-600/20':
                        purchase.status === 'received',
                      'bg-blue-50 text-blue-700 ring-blue-600/20': purchase.status === 'ordered',
                      'bg-amber-50 text-amber-700 ring-amber-600/20': purchase.status === 'draft',
                      'bg-rose-50 text-rose-700 ring-rose-600/20': purchase.status === 'cancelled',
                    }"
                  >
                    {{ purchase.status }}
                  </span>
                </td>

                <td>
                  <div class="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      title="View purchase"
                      class="flex size-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                      @click="$router.push(`/purchases/${purchase.id}`)"
                    >
                      <UIcon name="i-lucide-eye" class="size-4" />
                    </button>

                    <button
                      type="button"
                      title="Edit purchase"
                      class="flex size-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-amber-50 hover:text-amber-600"
                      @click="$router.push(`/purchases/${purchase.id}/edit`)"
                    >
                      <UIcon name="i-lucide-pencil" class="size-4" />
                    </button>

                    <button
                      type="button"
                      title="More options"
                      class="flex size-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <UIcon name="i-lucide-ellipsis" class="size-4" />
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="!purchases.data?.length">
                <td colspan="9" class="px-5 py-12 text-center">
                  <UIcon
                    name="i-lucide-package-search"
                    class="mx-auto mb-3 size-10 text-slate-300"
                  />
                  <p class="text-sm font-medium text-slate-700">No purchases found</p>
                  <p class="mt-1 text-sm text-slate-500">Purchase records will appear here.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <p class="text-sm text-slate-500">
            Showing
            <span class="font-medium text-slate-800">
              {{ purchases?.meta?.from ?? 0 }}
            </span>
            to
            <span class="font-medium text-slate-800">
              {{ purchases?.meta?.to ?? 0 }}
            </span>
            of
            <span class="font-medium text-slate-800">
              {{ purchases?.meta?.total ?? 0 }}
            </span>
            results
          </p>

          <div class="flex items-center gap-2">
            <UPagination
              v-model:page="filters.page"
              show-edges
              :sibling-count="1"
              :total="purchases?.meta?.total"
              :items-per-page="purchases?.meta?.per_page"
            />
          </div>
        </div>
      </div>
    </main>
  </Default>
</template>
