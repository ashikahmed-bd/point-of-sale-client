<script setup>
import { computed, ref } from 'vue'
import Default from '@/layouts/Default.vue'

const search = ref('')
const selectedType = ref('All')
const selectedStatus = ref('All')
const startDate = ref('')
const endDate = ref('')
const showForm = ref(false)
const selectedTransaction = ref(null)

const transactions = ref([
  {
    id: 1,
    reference: 'JV-0001',
    date: '2026-10-11',
    description: 'Office rent payment',
    account: 'Rent Expense',
    type: 'Journal',
    debit: 18000,
    credit: 18000,
    method: 'Bank Transfer',
    status: 'Posted',
  },
  {
    id: 2,
    reference: 'RV-0001',
    date: '2026-10-10',
    description: 'Sales revenue received',
    account: 'Sales Revenue',
    type: 'Receipt',
    debit: 45000,
    credit: 45000,
    method: 'Cash',
    status: 'Posted',
  },
  {
    id: 3,
    reference: 'PV-0001',
    date: '2026-10-09',
    description: 'Supplier payment',
    account: 'Accounts Payable',
    type: 'Payment',
    debit: 25000,
    credit: 25000,
    method: 'Bank Transfer',
    status: 'Posted',
  },
  {
    id: 4,
    reference: 'JV-0002',
    date: '2026-10-08',
    description: 'Inventory adjustment entry',
    account: 'Inventory',
    type: 'Journal',
    debit: 12000,
    credit: 12000,
    method: 'Journal Entry',
    status: 'Draft',
  },
  {
    id: 5,
    reference: 'RV-0002',
    date: '2026-10-07',
    description: 'Customer payment received',
    account: 'Accounts Receivable',
    type: 'Receipt',
    debit: 32000,
    credit: 32000,
    method: 'Cash',
    status: 'Posted',
  },
  {
    id: 6,
    reference: 'PV-0002',
    date: '2026-10-06',
    description: 'Utility bill payment',
    account: 'Utilities Expense',
    type: 'Payment',
    debit: 6500,
    credit: 6500,
    method: 'Bank Transfer',
    status: 'Pending',
  },
  {
    id: 7,
    reference: 'JV-0003',
    date: '2026-10-05',
    description: 'Owner capital introduced',
    account: 'Owner Equity',
    type: 'Journal',
    debit: 100000,
    credit: 100000,
    method: 'Journal Entry',
    status: 'Posted',
  },
])

const form = ref({
  date: new Date().toLocaleDateString('en-CA'),
  description: '',
  account: '',
  type: 'Journal',
  amount: 0,
  method: 'Journal Entry',
  status: 'Draft',
})

const types = ['All', 'Journal', 'Receipt', 'Payment']
const statuses = ['All', 'Posted', 'Draft', 'Pending', 'Cancelled']
const accounts = [
  'Cash in Hand',
  'Bank Account',
  'Accounts Receivable',
  'Accounts Payable',
  'Inventory',
  'Sales Revenue',
  'Rent Expense',
  'Utilities Expense',
  'Owner Equity',
]

const filteredTransactions = computed(() => {
  const query = search.value.toLowerCase()

  return transactions.value.filter((transaction) => {
    const matchesSearch =
      transaction.reference.toLowerCase().includes(query) ||
      transaction.description.toLowerCase().includes(query) ||
      transaction.account.toLowerCase().includes(query)

    const matchesType = selectedType.value === 'All' || transaction.type === selectedType.value

    const matchesStatus =
      selectedStatus.value === 'All' || transaction.status === selectedStatus.value

    const matchesStartDate = !startDate.value || transaction.date >= startDate.value

    const matchesEndDate = !endDate.value || transaction.date <= endDate.value

    return matchesSearch && matchesType && matchesStatus && matchesStartDate && matchesEndDate
  })
})

const postedTransactions = computed(
  () => transactions.value.filter((transaction) => transaction.status === 'Posted').length,
)

const pendingTransactions = computed(
  () =>
    transactions.value.filter((transaction) => ['Pending', 'Draft'].includes(transaction.status))
      .length,
)

const totalDebit = computed(() =>
  transactions.value
    .filter((transaction) => transaction.status === 'Posted')
    .reduce((sum, transaction) => sum + Number(transaction.debit), 0),
)

const totalCredit = computed(() =>
  transactions.value
    .filter((transaction) => transaction.status === 'Posted')
    .reduce((sum, transaction) => sum + Number(transaction.credit), 0),
)

const formatMoney = (value) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 2,
  }).format(value)

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

