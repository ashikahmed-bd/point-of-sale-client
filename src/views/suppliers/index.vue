<script setup>
import { ref, computed } from 'vue'
import Default from '@/layouts/Default.vue'

const search = ref('')
const status = ref('all')
const currentPage = ref(1)
const perPage = 5

const suppliers = ref([
  {
    id: '01J9SUPPLIER001',
    name: 'Abdul Rahman',
    company_name: 'Rahman Traders',
    phone: '01712345678',
    email: 'rahman@example.com',
    city: 'Dhaka',
    state: 'Dhaka',
    opening_balance: 15000,
    credit_limit: 100000,
    is_active: true,
  },
  {
    id: '01J9SUPPLIER002',
    name: 'Karim Uddin',
    company_name: 'Dhaka Wholesale',
    phone: '01812345678',
    email: 'karim@example.com',
    city: 'Chattogram',
    state: 'Chattogram',
    opening_balance: 25000,
    credit_limit: 150000,
    is_active: true,
  },
  {
    id: '01J9SUPPLIER003',
    name: 'Mohammad Hasan',
    company_name: 'City Distributors',
    phone: '01912345678',
    email: 'hasan@example.com',
    city: 'Sylhet',
    state: 'Sylhet',
    opening_balance: 0,
    credit_limit: 50000,
    is_active: true,
  },
  {
    id: '01J9SUPPLIER004',
    name: 'Abdur Karim',
    company_name: 'Karim Enterprise',
    phone: '01612345678',
    email: 'karim.enterprise@example.com',
    city: 'Rajshahi',
    state: 'Rajshahi',
    opening_balance: 12500,
    credit_limit: 75000,
    is_active: false,
  },
  {
    id: '01J9SUPPLIER005',
    name: 'Jamal Hossain',
    company_name: 'New Market Supply',
    phone: '01512345678',
    email: 'jamal@example.com',
    city: 'Khulna',
    state: 'Khulna',
    opening_balance: 8000,
    credit_limit: null,
    is_active: true,
  },
  {
    id: '01J9SUPPLIER006',
    name: 'Sabbir Ahmed',
    company_name: 'Sabbir Corporation',
    phone: '01312345678',
    email: 'sabbir@example.com',
    city: 'Dhaka',
    state: 'Dhaka',
    opening_balance: 5000,
    credit_limit: 80000,
    is_active: true,
  },
])

const filteredSuppliers = computed(() => {
  const query = search.value.toLowerCase().trim()

  return suppliers.value.filter((supplier) => {
    const matchesSearch = [
      supplier.name,
      supplier.company_name,
      supplier.phone,
      supplier.email,
      supplier.city,
    ].some((value) => value?.toLowerCase().includes(query))

    const matchesStatus =
      status.value === 'all' ||
      (status.value === 'active' && supplier.is_active) ||
      (status.value === 'inactive' && !supplier.is_active)

    return matchesSearch && matchesStatus
  })
})

const totalPages = computed(() => Math.ceil(filteredSuppliers.value.length / perPage))

const paginatedSuppliers = computed(() => {
  const start = (currentPage.value - 1) * perPage

  return filteredSuppliers.value.slice(start, start + perPage)
})

const totalOpeningBalance = computed(() =>
  suppliers.value.reduce((sum, supplier) => sum + Number(supplier.opening_balance || 0), 0),
)

const activeSuppliers = computed(
  () => suppliers.value.filter((supplier) => supplier.is_active).length,
)

const inactiveSuppliers = computed(
  () => suppliers.value.filter((supplier) => !supplier.is_active).length,
)

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
  })
    .format(amount || 0)
    .replace('BDT', '৳')

const handleFilter = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  search.value = ''
  status.value = 'all'
  currentPage.value = 1
}

const toggleStatus = (supplier) => {
  supplier.is_active = !supplier.is_active
}
</script>

