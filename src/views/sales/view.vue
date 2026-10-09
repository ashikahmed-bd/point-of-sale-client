<script setup>
import Default from '@/layouts/Default.vue'
import { useSaleStore } from '@/stores/sale'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const saleStore = useSaleStore()

const { sale } = storeToRefs(saleStore)

onMounted(async () => {
  await saleStore.show(route.params.id)
})
</script>

<template>
  <Default>
    <main class="space-y-5">
      <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div class="block">
          <h1 class="text-lg font-semibold text-body">Sale Details</h1>
          <p class="text-sm text-body/60">
            View invoice information, purchased items and payment details.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <RouterLink
            :to="{ name: 'sales' }"
            class="flex items-center gap-2 rounded border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-body transition hover:bg-slate-50"
          >
            <UIcon name="i-lucide-arrow-left" class="size-4" />
            Back
          </RouterLink>

          <button
            type="button"
            class="flex items-center gap-2 rounded bg-primary px-3 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            <UIcon name="i-lucide-printer" class="size-4" />
            Print
          </button>
        </div>
      </div>

      <section class="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div class="flex justify-between gap-4 border-b border-slate-200 p-5">
          <div class="flex items-center gap-2">
            <div class="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <UIcon name="i-lucide-receipt-text" class="size-5 text-primary" />
            </div>

            <div>
              <p class="text-xs text-body/50">Invoice Number</p>
              <h2 class="mt-1 text-base font-semibold text-body">#{{ sale.data?.invoice_no }}</h2>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"
            >
              <UIcon name="i-lucide-check-circle" class="size-3.5" />
              Completed
            </span>

            <span
              class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
            >
              <UIcon name="i-lucide-wallet" class="size-3.5" />
              Paid
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-lg border border-slate-200 p-4">
            <div class="flex items-center gap-2 text-sm text-body/60">
              <UIcon name="i-lucide-receipt" class="size-4" />
              Subtotal
            </div>

            <p class="mt-3 text-xl font-semibold text-body">{{ $currency(sale.data?.subtotal) }}</p>
          </div>

          <div class="rounded-lg border border-slate-200 p-4">
            <div class="flex items-center gap-2 text-sm text-body/60">
              <UIcon name="i-lucide-tag" class="size-4" />
              Discount
            </div>

            <p class="mt-3 text-xl font-semibold text-rose-600">
              -{{ $currency(sale.data?.discount) }}
            </p>
          </div>

          <div class="rounded-lg border border-slate-200 p-4">
            <div class="flex items-center gap-2 text-sm text-body/60">
              <UIcon name="i-lucide-percent" class="size-4" />
              Tax
            </div>

            <p class="mt-3 text-xl font-semibold text-body">{{ $currency(sale.data?.tax) }}</p>
          </div>

          <div class="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div class="flex items-center gap-2 text-sm text-primary">
              <UIcon name="i-lucide-wallet" class="size-4" />
              Grand Total
            </div>

            <p class="mt-3 text-xl font-semibold text-primary">{{ $currency(sale.data?.total) }}</p>
          </div>
        </div>
      </section>

      <section class="overflow-hidden rounded border border-border bg-white">
        <div class="flex items-center justify-between gap-2 border-b border-border px-5 py-4">
          <div>
            <h2 class="text-sm font-semibold text-body">Purchased Items</h2>
            <p class="mt-1 text-xs text-body/50">Products included in this invoice</p>
          </div>

          <span class="text-sm text-body/60"> 3 products </span>
        </div>

        <div class="overflow-x-auto px-4">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Discount</th>
                <th>Tax</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in sale.data?.items">
                <td>
                  <span class="text-sm font-medium text-body">{{ item.name }}</span>
                </td>
                <td>{{ item.sku }}</td>
                <td>{{ $currency(item.price) }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ $currency(item.discount) }}</td>
                <td>
                  <p class="text-sm text-body">{{ $currency(item.tax) }}</p>
                  <p class="mt-1 text-xs text-body/50">{{ item.tax_rate }}%</p>
                </td>
                <td>{{ $currency(item.total) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div class="rounded border border-border bg-white">
          <div class="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-user-round" class="size-5 text-primary" />
              <h2 class="text-sm font-semibold text-body">Customer Information</h2>
            </div>

            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-body/60">
              {{ sale.data?.customer ? 'Customer' : 'Walk-in' }}
            </span>
          </div>

          <div class="flex items-start gap-4 p-5">
            <div
              class="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary"
            >
              {{ (sale.data?.customer?.name ?? 'Walk-in Customer').charAt(0).toUpperCase() }}
            </div>

            <div class="min-w-0 flex-1 space-y-1">
              <h3 class="text-sm font-semibold text-body">
                {{ sale.data?.customer?.name ?? 'Walk-in Customer' }}
              </h3>

              <div v-if="sale.data?.customer?.phone" class="flex items-center gap-2 text-sm">
                <UIcon name="i-lucide-phone" class="size-4 text-body" />
                <span class="text-body">{{ sale.data.customer.phone }}</span>
              </div>

              <p v-else class="text-sm text-body/50">No phone number available</p>
            </div>
          </div>

          <div class="mx-5 mb-5 rounded-md bg-slate-50 px-4 py-3">
            <p class="text-xs text-body/50">Payment Account</p>

            <div class="mt-1 flex items-center gap-2">
              <UIcon name="i-lucide-wallet" class="size-4 text-body/60" />
              <span class="text-sm font-medium text-body">
                {{ sale.data?.account?.name ?? 'N/A' }}
              </span>
            </div>
          </div>

          <div class="p-5">
            <p class="text-sm text-body/50">
              {{ sale.data?.note ?? 'No additional note for this sale.' }}
            </p>

            <div class="mt-5 border-t border-border pt-4">
              <p class="text-xs text-body/50">Created At</p>
              <p class="mt-1 text-sm text-body">
                {{ $dateTime(sale.data?.created_at) }}
              </p>
            </div>
          </div>
        </div>

        <div class="rounded border border-border bg-white">
          <div class="flex items-center gap-2 border-b border-border px-5 py-4">
            <UIcon name="i-lucide-calculator" class="size-5 text-primary" />
            <h2 class="text-sm font-semibold text-body">Invoice Summary</h2>
          </div>

          <div class="space-y-3 p-5">
            <div class="flex items-center justify-between gap-4">
              <span class="text-sm text-body/60">Subtotal</span>
              <span class="text-sm font-medium text-body">
                {{ $currency(sale.data?.subtotal ?? 0) }}
              </span>
            </div>

            <div class="flex items-center justify-between gap-4">
              <span class="text-sm text-body/60">Discount</span>
              <span class="text-sm font-medium text-rose-600">
                −{{ $currency(sale.data?.discount ?? 0) }}
              </span>
            </div>

            <div class="flex items-center justify-between gap-4">
              <span class="text-sm text-body/60">Tax</span>
              <span class="text-sm font-medium text-body">
                {{ $currency(sale.data?.tax ?? 0) }}
              </span>
            </div>

            <div class="flex items-center justify-between gap-4">
              <span class="text-sm text-body/60">Shipping</span>
              <span class="text-sm font-medium text-body">
                {{ $currency(sale.data?.shipping ?? 0) }}
              </span>
            </div>

            <div class="border-t border-dashed border-border">
              <div class="flex items-center justify-between gap-4">
                <span class="text-sm font-semibold text-body">Grand Total</span>
                <span class="text-lg font-bold text-body">
                  {{ $currency(sale.data?.total ?? 0) }}
                </span>
              </div>
            </div>

            <div class="rounded-md bg-emerald-50 p-3">
              <div class="flex items-center justify-between gap-4">
                <span class="text-sm text-emerald-700">Paid Amount</span>
                <span class="text-sm font-semibold text-emerald-700">
                  {{ $currency(sale.data?.paid_amount ?? 0) }}
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between gap-4 px-1">
              <span class="text-sm text-body/60">Change</span>
              <span class="text-sm font-medium text-body">
                {{ $currency(sale.data?.change_amount ?? 0) }}
              </span>
            </div>

            <div
              class="flex items-center justify-between gap-4 rounded-md border border-rose-100 bg-rose-50 p-3"
            >
              <span class="text-sm font-medium text-rose-700">Due Amount</span>
              <span class="text-base font-bold text-rose-700">
                {{
                  $currency(
                    sale.data?.due_amount ??
                      Number(sale.data?.total ?? 0) - Number(sale.data?.paid_amount ?? 0),
                  )
                }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </Default>
</template>
