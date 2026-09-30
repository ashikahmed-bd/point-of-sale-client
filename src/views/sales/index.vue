<script setup>
import Default from '@/layouts/Default.vue'

const sales = [
  {
    id: 1,
    invoice: '#INV-001248',
    customer: 'Rahim Ahmed',
    items: 4,
    date: '30 Sep 2026',
    payment: 'Paid',
    method: 'Cash',
    total: '৳ 12,500',
    status: 'Completed',
  },
  {
    id: 2,
    invoice: '#INV-001247',
    customer: 'Karim Hasan',
    items: 2,
    date: '30 Sep 2026',
    payment: 'Paid',
    method: 'Card',
    total: '৳ 8,200',
    status: 'Completed',
  },
  {
    id: 3,
    invoice: '#INV-001246',
    customer: 'Nusrat Jahan',
    items: 5,
    date: '30 Sep 2026',
    payment: 'Pending',
    method: 'Cash',
    total: '৳ 15,800',
    status: 'Pending',
  },
  {
    id: 4,
    invoice: '#INV-001245',
    customer: 'Sakib Khan',
    items: 1,
    date: '29 Sep 2026',
    payment: 'Paid',
    method: 'bKash',
    total: '৳ 4,500',
    status: 'Completed',
  },
  {
    id: 5,
    invoice: '#INV-001244',
    customer: 'Tanvir Hossain',
    items: 3,
    date: '29 Sep 2026',
    payment: 'Paid',
    method: 'Cash',
    total: '৳ 9,750',
    status: 'Completed',
  },
  {
    id: 6,
    invoice: '#INV-001243',
    customer: 'Jannatul Ferdous',
    items: 2,
    date: '29 Sep 2026',
    payment: 'Refunded',
    method: 'Card',
    total: '৳ 6,300',
    status: 'Refunded',
  },
  {
    id: 7,
    invoice: '#INV-001242',
    customer: 'Mehedi Hasan',
    items: 6,
    date: '28 Sep 2026',
    payment: 'Paid',
    method: 'Cash',
    total: '৳ 18,400',
    status: 'Completed',
  },
  {
    id: 8,
    invoice: '#INV-001241',
    customer: 'Farhan Ahmed',
    items: 3,
    date: '28 Sep 2026',
    payment: 'Paid',
    method: 'Nagad',
    total: '৳ 7,850',
    status: 'Completed',
  },
  {
    id: 9,
    invoice: '#INV-001240',
    customer: 'Shakil Ahmed',
    items: 2,
    date: '28 Sep 2026',
    payment: 'Pending',
    method: 'Cash',
    total: '৳ 5,600',
    status: 'Pending',
  },
  {
    id: 10,
    invoice: '#INV-001239',
    customer: 'Mim Akter',
    items: 4,
    date: '27 Sep 2026',
    payment: 'Paid',
    method: 'Card',
    total: '৳ 11,200',
    status: 'Completed',
  },
]

const stats = [
  {
    title: 'Total Sales',
    value: '৳ 2,48,650',
    change: '+12.5%',
    icon: 'i-lucide-shopping-cart',
    class: 'bg-primary/10 text-primary',
  },
  {
    title: 'Today Sales',
    value: '৳ 46,250',
    change: '+8.2%',
    icon: 'i-lucide-banknote',
    class: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Transactions',
    value: '1,248',
    change: '+6.4%',
    icon: 'i-lucide-receipt',
    class: 'bg-violet-50 text-violet-600',
  },
  {
    title: 'Refunds',
    value: '৳ 12,450',
    change: '-3.2%',
    icon: 'i-lucide-rotate-ccw',
    class: 'bg-orange-50 text-orange-600',
  },
]

const statusClass = (status) => {
  return {
    Completed: 'bg-emerald-50 text-emerald-600',
    Pending: 'bg-orange-50 text-orange-600',
    Refunded: 'bg-red-50 text-red-600',
  }[status]
}

const paymentClass = (payment) => {
  return {
    Paid: 'text-emerald-600',
    Pending: 'text-orange-600',
    Refunded: 'text-red-600',
  }[payment]
}
</script>

