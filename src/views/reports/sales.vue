<script setup>
import { computed, ref } from 'vue'
import Default from '@/layouts/Default.vue'

const today = new Date()
const endDate = ref(today.toISOString().slice(0, 10))
const startDate = ref(new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10))
const search = ref('')
const selectedStatus = ref('all')
const selectedPayment = ref('all')

const sales = ref([
  {
    id: 'INV-1025',
    date: '2026-10-11',
    customer: 'Rahim Ahmed',
    items: 4,
    subtotal: 5200,
    discount: 200,
    tax: 250,
    total: 5250,
    payment: 'Cash',
    status: 'Completed',
  },
  {
    id: 'INV-1024',
    date: '2026-10-11',
    customer: 'Nusrat Jahan',
    items: 3,
    subtotal: 3800,
    discount: 100,
    tax: 185,
    total: 3885,
    payment: 'Card',
    status: 'Completed',
  },
  {
    id: 'INV-1023',
    date: '2026-10-10',
    customer: 'Karim Hossain',
    items: 6,
    subtotal: 7500,
    discount: 500,
    tax: 350,
    total: 7350,
    payment: 'Mobile Banking',
    status: 'Completed',
  },
  {
    id: 'INV-1022',
    date: '2026-10-10',
    customer: 'Walk-in Customer',
    items: 2,
    subtotal: 1600,
    discount: 0,
    tax: 80,
    total: 1680,
    payment: 'Cash',
    status: 'Completed',
  },
  {
    id: 'INV-1021',
    date: '2026-10-09',
    customer: 'Sadia Islam',
    items: 5,
    subtotal: 6200,
    discount: 300,
    tax: 295,
    total: 6195,
    payment: 'Bank Transfer',
    status: 'Pending',
  },
  {
    id: 'INV-1020',
    date: '2026-10-08',
    customer: 'Tanvir Hasan',
    items: 2,
    subtotal: 2400,
    discount: 100,
    tax: 115,
    total: 2415,
    payment: 'Cash',
    status: 'Completed',
  },
  {
    id: 'INV-1019',
    date: '2026-10-07',
    customer: 'Mim Akter',
    items: 7,
    subtotal: 8900,
    discount: 400,
    tax: 425,
    total: 8925,
    payment: 'Mobile Banking',
    status: 'Refunded',
  },
  {
    id: 'INV-1018',
    date: '2026-10-05',
    customer: 'Imran Chowdhury',
    items: 3,
    subtotal: 4500,
    discount: 150,
    tax: 218,
    total: 4568,
    payment: 'Card',
    status: 'Completed',
  },
  {
    id: 'INV-1017',
    date: '2026-10-03',
    customer: 'Walk-in Customer',
    items: 1,
    subtotal: 900,
    discount: 0,
    tax: 45,
    total: 945,
    payment: 'Cash',
    status: 'Completed',
  },
])

const products = ref([
  { name: 'Wireless Headphones', sku: 'PRD-001', sold: 145, revenue: 217500 },
  { name: 'USB-C Cable', sku: 'PRD-002', sold: 132, revenue: 39600 },
  { name: 'Bluetooth Speaker', sku: 'PRD-003', sold: 98, revenue: 147000 },
  { name: 'Power Bank 20000mAh', sku: 'PRD-004', sold: 76, revenue: 152000 },
  { name: 'Wireless Mouse', sku: 'PRD-005', sold: 64, revenue: 51200 },
])

const paymentMethods = ref([
  { name: 'Cash', amount: 245000, color: 'bg-blue-500' },
  { name: 'Card', amount: 182000, color: 'bg-violet-500' },
  { name: 'Mobile Banking', amount: 156000, color: 'bg-emerald-500' },
  { name: 'Bank Transfer', amount: 92000, color: 'bg-amber-500' },
])

