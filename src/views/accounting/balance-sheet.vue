<script setup>
import { computed, ref } from 'vue'
import Default from '@/layouts/Default.vue'

const asOfDate = ref(new Date().toISOString().slice(0, 10))
const showAll = ref(false)
const search = ref('')

const assets = ref([
  {
    category: 'Current Assets',
    accounts: [
      { name: 'Cash in Hand', code: '1001', amount: 85000 },
      { name: 'Cash at Bank', code: '1002', amount: 320000 },
      { name: 'Accounts Receivable', code: '1003', amount: 145000 },
      { name: 'Inventory', code: '1004', amount: 280000 },
      { name: 'Prepaid Expenses', code: '1005', amount: 18000 },
    ],
  },
  {
    category: 'Non-Current Assets',
    accounts: [
      { name: 'Furniture & Fixtures', code: '1501', amount: 120000 },
      { name: 'Equipment', code: '1502', amount: 250000 },
      { name: 'Accumulated Depreciation', code: '1503', amount: -35000 },
      { name: 'Office Computers', code: '1504', amount: 95000 },
    ],
  },
])

const liabilities = ref([
  {
    category: 'Current Liabilities',
    accounts: [
      { name: 'Accounts Payable', code: '2001', amount: 185000 },
      { name: 'Outstanding Expenses', code: '2002', amount: 25000 },
      { name: 'Tax Payable', code: '2003', amount: 18000 },
      { name: 'Short-Term Loan', code: '2004', amount: 50000 },
    ],
  },
  {
    category: 'Non-Current Liabilities',
    accounts: [{ name: 'Long-Term Loan', code: '2501', amount: 150000 }],
  },
])

const equity = ref([
  { name: 'Owner Capital', code: '3001', amount: 600000 },
  { name: 'Retained Earnings', code: '3002', amount: 220000 },
])

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(amount)

const sumAccounts = (accounts) => accounts.reduce((sum, account) => sum + account.amount, 0)

const sumGroups = (groups) => groups.reduce((sum, group) => sum + sumAccounts(group.accounts), 0)

const totalCurrentAssets = computed(() => sumAccounts(assets.value[0].accounts))

const totalNonCurrentAssets = computed(() => sumAccounts(assets.value[1].accounts))

const totalAssets = computed(() => totalCurrentAssets.value + totalNonCurrentAssets.value)

const totalCurrentLiabilities = computed(() => sumAccounts(liabilities.value[0].accounts))

const totalNonCurrentLiabilities = computed(() => sumAccounts(liabilities.value[1].accounts))

const totalLiabilities = computed(
  () => totalCurrentLiabilities.value + totalNonCurrentLiabilities.value,
)

const totalEquity = computed(() => sumAccounts(equity.value))

const totalLiabilitiesAndEquity = computed(() => totalLiabilities.value + totalEquity.value)

const difference = computed(() => totalAssets.value - totalLiabilitiesAndEquity.value)

const isBalanced = computed(() => Math.abs(difference.value) < 0.01)

const currentRatio = computed(() =>
  totalCurrentLiabilities.value
    ? (totalCurrentAssets.value / totalCurrentLiabilities.value).toFixed(2)
    : '—',
)

const workingCapital = computed(() => totalCurrentAssets.value - totalCurrentLiabilities.value)

const accountMatches = (account) => {
  const query = search.value.trim().toLowerCase()
  return (
    !query ||
    account.name.toLowerCase().includes(query) ||
    account.code.toLowerCase().includes(query)
  )
}