function nextReference(type) {
  const prefix = {
    Journal: 'JV',
    Receipt: 'RV',
    Payment: 'PV',
  }[type]

  const numbers = transactions.value
    .filter((transaction) => transaction.reference.startsWith(`${prefix}-`))
    .map((transaction) => Number(transaction.reference.split('-')[1]) || 0)

  const nextNumber = Math.max(0, ...numbers) + 1

  return `${prefix}-${String(nextNumber).padStart(4, '0')}`
}

function addTransaction() {
  if (
    !form.value.description.trim() ||
    !form.value.account ||
    !form.value.date ||
    Number(form.value.amount) <= 0
  ) {
    alert('Please complete all required fields with a valid amount.')
    return
  }

  if (form.value.date > new Date().toLocaleDateString('en-CA')) {
    alert('Transaction date cannot be in the future.')
    return
  }

  const transaction = {
    id: Date.now(),
    reference: nextReference(form.value.type),
    date: form.value.date,
    description: form.value.description.trim(),
    account: form.value.account,
    type: form.value.type,
    debit: Number(form.value.amount),
    credit: Number(form.value.amount),
    method: form.value.method,
    status: form.value.status,
  }

  transactions.value.unshift(transaction)
  showForm.value = false

  form.value = {
    date: new Date().toLocaleDateString('en-CA'),
    description: '',
    account: '',
    type: 'Journal',
    amount: 0,
    method: 'Journal Entry',
    status: 'Draft',
  }
}

function updateStatus(transaction, status) {
  transaction.status = status
  selectedTransaction.value = null
}

function resetFilters() {
  search.value = ''
  selectedType.value = 'All'
  selectedStatus.value = 'All'
  startDate.value = ''
  endDate.value = ''
}
</script>

