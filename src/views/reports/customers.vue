<template>
  <Default>
    <main class="space-y-6 p-4">
      <!-- Header -->
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Customer Reports</h1>
          <p class="mt-1 text-sm text-gray-500">
            Analyze customer growth, purchase history and outstanding balances.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            @click="exportCSV"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <UIcon name="i-lucide-download" class="size-4" />
            Export CSV
          </button>

          <button
            @click="printReport"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            <UIcon name="i-lucide-printer" class="size-4" />
            Print Report
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.title"
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ stat.title }}
              </p>
              <h2 class="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
                {{ stat.value }}
              </h2>
              <p class="mt-2 text-xs text-gray-500">
                {{ stat.description }}
              </p>
            </div>

            <div
              class="flex size-11 shrink-0 items-center justify-center rounded-xl"
              :class="stat.iconClass"
            >
              <UIcon :name="stat.icon" class="size-5" />
            </div>
          </div>
        </div>
      </div>

      <!-- Insights -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <!-- Customer Overview -->
        <section
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
        >
          <h2 class="font-semibold text-gray-900 dark:text-white">Customer Overview</h2>
          <p class="mt-1 text-sm text-gray-500">Customer status distribution</p>

          <div class="mt-6 space-y-5">
            <div>
              <div class="mb-2 flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-300">Active</span>
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ activeCount }}
                </span>
              </div>
              <div class="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <div
                  class="h-full rounded-full bg-emerald-500"
                  :style="{ width: percentage(activeCount) + '%' }"
                />
              </div>
            </div>

            <div>
              <div class="mb-2 flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-300">Inactive</span>
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ inactiveCount }}
                </span>
              </div>
              <div class="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <div
                  class="h-full rounded-full bg-gray-400"
                  :style="{ width: percentage(inactiveCount) + '%' }"
                />
              </div>
            </div>

            <div>
              <div class="mb-2 flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-300">Customers With Due</span>
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ customersWithDue }}
                </span>
              </div>
              <div class="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <div
                  class="h-full rounded-full bg-amber-500"
                  :style="{ width: percentage(customersWithDue) + '%' }"
                />
              </div>
            </div>
          </div>

          <div class="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
            <div class="flex items-start gap-2">
              <UIcon name="i-lucide-info" class="mt-0.5 size-4 shrink-0 text-primary" />
              <p class="text-sm text-gray-600 dark:text-gray-300">
                {{ customersWithDue }} customers have an outstanding balance.
              </p>
            </div>
          </div>
        </section>

        <!-- Top Customers -->
        <section
          class="rounded-xl border border-gray-200 bg-white p-5 xl:col-span-2 dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Top Customers</h2>
              <p class="mt-1 text-sm text-gray-500">Ranked by total purchase value</p>
            </div>
            <UIcon name="i-lucide-trophy" class="size-5 text-amber-500" />
          </div>

          <div class="space-y-4">
            <div
              v-for="(customer, index) in topCustomers"
              :key="customer.id"
              class="flex items-center gap-3"
            >
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
              >
                {{ initials(customer.name) }}
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {{ customer.name }}
                    </p>
                    <p class="mt-1 text-xs text-gray-500">{{ customer.orders }} orders</p>
                  </div>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ formatCurrency(customer.totalPurchases) }}
                  </p>
                </div>

                <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                  <div
                    class="h-full rounded-full bg-primary"
                    :style="{ width: topCustomerPercentage(customer.totalPurchases) + '%' }"
                  />
                </div>
              </div>

              <span class="text-xs text-gray-400"> #{{ index + 1 }} </span>
            </div>

            <div v-if="topCustomers.length === 0" class="py-8 text-center text-sm text-gray-500">
              No customer data available.
            </div>
          </div>
        </section>
      </div>

      <!-- Customer Table -->
      <section
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
      >
        <div
          class="flex flex-col justify-between gap-4 border-b border-gray-200 p-5 lg:flex-row lg:items-center dark:border-gray-700"
        >
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Customer Details</h2>
            <p class="mt-1 text-sm text-gray-500">Customer-wise purchase and payment summary</p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <div class="relative">
              <UIcon
                name="i-lucide-search"
                class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
              />
              <input
                v-model="search"
                type="text"
                placeholder="Search customers..."
                class="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-56 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <select
              v-model="selectedStatus"
              class="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              v-model="selectedBalance"
              class="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <option value="">All Balances</option>
              <option value="due">Has Due</option>
              <option value="clear">No Due</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[950px] text-left text-sm">
            <thead class="bg-gray-50 dark:bg-gray-900/50">
              <tr class="text-xs uppercase tracking-wide text-gray-500">
                <th class="px-5 py-4 font-medium">Customer</th>
                <th class="px-5 py-4 font-medium">Contact</th>
                <th class="px-5 py-4 font-medium">City</th>
                <th class="px-5 py-4 text-right font-medium">Orders</th>
                <th class="px-5 py-4 text-right font-medium">Total Purchases</th>
                <th class="px-5 py-4 text-right font-medium">Paid</th>
                <th class="px-5 py-4 text-right font-medium">Outstanding</th>
                <th class="px-5 py-4 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="customer in filteredCustomers"
                :key="customer.id"
                class="border-b border-gray-100 last:border-0 hover:bg-gray-50/70 dark:border-gray-700 dark:hover:bg-gray-700/20"
              >
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    >
                      {{ initials(customer.name) }}
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ customer.name }}
                      </p>
                      <p class="mt-1 text-xs text-gray-500">
                        {{ customer.code }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="px-5 py-4">
                  <p class="text-gray-700 dark:text-gray-200">
                    {{ customer.phone }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500">
                    {{ customer.email || '—' }}
                  </p>
                </td>

                <td class="px-5 py-4 text-gray-600 dark:text-gray-300">
                  {{ customer.city || '—' }}
                </td>

                <td class="px-5 py-4 text-right text-gray-600 dark:text-gray-300">
                  {{ customer.orders }}
                </td>

                <td class="px-5 py-4 text-right font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(customer.totalPurchases) }}
                </td>

                <td class="px-5 py-4 text-right text-emerald-600 dark:text-emerald-400">
                  {{ formatCurrency(customer.paid) }}
                </td>

                <td
                  class="px-5 py-4 text-right font-medium"
                  :class="customer.due > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-500'"
                >
                  {{ formatCurrency(customer.due) }}
                </td>

                <td class="px-5 py-4">
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="
                      customer.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    "
                  >
                    {{ customer.status }}
                  </span>
                </td>
              </tr>

              <tr v-if="filteredCustomers.length === 0">
                <td colspan="8" class="px-5 py-12 text-center">
                  <UIcon name="i-lucide-users" class="mx-auto size-8 text-gray-400" />
                  <p class="mt-2 font-medium text-gray-700 dark:text-gray-200">
                    No customers found
                  </p>
                  <p class="mt-1 text-sm text-gray-500">Try changing your search or filters.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="flex flex-col justify-between gap-2 border-t border-gray-200 px-5 py-4 text-sm text-gray-500 sm:flex-row sm:items-center dark:border-gray-700"
        >
          <p>Showing {{ filteredCustomers.length }} of {{ customers.length }} customers</p>
          <p>
            Filtered outstanding:
            <span class="font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(filteredDue) }}
            </span>
          </p>
        </div>
      </section>
    </main>
  </Default>
</template>

<script setup>
import { computed, ref } from 'vue'
import Default from '@/layouts/Default.vue'

const search = ref('')
const selectedStatus = ref('')
const selectedBalance = ref('')

const customers = ref([
  {
    id: 1,
    code: 'CUS-1001',
    name: 'Rahim Ahmed',
    phone: '01712345678',
    email: 'rahim@example.com',
    city: 'Dhaka',
    orders: 24,
    totalPurchases: 85000,
    paid: 70000,
    due: 15000,
    status: 'Active',
    joinedAt: '2026-10-02',
  },
  {
    id: 2,
    code: 'CUS-1002',
    name: 'Karim Hossain',
    phone: '01812345678',
    email: 'karim@example.com',
    city: 'Chattogram',
    orders: 18,
    totalPurchases: 62000,
    paid: 62000,
    due: 0,
    status: 'Active',
    joinedAt: '2026-09-28',
  },
  {
    id: 3,
    code: 'CUS-1003',
    name: 'Nusrat Jahan',
    phone: '01912345678',
    email: 'nusrat@example.com',
    city: 'Dhaka',
    orders: 31,
    totalPurchases: 125000,
    paid: 100000,
    due: 25000,
    status: 'Active',
    joinedAt: '2026-10-05',
  },
  {
    id: 4,
    code: 'CUS-1004',
    name: 'Sabbir Islam',
    phone: '01612345678',
    email: 'sabbir@example.com',
    city: 'Sylhet',
    orders: 9,
    totalPurchases: 28500,
    paid: 20000,
    due: 8500,
    status: 'Inactive',
    joinedAt: '2026-08-15',
  },
  {
    id: 5,
    code: 'CUS-1005',
    name: 'Farzana Akter',
    phone: '01512345678',
    email: 'farzana@example.com',
    city: 'Rajshahi',
    orders: 15,
    totalPurchases: 48000,
    paid: 48000,
    due: 0,
    status: 'Active',
    joinedAt: '2026-10-08',
  },
  {
    id: 6,
    code: 'CUS-1006',
    name: 'Imran Chowdhury',
    phone: '01312345678',
    email: 'imran@example.com',
    city: 'Khulna',
    orders: 12,
    totalPurchases: 39000,
    paid: 30000,
    due: 9000,
    status: 'Active',
    joinedAt: '2026-07-20',
  },
  {
    id: 7,
    code: 'CUS-1007',
    name: 'Tania Sultana',
    phone: '01412345678',
    email: 'tania@example.com',
    city: 'Dhaka',
    orders: 7,
    totalPurchases: 19500,
    paid: 19500,
    due: 0,
    status: 'Inactive',
    joinedAt: '2026-06-10',
  },
])

const totalPurchases = computed(() =>
  customers.value.reduce((sum, customer) => sum + customer.totalPurchases, 0),
)

const totalPaid = computed(() => customers.value.reduce((sum, customer) => sum + customer.paid, 0))

const totalDue = computed(() => customers.value.reduce((sum, customer) => sum + customer.due, 0))

const activeCount = computed(
  () => customers.value.filter((customer) => customer.status === 'Active').length,
)

const inactiveCount = computed(
  () => customers.value.filter((customer) => customer.status === 'Inactive').length,
)

const customersWithDue = computed(
  () => customers.value.filter((customer) => customer.due > 0).length,
)

const newCustomers = computed(() => {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  return customers.value.filter((customer) => {
    const joined = new Date(`${customer.joinedAt}T00:00:00`)
    return joined >= monthStart && joined <= now
  }).length
})

const stats = computed(() => [
  {
    title: 'Total Customers',
    value: customers.value.length.toLocaleString(),
    description: 'All registered customers',
    icon: 'i-lucide-users',
    iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  },
  {
    title: 'New Customers',
    value: newCustomers.value.toLocaleString(),
    description: 'Joined this month',
    icon: 'i-lucide-user-plus',
    iconClass: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
  },
  {
    title: 'Outstanding Balance',
    value: formatCurrency(totalDue.value),
    description: 'Total customer dues',
    icon: 'i-lucide-wallet',
    iconClass: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
  },
  {
    title: 'Active Customers',
    value: activeCount.value.toLocaleString(),
    description: 'Currently active accounts',
    icon: 'i-lucide-user-check',
    iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  },
])

const topCustomers = computed(() =>
  [...customers.value].sort((a, b) => b.totalPurchases - a.totalPurchases).slice(0, 4),
)

const filteredCustomers = computed(() => {
  const query = search.value.trim().toLowerCase()

  return customers.value.filter((customer) => {
    const matchesSearch =
      !query ||
      customer.name.toLowerCase().includes(query) ||
      customer.code.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query) ||
      (customer.email || '').toLowerCase().includes(query) ||
      (customer.city || '').toLowerCase().includes(query)

    const matchesStatus = !selectedStatus.value || customer.status === selectedStatus.value

    const matchesBalance =
      !selectedBalance.value ||
      (selectedBalance.value === 'due' && customer.due > 0) ||
      (selectedBalance.value === 'clear' && customer.due === 0)

    return matchesSearch && matchesStatus && matchesBalance
  })
})

const filteredDue = computed(() =>
  filteredCustomers.value.reduce((sum, customer) => sum + customer.due, 0),
)

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 2,
  }).format(amount)
}

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function percentage(count) {
  if (!customers.value.length) return 0
  return Math.round((count / customers.value.length) * 100)
}

