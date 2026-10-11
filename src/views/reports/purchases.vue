<script setup>
import { computed, ref } from 'vue'
import Default from '@/layouts/Default.vue'

const today = new Date()
const endDate = ref(today.toISOString().slice(0, 10))
const startDate = ref(new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10))

const search = ref('')
const selectedStatus = ref('all')
const selectedPayment = ref('all')

const purchases = ref([
  {
    id: 'PUR-1025',
    date: '2026-10-11',
    supplier: 'Rahman Trading',
    items: 12,
    subtotal: 45000,
    discount: 2000,
    tax: 2150,
    total: 45150,
    payment: 'Paid',
    status: 'Received',
  },
  {
    id: 'PUR-1024',
    date: '2026-10-11',
    supplier: 'Dhaka Electronics',
    items: 8,
    subtotal: 32000,
    discount: 1000,
    tax: 1550,
    total: 32550,
    payment: 'Partial',
    status: 'Received',
  },
  {
    id: 'PUR-1023',
    date: '2026-10-10',
    supplier: 'Global Imports',
    items: 15,
    subtotal: 68000,
    discount: 3000,
    tax: 3250,
    total: 68250,
    payment: 'Unpaid',
    status: 'Pending',
  },
  {
    id: 'PUR-1022',
    date: '2026-10-09',
    supplier: 'Rahman Trading',
    items: 6,
    subtotal: 18000,
    discount: 500,
    tax: 875,
    total: 18375,
    payment: 'Paid',
    status: 'Received',
  },
  {
    id: 'PUR-1021',
    date: '2026-10-08',
    supplier: 'Tech World BD',
    items: 10,
    subtotal: 54000,
    discount: 2500,
    tax: 2575,
    total: 54075,
    payment: 'Partial',
    status: 'Received',
  },
  {
    id: 'PUR-1020',
    date: '2026-10-06',
    supplier: 'Dhaka Electronics',
    items: 7,
    subtotal: 26500,
    discount: 500,
    tax: 1300,
    total: 27300,
    payment: 'Paid',
    status: 'Received',
  },
  {
    id: 'PUR-1019',
    date: '2026-10-04',
    supplier: 'Global Imports',
    items: 9,
    subtotal: 39000,
    discount: 1500,
    tax: 1875,
    total: 39375,
    payment: 'Unpaid',
    status: 'Cancelled',
  },
])

const trend = ref([
  { label: 'Mon', amount: 32000 },
  { label: 'Tue', amount: 45000 },
  { label: 'Wed', amount: 28500 },
  { label: 'Thu', amount: 61000 },
  { label: 'Fri', amount: 48000 },
  { label: 'Sat', amount: 72000 },
  { label: 'Sun', amount: 54000 },
])

const suppliers = ref([
  { name: 'Rahman Trading', purchases: 18, amount: 285000 },
  { name: 'Dhaka Electronics', purchases: 14, amount: 235000 },
  { name: 'Global Imports', purchases: 11, amount: 198000 },
  { name: 'Tech World BD', purchases: 9, amount: 165000 },
  { name: 'ABC Wholesale', purchases: 7, amount: 122000 },
])

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(amount)

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

const dateFilteredPurchases = computed(() =>
  purchases.value.filter((purchase) => {
    if (startDate.value && purchase.date < startDate.value) return false
    if (endDate.value && purchase.date > endDate.value) return false
    return true
  }),
)

const filteredPurchases = computed(() =>
  dateFilteredPurchases.value.filter((purchase) => {
    const query = search.value.trim().toLowerCase()

    const matchesSearch =
      !query ||
      purchase.id.toLowerCase().includes(query) ||
      purchase.supplier.toLowerCase().includes(query)

    const matchesStatus = selectedStatus.value === 'all' || purchase.status === selectedStatus.value

    const matchesPayment =
      selectedPayment.value === 'all' || purchase.payment === selectedPayment.value

    return matchesSearch && matchesStatus && matchesPayment
  }),
)

const validPurchases = computed(() =>
  dateFilteredPurchases.value.filter((purchase) => purchase.status !== 'Cancelled'),
)

const totalPurchases = computed(() =>
  validPurchases.value.reduce((sum, purchase) => sum + purchase.total, 0),
)

const totalOrders = computed(() => validPurchases.value.length)

