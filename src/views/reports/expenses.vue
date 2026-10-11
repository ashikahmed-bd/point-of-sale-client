<template>
  <Default>
    <main class="space-y-6 p-4">
      <!-- Header -->
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Expenses Reports</h1>
          <p class="mt-1 text-sm text-gray-500">
            Track business expenses, payment status and category-wise spending.
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

      <!-- Filters -->
      <section
        class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Date
            </label>
            <input
              v-model="startDate"
              type="date"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              End Date
            </label>
            <input
              v-model="endDate"
              type="date"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              v-model="selectedCategory"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Payment Status
            </label>
            <select
              v-model="selectedStatus"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search
            </label>
            <div class="relative">
              <UIcon
                name="i-lucide-search"
                class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
              />
              <input
                v-model="search"
                type="text"
                placeholder="Expense, reference..."
                class="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div class="mt-3 flex justify-end">
          <button
            @click="resetFilters"
            class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <UIcon name="i-lucide-rotate-ccw" class="size-4" />
            Reset Filters
          </button>
        </div>
      </section>

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

      <!-- Expense Analytics -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <!-- Category Summary -->
        <section
          class="rounded-xl border border-gray-200 bg-white p-5 xl:col-span-2 dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Expenses by Category</h2>
              <p class="mt-1 text-sm text-gray-500">
                Category-wise spending for the selected period
              </p>
            </div>
            <UIcon name="i-lucide-chart-pie" class="size-5 text-primary" />
          </div>

          <div class="space-y-5">
            <div v-for="category in categorySummary" :key="category.name">
              <div class="mb-2 flex items-center justify-between gap-3">
                <div class="min-w-0">
                  <p class="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                    {{ category.name }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500">{{ category.count }} expenses</p>
                </div>

                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ formatCurrency(category.amount) }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500">
                    {{ categoryPercentage(category.amount) }}%
                  </p>
                </div>
              </div>

              <div class="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <div
                  class="h-full rounded-full bg-primary"
                  :style="{ width: categoryPercentage(category.amount) + '%' }"
                />
              </div>
            </div>

            <div v-if="categorySummary.length === 0" class="py-8 text-center text-sm text-gray-500">
              No expenses found for this period.
            </div>
          </div>
        </section>

        <!-- Payment Summary -->
        <section
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
        >
          <h2 class="font-semibold text-gray-900 dark:text-white">Payment Summary</h2>
          <p class="mt-1 text-sm text-gray-500">Payment status breakdown</p>

          <div class="mt-6 space-y-5">
            <div>
              <div class="mb-2 flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-300">Paid</span>
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(paidAmount) }}
                </span>
              </div>
              <div class="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <div
                  class="h-full rounded-full bg-emerald-500"
                  :style="{ width: paymentPercentage(paidAmount) + '%' }"
                />
              </div>
            </div>

            <div>
              <div class="mb-2 flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-300">Partial</span>
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(partialDue) }}
                </span>
              </div>
              <div class="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <div
                  class="h-full rounded-full bg-amber-500"
                  :style="{ width: paymentPercentage(partialDue) + '%' }"
                />
              </div>
            </div>

            <div>
              <div class="mb-2 flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-300">Pending</span>
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(pendingAmount) }}
                </span>
              </div>
              <div class="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <div
                  class="h-full rounded-full bg-rose-500"
                  :style="{ width: paymentPercentage(pendingAmount) + '%' }"
                />
              </div>
            </div>
          </div>

          <div class="mt-6 border-t border-gray-100 pt-4 dark:border-gray-700">
            <div class="flex items-center justify-between gap-3">
              <span class="text-sm text-gray-500">Total outstanding</span>
              <span class="font-semibold text-rose-600 dark:text-rose-400">
                {{ formatCurrency(totalOutstanding) }}
              </span>
            </div>
          </div>
        </section>
      </div>

      <!-- Expense Table -->
      <section
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
      >
        <div
          class="flex flex-col justify-between gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center dark:border-gray-700"
        >
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Expense Transactions</h2>
            <p class="mt-1 text-sm text-gray-500">Detailed business expense records</p>
          </div>

          <div class="rounded-lg bg-gray-50 px-4 py-2.5 dark:bg-gray-900">
            <p class="text-xs text-gray-500">Filtered expense total</p>
            <p class="mt-1 font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(filteredTotal) }}
            </p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[1000px] text-left text-sm">
            <thead class="bg-gray-50 dark:bg-gray-900/50">
              <tr class="text-xs uppercase tracking-wide text-gray-500">
                <th class="px-5 py-4 font-medium">Reference</th>
                <th class="px-5 py-4 font-medium">Expense</th>
                <th class="px-5 py-4 font-medium">Category</th>
                <th class="px-5 py-4 font-medium">Date</th>
                <th class="px-5 py-4 font-medium">Payment Method</th>
                <th class="px-5 py-4 text-right font-medium">Amount</th>
                <th class="px-5 py-4 text-right font-medium">Paid</th>
                <th class="px-5 py-4 text-right font-medium">Due</th>
                <th class="px-5 py-4 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="expense in filteredExpenses"
                :key="expense.id"
                class="border-b border-gray-100 last:border-0 hover:bg-gray-50/70 dark:border-gray-700 dark:hover:bg-gray-700/20"
              >
                <td class="px-5 py-4 font-medium text-primary">
                  {{ expense.reference }}
                </td>

                <td class="px-5 py-4">
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ expense.title }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500">
                    {{ expense.description }}
                  </p>
                </td>

                <td class="px-5 py-4">
                  <span
                    class="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {{ expense.category }}
                  </span>
                </td>

                <td class="px-5 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                  {{ formatDate(expense.date) }}
                </td>

                <td class="px-5 py-4 text-gray-600 dark:text-gray-300">
                  {{ expense.method }}
                </td>

                <td class="px-5 py-4 text-right font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(expense.amount) }}
                </td>

                <td class="px-5 py-4 text-right text-emerald-600 dark:text-emerald-400">
                  {{ formatCurrency(expense.paid) }}
                </td>

                <td
                  class="px-5 py-4 text-right"
                  :class="
                    expense.amount - expense.paid > 0
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-gray-500'
                  "
                >
                  {{ formatCurrency(expense.amount - expense.paid) }}
                </td>

                <td class="px-5 py-4">
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="statusClass(expense.status)"
                  >
                    {{ expense.status }}
                  </span>
                </td>
              </tr>

              <tr v-if="filteredExpenses.length === 0">
                <td colspan="9" class="px-5 py-12 text-center">
                  <UIcon name="i-lucide-receipt" class="mx-auto size-8 text-gray-400" />
                  <p class="mt-2 font-medium text-gray-700 dark:text-gray-200">No expenses found</p>
                  <p class="mt-1 text-sm text-gray-500">Try changing the date range or filters.</p>
                </td>
              </tr>
            </tbody>

            <tfoot v-if="filteredExpenses.length > 0" class="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <td
                  colspan="5"
                  class="px-5 py-4 text-right font-semibold text-gray-900 dark:text-white"
                >
                  Total
                </td>
                <td class="px-5 py-4 text-right font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(filteredTotal) }}
                </td>
                <td class="px-5 py-4 text-right font-semibold text-emerald-600">
                  {{ formatCurrency(filteredPaid) }}
                </td>
                <td class="px-5 py-4 text-right font-semibold text-rose-600">
                  {{ formatCurrency(filteredDue) }}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="border-t border-gray-200 px-5 py-4 text-sm text-gray-500 dark:border-gray-700">
          Showing {{ filteredExpenses.length }} of {{ expenses.length }} expense records
        </div>
      </section>
    </main>
  </Default>
