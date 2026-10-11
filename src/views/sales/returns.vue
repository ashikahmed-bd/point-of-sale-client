<script setup>
import { computed, ref } from 'vue'
import Default from '@/layouts/Default.vue'

const search = ref('')
const statusFilter = ref('All')
const showForm = ref(false)
const selectedReturn = ref(null)

const returns = ref([
  {
    id: 1,
    returnNo: 'RET-0001',
    saleNo: 'INV-1025',
    customer: 'Rahim Ahmed',
    date: '2026-10-10',
    items: 2,
    amount: 1500,
    refundMethod: 'Cash',
    reason: 'Damaged product',
    status: 'Completed',
  },
  {
    id: 2,
    returnNo: 'RET-0002',
    saleNo: 'INV-1028',
    customer: 'Karim Hasan',
    date: '2026-10-10',
    items: 1,
    amount: 850,
    refundMethod: 'Mobile Banking',
    reason: 'Wrong item',
    status: 'Pending',
  },
  {
    id: 3,
    returnNo: 'RET-0003',
    saleNo: 'INV-1019',
    customer: 'Nusrat Jahan',
    date: '2026-10-09',
    items: 3,
    amount: 2400,
    refundMethod: 'Card',
    reason: 'Customer changed mind',
    status: 'Approved',
  },
  {
    id: 4,
    returnNo: 'RET-0004',
    saleNo: 'INV-1012',
    customer: 'Sabbir Hossain',
    date: '2026-10-08',
    items: 1,
    amount: 550,
    refundMethod: 'Cash',
    reason: 'Defective product',
    status: 'Rejected',
  },
  {
    id: 5,
    returnNo: 'RET-0005',
    saleNo: 'INV-1008',
    customer: 'Ayesha Akter',
    date: '2026-10-07',
    items: 2,
    amount: 1200,
    refundMethod: 'Mobile Banking',
    reason: 'Wrong size',
    status: 'Completed',
  },
])

const form = ref({
  saleNo: '',
  customer: '',
  date: new Date().toISOString().slice(0, 10),
  items: 1,
  amount: '',
  refundMethod: 'Cash',
  reason: 'Damaged product',
  notes: '',
})

