<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Default from '@/layouts/Default.vue'
import { useCustomerStore } from '@/stores/customer'
import { storeToRefs } from 'pinia'

const route = useRoute()
const customerStore = useCustomerStore()

const { customer, sales } = storeToRefs(customerStore)

onMounted(async () => {
  await customerStore.show(route.params.id)
  await customerStore.getSales(route.params.id)
})
</script>

<template>
  <Default>
    <main class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-semibold text-title">View Customer</h1>
          <p class="mt-1 text-sm text-body">
            Customer profile, account information and order history.
          </p>
        </div>

        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          @click="$router.back()"
        >
          <UIcon name="i-lucide-arrow-left" class="size-4" />
          Back
        </button>
      </div>

      <section v-if="customer" class="rounded-xl border border-slate-200 bg-white p-5">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="flex items-center gap-4">
            <div
              class="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary"
            >
              {{ customer.data?.name?.charAt(0)?.toUpperCase() || 'C' }}
            </div>

            <div class="min-w-0">
              <h2 class="text-lg font-semibold text-title">
                {{ customer.data?.name ?? '—' }}
              </h2>

              <p class="mt-1 text-sm text-body">
                {{ customer.data?.email || 'No email address' }}
              </p>
            </div>
          </div>

          <div class="flex gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              @click="
                $router.push({
                  name: 'customers.edit',
                  params: {
                    id: customer.data.id,
                  },
                })
              "
            >
              <UIcon name="i-lucide-pencil" class="size-4" />
              Edit Customer
            </button>
          </div>
        </div>
      </section>

      <section
        v-if="customer?.summary"
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <div class="rounded-xl bg-white p-4">
          <div class="flex items-center justify-between">
            <p class="text-sm text-body">Credit Limit</p>
            <UIcon name="i-lucide-credit-card" class="size-5 text-body/60" />
          </div>
          <p class="mt-3 text-2xl font-semibold text-title">
            {{ $currency(customer.summary.credit_limit) }}
          </p>
          <p class="mt-1 text-xs text-body">Available credit limit</p>
        </div>

        <div class="rounded-xl bg-white p-4">
          <div class="flex items-center justify-between">
            <p class="text-sm text-body">Outstanding Balance</p>
            <UIcon name="i-lucide-circle-dollar-sign" class="size-5 text-amber-600" />
          </div>
          <p class="mt-3 text-2xl font-semibold text-amber-600">
            {{ customer.summary.outstanding_balance }}
          </p>
          <p class="mt-1 text-xs text-body">Amount due from customer</p>
        </div>

        <div class="rounded-xl bg-white p-4">
          <div class="flex items-center justify-between">
            <p class="text-sm text-body">Total Spent</p>
            <UIcon name="i-lucide-wallet" class="size-5 text-body/60" />
          </div>
          <p class="mt-3 text-2xl font-semibold text-title">
            {{ $currency(customer.summary.total_spent) }}
          </p>
          <p class="mt-1 text-xs text-body">Total order value</p>
        </div>

        <div class="rounded-xl bg-white p-4">
          <div class="flex items-center justify-between">
            <p class="text-sm text-body">Total Orders</p>
            <UIcon name="i-lucide-shopping-bag" class="size-5 text-body/60" />
          </div>
          <p class="mt-3 text-2xl font-semibold text-title">
            {{ customer.summary.total_orders ?? 0 }}
          </p>
          <p class="mt-1 text-xs text-body">Orders placed</p>
        </div>
      </section>

      <section v-if="customer?.data" class="rounded-xl bg-white">
        <div class="border-b border-slate-200 px-5 py-4">
          <h2 class="font-semibold text-title">Customer Information</h2>
          <p class="mt-1 text-sm text-body">Contact details and account information.</p>
        </div>

        <div class="grid grid-cols-1 gap-x-8 gap-y-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p class="text-sm text-body">Phone Number</p>
            <p class="mt-1 text-sm font-medium text-title">
              {{ customer.data?.phone || '—' }}
            </p>
          </div>

          <div>
            <p class="text-sm text-body">Email Address</p>
            <p class="mt-1 text-sm font-medium text-title">
              {{ customer.data?.email || '—' }}
            </p>
          </div>

          <div>
            <p class="text-sm text-body">City</p>
            <p class="mt-1 text-sm font-medium text-title">
              {{ customer.data?.city || '—' }}
            </p>
          </div>

          <div>
            <p class="text-sm text-body">State</p>
            <p class="mt-1 text-sm font-medium text-title">
              {{ customer.data?.state || '—' }}
            </p>
          </div>

          <div>
            <p class="text-sm text-body">Postcode</p>
            <p class="mt-1 text-sm font-medium text-title">
              {{ customer.data?.postcode || '—' }}
            </p>
          </div>

          <div>
            <p class="text-sm text-body">Opening Balance</p>
            <p class="mt-1 text-sm font-medium text-title">
              {{ $currency(customer.data?.opening_balance) }}
            </p>
          </div>

          <div class="sm:col-span-2 lg:col-span-3">
            <p class="text-sm text-body">Address</p>
            <p class="mt-1 text-sm font-medium text-title">
              {{ customer.data?.address || '—' }}
            </p>
          </div>

          <div class="sm:col-span-2 lg:col-span-3">
            <p class="text-sm text-body">Notes</p>
            <p class="mt-1 whitespace-pre-wrap text-sm text-title">
              {{ customer.data?.notes || '—' }}
            </p>
          </div>
        </div>
      </section>

      <!-- Orders -->
      <section v-if="sales.data" class="overflow-hidden rounded-xl bg-white">
        <div
          class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-4"
        >
          <div>
            <h2 class="font-semibold text-title">Order History</h2>
            <p class="mt-1 text-sm text-body">Recent orders placed by this customer.</p>
          </div>

          <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {{ customer?.data?.sales_count }} orders
          </span>
        </div>

        <div v-if="sales?.data" class="overflow-x-auto px-2.5">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="sale in sales.data" :key="sale.id">
                <td>#{{ sale.invoice_no }}</td>
                <td>{{ $date(sale.created_at) }}</td>
                <td>{{ sale.items_count }}</td>
                <td>{{ $currency(sale.total) }}</td>
                <td>{{ $currency(Number(sale.total) - Number(sale.due_amount)) }}</td>
                <td>
                  <span class="text-red-600">{{ $currency(sale.due_amount) }}</span>
                </td>
                <td>
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize"
                    :class="{
                      'bg-green-50 text-green-700': sale.payment === 'paid',
                      'bg-amber-50 text-amber-700': sale.payment === 'partial',
                      'bg-red-50 text-red-700': sale.payment === 'unpaid',
                    }"
                  >
                    {{ sale.payment }}
                  </span>
                </td>

                <td>
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize"
                    :class="{
                      'bg-green-50 text-green-700': sale.status === 'completed',
                      'bg-amber-50 text-amber-700': sale.status === 'pending',
                      'bg-blue-50 text-blue-700': sale.status === 'processing',
                      'bg-red-50 text-red-700': sale.status === 'cancelled',
                      'bg-slate-100 text-slate-600': sale.status === 'draft',
                    }"
                  >
                    {{ sale.status || 'Unknown' }}
                  </span>
                </td>

                <td class="text-right">
                  <button
                    type="button"
                    title="View Sale"
                    class="inline-flex items-center justify-center rounded-md p-2 text-body/60 transition hover:bg-slate-100 hover:text-title"
                    @click="$router.push(`/sales/${sale.id}`)"
                  >
                    <UIcon name="i-lucide-eye" class="size-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="flex flex-col items-center justify-center px-5 py-12 text-center">
          <div class="flex size-12 items-center justify-center rounded-full bg-slate-100">
            <UIcon name="i-lucide-shopping-bag" class="size-6 text-slate-400" />
          </div>
          <h3 class="mt-4 text-sm font-semibold text-title">No orders found</h3>
          <p class="mt-1 text-sm text-body">This customer has no orders yet.</p>
        </div>
      </section>
    </main>
  </Default>
</template>