</template>

<script setup>
import { computed, ref } from 'vue'
import Default from '@/layouts/Default.vue'

const search = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')

const today = new Date()
const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

function toDateInput(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const startDate = ref(toDateInput(monthStart))
const endDate = ref(toDateInput(today))

const expenses = ref([
  {
    id: 1,
    reference: 'EXP-1001',
    title: 'Office Rent',
    description: 'Monthly office rent',
    category: 'Rent',
    date: '2026-10-02',
    method: 'Bank Transfer',
    amount: 25000,
    paid: 25000,
    status: 'Paid',
  },
  {
    id: 2,
    reference: 'EXP-1002',
    title: 'Electricity Bill',
    description: 'Office electricity bill',
    category: 'Utilities',
    date: '2026-10-04',
    method: 'Cash',
    amount: 4500,
    paid: 4500,
    status: 'Paid',
  },
  {
    id: 3,
    reference: 'EXP-1003',
    title: 'Staff Salary',
    description: 'Monthly staff salary',
    category: 'Salary',
    date: '2026-10-05',
    method: 'Bank Transfer',
    amount: 45000,
    paid: 30000,
    status: 'Partial',
  },
  {
    id: 4,
    reference: 'EXP-1004',
    title: 'Internet Bill',
    description: 'Monthly internet service',
    category: 'Utilities',
    date: '2026-10-07',
    method: 'Mobile Banking',
    amount: 1500,
    paid: 1500,
    status: 'Paid',
  },
  {
    id: 5,
    reference: 'EXP-1005',
    title: 'Office Supplies',
    description: 'Paper, pens and stationery',
    category: 'Supplies',
    date: '2026-10-08',
    method: 'Cash',
    amount: 3200,
    paid: 2000,
    status: 'Partial',
  },
  {
    id: 6,
    reference: 'EXP-1006',
    title: 'Delivery Charges',
    description: 'Product delivery costs',
    category: 'Transport',
    date: '2026-10-09',
    method: 'Cash',
    amount: 2800,
    paid: 0,
    status: 'Pending',
  },
  {
    id: 7,
    reference: 'EXP-1007',
    title: 'Marketing',
    description: 'Online marketing campaign',
    category: 'Marketing',
    date: '2026-10-10',
    method: 'Bank Transfer',
    amount: 8000,
    paid: 8000,
    status: 'Paid',
  },
  {
    id: 8,
    reference: 'EXP-1008',
    title: 'Equipment Repair',
    description: 'Office equipment maintenance',
    category: 'Maintenance',
    date: '2026-10-11',
    method: 'Cash',
    amount: 3500,
    paid: 0,
    status: 'Pending',
  },
  {
    id: 9,
    reference: 'EXP-1009',
    title: 'Water Bill',
    description: 'Monthly water bill',
    category: 'Utilities',
    date: '2026-09-20',
    method: 'Cash',
    amount: 900,
    paid: 900,
    status: 'Paid',
  },
  {
    id: 10,
    reference: 'EXP-1010',
    title: 'Travel Expense',
    description: 'Business travel',
    category: 'Transport',
    date: '2026-09-24',
    method: 'Cash',
    amount: 2200,
    paid: 1200,
    status: 'Partial',
  },
])

const categories = computed(() =>
  [...new Set(expenses.value.map((expense) => expense.category))].sort(),
)

const filteredExpenses = computed(() => {
  const query = search.value.trim().toLowerCase()

  return expenses.value.filter((expense) => {
    const matchesDate =
      (!startDate.value || expense.date >= startDate.value) &&
      (!endDate.value || expense.date <= endDate.value)

    const matchesCategory = !selectedCategory.value || expense.category === selectedCategory.value

    const matchesStatus = !selectedStatus.value || expense.status === selectedStatus.value

    const matchesSearch =
      !query ||
      expense.title.toLowerCase().includes(query) ||
      expense.reference.toLowerCase().includes(query) ||
      expense.category.toLowerCase().includes(query) ||
      expense.description.toLowerCase().includes(query) ||
      expense.method.toLowerCase().includes(query)

    return matchesDate && matchesCategory && matchesStatus && matchesSearch
  })
})

const totalAmount = computed(() =>
  filteredExpenses.value.reduce((sum, expense) => sum + expense.amount, 0),
)

const paidAmount = computed(() =>
  filteredExpenses.value.reduce((sum, expense) => sum + expense.paid, 0),
)

const totalOutstanding = computed(() =>
  filteredExpenses.value.reduce(
    (sum, expense) => sum + Math.max(0, expense.amount - expense.paid),
    0,
  ),
)

const pendingAmount = computed(() =>
  filteredExpenses.value
    .filter((expense) => expense.status === 'Pending')
    .reduce((sum, expense) => sum + Math.max(0, expense.amount - expense.paid), 0),
)

const partialDue = computed(() =>
  filteredExpenses.value
    .filter((expense) => expense.status === 'Partial')
    .reduce((sum, expense) => sum + Math.max(0, expense.amount - expense.paid), 0),
)

const thisMonthAmount = computed(() => {
  const now = new Date()
  const firstDay = toDateInput(new Date(now.getFullYear(), now.getMonth(), 1))
  const lastDay = toDateInput(now)

  return expenses.value
    .filter((expense) => expense.date >= firstDay && expense.date <= lastDay)
    .reduce((sum, expense) => sum + expense.amount, 0)
})

const paidExpenseTotal = computed(() =>
  filteredExpenses.value
    .filter((expense) => expense.status === 'Paid')
    .reduce((sum, expense) => sum + expense.amount, 0),
)

const pendingExpenseCount = computed(
  () => filteredExpenses.value.filter((expense) => expense.status !== 'Paid').length,
)

const stats = computed(() => [
  {
    title: 'Total Expenses',
    value: formatCurrency(totalAmount.value),
    description: 'For selected period and filters',
    icon: 'i-lucide-wallet',
    iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  },
  {
    title: 'This Month',
    value: formatCurrency(thisMonthAmount.value),
    description: 'All expenses recorded this month',
    icon: 'i-lucide-calendar-days',
    iconClass: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
  },
  {
    title: 'Pending Expenses',
    value: formatCurrency(totalOutstanding.value),
    description: `${pendingExpenseCount.value} unpaid or partially paid records`,
    icon: 'i-lucide-clock',
    iconClass: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  },
  {
    title: 'Paid Expenses',
    value: formatCurrency(paidExpenseTotal.value),
    description: 'Fully paid expense records',
    icon: 'i-lucide-circle-check',
    iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  },
])

const categorySummary = computed(() => {
  const totals = new Map()

  filteredExpenses.value.forEach((expense) => {
    const current = totals.get(expense.category) || {
      name: expense.category,
      amount: 0,
      count: 0,
    }

    current.amount += expense.amount
    current.count += 1
    totals.set(expense.category, current)
  })

  return [...totals.values()].sort((a, b) => b.amount - a.amount)
})

const filteredTotal = computed(() => totalAmount.value)
const filteredPaid = computed(() => paidAmount.value)
const filteredDue = computed(() => totalOutstanding.value)

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 2,
  }).format(amount)
}

