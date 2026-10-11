<script setup>
import { computed, ref } from 'vue'
import Default from '@/layouts/Default.vue'

const search = ref('')
const selectedType = ref('All')
const showForm = ref(false)

const accounts = ref([
  {
    code: '1000',
    name: 'Cash in Hand',
    type: 'Assets',
    balance: 25000,
    normalBalance: 'Debit',
    status: 'Active',
  },
  {
    code: '1010',
    name: 'Bank Account',
    type: 'Assets',
    balance: 150000,
    normalBalance: 'Debit',
    status: 'Active',
  },
  {
    code: '1100',
    name: 'Accounts Receivable',
    type: 'Assets',
    balance: 45000,
    normalBalance: 'Debit',
    status: 'Active',
  },
  {
    code: '1200',
    name: 'Inventory',
    type: 'Assets',
    balance: 320000,
    normalBalance: 'Debit',
    status: 'Active',
  },
  {
    code: '2000',
    name: 'Accounts Payable',
    type: 'Liabilities',
    balance: 85000,
    normalBalance: 'Credit',
    status: 'Active',
  },
  {
    code: '2100',
    name: 'VAT Payable',
    type: 'Liabilities',
    balance: 12000,
    normalBalance: 'Credit',
    status: 'Active',
  },
  {
    code: '3000',
    name: 'Owner Equity',
    type: 'Equity',
    balance: 250000,
    normalBalance: 'Credit',
    status: 'Active',
  },
  {
    code: '4000',
    name: 'Sales Revenue',
    type: 'Revenue',
    balance: 450000,
    normalBalance: 'Credit',
    status: 'Active',
  },
  {
    code: '5000',
    name: 'Cost of Goods Sold',
    type: 'Expenses',
    balance: 280000,
    normalBalance: 'Debit',
    status: 'Active',
  },
  {
    code: '5100',
    name: 'Rent Expense',
    type: 'Expenses',
    balance: 18000,
    normalBalance: 'Debit',
    status: 'Active',
  },
])

const form = ref({
  code: '',
  name: '',
  type: 'Assets',
  balance: 0,
  normalBalance: 'Debit',
})

const types = ['All', 'Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses']

const filteredAccounts = computed(() => {
  return accounts.value.filter((account) => {
    const query = search.value.toLowerCase()

    return (
      (account.name.toLowerCase().includes(query) || account.code.includes(query)) &&
      (selectedType.value === 'All' || account.type === selectedType.value)
    )
  })
})

const totalDebit = computed(() =>
  accounts.value
    .filter((account) => account.normalBalance === 'Debit')
    .reduce((sum, account) => sum + Number(account.balance), 0),
)

const totalCredit = computed(() =>
  accounts.value
    .filter((account) => account.normalBalance === 'Credit')
    .reduce((sum, account) => sum + Number(account.balance), 0),
)

const activeAccounts = computed(
  () => accounts.value.filter((account) => account.status === 'Active').length,
)

const formatMoney = (value) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 2,
  }).format(value)

function addAccount() {
  if (!form.value.code.trim() || !form.value.name.trim()) return

  if (accounts.value.some((account) => account.code === form.value.code.trim())) {
    alert('This account code already exists.')
    return
  }

  accounts.value.unshift({
    ...form.value,
    code: form.value.code.trim(),
    name: form.value.name.trim(),
    balance: Number(form.value.balance) || 0,
    status: 'Active',
  })

  form.value = {
    code: '',
    name: '',
    type: 'Assets',
    balance: 0,
    normalBalance: 'Debit',
  }

  showForm.value = false
}

function toggleStatus(account) {
  account.status = account.status === 'Active' ? 'Inactive' : 'Active'
}
</script>

