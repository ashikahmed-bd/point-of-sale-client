<script setup>
import { ref, computed } from 'vue'
import Default from '@/layouts/Default.vue'

const search = ref('')
const status = ref('all')
const currentPage = ref(1)
const perPage = 5

const purchases = ref([
  {
    id: 1,
    invoice: 'PUR-2026-0148',
    date: '2026-10-09',
    supplier: 'Rahman Traders',
    items: 12,
    total: 18500,
    paid: 18500,
    due: 0,
    status: 'Paid',
  },
  {
    id: 2,
    invoice: 'PUR-2026-0147',
    date: '2026-10-08',
    supplier: 'Dhaka Wholesale',
    items: 8,
    total: 24800,
    paid: 15000,
    due: 9800,
    status: 'Partial',
  },
  {
    id: 3,
    invoice: 'PUR-2026-0146',
    date: '2026-10-07',
    supplier: 'City Distributors',
    items: 15,
    total: 32500,
    paid: 0,
    due: 32500,
    status: 'Unpaid',
  },
  {
    id: 4,
    invoice: 'PUR-2026-0145',
    date: '2026-10-06',
    supplier: 'Karim Enterprise',
    items: 6,
    total: 12800,
    paid: 12800,
    due: 0,
    status: 'Paid',
  },
  {
    id: 5,
    invoice: 'PUR-2026-0144',
    date: '2026-10-05',
    supplier: 'New Market Supply',
    items: 10,
    total: 21400,
    paid: 10000,
    due: 11400,
    status: 'Partial',
  },
  {
    id: 6,
    invoice: 'PUR-2026-0143',
    date: '2026-10-04',
    supplier: 'Rahman Traders',
    items: 9,
    total: 15600,
    paid: 15600,
    due: 0,
    status: 'Paid',
  },
])

const filteredPurchases = computed(() => {
  const query = search.value.toLowerCase().trim()

  return purchases.value.filter((purchase) => {
    const matchesSearch =
      purchase.invoice.toLowerCase().includes(query) ||
      purchase.supplier.toLowerCase().includes(query)

    const matchesStatus = status.value === 'all' || purchase.status.toLowerCase() === status.value

    return matchesSearch && matchesStatus
  })
})

const totalPages = computed(() => Math.ceil(filteredPurchases.value.length / perPage))

const paginatedPurchases = computed(() => {
  const start = (currentPage.value - 1) * perPage

  return filteredPurchases.value.slice(start, start + perPage)
})

const totalPurchases = computed(() =>
  purchases.value.reduce((sum, purchase) => sum + purchase.total, 0),
)

const totalPaid = computed(() => purchases.value.reduce((sum, purchase) => sum + purchase.paid, 0))

const totalDue = computed(() => purchases.value.reduce((sum, purchase) => sum + purchase.due, 0))

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
  })
    .format(amount)
    .replace('BDT', '৳')

const formatDate = (date) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))

const statusClass = (value) => {
  const classes = {
    Paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    Partial: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    Unpaid: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  }

  return classes[value] || 'bg-slate-100 text-slate-600 ring-slate-500/20'
}

const handleSearch = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  search.value = ''
  status.value = 'all'
  currentPage.value = 1
}
</script>