const filteredReturns = computed(() => {
  const query = search.value.toLowerCase().trim()

  return returns.value.filter((item) => {
    const matchesSearch = [item.returnNo, item.saleNo, item.customer, item.reason].some((value) =>
      value.toLowerCase().includes(query),
    )

    const matchesStatus = statusFilter.value === 'All' || item.status === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

const totalReturns = computed(() => returns.value.length)

const pendingCount = computed(
  () => returns.value.filter((item) => item.status === 'Pending').length,
)

const completedCount = computed(
  () => returns.value.filter((item) => item.status === 'Completed').length,
)

const refundedAmount = computed(() =>
  returns.value
    .filter((item) => item.status === 'Completed')
    .reduce((total, item) => total + item.amount, 0),
)

function resetForm() {
  form.value = {
    saleNo: '',
    customer: '',
    date: new Date().toISOString().slice(0, 10),
    items: 1,
    amount: '',
    refundMethod: 'Cash',
    reason: 'Damaged product',
    notes: '',
  }
  showForm.value = false
}

function createReturn() {
  const amount = Number(form.value.amount)
  const items = Number(form.value.items)

  if (
    !form.value.saleNo.trim() ||
    !form.value.customer.trim() ||
    !form.value.date ||
    !Number.isInteger(items) ||
    items < 1 ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    alert('Please enter valid return details.')
    return
  }

  if (form.value.date > new Date().toISOString().slice(0, 10)) {
    alert('Return date cannot be in the future.')
    return
  }

  returns.value.unshift({
    id: Date.now(),
    returnNo: `RET-${String(returns.value.length + 1).padStart(4, '0')}`,
    saleNo: form.value.saleNo.trim(),
    customer: form.value.customer.trim(),
    date: form.value.date,
    items,
    amount,
    refundMethod: form.value.refundMethod,
    reason: form.value.reason,
    notes: form.value.notes.trim(),
    status: 'Pending',
  })

  resetForm()
}

function updateStatus(item, status) {
  item.status = status
  selectedReturn.value = null
}

function viewReturn(item) {
  selectedReturn.value = item
}

function formatAmount(amount) {
  return `৳${Number(amount).toLocaleString('en-BD')}`
}

function formatDate(date) {
  if (!date) return '—'

  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<template>
  <Default>
    <main class="space-y-4 p-4">
      <!-- Header -->
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sales Returns
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage returned products, refund requests and return approvals.
          </p>
        </div>

        <button
          type="button"
          @click="showForm = !showForm"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <UIcon name="i-lucide-plus" class="size-4" />
          Create Return
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Returns</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ totalReturns }}
              </h2>
            </div>
            <div class="rounded-lg bg-blue-50 p-3 dark:bg-blue-500/10">
              <UIcon name="i-lucide-undo-2" class="size-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500">All return requests</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Pending Returns</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ pendingCount }}
              </h2>
            </div>
            <div class="rounded-lg bg-orange-50 p-3 dark:bg-orange-500/10">
              <UIcon name="i-lucide-clock-3" class="size-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500">Awaiting review</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Completed Returns</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ completedCount }}
              </h2>
            </div>
            <div class="rounded-lg bg-green-50 p-3 dark:bg-green-500/10">
              <UIcon
                name="i-lucide-check-circle"
                class="size-6 text-green-600 dark:text-green-400"
              />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500">Refund processed</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Refunded Amount</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ formatAmount(refundedAmount) }}
              </h2>
            </div>
            <div class="rounded-lg bg-purple-50 p-3 dark:bg-purple-500/10">
              <UIcon name="i-lucide-wallet" class="size-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500">Completed refunds only</p>
        </div>
      </div>

      <!-- Create Return Form -->
      <div
        v-if="showForm"
        class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="mb-5 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Create Sales Return</h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter the original sale and returned item details.
            </p>
          </div>

          <button
            type="button"
            @click="resetForm"
            class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close form"
          >
            <UIcon name="i-lucide-x" class="size-5" />
          </button>
        </div>

        <form @submit.prevent="createReturn" class="space-y-5">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Invoice Number <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.saleNo"
                type="text"
                required
                placeholder="e.g. INV-1029"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Customer Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.customer"
                type="text"
                required
                placeholder="Enter customer name"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Return Date <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.date"
                type="date"
                :max="new Date().toISOString().slice(0, 10)"
                required
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Number of Items <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.items"
                type="number"
                min="1"
                step="1"
                required
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Refund Amount (৳) <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.amount"
                type="number"
                min="0.01"
                step="0.01"
                required
                placeholder="0.00"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Refund Method
              </label>
              <select
                v-model="form.refundMethod"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option>Cash</option>
                <option>Card</option>
                <option>Mobile Banking</option>
                <option>Store Credit</option>
              </select>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Return Reason
              </label>
              <select
                v-model="form.reason"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option>Damaged product</option>
                <option>Defective product</option>
                <option>Wrong item</option>
                <option>Wrong size</option>
                <option>Customer changed mind</option>
                <option>Other</option>
              </select>
            </div>

            <div class="md:col-span-2 xl:col-span-2">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Notes
              </label>
              <input
                v-model="form.notes"
                type="text"
                placeholder="Additional details (optional)"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div class="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
            <button
              type="button"
              @click="resetForm"
              class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              <UIcon name="i-lucide-plus" class="size-4" />
              Submit Return
            </button>
          </div>
        </form>
      </div>

      <!-- Return Details -->
      <div
        v-if="selectedReturn"
        class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Return Details — {{ selectedReturn.returnNo }}
            </h2>
            <p class="mt-1 text-sm text-gray-500">Original invoice: {{ selectedReturn.saleNo }}</p>
          </div>
          <button
            type="button"
            @click="selectedReturn = null"
            class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close details"
          >
            <UIcon name="i-lucide-x" class="size-5" />
          </button>
        </div>

        <div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/60">
            <p class="text-xs text-gray-500">Customer</p>
            <p class="mt-1 font-semibold text-gray-900 dark:text-white">
              {{ selectedReturn.customer }}
            </p>
          </div>
          <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/60">
            <p class="text-xs text-gray-500">Return Date</p>
            <p class="mt-1 font-semibold text-gray-900 dark:text-white">
              {{ formatDate(selectedReturn.date) }}
            </p>
          </div>
          <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/60">
            <p class="text-xs text-gray-500">Refund Amount</p>
            <p class="mt-1 font-semibold text-gray-900 dark:text-white">
              {{ formatAmount(selectedReturn.amount) }}
            </p>
          </div>
          <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/60">
            <p class="text-xs text-gray-500">Refund Method</p>
            <p class="mt-1 font-semibold text-gray-900 dark:text-white">
              {{ selectedReturn.refundMethod }}
            </p>
          </div>
        </div>

        <div class="mt-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <p class="text-xs text-gray-500">Return Reason</p>
          <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
            {{ selectedReturn.reason }}
          </p>
          <p v-if="selectedReturn.notes" class="mt-2 text-sm text-gray-500">
            {{ selectedReturn.notes }}
          </p>
        </div>

        <div class="mt-5 flex flex-wrap justify-end gap-2">
          <button
            v-if="selectedReturn.status === 'Pending'"
            type="button"
            @click="updateStatus(selectedReturn, 'Approved')"
            class="rounded-lg border border-green-200 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50 dark:border-green-900 dark:text-green-400 dark:hover:bg-green-500/10"
          >
            Approve Return
          </button>

          <button
            v-if="selectedReturn.status === 'Pending'"
            type="button"
            @click="updateStatus(selectedReturn, 'Rejected')"
            class="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            Reject Return
          </button>

          <button
            v-if="selectedReturn.status === 'Approved'"
            type="button"
            @click="updateStatus(selectedReturn, 'Completed')"
            class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Mark Refund Completed
          </button>
        </div>
      </div>

      <!-- Returns Table -->
      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col gap-4 border-b border-gray-200 p-4 dark:border-gray-800 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Return History</h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ filteredReturns.length }} return records found
            </p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <div class="relative">
              <UIcon
                name="i-lucide-search"
                class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
              />
              <input
                v-model="search"
                type="search"
                placeholder="Search return or invoice..."
                class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-64 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <select
              v-model="statusFilter"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Completed</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead
              class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/60 dark:text-gray-400"
            >
              <tr>
                <th class="px-5 py-4 font-semibold">Return No.</th>
                <th class="px-5 py-4 font-semibold">Original Invoice</th>
                <th class="px-5 py-4 font-semibold">Customer</th>
                <th class="px-5 py-4 font-semibold">Return Date</th>
                <th class="px-5 py-4 text-right font-semibold">Items</th>
                <th class="px-5 py-4 text-right font-semibold">Refund Amount</th>
                <th class="px-5 py-4 font-semibold">Refund Method</th>
                <th class="px-5 py-4 font-semibold">Status</th>
                <th class="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="item in filteredReturns"
                :key="item.id"
                class="transition hover:bg-gray-50/70 dark:hover:bg-gray-800/40"
              >
                <td class="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                  {{ item.returnNo }}
                </td>

                <td class="px-5 py-4 font-mono text-xs text-gray-600 dark:text-gray-400">
                  {{ item.saleNo }}
                </td>

                <td class="px-5 py-4 font-medium text-gray-700 dark:text-gray-300">
                  {{ item.customer }}
                </td>

                <td class="px-5 py-4 text-gray-600 dark:text-gray-400">
                  {{ formatDate(item.date) }}
                </td>

                <td class="px-5 py-4 text-right text-gray-700 dark:text-gray-300">
                  {{ item.items }}
                </td>

                <td class="px-5 py-4 text-right font-semibold text-gray-900 dark:text-white">
                  {{ formatAmount(item.amount) }}
                </td>

                <td class="px-5 py-4 text-gray-600 dark:text-gray-400">
                  {{ item.refundMethod }}
                </td>

                <td class="px-5 py-4">
                  <span
                    :class="{
                      'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400':
                        item.status === 'Pending',
                      'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400':
                        item.status === 'Approved',
                      'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400':
                        item.status === 'Completed',
                      'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400':
                        item.status === 'Rejected',
                    }"
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                  >
                    <span
                      :class="{
                        'bg-orange-500': item.status === 'Pending',
                        'bg-blue-500': item.status === 'Approved',
                        'bg-green-500': item.status === 'Completed',
                        'bg-red-500': item.status === 'Rejected',
                      }"
                      class="size-1.5 rounded-full"
                    />
                    {{ item.status }}
                  </span>
                </td>

                <td class="px-5 py-4">
                  <div class="flex justify-end">
                    <button
                      type="button"
                      @click="viewReturn(item)"
                      title="View return details"
                      class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
                    >
                      <UIcon name="i-lucide-eye" class="size-4" />
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="filteredReturns.length === 0">
                <td colspan="9" class="px-5 py-14 text-center">
                  <UIcon name="i-lucide-undo-2" class="mx-auto size-10 text-gray-300" />
                  <p class="mt-3 font-medium text-gray-700 dark:text-gray-300">No returns found</p>
                  <p class="mt-1 text-sm text-gray-500">Try changing your search or filter.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="flex flex-col gap-2 border-t border-gray-200 px-5 py-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
        >
          <p>Showing {{ filteredReturns.length }} of {{ returns.length }} returns</p>
          <p>Sales Return Management</p>
        </div>
      </div>
    </main>
  </Default>
</template>