const exportCsv = () => {
  const rows = [
    ['Balance Sheet'],
    ['As of Date', asOfDate.value],
    [],
    ['Section', 'Account Code', 'Account', 'Amount (BDT)'],
  ]

  assets.value.forEach((group) => {
    rows.push([group.category, '', '', ''])
    group.accounts.forEach((account) => {
      rows.push(['Assets', account.code, account.name, account.amount])
    })
    rows.push(['Total ' + group.category, '', '', sumAccounts(group.accounts)])
  })

  rows.push(['Total Assets', '', '', totalAssets.value])
  rows.push([])

  liabilities.value.forEach((group) => {
    rows.push([group.category, '', '', ''])
    group.accounts.forEach((account) => {
      rows.push(['Liabilities', account.code, account.name, account.amount])
    })
    rows.push(['Total ' + group.category, '', '', sumAccounts(group.accounts)])
  })

  rows.push(['Total Liabilities', '', '', totalLiabilities.value])
  rows.push([])

  rows.push(['Equity', '', '', ''])
  equity.value.forEach((account) => {
    rows.push(['Equity', account.code, account.name, account.amount])
  })

  rows.push(['Total Equity', '', '', totalEquity.value])
  rows.push(['Total Liabilities & Equity', '', '', totalLiabilitiesAndEquity.value])
  rows.push(['Balance Difference', '', '', difference.value])

  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob(['\uFEFF' + csv], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `balance-sheet-${asOfDate.value}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

const printReport = () => window.print()
</script>

<template>
  <Default>
    <main class="space-y-4 p-4">
      <!-- Header -->
      <div class="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <UIcon name="i-lucide-layout-dashboard" class="h-4 w-4" />
            <span>Accounting</span>
            <UIcon name="i-lucide-chevron-right" class="h-4 w-4" />
            <span class="text-gray-900 dark:text-white">Balance Sheet</span>
          </div>

          <h1 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Balance Sheet</h1>
          <p class="mt-1 text-sm text-gray-500">
            View your assets, liabilities and owner's equity.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <div
            class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900"
          >
            <UIcon name="i-lucide-calendar" class="h-4 w-4 text-gray-500" />
            <input
              v-model="asOfDate"
              type="date"
              class="bg-transparent py-2 text-sm outline-none"
              aria-label="Balance sheet as of date"
            />
          </div>

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
            Print
          </button>
        </div>
      </div>

      <!-- Balance Status -->
      <div
        class="flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center"
        :class="
          isBalanced
            ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-500/5'
            : 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-500/5'
        "
      >
        <div class="flex items-start gap-3">
          <UIcon
            :name="isBalanced ? 'i-lucide-circle-check' : 'i-lucide-alert-triangle'"
            class="mt-0.5 h-5 w-5 shrink-0"
            :class="isBalanced ? 'text-emerald-600' : 'text-amber-600'"
          />
          <div>
            <p
              class="font-semibold"
              :class="
                isBalanced
                  ? 'text-emerald-800 dark:text-emerald-300'
                  : 'text-amber-800 dark:text-amber-300'
              "
            >
              {{ isBalanced ? 'Balance Sheet is Balanced' : 'Balance Sheet is Not Balanced' }}
            </p>
            <p
              class="mt-1 text-sm"
              :class="
                isBalanced
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-amber-700 dark:text-amber-400'
              "
            >
              Assets = Liabilities + Equity
              <span v-if="!isBalanced">
                · Difference: {{ formatCurrency(Math.abs(difference)) }}
              </span>
            </p>
          </div>
        </div>

        <span
          class="w-fit rounded-full px-3 py-1 text-xs font-semibold"
          :class="
            isBalanced
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
          "
        >
          {{ isBalanced ? 'Balanced' : 'Needs Review' }}
        </span>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div class="rounded-lg bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-500/10">
              <UIcon name="i-lucide-landmark" class="h-5 w-5" />
            </div>
            <span class="text-xs font-medium text-blue-600">Assets</span>
          </div>
          <p class="mt-4 text-sm text-gray-500">Total Assets</p>
          <h2 class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(totalAssets) }}
          </h2>
          <p class="mt-2 text-xs text-gray-500">Current and non-current assets</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div class="rounded-lg bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-500/10">
              <UIcon name="i-lucide-receipt" class="h-5 w-5" />
            </div>
            <span class="text-xs font-medium text-amber-600">Liabilities</span>
          </div>
          <p class="mt-4 text-sm text-gray-500">Total Liabilities</p>
          <h2 class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(totalLiabilities) }}
          </h2>
          <p class="mt-2 text-xs text-gray-500">Short and long-term obligations</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div class="rounded-lg bg-violet-50 p-2.5 text-violet-600 dark:bg-violet-500/10">
              <UIcon name="i-lucide-piggy-bank" class="h-5 w-5" />
            </div>
            <span class="text-xs font-medium text-violet-600">Equity</span>
          </div>
          <p class="mt-4 text-sm text-gray-500">Total Equity</p>
          <h2 class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(totalEquity) }}
          </h2>
          <p class="mt-2 text-xs text-gray-500">Capital and retained earnings</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div class="rounded-lg bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-500/10">
              <UIcon name="i-lucide-scale" class="h-5 w-5" />
            </div>
            <span class="text-xs font-medium text-emerald-600">Liquidity</span>
          </div>
          <p class="mt-4 text-sm text-gray-500">Working Capital</p>
          <h2
            class="mt-1 text-2xl font-bold"
            :class="workingCapital >= 0 ? 'text-emerald-600' : 'text-red-600'"
          >
            {{ formatCurrency(workingCapital) }}
          </h2>
          <p class="mt-2 text-xs text-gray-500">Current assets minus current liabilities</p>
        </div>
      </div>

      <!-- Main Balance Sheet -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <!-- Assets -->
        <section
          class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-800"
          >
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-500/10">
                <UIcon name="i-lucide-landmark" class="h-5 w-5" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">Assets</h3>
                <p class="mt-1 text-xs text-gray-500">What the business owns</p>
              </div>
            </div>
            <span class="text-lg font-bold text-gray-900 dark:text-white">
              {{ formatCurrency(totalAssets) }}
            </span>
          </div>

          <div class="p-5">
            <div v-for="group in assets" :key="group.category" class="mb-6 last:mb-0">
              <div class="mb-3 flex items-center justify-between">
                <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {{ group.category }}
                </h4>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(sumAccounts(group.accounts)) }}
                </span>
              </div>

              <div class="space-y-3">
                <template v-for="account in group.accounts" :key="account.code">
                  <div
                    v-if="accountMatches(account) && (showAll || account.amount !== 0)"
                    class="flex items-start justify-between gap-3 text-sm"
                  >
                    <div class="flex items-start gap-2">
                      <span class="mt-0.5 text-xs text-gray-400">
                        {{ account.code }}
                      </span>
                      <span class="text-gray-600 dark:text-gray-300">
                        {{ account.name }}
                      </span>
                    </div>
                    <span
                      class="shrink-0 tabular-nums"
                      :class="
                        account.amount < 0 ? 'text-red-600' : 'text-gray-700 dark:text-gray-200'
                      "
                    >
                      {{ formatCurrency(account.amount) }}
                    </span>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <div
            class="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-gray-800/40"
          >
            <span class="font-semibold text-gray-900 dark:text-white"> Total Assets </span>
            <span class="text-lg font-bold text-blue-600">
              {{ formatCurrency(totalAssets) }}
            </span>
          </div>
        </section>

        <!-- Liabilities and Equity -->
        <section
          class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-800"
          >
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-500/10">
                <UIcon name="i-lucide-receipt" class="h-5 w-5" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">Liabilities & Equity</h3>
                <p class="mt-1 text-xs text-gray-500">What the business owes and owns</p>
              </div>
            </div>
          </div>

          <div class="p-5">
            <div v-for="group in liabilities" :key="group.category" class="mb-6 last:mb-0">
              <div class="mb-3 flex items-center justify-between">
                <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {{ group.category }}
                </h4>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(sumAccounts(group.accounts)) }}
                </span>
              </div>

              <div class="space-y-3">
                <template v-for="account in group.accounts" :key="account.code">
                  <div
                    v-if="accountMatches(account) && (showAll || account.amount !== 0)"
                    class="flex items-start justify-between gap-3 text-sm"
                  >
                    <div class="flex items-start gap-2">
                      <span class="mt-0.5 text-xs text-gray-400">
                        {{ account.code }}
                      </span>
                      <span class="text-gray-600 dark:text-gray-300">
                        {{ account.name }}
                      </span>
                    </div>
                    <span class="shrink-0 text-gray-700 dark:text-gray-200">
                      {{ formatCurrency(account.amount) }}
                    </span>
                  </div>
                </template>
              </div>
            </div>

            <div class="mb-3 mt-7 border-t border-gray-100 pt-5 dark:border-gray-800">
              <div class="mb-3 flex items-center justify-between">
                <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Owner's Equity
                </h4>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(totalEquity) }}
                </span>
              </div>

              <div class="space-y-3">
                <div
                  v-for="account in equity"
                  :key="account.code"
                  v-show="accountMatches(account) && (showAll || account.amount !== 0)"
                  class="flex items-start justify-between gap-3 text-sm"
                >
                  <div class="flex items-start gap-2">
                    <span class="mt-0.5 text-xs text-gray-400">
                      {{ account.code }}
                    </span>
                    <span class="text-gray-600 dark:text-gray-300">
                      {{ account.name }}
                    </span>
                  </div>
                  <span class="shrink-0 text-gray-700 dark:text-gray-200">
                    {{ formatCurrency(account.amount) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            class="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-gray-800/40"
          >
            <span class="font-semibold text-gray-900 dark:text-white">
              Total Liabilities & Equity
            </span>
            <span class="text-lg font-bold text-amber-600">
              {{ formatCurrency(totalLiabilitiesAndEquity) }}
            </span>
          </div>
        </section>
      </div>

      <!-- Reconciliation -->
      <section
        class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Balance Reconciliation</h3>
            <p class="mt-1 text-sm text-gray-500">Assets should equal liabilities plus equity.</p>
          </div>

          <button
            @click="showAll = !showAll"
            class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <UIcon :name="showAll ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="h-4 w-4" />
            {{ showAll ? 'Hide Zero Balances' : 'Show All Balances' }}
          </button>
        </div>

        <div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <p class="text-sm text-gray-500">Total Assets</p>
            <p class="mt-2 text-xl font-bold text-gray-900 dark:text-white">
              {{ formatCurrency(totalAssets) }}
            </p>
          </div>

          <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <p class="text-sm text-gray-500">Liabilities + Equity</p>
            <p class="mt-2 text-xl font-bold text-gray-900 dark:text-white">
              {{ formatCurrency(totalLiabilitiesAndEquity) }}
            </p>
          </div>

          <div
            class="rounded-lg p-4"
            :class="
              isBalanced ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-red-50 dark:bg-red-500/10'
            "
          >
            <p
              class="text-sm"
              :class="
                isBalanced
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-red-700 dark:text-red-400'
              "
            >
              Difference
            </p>
            <p
              class="mt-2 text-xl font-bold"
              :class="
                isBalanced
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-red-700 dark:text-red-400'
              "
            >
              {{ formatCurrency(difference) }}
            </p>
          </div>
        </div>

        <div class="mt-5 rounded-lg border border-gray-100 p-4 dark:border-gray-800">
          <div class="mb-2 flex items-center justify-between text-sm">
            <span class="text-gray-500">Current Ratio</span>
            <span class="font-semibold text-gray-900 dark:text-white">
              {{ currentRatio }}
            </span>
          </div>
          <p class="text-xs text-gray-500">Current assets divided by current liabilities.</p>
        </div>
      </section>

      <!-- Notice -->
      <div
        class="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-500/5"
      >
        <UIcon name="i-lucide-info" class="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        <div>
          <p class="text-sm font-medium text-blue-900 dark:text-blue-300">Demo Data</p>
          <p class="mt-1 text-sm text-blue-800/80 dark:text-blue-200/70">
            This page uses sample account balances. In production, retrieve balances from the
            general ledger as of the selected date. The balance sheet must include the period's net
            profit or loss in retained earnings/equity and reconcile against posted journal entries.
          </p>
        </div>
      </div>
    </main>
  </Default>
</template>
