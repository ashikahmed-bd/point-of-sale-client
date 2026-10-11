<script setup>
import { computed, ref } from 'vue'
import Default from '@/layouts/Default.vue'

const period = ref('This Month')
const startDate = ref('')
const endDate = ref('')
const search = ref('')
const selectedType = ref('All')

const transactions = ref([
  {
    id: 1,
    date: '2026-10-11',
    reference: 'CF-0001',
    description: 'Sales collection',
    category: 'Sales Revenue',
    type: 'Inflow',
    method: 'Cash',
    amount: 45000,
  },
  {
    id: 2,
    date: '2026-10-10',
    reference: 'CF-0002',
    description: 'Supplier payment',
    category: 'Supplier Payment',
    type: 'Outflow',
    method: 'Bank Transfer',
    amount: 25000,
  },
  {
    id: 3,
    date: '2026-10-09',
    reference: 'CF-0003',
    description: 'Customer due collection',
    category: 'Accounts Receivable',
    type: 'Inflow',
    method: 'Bank Transfer',
    amount: 32000,
  },
  {
    id: 4,
    date: '2026-10-08',
    reference: 'CF-0004',
    description: 'Office rent payment',
    category: 'Rent Expense',
    type: 'Outflow',
    method: 'Bank Transfer',
    amount: 18000,
  },
  {
    id: 5,
    date: '2026-10-07',
    reference: 'CF-0005',
    description: 'Owner capital deposit',
    category: 'Capital',
    type: 'Inflow',
    method: 'Bank Transfer',
    amount: 100000,
  },
  {
    id: 6,
    date: '2026-10-06',
    reference: 'CF-0006',
    description: 'Utility bill payment',
    category: 'Utilities',
    type: 'Outflow',
    method: 'Cash',
    amount: 6500,
  },
  {
    id: 7,
    date: '2026-10-05',
    reference: 'CF-0007',
    description: 'Equipment purchase',
    category: 'Equipment',
    type: 'Outflow',
    method: 'Bank Transfer',
    amount: 35000,
  },
  {
    id: 8,
    date: '2026-10-04',
    reference: 'CF-0008',
    description: 'Cash sales',
    category: 'Sales Revenue',
    type: 'Inflow',
    method: 'Cash',
    amount: 28000,
  },
  {
    id: 9,
    date: '2026-10-03',
    reference: 'CF-0009',
    description: 'Loan received',
    category: 'Loan',
    type: 'Inflow',
    method: 'Bank Transfer',
    amount: 75000,
  },
  {
    id: 10,
    date: '2026-10-02',
    reference: 'CF-0010',
    description: 'Staff salary payment',
    category: 'Salary Expense',
    type: 'Outflow',
    method: 'Bank Transfer',
    amount: 22000,
  },
])

const filteredTransactions = computed(() => {
  let from = startDate.value
  let to = endDate.value

  if (!from && !to) {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const todayString = `${year}-${month}-${day}`

    if (period.value === 'This Month') {
      from = `${year}-${month}-01`
      to = todayString
    } else if (period.value === 'Last 30 Days') {
      const date = new Date(today)
      date.setDate(date.getDate() - 29)
      from = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      to = todayString
    } else if (period.value === 'This Year') {
      from = `${year}-01-01`
      to = todayString
    }
  }

  const query = search.value.toLowerCase()

  return transactions.value
    .filter((item) => {
      const matchesSearch =
        item.reference.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)

      const matchesType = selectedType.value === 'All' || item.type === selectedType.value
      const matchesStart = !from || item.date >= from
      const matchesEnd = !to || item.date <= to

      return matchesSearch && matchesType && matchesStart && matchesEnd
    })
    .sort((a, b) => b.date.localeCompare(a.date))
})

const totalInflow = computed(() =>
  filteredTransactions.value
    .filter((item) => item.type === 'Inflow')
    .reduce((sum, item) => sum + Number(item.amount), 0),
)

const totalOutflow = computed(() =>
  filteredTransactions.value
    .filter((item) => item.type === 'Outflow')
    .reduce((sum, item) => sum + Number(item.amount), 0),
)

const netCashFlow = computed(() => totalInflow.value - totalOutflow.value)

const openingBalance = ref(125000)
const closingBalance = computed(() => openingBalance.value + netCashFlow.value)

const inflowCategories = computed(() => getCategoryTotals('Inflow'))
const outflowCategories = computed(() => getCategoryTotals('Outflow'))

function getCategoryTotals(type) {
  const totals = {}

  filteredTransactions.value
    .filter((item) => item.type === type)
    .forEach((item) => {
      totals[item.category] = (totals[item.category] || 0) + Number(item.amount)
    })

  return Object.entries(totals)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
}

const maxCategoryAmount = computed(() =>
  Math.max(
    1,
    ...inflowCategories.value.map((item) => item.amount),
    ...outflowCategories.value.map((item) => item.amount),
  ),
)