const totalItems = computed(() =>
  validPurchases.value.reduce((sum, purchase) => sum + purchase.items, 0),
)

const averagePurchase = computed(() =>
  totalOrders.value ? totalPurchases.value / totalOrders.value : 0,
)

const totalDiscount = computed(() =>
  validPurchases.value.reduce((sum, purchase) => sum + purchase.discount, 0),
)

const totalTax = computed(() =>
  validPurchases.value.reduce((sum, purchase) => sum + purchase.tax, 0),
)

const unpaidAmount = computed(() =>
  validPurchases.value.reduce((sum, purchase) => {
    if (purchase.payment === 'Unpaid') return sum + purchase.total
    if (purchase.payment === 'Partial') return sum + purchase.total * 0.5
    return sum
  }, 0),
)

const maxTrend = computed(() => Math.max(...trend.value.map((item) => item.amount), 1))

const statusClass = (status) => {
  if (status === 'Received') {
    return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
  }

  if (status === 'Pending') {
    return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
  }

  return 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
}

const paymentClass = (status) => {
  if (status === 'Paid') {
    return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
  }

  if (status === 'Partial') {
    return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
  }

  return 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
}

const resetFilters = () => {
  startDate.value = ''
  endDate.value = ''
  search.value = ''
  selectedStatus.value = 'all'
  selectedPayment.value = 'all'
}

