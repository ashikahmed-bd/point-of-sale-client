<script setup>
import { computed, ref } from 'vue'
import Default from '@/layouts/Default.vue'

const selectedPeriod = ref('this_month')
const search = ref('')
const showDetails = ref(false)

const periodOptions = [
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'This Quarter', value: 'this_quarter' },
  { label: 'This Year', value: 'this_year' },
]

const report = ref({
  revenue: 850000,
  salesReturns: 15000,
  costOfGoodsSold: 480000,
  operatingExpenses: 145000,
  otherIncome: 12000,
  otherExpenses: 8000,
  tax: 20000,
})

const grossRevenue = computed(() => report.value.revenue - report.value.salesReturns)

const grossProfit = computed(() => grossRevenue.value - report.value.costOfGoodsSold)

const operatingProfit = computed(() => grossProfit.value - report.value.operatingExpenses)

const netProfit = computed(
  () =>
    operatingProfit.value +
    report.value.otherIncome -
    report.value.otherExpenses -
    report.value.tax,
)

const grossMargin = computed(() =>
  grossRevenue.value ? ((grossProfit.value / grossRevenue.value) * 100).toFixed(1) : '0.0',
)

const netMargin = computed(() =>
  grossRevenue.value ? ((netProfit.value / grossRevenue.value) * 100).toFixed(1) : '0.0',
)

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(value)

const monthlyData = ref([
  { month: 'May', revenue: 680000, expenses: 570000, profit: 110000 },
  { month: 'June', revenue: 720000, expenses: 605000, profit: 115000 },
  { month: 'July', revenue: 760000, expenses: 630000, profit: 130000 },
  { month: 'August', revenue: 790000, expenses: 650000, profit: 140000 },
  { month: 'September', revenue: 810000, expenses: 670000, profit: 140000 },
  { month: 'October', revenue: 850000, expenses: 653000, profit: 197000 },
])

const expenseBreakdown = ref([
  { name: 'Salary & Wages', amount: 65000, color: 'bg-blue-500' },
  { name: 'Rent', amount: 30000, color: 'bg-violet-500' },
  { name: 'Utilities', amount: 18000, color: 'bg-amber-500' },
  { name: 'Marketing', amount: 15000, color: 'bg-emerald-500' },
  { name: 'Transport', amount: 10000, color: 'bg-rose-500' },
  { name: 'Other Expenses', amount: 7000, color: 'bg-gray-400' },
])

const totalBreakdown = computed(() =>
  expenseBreakdown.value.reduce((total, item) => total + item.amount, 0),
)

const filteredExpenses = computed(() =>
  expenseBreakdown.value.filter((item) =>
    item.name.toLowerCase().includes(search.value.toLowerCase()),
  ),
)

const profitRows = computed(() => [
  { label: 'Sales Revenue', amount: report.value.revenue, type: 'income', bold: false },
  {
    label: 'Less: Sales Returns & Discounts',
    amount: -report.value.salesReturns,
    type: 'deduction',
    bold: false,
  },
  { label: 'Net Revenue', amount: grossRevenue.value, type: 'total', bold: true },
  {
    label: 'Cost of Goods Sold (COGS)',
    amount: -report.value.costOfGoodsSold,
    type: 'deduction',
    bold: false,
  },
  { label: 'Gross Profit', amount: grossProfit.value, type: 'subtotal', bold: true },
  {
    label: 'Operating Expenses',
    amount: -report.value.operatingExpenses,
    type: 'deduction',
    bold: false,
  },
  { label: 'Operating Profit', amount: operatingProfit.value, type: 'subtotal', bold: true },
  { label: 'Other Income', amount: report.value.otherIncome, type: 'income', bold: false },
  { label: 'Other Expenses', amount: -report.value.otherExpenses, type: 'deduction', bold: false },
  { label: 'Income Tax', amount: -report.value.tax, type: 'deduction', bold: false },
  { label: 'Net Profit', amount: netProfit.value, type: 'final', bold: true },
])