function formatDate(date) {
  if (!date) return '—'

  const [year, month, day] = date.split('-').map(Number)
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

function categoryPercentage(amount) {
  if (!totalAmount.value) return 0
  return Math.round((amount / totalAmount.value) * 100)
}

function paymentPercentage(amount) {
  if (!totalAmount.value) return 0
  return Math.min(100, Math.round((amount / totalAmount.value) * 100))
}

function statusClass(status) {
  if (status === 'Paid') {
    return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
  }

  if (status === 'Partial') {
    return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
  }

  return 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
}

function resetFilters() {
  search.value = ''
  selectedCategory.value = ''
  selectedStatus.value = ''
  startDate.value = ''
  endDate.value = ''
}

function exportCSV() {
  const headers = [
    'Reference',
    'Expense',
    'Description',
    'Category',
    'Date',
    'Payment Method',
    'Amount',
    'Paid',
    'Due',
    'Status',
  ]

  const rows = filteredExpenses.value.map((expense) => [
    expense.reference,
    expense.title,
    expense.description,
    expense.category,
    expense.date,
    expense.method,
    expense.amount,
    expense.paid,
    Math.max(0, expense.amount - expense.paid),
    expense.status,
  ])

  const escapeCSV = (value) => `"${String(value).replace(/"/g, '""')}"`

  const csv = [headers, ...rows].map((row) => row.map(escapeCSV).join(',')).join('\r\n')

  const blob = new Blob(['\uFEFF' + csv], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'expenses-report.csv'
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