<template>
  <Default>
    <main class="space-y-5 p-4 sm:p-6">
      <!-- Header -->
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage journal entries, receipts, payments and financial transactions.
          </p>
        </div>

        <button
          @click="showForm = !showForm"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          <UIcon name="i-lucide-plus" class="h-4 w-4" />
          New Transaction
        </button>
      </div>

      <!-- Summary -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Transactions</p>
            <div class="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/30">
              <UIcon
                name="i-lucide-arrow-left-right"
                class="h-5 w-5 text-blue-600 dark:text-blue-400"
              />
            </div>
          </div>
          <p class="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            {{ transactions.length }}
          </p>
          <p class="mt-1 text-xs text-gray-500">All recorded entries</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 dark:text-gray-400">Posted Entries</p>
            <div class="rounded-lg bg-green-50 p-2 dark:bg-green-900/30">
              <UIcon
                name="i-lucide-circle-check"
                class="h-5 w-5 text-green-600 dark:text-green-400"
              />
            </div>
          </div>
          <p class="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            {{ postedTransactions }}
          </p>
          <p class="mt-1 text-xs text-gray-500">Successfully posted</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 dark:text-gray-400">Pending / Draft</p>
            <div class="rounded-lg bg-amber-50 p-2 dark:bg-amber-900/30">
              <UIcon name="i-lucide-clock-3" class="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p class="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            {{ pendingTransactions }}
          </p>
          <p class="mt-1 text-xs text-gray-500">Awaiting finalization</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 dark:text-gray-400">Posted Debit Total</p>
            <div class="rounded-lg bg-purple-50 p-2 dark:bg-purple-900/30">
              <UIcon name="i-lucide-wallet" class="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p class="mt-3 text-xl font-bold text-gray-900 dark:text-white">
            {{ formatMoney(totalDebit) }}
          </p>
          <p class="mt-1 text-xs text-gray-500">Posted entry amount total</p>
        </div>
      </div>

      <!-- Create Form -->
      <div
        v-if="showForm"
        class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="mb-5 flex items-center justify-between">
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Create Transaction</h2>
            <p class="mt-1 text-sm text-gray-500">Enter the transaction details below.</p>
          </div>

          <button
            @click="showForm = false"
            class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close form"
          >
            <UIcon name="i-lucide-x" class="h-5 w-5" />
          </button>
        </div>

        <form
          @submit.prevent="addTransaction"
          class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Transaction Date *
            </label>
            <input
              v-model="form.date"
              type="date"
              :max="new Date().toLocaleDateString('en-CA')"
              required
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Transaction Type *
            </label>
            <select
              v-model="form.type"
              required
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="Journal">Journal</option>
              <option value="Receipt">Receipt</option>
              <option value="Payment">Payment</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Account *
            </label>
            <select
              v-model="form.account"
              required
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="" disabled>Select account</option>
              <option v-for="account in accounts" :key="account" :value="account">
                {{ account }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description *
            </label>
            <input
              v-model="form.description"
              required
              placeholder="Enter transaction description"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount (৳) *
            </label>
            <input
              v-model.number="form.amount"
              type="number"
              min="0.01"
              step="0.01"
              required
              placeholder="0.00"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Payment Method
            </label>
            <select
              v-model="form.method"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option>Journal Entry</option>
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>Cheque</option>
              <option>Mobile Banking</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Initial Status
            </label>
            <select
              v-model="form.status"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div class="flex items-end gap-2">
            <button
              type="submit"
              class="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              Save Transaction
            </button>
            <button
              type="button"
              @click="showForm = false"
              class="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Filters -->
      <div
        class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div class="relative xl:col-span-2">
            <UIcon
              name="i-lucide-search"
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            />
            <input
              v-model="search"
              placeholder="Search reference, description..."
              class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          <select
            v-model="selectedType"
            class="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          >
            <option v-for="type in types" :key="type" :value="type">
              {{ type === 'All' ? 'All Types' : type }}
            </option>
          </select>

          <select
            v-model="selectedStatus"
            class="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          >
            <option v-for="status in statuses" :key="status" :value="status">
              {{ status === 'All' ? 'All Statuses' : status }}
            </option>
          </select>

          <button
            @click="resetFilters"
            class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <UIcon name="i-lucide-rotate-ccw" class="h-4 w-4" />
            Reset Filters
          </button>
        </div>

        <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label class="mb-1 block text-xs font-medium text-gray-500">From Date</label>
            <input
              v-model="startDate"
              type="date"
              :max="endDate || undefined"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-gray-500">To Date</label>
            <input
              v-model="endDate"
              type="date"
              :min="startDate || undefined"
              :max="new Date().toLocaleDateString('en-CA')"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>
        </div>
      </div>

      <!-- Transaction Table -->
      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col gap-2 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
        >
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Transaction History</h2>
            <p class="mt-1 text-sm text-gray-500">
              {{ filteredTransactions.length }} transactions found
            </p>
          </div>
          <span class="text-xs text-gray-500"> Currency: BDT (৳) </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead
              class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/60 dark:text-gray-400"
            >
              <tr>
                <th class="px-5 py-3.5 font-semibold">Reference</th>
                <th class="px-5 py-3.5 font-semibold">Date</th>
                <th class="px-5 py-3.5 font-semibold">Description</th>
                <th class="px-5 py-3.5 font-semibold">Account</th>
                <th class="px-5 py-3.5 font-semibold">Type</th>
                <th class="px-5 py-3.5 text-right font-semibold">Debit</th>
                <th class="px-5 py-3.5 text-right font-semibold">Credit</th>
                <th class="px-5 py-3.5 text-center font-semibold">Status</th>
                <th class="px-5 py-3.5 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="transaction in filteredTransactions"
                :key="transaction.id"
                class="transition hover:bg-gray-50 dark:hover:bg-gray-800/40"
              >
                <td class="whitespace-nowrap px-5 py-4 font-semibold text-primary">
                  {{ transaction.reference }}
                </td>

                <td class="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-gray-300">
                  {{ formatDate(transaction.date) }}
                </td>

                <td class="px-5 py-4">
                  <p class="truncate font-medium text-gray-900 dark:text-white">
                    {{ transaction.description }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500">
                    {{ transaction.method }}
                  </p>
                </td>

                <td class="whitespace-nowrap px-5 py-4 text-gray-700 dark:text-gray-300">
                  {{ transaction.account }}
                </td>

                <td class="whitespace-nowrap px-5 py-4">
                  <span
                    :class="{
                      'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400':
                        transaction.type === 'Journal',
                      'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400':
                        transaction.type === 'Receipt',
                      'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400':
                        transaction.type === 'Payment',
                    }"
                    class="rounded-full px-2.5 py-1 text-xs font-medium"
                  >
                    {{ transaction.type }}
                  </span>
                </td>

                <td
                  class="whitespace-nowrap px-5 py-4 text-right font-medium tabular-nums text-gray-900 dark:text-white"
                >
                  {{ formatMoney(transaction.debit) }}
                </td>

                <td
                  class="whitespace-nowrap px-5 py-4 text-right font-medium tabular-nums text-gray-900 dark:text-white"
                >
                  {{ formatMoney(transaction.credit) }}
                </td>

                <td class="whitespace-nowrap px-5 py-4 text-center">
                  <span
                    :class="{
                      'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400':
                        transaction.status === 'Posted',
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300':
                        transaction.status === 'Draft',
                      'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400':
                        transaction.status === 'Pending',
                      'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400':
                        transaction.status === 'Cancelled',
                    }"
                    class="rounded-full px-2.5 py-1 text-xs font-medium"
                  >
                    {{ transaction.status }}
                  </span>
                </td>

                <td class="whitespace-nowrap px-5 py-4 text-right">
                  <button
                    @click="selectedTransaction = transaction"
                    title="View transaction"
                    class="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <UIcon name="i-lucide-eye" class="h-4 w-4" />
                  </button>
                </td>
              </tr>

              <tr v-if="filteredTransactions.length === 0">
                <td colspan="9" class="px-5 py-12 text-center">
                  <UIcon name="i-lucide-search-x" class="mx-auto h-8 w-8 text-gray-400" />
                  <p class="mt-2 font-medium text-gray-700 dark:text-gray-300">
                    No transactions found
                  </p>
                  <p class="mt-1 text-sm text-gray-500">
                    Change the filters or search for another transaction.
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
                  Filtered Total
                </td>
                <td
                  class="whitespace-nowrap px-5 py-4 text-right font-bold text-gray-900 dark:text-white"
                >
                  {{
                    formatMoney(
                      filteredTransactions.reduce((sum, item) => sum + Number(item.debit), 0),
                    )
                  }}
                </td>
                <td
                  class="whitespace-nowrap px-5 py-4 text-right font-bold text-gray-900 dark:text-white"
                >
                  {{
                    formatMoney(
                      filteredTransactions.reduce((sum, item) => sum + Number(item.credit), 0),
                    )
                  }}
                </td>
                <td colspan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Transaction Details Modal -->
      <div
        v-if="selectedTransaction"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="selectedTransaction = null"
      >
        <div class="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl dark:bg-gray-900">
          <div class="mb-5 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Transaction Details
              </h2>
              <p class="mt-1 text-sm text-primary">
                {{ selectedTransaction.reference }}
              </p>
            </div>
            <button
              @click="selectedTransaction = null"
              class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <UIcon name="i-lucide-x" class="h-5 w-5" />
            </button>
          </div>

          <div class="space-y-4">
            <div
              class="flex justify-between gap-4 border-b border-gray-100 pb-3 dark:border-gray-800"
            >
              <span class="text-sm text-gray-500">Date</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatDate(selectedTransaction.date) }}
              </span>
            </div>

            <div
              class="flex justify-between gap-4 border-b border-gray-100 pb-3 dark:border-gray-800"
            >
              <span class="text-sm text-gray-500">Description</span>
              <span
                class="max-w-[65%] text-right text-sm font-medium text-gray-900 dark:text-white"
              >
                {{ selectedTransaction.description }}
              </span>
            </div>

            <div
              class="flex justify-between gap-4 border-b border-gray-100 pb-3 dark:border-gray-800"
            >
              <span class="text-sm text-gray-500">Account</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ selectedTransaction.account }}
              </span>
            </div>

            <div
              class="flex justify-between gap-4 border-b border-gray-100 pb-3 dark:border-gray-800"
            >
              <span class="text-sm text-gray-500">Transaction Type</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ selectedTransaction.type }}
              </span>
            </div>

            <div
              class="flex justify-between gap-4 border-b border-gray-100 pb-3 dark:border-gray-800"
            >
              <span class="text-sm text-gray-500">Payment Method</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ selectedTransaction.method }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                <p class="text-xs text-gray-500">Debit</p>
                <p class="mt-1 font-bold text-blue-700 dark:text-blue-400">
                  {{ formatMoney(selectedTransaction.debit) }}
                </p>
              </div>
              <div class="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
                <p class="text-xs text-gray-500">Credit</p>
                <p class="mt-1 font-bold text-purple-700 dark:text-purple-400">
                  {{ formatMoney(selectedTransaction.credit) }}
                </p>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">Status</span>
              <span
                class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {{ selectedTransaction.status }}
              </span>
            </div>
          </div>

          <div class="mt-6 flex flex-wrap justify-end gap-2">
            <button
              v-if="['Draft', 'Pending'].includes(selectedTransaction.status)"
              @click="updateStatus(selectedTransaction, 'Posted')"
              class="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Post Transaction
            </button>

            <button
              v-if="
                selectedTransaction.status !== 'Cancelled' &&
                selectedTransaction.status !== 'Posted'
              "
              @click="updateStatus(selectedTransaction, 'Cancelled')"
              class="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20"
            >
              Cancel Transaction
            </button>

            <button
              @click="selectedTransaction = null"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </main>
  </Default>
</template>