const formatMoney = (value) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 2,
  }).format(value)

const formatDate = (value) =>
  new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

function applyPeriod(value) {
  period.value = value
  startDate.value = ''
  endDate.value = ''
}

function resetFilters() {
  search.value = ''
  selectedType.value = 'All'
  period.value = 'This Month'
  startDate.value = ''
  endDate.value = ''
}

function exportCSV() {
  const headers = ['Date', 'Reference', 'Description', 'Category', 'Type', 'Method', 'Amount']
  const rows = filteredTransactions.value.map((item) => [
    item.date,
    item.reference,
    item.description,
    item.category,
    item.type,
    item.method,
    item.amount,
  ])

  const csv = [headers, ...rows]
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'cash-flow-report.csv'
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <Default>
    <main class="space-y-5 p-4 sm:p-6">
      <!-- Header -->
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Cash Flow</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor cash inflows, outflows and your overall cash position.
          </p>
        </div>

        <button
          @click="exportCSV"
          class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <UIcon name="i-lucide-download" class="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <!-- Period Filter -->
      <div
        class="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 lg:flex-row lg:items-end lg:justify-between"
      >
        <div class="flex flex-wrap gap-2">
          <button
            v-for="item in ['This Month', 'Last 30 Days', 'This Year', 'All Time']"
            :key="item"
            @click="applyPeriod(item)"
            :class="
              period === item && !startDate && !endDate
                ? 'bg-primary text-white'
                : 'border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
            "
            class="rounded-lg px-3 py-2 text-sm font-medium transition"
          >
            {{ item }}
          </button>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label class="mb-1 block text-xs font-medium text-gray-500">From Date</label>
            <input
              v-model="startDate"
              type="date"
              :max="endDate || undefined"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-medium text-gray-500">To Date</label>
            <input
              v-model="endDate"
              type="date"
              :min="startDate || undefined"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 dark:text-gray-400">Opening Balance</p>
            <div class="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/30">
              <UIcon name="i-lucide-wallet" class="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p class="mt-3 text-xl font-bold text-gray-900 dark:text-white">
            {{ formatMoney(openingBalance) }}
          </p>
          <p class="mt-1 text-xs text-gray-500">Sample opening cash position</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Inflow</p>
            <div class="rounded-lg bg-green-50 p-2 dark:bg-green-900/30">
              <UIcon
                name="i-lucide-trending-up"
                class="h-5 w-5 text-green-600 dark:text-green-400"
              />
            </div>
          </div>
          <p class="mt-3 text-xl font-bold text-green-600 dark:text-green-400">
            {{ formatMoney(totalInflow) }}
          </p>
          <p class="mt-1 text-xs text-gray-500">Money received</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Outflow</p>
            <div class="rounded-lg bg-red-50 p-2 dark:bg-red-900/30">
              <UIcon name="i-lucide-trending-down" class="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p class="mt-3 text-xl font-bold text-red-600 dark:text-red-400">
            {{ formatMoney(totalOutflow) }}
          </p>
          <p class="mt-1 text-xs text-gray-500">Money paid out</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 dark:text-gray-400">Net Cash Flow</p>
            <div
              :class="
                netCashFlow >= 0
                  ? 'bg-emerald-50 dark:bg-emerald-900/30'
                  : 'bg-red-50 dark:bg-red-900/30'
              "
              class="rounded-lg p-2"
            >
              <UIcon
                name="i-lucide-arrow-left-right"
                :class="
                  netCashFlow >= 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400'
                "
                class="h-5 w-5"
              />
            </div>
          </div>
          <p
            :class="
              netCashFlow >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            "
            class="mt-3 text-xl font-bold"
          >
            {{ formatMoney(netCashFlow) }}
          </p>
          <p class="mt-1 text-xs text-gray-500">Inflow minus outflow</p>
        </div>
      </div>

      <!-- Closing Balance -->
      <div
        class="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex items-center gap-3">
          <div class="rounded-xl bg-primary/10 p-3">
            <UIcon name="i-lucide-landmark" class="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Estimated Closing Balance</h2>
            <p class="mt-1 text-sm text-gray-500">Opening balance + net cash flow</p>
          </div>
        </div>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ formatMoney(closingBalance) }}
        </p>
      </div>

      <!-- Cash Flow Breakdown -->
      <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="mb-5 flex items-center justify-between">
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Cash Inflow Breakdown</h2>
              <p class="mt-1 text-sm text-gray-500">Sources of incoming cash</p>
            </div>
            <UIcon name="i-lucide-circle-arrow-down" class="h-5 w-5 text-green-500" />
          </div>

          <div v-if="inflowCategories.length" class="space-y-5">
            <div v-for="item in inflowCategories" :key="item.name">
              <div class="mb-2 flex items-center justify-between gap-3">
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ item.name }}</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatMoney(item.amount) }}
                </span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  class="h-full rounded-full bg-green-500 transition-all"
                  :style="{ width: `${(item.amount / maxCategoryAmount) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>

          <p v-else class="py-8 text-center text-sm text-gray-500">
            No inflow data for this period.
          </p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="mb-5 flex items-center justify-between">
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Cash Outflow Breakdown</h2>
              <p class="mt-1 text-sm text-gray-500">Where cash is being spent</p>
            </div>
            <UIcon name="i-lucide-circle-arrow-up" class="h-5 w-5 text-red-500" />
          </div>

          <div v-if="outflowCategories.length" class="space-y-5">
            <div v-for="item in outflowCategories" :key="item.name">
              <div class="mb-2 flex items-center justify-between gap-3">
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ item.name }}</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatMoney(item.amount) }}
                </span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  class="h-full rounded-full bg-red-500 transition-all"
                  :style="{ width: `${(item.amount / maxCategoryAmount) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>

          <p v-else class="py-8 text-center text-sm text-gray-500">
            No outflow data for this period.
          </p>
        </div>
      </div>

      <!-- Transactions -->
      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col gap-4 border-b border-gray-200 p-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Cash Flow Transactions</h2>
            <p class="mt-1 text-sm text-gray-500">
              {{ filteredTransactions.length }} records found
            </p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <div class="relative">
              <UIcon
                name="i-lucide-search"
                class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              />
              <input
                v-model="search"
                placeholder="Search transactions..."
                class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>

            <select
              v-model="selectedType"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="All">All Transactions</option>
              <option value="Inflow">Cash Inflow</option>
              <option value="Outflow">Cash Outflow</option>
            </select>

            <button
              @click="resetFilters"
              class="rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Reset
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead
              class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/60 dark:text-gray-400"
            >
              <tr>
                <th class="px-5 py-3.5 font-semibold">Date</th>
                <th class="px-5 py-3.5 font-semibold">Reference</th>
                <th class="px-5 py-3.5 font-semibold">Description</th>
                <th class="px-5 py-3.5 font-semibold">Category</th>
                <th class="px-5 py-3.5 font-semibold">Method</th>
                <th class="px-5 py-3.5 text-center font-semibold">Type</th>
                <th class="px-5 py-3.5 text-right font-semibold">Amount</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="item in filteredTransactions"
                :key="item.id"
                class="transition hover:bg-gray-50 dark:hover:bg-gray-800/40"
              >
                <td class="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-gray-300">
                  {{ formatDate(item.date) }}
                </td>
                <td class="whitespace-nowrap px-5 py-4 font-semibold text-primary">
                  {{ item.reference }}
                </td>
                <td class="whitespace-nowrap px-5 py-4 font-medium text-gray-900 dark:text-white">
                  {{ item.description }}
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-gray-300">
                  {{ item.category }}
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-gray-300">
                  {{ item.method }}
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-center">
                  <span
                    :class="
                      item.type === 'Inflow'
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    "
                    class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                  >
                    <UIcon
                      :name="
                        item.type === 'Inflow'
                          ? 'i-lucide-arrow-down-left'
                          : 'i-lucide-arrow-up-right'
                      "
                      class="h-3.5 w-3.5"
                    />
                    {{ item.type }}
                  </span>
                </td>
                <td
                  :class="
                    item.type === 'Inflow'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  "
                  class="whitespace-nowrap px-5 py-4 text-right font-semibold tabular-nums"
                >
                  {{ item.type === 'Inflow' ? '+' : '-' }}{{ formatMoney(item.amount) }}
                </td>
              </tr>

              <tr v-if="filteredTransactions.length === 0">
                <td colspan="7" class="px-5 py-12 text-center">
                  <UIcon name="i-lucide-search-x" class="mx-auto h-8 w-8 text-gray-400" />
                  <p class="mt-2 font-medium text-gray-700 dark:text-gray-300">
                    No transactions found
                  </p>
                  <p class="mt-1 text-sm text-gray-500">
                    Try changing the date range or search filters.
                  </p>
                </td>
              </tr>
            </tbody>

            <tfoot
              v-if="filteredTransactions.length"
              class="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/40"
            >
              <tr>
                <td
                  colspan="5"
                  class="px-5 py-4 text-right font-semibold text-gray-700 dark:text-gray-200"
                >
                  Period Total
                </td>
                <td class="px-5 py-4 text-center text-xs font-medium text-gray-500">Net</td>
                <td
                  :class="
                    netCashFlow >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  "
                  class="whitespace-nowrap px-5 py-4 text-right font-bold"
                >
                  {{
                    formatMoney(
                      filteredTransactions.reduce(
                        (sum, item) =>
                          sum +
                          (item.type === 'Inflow' ? Number(item.amount) : -Number(item.amount)),
                        0,
                      ),
                    )
                  }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </main>
  </Default>
</template>