const exportCsv = () => {
  const rows = [
    ['Profit & Loss Statement'],
    ['Period', selectedPeriod.value],
    [],
    ['Description', 'Amount (BDT)'],
    ...profitRows.value.map((row) => [row.label, row.amount]),
    [],
    ['Gross Margin (%)', grossMargin.value],
    ['Net Margin (%)', netMargin.value],
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
  link.download = 'profit-loss-report.csv'
  link.click()
  URL.revokeObjectURL(url)
}

const maxMonthlyValue = computed(() =>
  Math.max(...monthlyData.value.map((item) => item.revenue), 1),
)
</script>

<template>
  <Default>
    <main class="space-y-4 p-4">
      <!-- Page Header -->
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <UIcon name="i-lucide-layout-dashboard" class="h-4 w-4" />
            <span>Accounting</span>
            <UIcon name="i-lucide-chevron-right" class="h-4 w-4" />
            <span class="text-gray-900 dark:text-white">Profit & Loss</span>
          </div>

          <h1 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Profit & Loss</h1>
          <p class="mt-1 text-sm text-gray-500">
            Analyze your revenue, expenses and business profitability.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <select
            v-model="selectedPeriod"
            class="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900"
          >
            <option v-for="period in periodOptions" :key="period.value" :value="period.value">
              {{ period.label }}
            </option>
          </select>

          <button
            @click="exportCsv"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            <UIcon name="i-lucide-download" class="h-4 w-4" />
            Export CSV
          </button>

          <button
            @click="showDetails = !showDetails"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            <UIcon name="i-lucide-file-text" class="h-4 w-4" />
            {{ showDetails ? 'Hide Statement' : 'View Statement' }}
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div class="rounded-lg bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-500/10">
              <UIcon name="i-lucide-wallet" class="h-5 w-5" />
            </div>
            <span class="text-xs font-medium text-emerald-600"> Revenue </span>
          </div>
          <p class="mt-4 text-sm text-gray-500">Net Revenue</p>
          <h2 class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(grossRevenue) }}
          </h2>
          <p class="mt-2 text-xs text-gray-500">Before cost of goods sold</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div class="rounded-lg bg-violet-50 p-2.5 text-violet-600 dark:bg-violet-500/10">
              <UIcon name="i-lucide-chart-no-axes-combined" class="h-5 w-5" />
            </div>
            <span class="text-xs font-medium text-violet-600"> {{ grossMargin }}% margin </span>
          </div>
          <p class="mt-4 text-sm text-gray-500">Gross Profit</p>
          <h2 class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(grossProfit) }}
          </h2>
          <p class="mt-2 text-xs text-gray-500">Revenue minus COGS</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div class="rounded-lg bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-500/10">
              <UIcon name="i-lucide-receipt-text" class="h-5 w-5" />
            </div>
            <span class="text-xs font-medium text-amber-600"> Expenses </span>
          </div>
          <p class="mt-4 text-sm text-gray-500">Total Expenses</p>
          <h2 class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {{
              formatCurrency(
                report.operatingExpenses +
                  report.costOfGoodsSold +
                  report.otherExpenses +
                  report.tax +
                  report.salesReturns,
              )
            }}
          </h2>
          <p class="mt-2 text-xs text-gray-500">Including COGS, returns and tax</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div class="rounded-lg bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-500/10">
              <UIcon name="i-lucide-trending-up" class="h-5 w-5" />
            </div>
            <span
              class="rounded-full px-2 py-1 text-xs font-medium"
              :class="
                netProfit >= 0
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10'
                  : 'bg-red-50 text-red-600 dark:bg-red-500/10'
              "
            >
              {{ netMargin }}% margin
            </span>
          </div>
          <p class="mt-4 text-sm text-gray-500">Net Profit</p>
          <h2
            class="mt-1 text-2xl font-bold"
            :class="netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'"
          >
            {{ formatCurrency(netProfit) }}
          </h2>
          <p class="mt-2 text-xs text-gray-500">After all expenses and tax</p>
        </div>
      </div>

      <!-- Charts / Breakdown -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 xl:col-span-2"
        >
          <div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Revenue & Profit Trend</h3>
              <p class="mt-1 text-sm text-gray-500">Monthly financial performance</p>
            </div>
            <div class="flex items-center gap-4 text-xs text-gray-500">
              <span class="flex items-center gap-1.5">
                <span class="h-2.5 w-2.5 rounded-sm bg-blue-500"></span>
                Revenue
              </span>
              <span class="flex items-center gap-1.5">
                <span class="h-2.5 w-2.5 rounded-sm bg-emerald-500"></span>
                Profit
              </span>
            </div>
          </div>

          <div class="mt-6 space-y-4">
            <div
              v-for="item in monthlyData"
              :key="item.month"
              class="grid grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-3"
            >
              <span class="text-xs text-gray-500">{{ item.month }}</span>

              <div class="space-y-1.5">
                <div class="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    class="h-full rounded-full bg-blue-500"
                    :style="{ width: `${(item.revenue / maxMonthlyValue) * 100}%` }"
                  ></div>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    class="h-full rounded-full bg-emerald-500"
                    :style="{ width: `${(item.profit / maxMonthlyValue) * 100}%` }"
                  ></div>
                </div>
              </div>

              <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
                {{ formatCurrency(item.revenue) }}
              </span>
            </div>
          </div>

          <div
            class="mt-5 border-t border-gray-100 pt-4 text-xs text-gray-500 dark:border-gray-800"
          >
            Demo trend data for the last six months.
          </div>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Operating Expenses</h3>
            <p class="mt-1 text-sm text-gray-500">Breakdown by category</p>
          </div>

          <div class="mt-6 space-y-4">
            <div v-for="expense in expenseBreakdown" :key="expense.name">
              <div class="mb-2 flex items-center justify-between gap-3 text-sm">
                <span class="text-gray-600 dark:text-gray-300">
                  {{ expense.name }}
                </span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(expense.amount) }}
                </span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  class="h-full rounded-full"
                  :class="expense.color"
                  :style="{ width: `${(expense.amount / totalBreakdown) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>

          <div
            class="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800"
          >
            <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
              Total Operating Expenses
            </span>
            <span class="font-bold text-gray-900 dark:text-white">
              {{ formatCurrency(totalBreakdown) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Detailed Profit & Loss Statement -->
      <div
        v-if="showDetails"
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center dark:border-gray-800"
        >
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Profit & Loss Statement</h3>
            <p class="mt-1 text-sm text-gray-500">Detailed income and expense summary</p>
          </div>
          <span
            class="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            Currency: BDT
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/60">
              <tr>
                <th class="px-5 py-3 font-medium">Description</th>
                <th class="px-5 py-3 text-right font-medium">Amount</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="row in profitRows"
                :key="row.label"
                :class="{
                  'bg-gray-50 dark:bg-gray-800/50': row.type === 'total' || row.type === 'subtotal',
                  'bg-emerald-50/70 dark:bg-emerald-500/10': row.type === 'final',
                }"
              >
                <td
                  class="px-5 py-3.5"
                  :class="
                    row.bold
                      ? 'font-semibold text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300'
                  "
                >
                  {{ row.label }}
                </td>
                <td
                  class="px-5 py-3.5 text-right tabular-nums"
                  :class="[
                    row.bold
                      ? 'font-semibold text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300',
                    row.type === 'final'
                      ? row.amount >= 0
                        ? 'text-emerald-600'
                        : 'text-red-600'
                      : '',
                  ]"
                >
                  {{ row.amount < 0 ? '-' : '' }}{{ formatCurrency(Math.abs(row.amount)) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="grid grid-cols-1 gap-4 border-t border-gray-100 p-5 sm:grid-cols-2 dark:border-gray-800"
        >
          <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/60">
            <p class="text-sm text-gray-500">Gross Profit Margin</p>
            <p class="mt-1 text-xl font-bold text-gray-900 dark:text-white">{{ grossMargin }}%</p>
          </div>
          <div class="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-500/10">
            <p class="text-sm text-emerald-700 dark:text-emerald-400">Net Profit Margin</p>
            <p class="mt-1 text-xl font-bold text-emerald-700 dark:text-emerald-400">
              {{ netMargin }}%
            </p>
          </div>
        </div>
      </div>

      <!-- Expense Search and Table -->
      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center dark:border-gray-800"
        >
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Expense Details</h3>
            <p class="mt-1 text-sm text-gray-500">Search operating expense categories</p>
          </div>

          <div class="relative w-full sm:w-72">
            <UIcon
              name="i-lucide-search"
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            />
            <input
              v-model="search"
              type="text"
              placeholder="Search expense..."
              class="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/60">
              <tr>
                <th class="px-5 py-3 font-medium">Expense Category</th>
                <th class="px-5 py-3 text-right font-medium">Amount</th>
                <th class="px-5 py-3 text-right font-medium">% of Expenses</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="expense in filteredExpenses"
                :key="expense.name"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/40"
              >
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <span class="h-2.5 w-2.5 rounded-full" :class="expense.color"></span>
                    <span class="font-medium text-gray-700 dark:text-gray-200">
                      {{ expense.name }}
                    </span>
                  </div>
                </td>
                <td class="px-5 py-4 text-right font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(expense.amount) }}
                </td>
                <td class="px-5 py-4 text-right text-gray-500">
                  {{
                    totalBreakdown ? ((expense.amount / totalBreakdown) * 100).toFixed(1) : '0.0'
                  }}%
                </td>
              </tr>

              <tr v-if="filteredExpenses.length === 0">
                <td colspan="3" class="px-5 py-10 text-center text-gray-500">
                  No expense categories found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="flex flex-col justify-between gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800"
        >
          <span class="text-sm text-gray-500"> {{ filteredExpenses.length }} categories </span>
          <span class="text-sm font-semibold text-gray-900 dark:text-white">
            Total: {{ formatCurrency(totalBreakdown) }}
          </span>
        </div>
      </div>

      <!-- Footer Note -->
      <div
        class="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-500/5"
      >
        <UIcon name="i-lucide-info" class="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        <div>
          <p class="text-sm font-medium text-blue-900 dark:text-blue-300">Financial Report Note</p>
          <p class="mt-1 text-sm text-blue-800/80 dark:text-blue-200/70">
            This page currently uses sample data for UI demonstration. Connect it to your sales,
            purchase, inventory and accounting ledgers to calculate actual profit and loss for the
            selected period.
          </p>
        </div>
      </div>
    </main>
  </Default>
</template>
