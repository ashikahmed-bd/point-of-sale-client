<template>
  <Default>
    <main class="space-y-6 p-4">
      <!-- Header -->
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Suppliers Reports</h1>
          <p class="mt-1 text-sm text-gray-500">
            Monitor supplier purchases, payment history and outstanding payables.
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

      <!-- Supplier Insights -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <!-- Supplier Overview -->
        <section
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
        >
          <h2 class="font-semibold text-gray-900 dark:text-white">Supplier Overview</h2>
          <p class="mt-1 text-sm text-gray-500">Account status and payable summary</p>

          <div class="mt-6 space-y-5">
            <div>
              <div class="mb-2 flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-300">Active Suppliers</span>
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
                <span class="text-gray-600 dark:text-gray-300">Inactive Suppliers</span>
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
                <span class="text-gray-600 dark:text-gray-300">Suppliers With Due</span>
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ suppliersWithDue }}
                </span>
              </div>
              <div class="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <div
                  class="h-full rounded-full bg-amber-500"
                  :style="{ width: percentage(suppliersWithDue) + '%' }"
                />
              </div>
            </div>
          </div>

          <div class="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
            <div class="flex items-start gap-2">
              <UIcon name="i-lucide-info" class="mt-0.5 size-4 shrink-0 text-primary" />
              <p class="text-sm text-gray-600 dark:text-gray-300">
                {{ suppliersWithDue }} suppliers have pending payments.
              </p>
            </div>
          </div>
        </section>

        <!-- Top Suppliers -->
        <section
          class="rounded-xl border border-gray-200 bg-white p-5 xl:col-span-2 dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Top Suppliers</h2>
              <p class="mt-1 text-sm text-gray-500">Ranked by total purchase value</p>
            </div>
            <UIcon name="i-lucide-trophy" class="size-5 text-amber-500" />
          </div>

          <div class="space-y-5">
            <div
              v-for="(supplier, index) in topSuppliers"
              :key="supplier.id"
              class="flex items-center gap-3"
            >
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
              >
                {{ initials(supplier.name) }}
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {{ supplier.name }}
                    </p>
                    <p class="mt-1 text-xs text-gray-500">
                      {{ supplier.purchases }} purchase orders
                    </p>
                  </div>

                  <p class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ formatCurrency(supplier.totalPurchases) }}
                  </p>
                </div>

                <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                  <div
                    class="h-full rounded-full bg-primary"
                    :style="{ width: topSupplierPercentage(supplier.totalPurchases) + '%' }"
                  />
                </div>
              </div>

              <span class="text-xs text-gray-400">#{{ index + 1 }}</span>
            </div>

            <div v-if="topSuppliers.length === 0" class="py-8 text-center text-sm text-gray-500">
              No supplier data available.
            </div>
          </div>
        </section>
      </div>

      <!-- Supplier Table -->
      <section
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
      >
        <div
          class="flex flex-col justify-between gap-4 border-b border-gray-200 p-5 lg:flex-row lg:items-center dark:border-gray-700"
        >
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Supplier Details</h2>
            <p class="mt-1 text-sm text-gray-500">Supplier-wise purchase and payment report</p>
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
                placeholder="Search suppliers..."
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
              <option value="due">Has Payable</option>
              <option value="clear">Fully Paid</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[1000px] text-left text-sm">
            <thead class="bg-gray-50 dark:bg-gray-900/50">
              <tr class="text-xs uppercase tracking-wide text-gray-500">
                <th class="px-5 py-4 font-medium">Supplier</th>
                <th class="px-5 py-4 font-medium">Contact</th>
                <th class="px-5 py-4 font-medium">City</th>
                <th class="px-5 py-4 text-right font-medium">Purchases</th>
                <th class="px-5 py-4 text-right font-medium">Purchase Value</th>
                <th class="px-5 py-4 text-right font-medium">Paid</th>
                <th class="px-5 py-4 text-right font-medium">Payable</th>
                <th class="px-5 py-4 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="supplier in filteredSuppliers"
                :key="supplier.id"
                class="border-b border-gray-100 last:border-0 hover:bg-gray-50/70 dark:border-gray-700 dark:hover:bg-gray-700/20"
              >
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    >
                      {{ initials(supplier.name) }}
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ supplier.name }}
                      </p>
                      <p class="mt-1 text-xs text-gray-500">
                        {{ supplier.code }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="px-5 py-4">
                  <p class="text-gray-700 dark:text-gray-200">
                    {{ supplier.phone }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500">
                    {{ supplier.email || '—' }}
                  </p>
                </td>

                <td class="px-5 py-4 text-gray-600 dark:text-gray-300">
                  {{ supplier.city || '—' }}
                </td>

                <td class="px-5 py-4 text-right text-gray-600 dark:text-gray-300">
                  {{ supplier.purchases }}
                </td>

                <td class="px-5 py-4 text-right font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(supplier.totalPurchases) }}
                </td>

                <td class="px-5 py-4 text-right text-emerald-600 dark:text-emerald-400">
                  {{ formatCurrency(supplier.paid) }}
                </td>

                <td
                  class="px-5 py-4 text-right font-medium"
                  :class="
                    supplier.payable > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-500'
                  "
                >
                  {{ formatCurrency(supplier.payable) }}
                </td>

                <td class="px-5 py-4">
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="
                      supplier.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    "
                  >
                    {{ supplier.status }}
                  </span>
                </td>
              </tr>

              <tr v-if="filteredSuppliers.length === 0">
                <td colspan="8" class="px-5 py-12 text-center">
                  <UIcon name="i-lucide-truck" class="mx-auto size-8 text-gray-400" />
                  <p class="mt-2 font-medium text-gray-700 dark:text-gray-200">
                    No suppliers found
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
          <p>Showing {{ filteredSuppliers.length }} of {{ suppliers.length }} suppliers</p>
          <p>
            Filtered payables:
            <span class="font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(filteredPayables) }}
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

const suppliers = ref([
  {
    id: 1,
    code: 'SUP-1001',
    name: 'Rahman Trading',
    phone: '01712345678',
    email: 'rahman@example.com',
    city: 'Dhaka',
    purchases: 32,
    totalPurchases: 185000,
    paid: 150000,
    payable: 35000,
    status: 'Active',
  },
  {
    id: 2,
    code: 'SUP-1002',
    name: 'Global Electronics',
    phone: '01812345678',
    email: 'global@example.com',
    city: 'Chattogram',
    purchases: 24,
    totalPurchases: 320000,
    paid: 300000,
    payable: 20000,
    status: 'Active',
  },
  {
    id: 3,
    code: 'SUP-1003',
    name: 'Tech Source BD',
    phone: '01912345678',
    email: 'techsource@example.com',
    city: 'Dhaka',
    purchases: 41,
    totalPurchases: 450000,
    paid: 390000,
    payable: 60000,
    status: 'Active',
  },
  {
    id: 4,
    code: 'SUP-1004',
    name: 'Modern Accessories',
    phone: '01612345678',
    email: 'modern@example.com',
    city: 'Sylhet',
    purchases: 15,
    totalPurchases: 95000,
    paid: 95000,
    payable: 0,
    status: 'Inactive',
  },
  {
    id: 5,
    code: 'SUP-1005',
    name: 'National Wholesale',
    phone: '01512345678',
    email: 'national@example.com',
    city: 'Rajshahi',
    purchases: 19,
    totalPurchases: 210000,
    paid: 180000,
    payable: 30000,
    status: 'Active',
  },
  {
    id: 6,
    code: 'SUP-1006',
    name: 'Smart Devices Ltd',
    phone: '01312345678',
    email: 'smart@example.com',
    city: 'Khulna',
    purchases: 12,
    totalPurchases: 165000,
    paid: 135000,
    payable: 30000,
    status: 'Active',
  },
  {
    id: 7,
    code: 'SUP-1007',
    name: 'City Packaging',
    phone: '01412345678',
    email: 'city@example.com',
    city: 'Dhaka',
    purchases: 8,
    totalPurchases: 42000,
    paid: 42000,
    payable: 0,
    status: 'Inactive',
  },
])

const totalPurchases = computed(() =>
  suppliers.value.reduce((sum, supplier) => sum + supplier.totalPurchases, 0),
)

const totalPaid = computed(() => suppliers.value.reduce((sum, supplier) => sum + supplier.paid, 0))

const totalPayables = computed(() =>
  suppliers.value.reduce((sum, supplier) => sum + supplier.payable, 0),
)

const activeCount = computed(
  () => suppliers.value.filter((supplier) => supplier.status === 'Active').length,
)

const inactiveCount = computed(
  () => suppliers.value.filter((supplier) => supplier.status === 'Inactive').length,
)

const suppliersWithDue = computed(
  () => suppliers.value.filter((supplier) => supplier.payable > 0).length,
)

const stats = computed(() => [
  {
    title: 'Total Suppliers',
    value: suppliers.value.length.toLocaleString(),
    description: 'All registered suppliers',
    icon: 'i-lucide-truck',
    iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  },
  {
    title: 'Total Purchases',
    value: formatCurrency(totalPurchases.value),
    description: 'Total supplier purchase value',
    icon: 'i-lucide-shopping-cart',
    iconClass: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
  },
  {
    title: 'Outstanding Payables',
    value: formatCurrency(totalPayables.value),
    description: 'Amount owed to suppliers',
    icon: 'i-lucide-wallet',
    iconClass: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
  },
  {
    title: 'Active Suppliers',
    value: activeCount.value.toLocaleString(),
    description: 'Currently active accounts',
    icon: 'i-lucide-user-check',
    iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  },
])

const topSuppliers = computed(() =>
  [...suppliers.value].sort((a, b) => b.totalPurchases - a.totalPurchases).slice(0, 4),
)

const filteredSuppliers = computed(() => {
  const query = search.value.trim().toLowerCase()

  return suppliers.value.filter((supplier) => {
    const matchesSearch =
      !query ||
      supplier.name.toLowerCase().includes(query) ||
      supplier.code.toLowerCase().includes(query) ||
      supplier.phone.toLowerCase().includes(query) ||
      (supplier.email || '').toLowerCase().includes(query) ||
      (supplier.city || '').toLowerCase().includes(query)

    const matchesStatus = !selectedStatus.value || supplier.status === selectedStatus.value

    const matchesBalance =
      !selectedBalance.value ||
      (selectedBalance.value === 'due' && supplier.payable > 0) ||
      (selectedBalance.value === 'clear' && supplier.payable === 0)

    return matchesSearch && matchesStatus && matchesBalance
  })
})

const filteredPayables = computed(() =>
  filteredSuppliers.value.reduce((sum, supplier) => sum + supplier.payable, 0),
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
  if (!suppliers.value.length) return 0
  return Math.round((count / suppliers.value.length) * 100)
}

function topSupplierPercentage(amount) {
  const max = Math.max(...topSuppliers.value.map((supplier) => supplier.totalPurchases), 0)

  if (!max) return 0
  return Math.round((amount / max) * 100)
}

function exportCSV() {
  const headers = [
    'Supplier Code',
    'Supplier Name',
    'Phone',
    'Email',
    'City',
    'Purchase Orders',
    'Total Purchases',
    'Paid',
    'Outstanding Payable',
    'Status',
  ]

  const rows = filteredSuppliers.value.map((supplier) => [
    supplier.code,
    supplier.name,
    supplier.phone,
    supplier.email || '',
    supplier.city || '',
    supplier.purchases,
    supplier.totalPurchases,
    supplier.paid,
    supplier.payable,
    supplier.status,
  ])

  const escapeCSV = (value) => `"${String(value).replace(/"/g, '""')}"`

  const csv = [headers, ...rows].map((row) => row.map(escapeCSV).join(',')).join('\r\n')

  const blob = new Blob(['\uFEFF' + csv], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'suppliers-report.csv'
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