const trend = ref([
  { label: 'Mon', sales: 18500 },
  { label: 'Tue', sales: 24200 },
  { label: 'Wed', sales: 19800 },
  { label: 'Thu', sales: 31500 },
  { label: 'Fri', sales: 27800 },
  { label: 'Sat', sales: 36200 },
  { label: 'Sun', sales: 29400 },
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

const dateFilteredSales = computed(() =>
  sales.value.filter((sale) => {
    if (startDate.value && sale.date < startDate.value) return false
    if (endDate.value && sale.date > endDate.value) return false
    return true
  }),
)

const filteredSales = computed(() =>
  dateFilteredSales.value.filter((sale) => {
    const query = search.value.trim().toLowerCase()
    const matchesSearch =
      !query || sale.id.toLowerCase().includes(query) || sale.customer.toLowerCase().includes(query)

    const matchesStatus = selectedStatus.value === 'all' || sale.status === selectedStatus.value

    const matchesPayment = selectedPayment.value === 'all' || sale.payment === selectedPayment.value

    return matchesSearch && matchesStatus && matchesPayment
  }),
)

const completedSales = computed(() =>
  dateFilteredSales.value.filter((sale) => sale.status === 'Completed'),
)

const totalSales = computed(() => completedSales.value.reduce((sum, sale) => sum + sale.total, 0))

const totalOrders = computed(() => completedSales.value.length)

const totalItems = computed(() => completedSales.value.reduce((sum, sale) => sum + sale.items, 0))

const averageOrderValue = computed(() =>
  totalOrders.value ? totalSales.value / totalOrders.value : 0,
)

const totalDiscount = computed(() =>
  completedSales.value.reduce((sum, sale) => sum + sale.discount, 0),
)

const totalTax = computed(() => completedSales.value.reduce((sum, sale) => sum + sale.tax, 0))

const maxTrend = computed(() => Math.max(...trend.value.map((item) => item.sales), 1))

const totalPayments = computed(() =>
  paymentMethods.value.reduce((sum, method) => sum + method.amount, 0),
)

const statusClass = (status) => {
  if (status === 'Completed') {
    return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
  }
  if (status === 'Pending') {
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
    ['Sales Report'],
    ['From', startDate.value || 'All dates'],
    ['To', endDate.value || 'All dates'],
    [],
    [
      'Invoice',
      'Date',
      'Customer',
      'Items',
      'Subtotal',
      'Discount',
      'Tax',
      'Total',
      'Payment Method',
      'Status',
    ],
    ...filteredSales.value.map((sale) => [
      sale.id,
      sale.date,
      sale.customer,
      sale.items,
      sale.subtotal,
      sale.discount,
      sale.tax,
      sale.total,
      sale.payment,
      sale.status,
    ]),
    [],
    ['Completed Sales Total', totalSales.value],
    ['Completed Orders', totalOrders.value],
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
  link.download = 'sales-report.csv'
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
          <h1 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Sales Reports</h1>
          <p class="mt-1 text-sm text-gray-500">
            Monitor sales performance, orders and top-selling products.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="exportCsv"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            <UIcon name="i-lucide-download" class="h-4 w-4" />
            Export CSV
          </button>

          <button
            @click="printReport"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            <UIcon name="i-lucide-printer" class="h-4 w-4" />
            Print Report
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div
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
              Payment Method
            </label>
            <select
              v-model="selectedPayment"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="all">All Methods</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Mobile Banking">Mobile Banking</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Order Status
            </label>
            <select
              v-model="selectedStatus"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="all">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
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
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div class="rounded-lg bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-500/10">
              <UIcon name="i-lucide-banknote" class="h-5 w-5" />
            </div>
            <span class="text-xs font-medium text-emerald-600">Sales</span>
          </div>
          <p class="mt-4 text-sm text-gray-500">Total Sales</p>
          <h2 class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(totalSales) }}
          </h2>
          <p class="mt-2 text-xs text-gray-500">Completed orders only</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div class="rounded-lg bg-violet-50 p-2.5 text-violet-600 dark:bg-violet-500/10">
              <UIcon name="i-lucide-shopping-cart" class="h-5 w-5" />
            </div>
            <span class="text-xs font-medium text-violet-600">Orders</span>
          </div>
          <p class="mt-4 text-sm text-gray-500">Completed Orders</p>
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
              <UIcon name="i-lucide-receipt-text" class="h-5 w-5" />
            </div>
            <span class="text-xs font-medium text-amber-600">Average</span>
          </div>
          <p class="mt-4 text-sm text-gray-500">Average Order Value</p>
          <h2 class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(averageOrderValue) }}
          </h2>
          <p class="mt-2 text-xs text-gray-500">Sales divided by completed orders</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div class="rounded-lg bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-500/10">
              <UIcon name="i-lucide-package" class="h-5 w-5" />
            </div>
            <span class="text-xs font-medium text-emerald-600">Items</span>
          </div>
          <p class="mt-4 text-sm text-gray-500">Items Sold</p>
          <h2 class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {{ totalItems.toLocaleString() }}
          </h2>
          <p class="mt-2 text-xs text-gray-500">Across completed orders</p>
        </div>
      </div>

      <!-- Sales Trend and Payment Methods -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 xl:col-span-2"
        >
          <div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Sales Trend</h3>
              <p class="mt-1 text-sm text-gray-500">Daily sales performance</p>
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
                {{ formatCurrency(item.sales) }}
              </span>
              <div class="flex h-full w-full items-end justify-center">
                <div
                  class="w-full max-w-12 rounded-t-md bg-blue-500 transition-all hover:bg-blue-600"
                  :style="{ height: `${(item.sales / maxTrend) * 100}%` }"
                  :title="`${item.label}: ${formatCurrency(item.sales)}`"
                ></div>
              </div>
              <span class="text-xs text-gray-500">{{ item.label }}</span>
            </div>
          </div>
        </section>

        <section
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Payment Methods</h3>
            <p class="mt-1 text-sm text-gray-500">Sales by payment type</p>
          </div>

          <div class="mt-6 space-y-5">
            <div v-for="method in paymentMethods" :key="method.name">
              <div class="mb-2 flex items-center justify-between gap-2 text-sm">
                <span class="text-gray-600 dark:text-gray-300">
                  {{ method.name }}
                </span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(method.amount) }}
                </span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  class="h-full rounded-full"
                  :class="method.color"
                  :style="{ width: `${(method.amount / totalPayments) * 100}%` }"
                ></div>
              </div>
              <p class="mt-1 text-right text-xs text-gray-400">
                {{ ((method.amount / totalPayments) * 100).toFixed(1) }}%
              </p>
            </div>
          </div>
        </section>
      </div>

      <!-- Top Products -->
      <section
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="border-b border-gray-100 p-5 dark:border-gray-800">
          <h3 class="font-semibold text-gray-900 dark:text-white">Top-Selling Products</h3>
          <p class="mt-1 text-sm text-gray-500">Best-performing products by quantity sold</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/60">
              <tr>
                <th class="px-5 py-3 font-medium">#</th>
                <th class="px-5 py-3 font-medium">Product</th>
                <th class="px-5 py-3 font-medium">SKU</th>
                <th class="px-5 py-3 text-right font-medium">Qty Sold</th>
                <th class="px-5 py-3 text-right font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="(product, index) in products"
                :key="product.sku"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/40"
              >
                <td class="px-5 py-4 text-gray-500">{{ index + 1 }}</td>
                <td class="px-5 py-4 font-medium text-gray-900 dark:text-white">
                  {{ product.name }}
                </td>
                <td class="px-5 py-4 text-gray-500">{{ product.sku }}</td>
                <td class="px-5 py-4 text-right font-medium text-gray-700 dark:text-gray-200">
                  {{ product.sold.toLocaleString() }}
                </td>
                <td class="px-5 py-4 text-right font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(product.revenue) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Sales Transactions -->
      <section
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center dark:border-gray-800"
        >
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Sales Transactions</h3>
            <p class="mt-1 text-sm text-gray-500">Review invoices within the selected date range</p>
          </div>

          <div class="relative w-full sm:w-72">
            <UIcon
              name="i-lucide-search"
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            />
            <input
              v-model="search"
              type="text"
              placeholder="Search invoice or customer..."
              class="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/60">
              <tr>
                <th class="px-5 py-3 font-medium">Invoice</th>
                <th class="px-5 py-3 font-medium">Date</th>
                <th class="px-5 py-3 font-medium">Customer</th>
                <th class="px-5 py-3 text-right font-medium">Items</th>
                <th class="px-5 py-3 text-right font-medium">Discount</th>
                <th class="px-5 py-3 font-medium">Payment</th>
                <th class="px-5 py-3 text-right font-medium">Total</th>
                <th class="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="sale in filteredSales"
                :key="sale.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/40"
              >
                <td class="whitespace-nowrap px-5 py-4 font-medium text-primary">
                  {{ sale.id }}
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-gray-500">
                  {{ formatDate(sale.date) }}
                </td>
                <td class="px-5 py-4 text-gray-700 dark:text-gray-200">
                  {{ sale.customer }}
                </td>
                <td class="px-5 py-4 text-right text-gray-600 dark:text-gray-300">
                  {{ sale.items }}
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-right text-gray-600 dark:text-gray-300">
                  {{ formatCurrency(sale.discount) }}
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-gray-300">
                  {{ sale.payment }}
                </td>
                <td
                  class="whitespace-nowrap px-5 py-4 text-right font-semibold text-gray-900 dark:text-white"
                >
                  {{ formatCurrency(sale.total) }}
                </td>
                <td class="px-5 py-4">
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="statusClass(sale.status)"
                  >
                    {{ sale.status }}
                  </span>
                </td>
              </tr>

              <tr v-if="filteredSales.length === 0">
                <td colspan="8" class="px-5 py-12 text-center">
                  <UIcon name="i-lucide-file-search" class="mx-auto h-8 w-8 text-gray-400" />
                  <p class="mt-2 font-medium text-gray-700 dark:text-gray-200">No sales found</p>
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
            Showing {{ filteredSales.length }} of {{ dateFilteredSales.length }} invoices
          </span>
          <span class="text-sm font-semibold text-gray-900 dark:text-white">
            Completed Sales: {{ formatCurrency(totalSales) }}
          </span>
        </div>
      </section>

      <!-- Report Summary -->
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
          <p class="text-sm text-gray-500">Tax Collected</p>
          <p class="mt-2 text-xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(totalTax) }}
          </p>
        </div>
        <div
          class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
        >
          <p class="text-sm text-gray-500">Items Sold</p>
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
            This page currently uses sample data. The sales table responds to date, payment, status
            and search filters. Trend, payment breakdown and top products are demo figures and
            should be loaded from your Laravel API for accurate reporting.
          </p>
        </div>
      </div>
    </main>
  </Default>
</template>
