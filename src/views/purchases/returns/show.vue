<script setup>
import { onMounted } from 'vue'
import Default from '@/layouts/Default.vue'
import { usePurchaseReturnStore } from '@/stores/purchase-return'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

const route = useRoute()

const purchaseReturns = usePurchaseReturnStore()
const { item } = storeToRefs(purchaseReturns)

onMounted(async () => {
  await purchaseReturns.show(route.params.id)
})
</script>

<template>
  <Default>
    <main class="space-y-4">
      <div v-if="item" class="space-y-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="mt-2 text-2xl font-semibold text-title">Purchase Return Details</h1>
            <p class="mt-1 text-sm text-body">
              View purchase return information and returned products.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="$router.back()"
              class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>

            <button
              type="button"
              @click="
                $router.push({
                  name: 'purchase-returns.edit',
                  params: {
                    id: item.id,
                  },
                })
              "
              class="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Edit Return
            </button>
          </div>
        </div>

        <!-- Return Overview -->
        <section class="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white p-4">
          <div class="flex flex-col gap-4 py-2.5 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-3">
                <h2 class="break-all text-xl font-semibold text-gray-900">
                  {{ item.return_no }}
                </h2>

                <span
                  class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ring-1 ring-inset"
                  :class="{
                    'bg-yellow-100 text-yellow-700': item.status === 'draft',
                    'bg-green-100 text-green-700': item.status === 'completed',
                    'bg-blue-100 text-blue-700': item.status === 'returned',
                    'bg-red-100 text-red-700': item.status === 'cancelled',
                  }"
                >
                  {{ item.status || 'Unknown' }}
                </span>
              </div>

              <p class="mt-2 text-sm text-gray-500">
                Return Reference:
                <span class="font-medium text-gray-700">
                  {{ item.reference || '—' }}
                </span>
              </p>

              <p class="mt-1 text-sm text-gray-500">
                Original Purchase:
                <span class="font-medium text-blue-600">
                  {{ item.purchase?.purchase_no || '—' }}
                </span>
              </p>
            </div>

            <div class="sm:text-right">
              <p class="text-sm text-gray-500">Return Total</p>
              <p class="mt-1 text-3xl font-bold text-gray-900">
                {{ $currency(item.total) }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 py-4 sm:grid-cols-4">
            <div>
              <p class="text-sm text-gray-500">Return Date</p>
              <p class="mt-1 font-medium text-gray-900">
                {{ $date(item.return_date) }}
              </p>
            </div>

            <div>
              <p class="text-sm text-gray-500">Products</p>
              <p class="mt-1 font-medium text-gray-900">
                {{ item.items?.length }}
              </p>
            </div>

            <div>
              <p class="text-sm text-gray-500">Units Returned</p>
              <p class="mt-1 font-medium text-gray-900">
                {{ item.items?.reduce((sum, row) => sum + Number(row.quantity || 0), 0) ?? 0 }}
              </p>
            </div>

            <div>
              <p class="text-sm text-gray-500">Created At</p>
              <p class="mt-1 font-medium text-gray-900">
                {{ $dateTime(item.created_at) }}
              </p>
            </div>
          </div>
        </section>

        <!-- Purchase and Return Information -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="rounded-xl border border-gray-200 bg-white p-5">
            <h3 class="text-base font-semibold text-gray-900">Purchase Information</h3>
            <div class="mt-4 divide-y divide-gray-100">
              <div class="flex items-center justify-between gap-4 py-3">
                <span class="text-sm text-gray-500">Purchase Number</span>
                <span class="break-all text-right text-sm font-medium text-blue-600">
                  {{ item.purchase?.purchase_no ?? '—' }}
                </span>
              </div>

              <div class="flex items-center justify-between gap-4 py-3">
                <span class="text-sm text-gray-500">Purchase Date</span>
                <span class="text-right text-sm font-medium text-gray-900">
                  {{ $date(item.purchase?.purchase_date) }}
                </span>
              </div>

              <div class="flex items-center justify-between gap-4 py-3">
                <span class="text-sm text-gray-500">Expected Date</span>
                <span class="text-right text-sm font-medium text-gray-900">
                  {{ $date(item.purchase?.expected_date) }}
                </span>
              </div>

              <div class="flex items-center justify-between gap-4 py-3">
                <span class="text-sm text-gray-500">Reference</span>
                <span class="text-right text-sm font-medium text-gray-900">
                  {{ item.purchase?.reference ?? '—' }}
                </span>
              </div>

              <div class="flex items-center justify-between gap-4 py-3">
                <span class="text-sm text-gray-500">Purchase Status</span>
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset"
                  :class="{
                    'bg-yellow-100 text-yellow-700': item.purchase?.status === 'draft',
                    'bg-green-100 text-green-700': item.purchase?.status === 'completed',
                    'bg-blue-100 text-blue-700': item.purchase?.status === 'returned',
                    'bg-red-100 text-red-700': item.purchase?.status === 'cancelled',
                  }"
                >
                  {{ item.purchase?.status ?? 'Unknown' }}
                </span>
              </div>

              <div class="flex items-center justify-between gap-4 py-3">
                <span class="text-sm text-gray-500">Purchase Total</span>
                <span class="text-sm font-semibold text-gray-900">
                  {{ $currency(item.purchase?.total) }}
                </span>
              </div>

              <div class="flex items-center justify-between gap-4 py-3">
                <span class="text-sm text-gray-500">Paid Amount</span>
                <span class="text-sm font-medium text-gray-900">
                  {{ $currency(item.purchase?.paid_amount) }}
                </span>
              </div>

              <div class="flex items-center justify-between gap-4 py-3">
                <span class="text-sm text-gray-500">Due Amount</span>
                <span class="text-sm font-medium text-gray-900">
                  {{ $currency(item.purchase?.due_amount) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Return Information -->
          <div class="rounded-xl border border-gray-200 bg-white p-5">
            <h3 class="text-base font-semibold text-gray-900">Return Information</h3>

            <div class="mt-4 rounded-lg bg-gray-50 p-4">
              <p class="text-sm text-gray-500">Return Notes</p>
              <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                {{ item.note ?? 'No notes provided.' }}
              </p>
            </div>

            <div class="mt-5 space-y-4">
              <div>
                <p class="text-sm text-gray-500">Return Number</p>
                <p class="mt-1 break-all text-sm font-medium text-gray-900">
                  {{ item.return_no }}
                </p>
              </div>

              <div>
                <p class="text-sm text-gray-500">Created By</p>
                <p class="mt-1 text-sm font-medium text-gray-900">
                  {{ item.created_by || 'Not assigned' }}
                </p>
              </div>

              <div>
                <p class="text-sm text-gray-500">Last Updated</p>
                <p class="mt-1 text-sm font-medium text-gray-900">
                  {{ $dateTime(item.updated_at) }}
                </p>
              </div>

              <div class="group">
                <h4 class="text-sm text-muted">Item Notes</h4>
                <div
                  v-for="item in item.items"
                  :key="`${item.id}-reason`"
                  class="flex items-start gap-4"
                >
                  <p class="text-sm font-medium text-title">
                    {{ item.product?.name ?? 'Product' }}
                  </p>
                  <p class="text-sm text-body">
                    {{ item.reason ?? 'No reason provided.' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Returned Products -->
        <section class="rounded-xl bg-white">
          <div class="flex items-center justify-between gap-2 p-4">
            <div>
              <h3 class="text-base font-semibold text-title">Returned Products</h3>
              <p class="mt-1 text-sm text-body">Product details and return amounts.</p>
            </div>

            <span class="w-fit rounded bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700">
              {{ item.items.length }}
              {{ item.items.length === 1 ? 'Product' : 'Products' }}
            </span>
          </div>

          <div v-if="item.items.length" class="overflow-x-auto px-2.5">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Cost</th>
                  <th>Discount</th>
                  <th>Tax</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="item in item.items" :key="item.id">
                  <td>
                    <div class="flex items-center gap-3">
                      <img
                        :src="item.product.cover_url"
                        :alt="item.product?.name || 'Product'"
                        class="h-12 w-12 shrink-0 rounded bg-gray-50 object-cover"
                      />

                      <div class="min-w-0">
                        <h4 class="font-medium text-title">
                          {{ item.product?.name || 'Unknown Product' }}
                        </h4>
                        <p class="mt-1 text-xs text-body">Code: {{ item.product?.code || '—' }}</p>
                      </div>
                    </div>
                  </td>

                  <td>{{ item.quantity ?? 0 }}</td>
                  <td>{{ $currency(item.unit_cost) }}</td>
                  <td>{{ $currency(item.discount) }}</td>
                  <td>{{ $currency(item.tax) }}</td>
                  <td>{{ $currency(item.total) }}</td>
                </tr>
              </tbody>
            </table>
            <div class="ml-auto max-w-xs space-y-4 px-2.5 py-4">
              <div class="flex justify-between gap-4 text-sm">
                <span class="text-gray-500">Subtotal</span>
                <span class="font-medium text-gray-900">
                  {{ $currency(item.subtotal) }}
                </span>
              </div>

              <div class="flex justify-between gap-4 text-sm">
                <span class="text-gray-500">Discount</span>
                <span class="font-medium text-gray-900"> − {{ $currency(item.discount) }} </span>
              </div>

              <div class="flex justify-between gap-4 text-sm">
                <span class="text-gray-500">Tax</span>
                <span class="font-medium text-gray-900">
                  {{ $currency(item.tax) }}
                </span>
              </div>

              <div class="flex justify-between gap-4 text-sm">
                <span class="text-gray-500">Shipping</span>
                <span class="font-medium text-gray-900">
                  {{ $currency(item.shipping) }}
                </span>
              </div>

              <div class="flex justify-between gap-4 text-sm">
                <span class="text-gray-500">Charges</span>
                <span class="font-medium text-gray-900">
                  {{ $currency(item.charge) }}
                </span>
              </div>

              <div class="flex items-center justify-between gap-4">
                <span class="font-semibold text-gray-900">Grand Total</span>
                <span class="text-xl font-bold text-gray-900">
                  {{ $currency(item.total) }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Empty State -->
      <div v-else class="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <h2 class="text-lg font-semibold text-gray-900">Purchase return not found</h2>
        <p class="mt-2 text-sm text-gray-500">The requested return could not be loaded.</p>
        <button
          type="button"
          @click="$router.back()"
          class="mt-5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Go Back
        </button>
      </div>
    </main>
  </Default>
</template>