const exportCsv = () => {
  const rows = [
    ['Purchases Report'],
    ['From', startDate.value || 'All dates'],
    ['To', endDate.value || 'All dates'],
    [],
    [
      'Purchase No.',
      'Date',
      'Supplier',
      'Items',
      'Subtotal',
      'Discount',
      'Tax',
      'Total',
      'Payment Status',
      'Purchase Status',
    ],
    ...filteredPurchases.value.map((purchase) => [
      purchase.id,
      purchase.date,
      purchase.supplier,
      purchase.items,
      purchase.subtotal,
      purchase.discount,
      purchase.tax,
      purchase.total,
      purchase.payment,
      purchase.status,
    ]),
    [],
    ['Total Purchases', totalPurchases.value],
    ['Purchase Orders', totalOrders.value],
    ['Total Discounts', totalDiscount.value],
    ['Total Tax', totalTax.value],
  ]

  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob(['\uFEFF' + csv], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'purchases-report.csv'
  link.click()
  URL.revokeObjectURL(url)
}

const printReport = () => window.print()
</script>

<template>
  <Default>
    <main class="space-y-4 p-4">
      <!-- Header -->
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Purchases Reports</h1>
          <p class="mt-1 text-sm text-gray-500">
            Monitor purchase performance, suppliers and outstanding payments.
          </p>
        </div>

        <div class="flex shrink-0 flex-wrap items-center gap-2">
          <button
            @click="exportCsv"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            <UIcon name="i-lucide-download" class="h-4 w-4" />
            Export
          </button>

          <button
            @click="printReport"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            <UIcon name="i-lucide-printer" class="h-4 w-4" />
            Print
          </button>
        </div>
      </div>

      <!-- Filters -->
      <section
        class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Date
            </label>
            <input
              v-model="startDate"
              type="date"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              End Date
            </label>
            <input
              v-model="endDate"
              type="date"
              :min="startDate || undefined"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Payment Status
            </label>
            <select
              v-model="selectedPayment"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="all">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Purchase Status
            </label>
            <select
              v-model="selectedStatus"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="all">All Statuses</option>
              <option value="Received">Received</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div class="flex items-end">
            <button
              @click="resetFilters"
              class="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <UIcon name="i-lucide-rotate-ccw" class="h-4 w-4" />
              Reset Filters
            </button>
          </div>
        </div>
      </section>

      <!-- Summary Cards -->
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div class="rounded-lg bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-500/10">
              <UIcon name="i-lucide-shopping-bag" class="h-5 w-5" />
            </div>
            <span class="text-xs font-medium text-blue-600">Purchases</span>
          </div>
          <p class="mt-4 text-sm text-gray-500">Total Purchases</p>
          <h2 class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(totalPurchases) }}
          </h2>
          <p class="mt-2 text-xs text-gray-500">Excluding cancelled orders</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div class="rounded-lg bg-violet-50 p-2.5 text-violet-600 dark:bg-violet-500/10">
              <UIcon name="i-lucide-clipboard-list" class="h-5 w-5" />
            </div>
            <span class="text-xs font-medium text-violet-600">Orders</span>
          </div>
          <p class="mt-4 text-sm text-gray-500">Purchase Orders</p>
          <h2 class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {{ totalOrders.toLocaleString() }}
          </h2>
          <p class="mt-2 text-xs text-gray-500">Within selected date range</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div class="rounded-lg bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-500/10">
              <UIcon name="i-lucide-wallet" class="h-5 w-5" />
            </div>
            <span class="text-xs font-medium text-amber-600">Average</span>
          </div>
          <p class="mt-4 text-sm text-gray-500">Average Purchase</p>
          <h2 class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(averagePurchase) }}
          </h2>
          <p class="mt-2 text-xs text-gray-500">Per valid purchase order</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div class="rounded-lg bg-red-50 p-2.5 text-red-600 dark:bg-red-500/10">
              <UIcon name="i-lucide-clock" class="h-5 w-5" />
            </div>
            <span class="text-xs font-medium text-red-600">Outstanding</span>
          </div>
          <p class="mt-4 text-sm text-gray-500">Estimated Unpaid Amount</p>
          <h2 class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(unpaidAmount) }}
          </h2>
          <p class="mt-2 text-xs text-gray-500">Demo estimate; use actual payment balances</p>
        </div>
      </section>

      <!-- Purchase Trend -->
      <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 xl:col-span-2"
        >
          <div class="flex items-center justify-between gap-3">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Purchase Trend</h3>
              <p class="mt-1 text-sm text-gray-500">Daily purchase amount</p>
            </div>
            <span class="text-xs text-gray-500">Demo weekly data</span>
          </div>

          <div
            class="mt-6 flex h-56 items-end justify-around gap-3 border-b border-gray-100 pb-2 dark:border-gray-800"
          >
            <div
              v-for="item in trend"
              :key="item.label"
              class="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <span class="text-[10px] text-gray-500 sm:text-xs">
                {{ formatCurrency(item.amount) }}
              </span>
              <div class="flex h-full w-full items-end justify-center">
                <div
                  class="w-full max-w-12 rounded-t-md bg-violet-500 transition-all hover:bg-violet-600"
                  :style="{ height: `${(item.amount / maxTrend) * 100}%` }"
                  :title="`${item.label}: ${formatCurrency(item.amount)}`"
                ></div>
              </div>
              <span class="text-xs text-gray-500">{{ item.label }}</span>
            </div>
          </div>
        </section>

        <!-- Purchase Summary -->
        <section
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <h3 class="font-semibold text-gray-900 dark:text-white">Purchase Summary</h3>
          <p class="mt-1 text-sm text-gray-500">Cost overview for the selected period</p>

          <div class="mt-6 space-y-5">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full bg-violet-500"></span>
                <span class="text-sm text-gray-600 dark:text-gray-300"> Purchase Amount </span>
              </div>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ formatCurrency(totalPurchases) }}
              </span>
            </div>

            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                <span class="text-sm text-gray-600 dark:text-gray-300"> Discounts </span>
              </div>
              <span class="text-sm font-semibold text-emerald-600">
                {{ formatCurrency(totalDiscount) }}
              </span>
            </div>

            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                <span class="text-sm text-gray-600 dark:text-gray-300"> Tax </span>
              </div>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ formatCurrency(totalTax) }}
              </span>
            </div>

            <div class="border-t border-gray-100 pt-4 dark:border-gray-800">
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm text-gray-500">Items Purchased</span>
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ totalItems.toLocaleString() }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Top Suppliers -->
      <section
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="border-b border-gray-100 p-5 dark:border-gray-800">
          <h3 class="font-semibold text-gray-900 dark:text-white">Top Suppliers</h3>
          <p class="mt-1 text-sm text-gray-500">Suppliers ranked by purchase amount</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/60">
              <tr>
                <th class="px-5 py-3 font-medium">#</th>
                <th class="px-5 py-3 font-medium">Supplier</th>
                <th class="px-5 py-3 text-right font-medium">Orders</th>
                <th class="px-5 py-3 text-right font-medium">Purchase Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="(supplier, index) in suppliers"
                :key="supplier.name"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/40"
              >
                <td class="px-5 py-4 text-gray-500">{{ index + 1 }}</td>
                <td class="px-5 py-4 font-medium text-gray-900 dark:text-white">
                  {{ supplier.name }}
                </td>
                <td class="px-5 py-4 text-right text-gray-600 dark:text-gray-300">
                  {{ supplier.purchases }}
                </td>
                <td class="px-5 py-4 text-right font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(supplier.amount) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Purchase Transactions -->
      <section
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center dark:border-gray-800"
        >
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Purchase Transactions</h3>
            <p class="mt-1 text-sm text-gray-500">Review purchase orders and supplier payments</p>
          </div>

          <div class="relative w-full sm:w-72">
            <UIcon
              name="i-lucide-search"
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            />
            <input
              v-model="search"
              type="text"
              placeholder="Search purchase or supplier..."
              class="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/60">
              <tr>
                <th class="px-5 py-3 font-medium">Purchase No.</th>
                <th class="px-5 py-3 font-medium">Date</th>
                <th class="px-5 py-3 font-medium">Supplier</th>
                <th class="px-5 py-3 text-right font-medium">Items</th>
                <th class="px-5 py-3 text-right font-medium">Discount</th>
                <th class="px-5 py-3 text-right font-medium">Total</th>
                <th class="px-5 py-3 font-medium">Payment</th>
                <th class="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="purchase in filteredPurchases"
                :key="purchase.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/40"
              >
                <td class="whitespace-nowrap px-5 py-4 font-medium text-primary">
                  {{ purchase.id }}
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-gray-500">
                  {{ formatDate(purchase.date) }}
                </td>
                <td class="px-5 py-4 font-medium text-gray-700 dark:text-gray-200">
                  {{ purchase.supplier }}
                </td>
                <td class="px-5 py-4 text-right text-gray-600 dark:text-gray-300">
                  {{ purchase.items }}
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-right text-gray-600 dark:text-gray-300">
                  {{ formatCurrency(purchase.discount) }}
                </td>
                <td
                  class="whitespace-nowrap px-5 py-4 text-right font-semibold text-gray-900 dark:text-white"
                >
                  {{ formatCurrency(purchase.total) }}
                </td>
                <td class="px-5 py-4">
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="paymentClass(purchase.payment)"
                  >
                    {{ purchase.payment }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="statusClass(purchase.status)"
                  >
                    {{ purchase.status }}
                  </span>
                </td>
              </tr>

              <tr v-if="filteredPurchases.length === 0">
                <td colspan="8" class="px-5 py-12 text-center">
                  <UIcon name="i-lucide-file-search" class="mx-auto h-8 w-8 text-gray-400" />
                  <p class="mt-2 font-medium text-gray-700 dark:text-gray-200">
                    No purchases found
                  </p>
                  <p class="mt-1 text-sm text-gray-500">Try changing the date range or filters.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="flex flex-col justify-between gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800"
        >
          <span class="text-sm text-gray-500">
            Showing {{ filteredPurchases.length }} of {{ dateFilteredPurchases.length }} purchases
          </span>
          <span class="text-sm font-semibold text-gray-900 dark:text-white">
            Total Purchases: {{ formatCurrency(totalPurchases) }}
          </span>
        </div>
      </section>

      <!-- Footer Summary -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
        >
          <p class="text-sm text-gray-500">Total Discounts</p>
          <p class="mt-2 text-xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(totalDiscount) }}
          </p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
        >
          <p class="text-sm text-gray-500">Total Tax</p>
          <p class="mt-2 text-xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(totalTax) }}
          </p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
        >
          <p class="text-sm text-gray-500">Items Purchased</p>
          <p class="mt-2 text-xl font-bold text-gray-900 dark:text-white">
            {{ totalItems.toLocaleString() }}
          </p>
        </div>
      </div>

      <!-- Notice -->
      <div
        class="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-500/5"
      >
        <UIcon name="i-lucide-info" class="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        <div>
          <p class="text-sm font-medium text-blue-900 dark:text-blue-300">Report Information</p>
          <p class="mt-1 text-sm text-blue-800/80 dark:text-blue-200/70">
            This page currently uses sample data. Connect it to your Laravel purchases, purchase
            items, suppliers and payment records for accurate reporting. The outstanding amount is
            only an estimate in this demo and should be calculated from actual payments.
          </p>
        </div>
      </div>
    </main>
  </Default>
</template>