function topCustomerPercentage(amount) {
  const max = Math.max(...topCustomers.value.map((customer) => customer.totalPurchases), 0)
  if (!max) return 0
  return Math.round((amount / max) * 100)
}

function exportCSV() {
  const headers = [
    'Customer Code',
    'Customer Name',
    'Phone',
    'Email',
    'City',
    'Orders',
    'Total Purchases',
    'Paid',
    'Outstanding',
    'Status',
    'Joined Date',
  ]

  const rows = filteredCustomers.value.map((customer) => [
    customer.code,
    customer.name,
    customer.phone,
    customer.email || '',
    customer.city || '',
    customer.orders,
    customer.totalPurchases,
    customer.paid,
    customer.due,
    customer.status,
    customer.joinedAt,
  ])

  const escapeCSV = (value) => `"${String(value).replace(/"/g, '""')}"`

  const csv = [headers, ...rows].map((row) => row.map(escapeCSV).join(',')).join('\r\n')

  const blob = new Blob(['\uFEFF' + csv], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'customers-report.csv'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function printReport() {
  window.print()
}
</script>

<style>
@media print {
  body {
    background: white !important;
  }

  button,
  input,
  select {
    display: none !important;
  }

  main {
    padding: 0 !important;
  }

  section {
    break-inside: avoid;
  }
}
</style>