<template>
  <Default>
    <main class="space-y-4 p-4">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">Suppliers</h1>

          <p class="mt-1 text-sm text-slate-500">
            Manage your suppliers, contact details and opening balances.
          </p>
        </div>

        <RouterLink
          :to="{ name: 'suppliers.create' }"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <UIcon name="i-lucide-plus" class="size-4" />
          Add Supplier
        </RouterLink>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <!-- Total Suppliers -->
        <div class="rounded-xl border border-slate-200 bg-white p-5">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-slate-500">Total Suppliers</p>

            <div
              class="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"
            >
              <UIcon name="i-lucide-users" class="size-5" />
            </div>
          </div>

          <h2 class="mt-4 text-2xl font-bold text-slate-900">
            {{ suppliers.length }}
          </h2>

          <p class="mt-2 text-xs text-slate-500">All registered suppliers</p>
        </div>

        <!-- Active Suppliers -->
        <div class="rounded-xl border border-slate-200 bg-white p-5">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-slate-500">Active Suppliers</p>

            <div
              class="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"
            >
              <UIcon name="i-lucide-user-check" class="size-5" />
            </div>
          </div>

          <h2 class="mt-4 text-2xl font-bold text-slate-900">
            {{ activeSuppliers }}
          </h2>

          <p class="mt-2 text-xs text-emerald-600">Currently active suppliers</p>
        </div>

        <!-- Inactive Suppliers -->
        <div class="rounded-xl border border-slate-200 bg-white p-5">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-slate-500">Inactive Suppliers</p>

            <div
              class="flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"
            >
              <UIcon name="i-lucide-user-round-x" class="size-5" />
            </div>
          </div>

          <h2 class="mt-4 text-2xl font-bold text-slate-900">
            {{ inactiveSuppliers }}
          </h2>

          <p class="mt-2 text-xs text-slate-500">Disabled supplier accounts</p>
        </div>

        <!-- Opening Balance -->
        <div class="rounded-xl border border-slate-200 bg-white p-5">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-slate-500">Opening Balance</p>

            <div
              class="flex size-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600"
            >
              <UIcon name="i-lucide-wallet" class="size-5" />
            </div>
          </div>

          <h2 class="mt-4 text-2xl font-bold text-slate-900">
            {{ formatCurrency(totalOpeningBalance) }}
          </h2>

          <p class="mt-2 text-xs text-slate-500">Combined opening balances</p>
        </div>
      </div>

      <!-- Supplier Table -->
      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <!-- Toolbar -->
        <div
          class="flex flex-col gap-4 border-b border-slate-200 p-5 xl:flex-row xl:items-center xl:justify-between"
        >
          <div>
            <h2 class="text-base font-semibold text-slate-900">Supplier List</h2>

            <p class="mt-1 text-sm text-slate-500">View and manage your supplier information.</p>
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
                placeholder="Search supplier..."
                class="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:w-64"
                @input="handleFilter"
              />
            </div>

            <select
              v-model="status"
              class="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-primary"
              @change="handleFilter"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
          <table class="w-full text-left">
            <thead class="bg-slate-50">
              <tr>
                <th
                  class="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Supplier
                </th>

                <th
                  class="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Contact
                </th>

                <th
                  class="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Location
                </th>

                <th
                  class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Opening Balance
                </th>

                <th
                  class="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Credit Limit
                </th>

                <th
                  class="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Status
                </th>

                <th
                  class="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="supplier in paginatedSuppliers"
                :key="supplier.id"
                class="transition hover:bg-slate-50/70"
              >
                <!-- Supplier -->
                <td class="whitespace-nowrap px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                    >
                      {{ supplier.name.charAt(0).toUpperCase() }}
                    </div>

                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-800">
                        {{ supplier.name }}
                      </p>

                      <p class="mt-0.5 text-xs text-slate-500">
                        {{ supplier.company_name || 'Individual Supplier' }}
                      </p>
                    </div>
                  </div>
                </td>

                <!-- Contact -->
                <td class="whitespace-nowrap px-5 py-4">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2 text-sm text-slate-700">
                      <UIcon name="i-lucide-phone" class="size-3.5 text-slate-400" />
                      {{ supplier.phone }}
                    </div>

                    <div
                      v-if="supplier.email"
                      class="flex items-center gap-2 text-xs text-slate-500"
                    >
                      <UIcon name="i-lucide-mail" class="size-3.5 text-slate-400" />
                      {{ supplier.email }}
                    </div>
                  </div>
                </td>

                <!-- Location -->
                <td class="whitespace-nowrap px-5 py-4">
                  <div class="flex items-center gap-2 text-sm text-slate-600">
                    <UIcon name="i-lucide-map-pin" class="size-4 shrink-0 text-slate-400" />

                    <div>
                      <p>{{ supplier.city || '—' }}</p>
                      <p v-if="supplier.state" class="mt-0.5 text-xs text-slate-400">
                        {{ supplier.state }}
                      </p>
                    </div>
                  </div>
                </td>

                <!-- Opening Balance -->
                <td
                  class="whitespace-nowrap px-5 py-4 text-right text-sm font-medium text-slate-800"
                >
                  {{ formatCurrency(supplier.opening_balance) }}
                </td>

                <!-- Credit Limit -->
                <td class="whitespace-nowrap px-5 py-4 text-right">
                  <span class="text-sm font-medium text-slate-700">
                    {{
                      supplier.credit_limit != null
                        ? formatCurrency(supplier.credit_limit)
                        : 'No Limit'
                    }}
                  </span>
                </td>

                <!-- Status -->
                <td class="whitespace-nowrap px-5 py-4 text-center">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
                    :class="
                      supplier.is_active
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                        : 'bg-slate-100 text-slate-600 ring-slate-500/20'
                    "
                  >
                    <span
                      class="size-1.5 rounded-full"
                      :class="supplier.is_active ? 'bg-emerald-500' : 'bg-slate-400'"
                    ></span>

                    {{ supplier.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="whitespace-nowrap px-5 py-4">
                  <div class="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      title="View supplier"
                      class="flex size-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      <UIcon name="i-lucide-eye" class="size-4" />
                    </button>

                    <button
                      type="button"
                      title="Edit supplier"
                      class="flex size-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-amber-50 hover:text-amber-600"
                    >
                      <UIcon name="i-lucide-pencil" class="size-4" />
                    </button>

                    <button
                      type="button"
                      :title="supplier.is_active ? 'Deactivate supplier' : 'Activate supplier'"
                      class="flex size-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                      @click="toggleStatus(supplier)"
                    >
                      <UIcon
                        :name="
                          supplier.is_active ? 'i-lucide-user-round-x' : 'i-lucide-user-round-check'
                        "
                        class="size-4"
                      />
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="paginatedSuppliers.length === 0">
                <td colspan="7" class="px-5 py-16 text-center">
                  <div
                    class="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100"
                  >
                    <UIcon name="i-lucide-users-round" class="size-6 text-slate-400" />
                  </div>

                  <p class="mt-3 text-sm font-semibold text-slate-800">No suppliers found</p>

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
              {{ filteredSuppliers.length ? (currentPage - 1) * perPage + 1 : 0 }}
            </span>
            to
            <span class="font-medium text-slate-800">
              {{ Math.min(currentPage * perPage, filteredSuppliers.length) }}
            </span>
            of
            <span class="font-medium text-slate-800">
              {{ filteredSuppliers.length }}
            </span>
            suppliers
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
    </main>
  </Default>
</template>