<template>
  <Default>
    <main class="space-y-5 p-4 sm:p-6">
      <!-- Page Header -->
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Chart of Accounts</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your financial accounts, account types and balances.
          </p>
        </div>

        <button
          @click="showForm = !showForm"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          <UIcon name="i-lucide-plus" class="h-4 w-4" />
          Add Account
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Accounts</p>
            <div class="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/30">
              <UIcon name="i-lucide-wallet" class="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p class="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            {{ accounts.length }}
          </p>
          <p class="mt-1 text-xs text-gray-500">Across all account types</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 dark:text-gray-400">Active Accounts</p>
            <div class="rounded-lg bg-green-50 p-2 dark:bg-green-900/30">
              <UIcon
                name="i-lucide-circle-check"
                class="h-5 w-5 text-green-600 dark:text-green-400"
              />
            </div>
          </div>
          <p class="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            {{ activeAccounts }}
          </p>
          <p class="mt-1 text-xs text-gray-500">Currently enabled accounts</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 dark:text-gray-400">Debit Balance</p>
            <div class="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-900/30">
              <UIcon
                name="i-lucide-trending-up"
                class="h-5 w-5 text-indigo-600 dark:text-indigo-400"
              />
            </div>
          </div>
          <p class="mt-3 text-xl font-bold text-gray-900 dark:text-white">
            {{ formatMoney(totalDebit) }}
          </p>
          <p class="mt-1 text-xs text-gray-500">Normal debit balance accounts</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500 dark:text-gray-400">Credit Balance</p>
            <div class="rounded-lg bg-purple-50 p-2 dark:bg-purple-900/30">
              <UIcon
                name="i-lucide-trending-down"
                class="h-5 w-5 text-purple-600 dark:text-purple-400"
              />
            </div>
          </div>
          <p class="mt-3 text-xl font-bold text-gray-900 dark:text-white">
            {{ formatMoney(totalCredit) }}
          </p>
          <p class="mt-1 text-xs text-gray-500">Normal credit balance accounts</p>
        </div>
      </div>

      <!-- Account Form -->
      <div
        v-if="showForm"
        class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="mb-5 flex items-center justify-between">
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Create Account</h2>
            <p class="mt-1 text-sm text-gray-500">Enter the new account details.</p>
          </div>

          <button
            @click="showForm = false"
            class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <UIcon name="i-lucide-x" class="h-5 w-5" />
          </button>
        </div>

        <form
          @submit.prevent="addAccount"
          class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Account Code *
            </label>
            <input
              v-model="form.code"
              required
              placeholder="e.g. 1020"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Account Name *
            </label>
            <input
              v-model="form.name"
              required
              placeholder="Enter account name"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Account Type *
            </label>
            <select
              v-model="form.type"
              required
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option v-for="type in types.slice(1)" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Opening Balance
            </label>
            <input
              v-model.number="form.balance"
              type="number"
              min="0"
              step="0.01"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Normal Balance *
            </label>
            <select
              v-model="form.normalBalance"
              required
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="Debit">Debit</option>
              <option value="Credit">Credit</option>
            </select>
          </div>

          <div class="flex items-end gap-2">
            <button
              type="submit"
              class="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              Save Account
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

      <!-- Account Table -->
      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col gap-4 border-b border-gray-200 p-4 dark:border-gray-800 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">All Accounts</h2>
            <p class="mt-1 text-sm text-gray-500">Browse and manage your chart of accounts.</p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <div class="relative">
              <UIcon
                name="i-lucide-search"
                class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              />
              <input
                v-model="search"
                placeholder="Search account..."
                class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-64 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>

            <select
              v-model="selectedType"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option v-for="type in types" :key="type" :value="type">
                {{ type === 'All' ? 'All Account Types' : type }}
              </option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead
              class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/60 dark:text-gray-400"
            >
              <tr>
                <th class="px-5 py-3.5 font-semibold">Code</th>
                <th class="px-5 py-3.5 font-semibold">Account Name</th>
                <th class="px-5 py-3.5 font-semibold">Type</th>
                <th class="px-5 py-3.5 font-semibold">Normal Balance</th>
                <th class="px-5 py-3.5 text-right font-semibold">Balance</th>
                <th class="px-5 py-3.5 text-center font-semibold">Status</th>
                <th class="px-5 py-3.5 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="account in filteredAccounts"
                :key="account.code"
                class="transition hover:bg-gray-50 dark:hover:bg-gray-800/40"
              >
                <td
                  class="whitespace-nowrap px-5 py-4 font-medium text-gray-600 dark:text-gray-300"
                >
                  {{ account.code }}
                </td>

                <td class="whitespace-nowrap px-5 py-4 font-medium text-gray-900 dark:text-white">
                  {{ account.name }}
                </td>

                <td class="whitespace-nowrap px-5 py-4">
                  <span
                    class="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {{ account.type }}
                  </span>
                </td>

                <td class="whitespace-nowrap px-5 py-4">
                  <span
                    :class="
                      account.normalBalance === 'Debit'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-purple-600 dark:text-purple-400'
                    "
                  >
                    {{ account.normalBalance }}
                  </span>
                </td>

                <td
                  class="whitespace-nowrap px-5 py-4 text-right font-medium tabular-nums text-gray-900 dark:text-white"
                >
                  {{ formatMoney(account.balance) }}
                </td>

                <td class="whitespace-nowrap px-5 py-4 text-center">
                  <span
                    :class="
                      account.status === 'Active'
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    "
                    class="rounded-full px-2.5 py-1 text-xs font-medium"
                  >
                    {{ account.status }}
                  </span>
                </td>

                <td class="whitespace-nowrap px-5 py-4 text-right">
                  <button
                    @click="toggleStatus(account)"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <UIcon
                      :name="account.status === 'Active' ? 'i-lucide-ban' : 'i-lucide-check-circle'"
                      class="h-3.5 w-3.5"
                    />
                    {{ account.status === 'Active' ? 'Deactivate' : 'Activate' }}
                  </button>
                </td>
              </tr>

              <tr v-if="filteredAccounts.length === 0">
                <td colspan="7" class="px-5 py-12 text-center">
                  <UIcon name="i-lucide-search-x" class="mx-auto h-8 w-8 text-gray-400" />
                  <p class="mt-2 font-medium text-gray-700 dark:text-gray-300">No accounts found</p>
                  <p class="mt-1 text-sm text-gray-500">Try another search term or account type.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="border-t border-gray-200 px-5 py-3 text-xs text-gray-500 dark:border-gray-800">
          Showing {{ filteredAccounts.length }} of {{ accounts.length }} accounts
        </div>
      </div>
    </main>
  </Default>
</template>