<template>
  <Default>
    <main class="p-4">
      <div class="mx-auto max-w-screen-2xl space-y-6">
        <!-- Header -->
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div class="mb-2 flex items-center gap-2 text-xs text-slate-500">
              <span>Dashboard</span>
              <span>/</span>
              <span class="text-primary">Purchases</span>
            </div>

            <h1 class="text-2xl font-bold tracking-tight text-slate-900">Purchases</h1>

            <p class="mt-1 text-sm text-slate-500">
              Manage your purchase orders and supplier invoices.
            </p>
          </div>

          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <UIcon name="i-lucide-plus" class="size-4" />
            New Purchase
          </button>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-xl border border-slate-200 bg-white p-5">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-slate-500">Total Purchases</p>
              <div
                class="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"
              >
                <UIcon name="i-lucide-shopping-bag" class="size-5" />
              </div>
            </div>

            <h2 class="mt-4 text-2xl font-bold text-slate-900">
              {{ formatCurrency(totalPurchases) }}
            </h2>

            <p class="mt-2 text-xs text-slate-500">{{ purchases.length }} purchase invoices</p>
          </div>

          <div class="rounded-xl border border-slate-200 bg-white p-5">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-slate-500">Total Paid</p>
              <div
                class="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"
              >
                <UIcon name="i-lucide-circle-check" class="size-5" />
              </div>
            </div>

            <h2 class="mt-4 text-2xl font-bold text-slate-900">
              {{ formatCurrency(totalPaid) }}
            </h2>

            <p class="mt-2 text-xs text-emerald-600">Payments completed or received</p>
          </div>

          <div class="rounded-xl border border-slate-200 bg-white p-5">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-slate-500">Total Due</p>
              <div
                class="flex size-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600"
              >
                <UIcon name="i-lucide-wallet" class="size-5" />
              </div>
            </div>

            <h2 class="mt-4 text-2xl font-bold text-slate-900">
              {{ formatCurrency(totalDue) }}
            </h2>

            <p class="mt-2 text-xs text-rose-600">Outstanding supplier balance</p>
          </div>

          <div class="rounded-xl border border-slate-200 bg-white p-5">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-slate-500">Total Invoices</p>
              <div
                class="flex size-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600"
              >
                <UIcon name="i-lucide-file-text" class="size-5" />
              </div>
            </div>

            <h2 class="mt-4 text-2xl font-bold text-slate-900">
              {{ purchases.length }}
            </h2>

            <p class="mt-2 text-xs text-slate-500">All purchase transactions</p>
          </div>
        </div>

        <!-- Purchases Table -->
        <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <!-- Table Header -->
          <div
            class="flex flex-col gap-4 border-b border-slate-200 p-5 xl:flex-row xl:items-center xl:justify-between"
          >
            <div>
              <h2 class="text-base font-semibold text-slate-900">Purchase List</h2>
              <p class="mt-1 text-sm text-slate-500">View and manage all your purchases.</p>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row">
              <div class="relative">
                <UIcon
                  name="i-lucide-search"
                  class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                />

                <input
                  v-model="search"
                  type="text"
                  placeholder="Search invoice, supplier..."
                  class="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:w-64"
                  @input="handleSearch"
                />
              </div>

              <select
                v-model="status"
                class="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-primary"
                @change="handleSearch"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
              </select>

              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                @click="resetFilters"
              >
                <UIcon name="i-lucide-rotate-ccw" class="size-4" />
                Reset
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full min-w-[1050px] text-left">
              <thead class="bg-slate-50">
                <tr>
                  <th
                    class="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Invoice
                  </th>
                  <th
                    class="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Date
                  </th>
                  <th
                    class="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Supplier
                  </th>
                  <th
                    class="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Items
                  </th>
                  <th
                    class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Total
                  </th>
                  <th
                    class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Paid
                  </th>
                  <th
                    class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Due
                  </th>
                  <th
                    class="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Status
                  </th>
                  <th
                    class="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="purchase in paginatedPurchases"
                  :key="purchase.id"
                  class="transition hover:bg-slate-50/70"
                >
                  <td class="whitespace-nowrap px-5 py-4">
                    <span class="text-sm font-semibold text-primary">
                      {{ purchase.invoice }}
                    </span>
                  </td>

                  <td class="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                    {{ formatDate(purchase.date) }}
                  </td>

                  <td class="whitespace-nowrap px-5 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600"
                      >
                        {{ purchase.supplier.charAt(0) }}
                      </div>

                      <span class="text-sm font-medium text-slate-800">
                        {{ purchase.supplier }}
                      </span>
                    </div>
                  </td>

                  <td class="whitespace-nowrap px-5 py-4 text-center text-sm text-slate-600">
                    {{ purchase.items }}
                  </td>

                  <td
                    class="whitespace-nowrap px-5 py-4 text-right text-sm font-semibold text-slate-800"
                  >
                    {{ formatCurrency(purchase.total) }}
                  </td>

                  <td class="whitespace-nowrap px-5 py-4 text-right text-sm text-emerald-700">
                    {{ formatCurrency(purchase.paid) }}
                  </td>

                  <td class="whitespace-nowrap px-5 py-4 text-right text-sm text-rose-600">
                    {{ formatCurrency(purchase.due) }}
                  </td>

                  <td class="whitespace-nowrap px-5 py-4 text-center">
                    <span
                      class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
                      :class="statusClass(purchase.status)"
                    >
                      {{ purchase.status }}
                    </span>
                  </td>

                  <td class="whitespace-nowrap px-5 py-4">
                    <div class="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        title="View purchase"
                        class="flex size-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        <UIcon name="i-lucide-eye" class="size-4" />
                      </button>

                      <button
                        type="button"
                        title="Edit purchase"
                        class="flex size-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-amber-50 hover:text-amber-600"
                      >
                        <UIcon name="i-lucide-pencil" class="size-4" />
                      </button>

                      <button
                        type="button"
                        title="More options"
                        class="flex size-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        <UIcon name="i-lucide-ellipsis" class="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="paginatedPurchases.length === 0">
                  <td colspan="9" class="px-5 py-16 text-center">
                    <div
                      class="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100"
                    >
                      <UIcon name="i-lucide-search-x" class="size-6 text-slate-400" />
                    </div>

                    <p class="mt-3 text-sm font-semibold text-slate-800">No purchases found</p>

                    <p class="mt-1 text-sm text-slate-500">Try changing your search or filters.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div
            class="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <p class="text-sm text-slate-500">
              Showing
              <span class="font-medium text-slate-800">
                {{ filteredPurchases.length ? (currentPage - 1) * perPage + 1 : 0 }}
              </span>
              to
              <span class="font-medium text-slate-800">
                {{ Math.min(currentPage * perPage, filteredPurchases.length) }}
              </span>
              of
              <span class="font-medium text-slate-800">
                {{ filteredPurchases.length }}
              </span>
              results
            </p>

            <div class="flex items-center gap-2">
              <button
                type="button"
                :disabled="currentPage === 1"
                class="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                @click="currentPage--"
              >
                <UIcon name="i-lucide-chevron-left" class="size-4" />
              </button>

              <button
                v-for="page in totalPages"
                :key="page"
                type="button"
                class="flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition"
                :class="
                  currentPage === page
                    ? 'border-primary bg-primary text-white'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                "
                @click="currentPage = page"
              >
                {{ page }}
              </button>

              <button
                type="button"
                :disabled="currentPage >= totalPages || totalPages === 0"
                class="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                @click="currentPage++"
              >
                <UIcon name="i-lucide-chevron-right" class="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </Default>
</template>
