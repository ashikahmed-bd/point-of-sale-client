<script setup>
import Default from '@/layouts/Default.vue'
import { usePurchaseStore } from '@/stores/purchase'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const purchaseStore = usePurchaseStore()

const { purchase } = storeToRefs(purchaseStore)

onMounted(async () => {
  await purchaseStore.show(route.params.id)
})
</script>

<template>
  <Default>
    <main class="space-y-4 p-4">
      <!-- Page Header -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Purchase Details</h1>

          <p class="mt-1 text-sm text-slate-500">
            View purchase information, items and payment details.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            @click="$router.push('/purchases')"
          >
            <UIcon name="i-lucide-arrow-left" class="size-4" />
            Back
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            @click="window.print()"
          >
            <UIcon name="i-lucide-printer" class="size-4" />
            Print
          </button>

          <button
            type="button"
            @click="$router.push(`/purchases/${purchase.id}/edit`)"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            <UIcon name="i-lucide-pencil" class="size-4" />
            Edit Purchase
          </button>
        </div>
      </div>

      <section class="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div
          class="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div class="flex flex-wrap items-center gap-3">
              <h2 class="text-lg font-bold text-slate-900">
                {{ purchase.purchase_no }}
              </h2>

              <span
                class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                :class="{
                  'bg-emerald-50 text-emerald-700': purchase.status === 'received',
                  'bg-blue-50 text-blue-700': purchase.status === 'ordered',
                  'bg-amber-50 text-amber-700': purchase.status === 'draft',
                  'bg-red-50 text-red-700': purchase.status === 'cancelled',
                }"
              >
                {{ purchase.status }}
              </span>
            </div>

            <p class="mt-1 text-sm text-slate-500">Purchase date: {{ $date(purchase.date) }}</p>
          </div>

          <div class="sm:text-right">
            <p class="text-sm text-slate-500">Purchase Total</p>
            <p class="mt-1 text-2xl font-bold text-slate-900">
              {{ $currency(purchase.total) }}
            </p>
          </div>
        </div>

        <div
          class="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4"
        >
          <div class="flex items-center gap-3 px-5 py-4">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600"
            >
              <UIcon name="i-lucide-package" class="size-5" />
            </div>
            <div>
              <p class="text-xs text-slate-500">Total Items</p>
              <p class="mt-1 text-lg font-semibold text-slate-900">
                {{ purchase.items_count ?? 0 }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 px-5 py-4">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"
            >
              <UIcon name="i-lucide-wallet" class="size-5" />
            </div>
            <div>
              <p class="text-xs text-slate-500">Paid Amount</p>
              <p class="mt-1 text-lg font-semibold text-emerald-700">
                {{ $currency(purchase.paid_amount) }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 px-5 py-4">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600"
            >
              <UIcon name="i-lucide-clock-3" class="size-5" />
            </div>
            <div>
              <p class="text-xs text-slate-500">Due Amount</p>
              <p class="mt-1 text-lg font-semibold text-rose-600">
                {{ $currency(purchase.due_amount) }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 px-5 py-4">
            <div
              class="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold uppercase text-primary"
            >
              {{ purchase.creator?.name?.charAt(0) ?? 'U' }}
            </div>

            <div>
              <p class="text-sm font-semibold text-slate-800">Created By</p>
              <p class="mt-1 text-sm text-slate-500">
                {{ purchase.creator?.name }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Supplier and Store -->
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section class="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div class="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
            <div
              class="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"
            >
              <UIcon name="i-lucide-truck" class="size-5" />
            </div>

            <div>
              <h2 class="font-semibold text-slate-900">Supplier Information</h2>
              <p class="text-xs text-slate-500">Purchase supplied by</p>
            </div>
          </div>

          <div v-if="purchase.supplier" class="space-y-4 p-5">
            <div>
              <p class="text-base font-semibold text-slate-900">
                {{ purchase.supplier?.name }}
              </p>
              <p class="mt-1 text-sm text-slate-500">
                {{ purchase.supplier?.company_name || 'Individual Supplier' }}
              </p>
            </div>

            <div class="space-y-3">
              <div class="flex items-start gap-3 text-sm">
                <UIcon name="i-lucide-phone" class="mt-0.5 size-4 shrink-0 text-slate-400" />
                <span class="text-slate-700">{{ purchase.supplier?.phone }}</span>
              </div>

              <div class="flex items-start gap-3 text-sm">
                <UIcon name="i-lucide-mail" class="mt-0.5 size-4 shrink-0 text-slate-400" />
                <span class="break-all text-slate-700">
                  {{ purchase.supplier?.email || '—' }}
                </span>
              </div>

              <div class="flex items-start gap-3 text-sm">
                <UIcon name="i-lucide-map-pin" class="mt-0.5 size-4 shrink-0 text-slate-400" />
                <span class="text-slate-700">
                  {{ purchase.supplier?.address }}, {{ purchase.supplier?.city }},
                  {{ purchase.supplier?.state }}
                  {{ purchase.supplier?.postcode }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section class="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div class="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
            <div
              class="flex size-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600"
            >
              <UIcon name="i-lucide-store" class="size-5" />
            </div>

            <div>
              <h2 class="font-semibold text-slate-900">Store Information</h2>
              <p class="text-xs text-slate-500">Purchase destination</p>
            </div>
          </div>

          <div v-if="purchase.store" class="space-y-4 p-5">
            <div>
              <p class="text-base font-semibold text-slate-900">
                {{ purchase.store?.name }}
              </p>
              <p class="mt-1 text-sm text-slate-500">
                {{ purchase.store?.address }}
              </p>
            </div>

            <div class="space-y-3">
              <div class="flex items-center gap-3 text-sm">
                <UIcon name="i-lucide-phone" class="size-4 text-slate-400" />
                <span class="text-slate-700">{{ purchase.store?.phone }}</span>
              </div>

              <div class="flex items-center gap-3 text-sm">
                <UIcon name="i-lucide-mail" class="size-4 text-slate-400" />
                <span class="break-all text-slate-700">
                  {{ purchase.store?.email }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Purchase Items -->
      <section class="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <!-- Header -->
        <div
          class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2 class="font-semibold text-slate-900">Purchase Items</h2>
            <p class="mt-1 text-sm text-slate-500">Products included in this purchase</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
            >
              <UIcon name="i-lucide-package" class="size-4" />
              {{ purchase.items_count ?? 0 }} Products
            </span>

            <span
              class="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary"
            >
              <UIcon name="i-lucide-layers" class="size-4" />
              {{ Number(purchase.items_quantity ?? 0).toLocaleString('en-BD') }} Units
            </span>
          </div>
        </div>

        <!-- Items Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-slate-50">
              <tr>
                <th
                  class="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  #
                </th>
                <th
                  class="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Product
                </th>
                <th
                  class="whitespace-nowrap px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Unit Cost
                </th>
                <th
                  class="whitespace-nowrap px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Quantity
                </th>
                <th
                  class="whitespace-nowrap px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Discount
                </th>
                <th
                  class="whitespace-nowrap px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Tax
                </th>
                <th
                  class="whitespace-nowrap px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Total
                </th>
              </tr>
            </thead>

            <tbody v-if="purchase.items?.length" class="divide-y divide-slate-100">
              <tr
                v-for="(item, index) in purchase.items"
                :key="item.id"
                class="transition-colors hover:bg-slate-50/70"
              >
                <td class="whitespace-nowrap px-5 py-4 text-sm text-slate-400">
                  {{ index + 1 }}
                </td>

                <td class="min-w-56 px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"
                    >
                      <UIcon name="i-lucide-package" class="size-5" />
                    </div>

                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-800">
                        {{ item.name }}
                      </p>
                      <p class="mt-1 text-xs text-slate-500">SKU: {{ item.sku || 'N/A' }}</p>
                    </div>
                  </div>
                </td>

                <td class="whitespace-nowrap px-5 py-4 text-right text-sm text-slate-600">
                  {{ $currency(item.unit_cost) }}
                </td>

                <td class="whitespace-nowrap px-5 py-4 text-right">
                  <span
                    class="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-700"
                  >
                    {{ Number(item.quantity || 0).toLocaleString('en-BD') }}
                  </span>
                </td>

                <td class="whitespace-nowrap px-5 py-4 text-right text-sm text-slate-600">
                  {{ $currency(item.discount) }}
                </td>

                <td class="whitespace-nowrap px-5 py-4 text-right text-sm text-slate-600">
                  {{ $currency(item.tax) }}
                </td>

                <td
                  class="whitespace-nowrap px-5 py-4 text-right text-sm font-semibold text-slate-900"
                >
                  {{ $currency(item.total) }}
                </td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr>
                <td colspan="7" class="px-5 py-12 text-center">
                  <div class="flex flex-col items-center">
                    <div
                      class="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400"
                    >
                      <UIcon name="i-lucide-package-open" class="size-6" />
                    </div>
                    <p class="mt-3 text-sm font-semibold text-slate-700">No purchase items found</p>
                    <p class="mt-1 text-sm text-slate-500">
                      Items will appear here when available.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Note & Totals -->
        <div class="border-t border-slate-200 bg-slate-50/50 p-4 sm:p-5">
          <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <!-- Purchase Note -->
            <section class="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div class="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5">
                <div
                  class="flex size-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600"
                >
                  <UIcon name="i-lucide-notebook-text" class="size-5" />
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-slate-900">Purchase Note</h3>
                  <p class="mt-0.5 text-xs text-slate-500">Additional information</p>
                </div>
              </div>

              <div class="p-4">
                <p class="whitespace-pre-line text-sm leading-6 text-slate-600">
                  {{ purchase.note || 'No notes added for this purchase.' }}
                </p>
              </div>
            </section>

            <!-- Purchase Totals -->
            <section class="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div class="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5">
                <div
                  class="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"
                >
                  <UIcon name="i-lucide-calculator" class="size-5" />
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-slate-900">Purchase Summary</h3>
                  <p class="mt-0.5 text-xs text-slate-500">Payment breakdown</p>
                </div>
              </div>

              <div class="space-y-3 p-4">
                <div class="flex items-center justify-between gap-4 text-sm">
                  <span class="text-slate-500">Subtotal</span>
                  <span class="font-medium text-slate-800">
                    {{ $currency(purchase.subtotal) }}
                  </span>
                </div>

                <div class="flex items-center justify-between gap-4 text-sm">
                  <span class="text-slate-500">Discount</span>
                  <span class="font-medium text-rose-600">
                    −{{ $currency(purchase.discount) }}
                  </span>
                </div>

                <div class="flex items-center justify-between gap-4 text-sm">
                  <span class="text-slate-500">Tax</span>
                  <span class="font-medium text-slate-800">
                    {{ $currency(purchase.tax) }}
                  </span>
                </div>

                <div class="flex items-center justify-between gap-4 text-sm">
                  <span class="text-slate-500">Shipping</span>
                  <span class="font-medium text-slate-800">
                    {{ $currency(purchase.shipping) }}
                  </span>
                </div>

                <div class="border-t border-dashed border-slate-200 pt-3">
                  <div class="flex items-center justify-between gap-4">
                    <span class="font-semibold text-slate-900">Grand Total</span>
                    <span class="text-xl font-bold text-slate-900">
                      {{ $currency(purchase.total) }}
                    </span>
                  </div>
                </div>

                <div class="flex items-center justify-between gap-4 text-sm">
                  <span class="text-slate-500">Paid Amount</span>
                  <span class="font-semibold text-emerald-700">
                    {{ $currency(purchase.paid_amount) }}
                  </span>
                </div>

                <div class="flex items-center justify-between gap-4 rounded-lg bg-rose-50 p-3">
                  <div>
                    <p class="text-sm font-semibold text-rose-700">Outstanding Due</p>
                    <p class="mt-0.5 text-xs text-rose-600">Remaining payment</p>
                  </div>
                  <span class="text-lg font-bold text-rose-700">
                    {{ $currency(purchase.due_amount) }}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  </Default>
</template>