<template>
  <Default>
    <main class="p-4">
      <div class="mx-auto max-w-7xl">
        <!-- Header -->
        <div class="mb-4 flex items-center justify-between gap-4">
          <div>
            <h1 class="text-sm font-semibold text-body">Sales</h1>

            <p class="mt-1 text-sm text-body/60">
              Manage sales, transactions, payments and invoices.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-body transition hover:bg-slate-50"
            >
              <UIcon name="i-lucide-download" class="size-4" />

              Export
            </button>

            <RouterLink
              :to="{ name: 'pos' }"
              class="flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-white transition hover:bg-primary/90"
            >
              <UIcon name="i-lucide-plus" class="size-4" />

              New Sale
            </RouterLink>
          </div>
        </div>

        <!-- Stats -->
        <div class="mb-3 grid grid-cols-4 gap-3">
          <div
            v-for="stat in stats"
            :key="stat.title"
            class="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
          >
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-lg"
              :class="stat.class"
            >
              <UIcon :name="stat.icon" class="size-5" />
            </div>

            <div class="min-w-0">
              <p class="text-sm text-body/60">
                {{ stat.title }}
              </p>

              <div class="mt-0.5 flex items-center gap-2">
                <span class="text-sm font-semibold text-body">
                  {{ stat.value }}
                </span>

                <span class="text-xs font-medium text-emerald-600">
                  {{ stat.change }}
                </span>
              </div>

              <p class="mt-0.5 text-xs text-body/40">vs last month</p>
            </div>
          </div>
        </div>

        <!-- Sales List -->
        <section class="overflow-hidden rounded-lg border border-slate-200 bg-white px-4 py-5">
          <!-- Filters -->
          <div class="flex items-center gap-2 border-b border-slate-100 p-2">
            <!-- Search -->
            <div class="relative flex-1">
              <UIcon
                name="i-lucide-search"
                class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-body/40"
              />

              <input
                type="text"
                placeholder="Search invoice, customer or transaction..."
                class="h-9 w-full rounded-md border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-sm text-body outline-none transition placeholder:text-body/40 focus:border-primary focus:bg-white"
              />
            </div>

            <!-- Date -->
            <button
              type="button"
              class="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-body"
            >
              <UIcon name="i-lucide-calendar" class="size-4 text-body/50" />

              This Month

              <UIcon name="i-lucide-chevron-down" class="size-4 text-body/50" />
            </button>

            <!-- Payment -->
            <select
              class="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-body outline-none focus:border-primary"
            >
              <option>All Payments</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Refunded</option>
            </select>

            <!-- Status -->
            <select
              class="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-body outline-none focus:border-primary"
            >
              <option>All Status</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Refunded</option>
            </select>

            <!-- Filter -->
            <button
              type="button"
              class="flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm text-body transition hover:bg-slate-50"
            >
              <UIcon name="i-lucide-list-filter" class="size-4" />

              Filter
            </button>

            <button type="button" class="px-1 text-sm text-primary hover:underline">Reset</button>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto px-2">
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
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="sale in sales" :key="sale.id">
                  <td>
                    <button type="button" class="text-sm font-medium text-primary hover:underline">
                      {{ sale.invoice }}
                    </button>
                  </td>

                  <td>
                    <div class="flex items-center gap-2">
                      <div
                        class="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-body"
                      >
                        {{ sale.customer.charAt(0) }}
                      </div>

                      <span class="text-sm text-body">
                        {{ sale.customer }}
                      </span>
                    </div>
                  </td>

                  <td class="text-body/70">
                    {{ sale.items }}
                  </td>

                  <td class="whitespace-nowrap text-body/60">
                    {{ sale.date }}
                  </td>

                  <td>
                    <span class="text-sm font-medium" :class="paymentClass(sale.payment)">
                      {{ sale.payment }}
                    </span>
                  </td>

                  <td>
                    <span class="text-sm text-body/70">
                      {{ sale.method }}
                    </span>
                  </td>

                  <td>
                    <span class="whitespace-nowrap text-sm font-semibold text-body">
                      {{ sale.total }}
                    </span>
                  </td>

                  <td>
                    <span
                      class="inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium"
                      :class="statusClass(sale.status)"
                    >
                      {{ sale.status }}
                    </span>
                  </td>

                  <td>
                    <div class="flex items-center gap-1">
                      <button
                        type="button"
                        class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-body/60 transition hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                      >
                        <UIcon name="i-lucide-eye" class="size-4" />
                      </button>

                      <button
                        type="button"
                        class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-body/60 transition hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                      >
                        <UIcon name="i-lucide-printer" class="size-4" />
                      </button>

                      <button
                        type="button"
                        class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-body/60 transition hover:border-primary/20 hover:bg-slate-50 hover:text-primary"
                      >
                        <UIcon name="i-lucide-more-horizontal" class="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between border-t border-slate-100 px-3 py-3">
            <p class="text-sm text-body/60">Showing 1 to 10 of 1,248 sales</p>

            <div class="flex items-center gap-4">
              <!-- Pagination -->
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-body/50 hover:bg-slate-50"
                >
                  <UIcon name="i-lucide-chevron-left" class="size-4" />
                </button>

                <button
                  type="button"
                  class="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-medium text-white"
                >
                  1
                </button>

                <button
                  v-for="page in [2, 3, 4, 5]"
                  :key="page"
                  type="button"
                  class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-sm text-body hover:bg-slate-50"
                >
                  {{ page }}
                </button>

                <span class="px-1 text-sm text-body/40"> ... </span>

                <button
                  type="button"
                  class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-sm text-body hover:bg-slate-50"
                >
                  125
                </button>

                <button
                  type="button"
                  class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-body hover:bg-slate-50"
                >
                  <UIcon name="i-lucide-chevron-right" class="size-4" />
                </button>
              </div>

              <!-- Per Page -->
              <div class="flex items-center gap-2">
                <span class="text-sm text-body/60"> Show </span>

                <select
                  class="h-8 rounded-md border border-slate-200 bg-white px-2 text-sm text-body outline-none focus:border-primary"
                >
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>

                <span class="text-sm text-body/60"> per page </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </Default>
</template>
