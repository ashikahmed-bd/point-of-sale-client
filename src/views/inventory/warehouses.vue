<script setup>
import { computed, ref } from 'vue'
import Default from '@/layouts/Default.vue'

const search = ref('')
const statusFilter = ref('All')
const showForm = ref(false)

const warehouses = ref([
  {
    id: 1,
    name: 'Main Warehouse',
    code: 'WH-001',
    manager: 'Rahim Ahmed',
    phone: '01712345678',
    city: 'Dhaka',
    address: 'Mirpur, Dhaka',
    products: 1250,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Branch Warehouse',
    code: 'WH-002',
    manager: 'Karim Hasan',
    phone: '01812345678',
    city: 'Chattogram',
    address: 'Agrabad, Chattogram',
    products: 840,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Dhaka Distribution Center',
    code: 'WH-003',
    manager: 'Sabbir Hossain',
    phone: '01912345678',
    city: 'Dhaka',
    address: 'Uttara, Dhaka',
    products: 620,
    status: 'Active',
  },
  {
    id: 4,
    name: 'Old Storage',
    code: 'WH-004',
    manager: 'Nusrat Jahan',
    phone: '01612345678',
    city: 'Gazipur',
    address: 'Tongi, Gazipur',
    products: 0,
    status: 'Inactive',
  },
])

const form = ref({
  name: '',
  code: '',
  manager: '',
  phone: '',
  city: '',
  address: '',
})

const filteredWarehouses = computed(() => {
  const query = search.value.toLowerCase().trim()

  return warehouses.value.filter((warehouse) => {
    const matchesSearch = [
      warehouse.name,
      warehouse.code,
      warehouse.manager,
      warehouse.city,
      warehouse.phone,
    ].some((value) => value.toLowerCase().includes(query))

    const matchesStatus = statusFilter.value === 'All' || warehouse.status === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

const activeCount = computed(
  () => warehouses.value.filter((item) => item.status === 'Active').length,
)

const totalProducts = computed(() =>
  warehouses.value.reduce((total, item) => total + item.products, 0),
)

function createWarehouse() {
  if (
    !form.value.name.trim() ||
    !form.value.code.trim() ||
    !form.value.manager.trim() ||
    !form.value.city.trim()
  ) {
    alert('Please fill in all required fields.')
    return
  }

  const codeExists = warehouses.value.some(
    (item) => item.code.toLowerCase() === form.value.code.trim().toLowerCase(),
  )

  if (codeExists) {
    alert('Warehouse code already exists.')
    return
  }

  warehouses.value.unshift({
    id: Date.now(),
    name: form.value.name.trim(),
    code: form.value.code.trim(),
    manager: form.value.manager.trim(),
    phone: form.value.phone.trim(),
    city: form.value.city.trim(),
    address: form.value.address.trim() || '—',
    products: 0,
    status: 'Active',
  })

  form.value = {
    name: '',
    code: '',
    manager: '',
    phone: '',
    city: '',
    address: '',
  }

  showForm.value = false
}

function toggleStatus(warehouse) {
  warehouse.status = warehouse.status === 'Active' ? 'Inactive' : 'Active'
}
</script>

<template>
  <Default>
    <main class="space-y-4 p-4">
      <!-- Header -->
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Warehouses
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your warehouses, locations and inventory storage.
          </p>
        </div>

        <button
          type="button"
          @click="showForm = !showForm"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <UIcon name="i-lucide-plus" class="size-4" />
          Add Warehouse
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Warehouses</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ warehouses.length }}
              </h2>
            </div>
            <div class="rounded-lg bg-blue-50 p-3 dark:bg-blue-500/10">
              <UIcon name="i-lucide-warehouse" class="size-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500">All registered locations</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Active Warehouses</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ activeCount }}
              </h2>
            </div>
            <div class="rounded-lg bg-green-50 p-3 dark:bg-green-500/10">
              <UIcon
                name="i-lucide-check-circle"
                class="size-6 text-green-600 dark:text-green-400"
              />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500">Currently operational</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Inactive Warehouses</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ warehouses.length - activeCount }}
              </h2>
            </div>
            <div class="rounded-lg bg-orange-50 p-3 dark:bg-orange-500/10">
              <UIcon
                name="i-lucide-circle-pause"
                class="size-6 text-orange-600 dark:text-orange-400"
              />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500">Not currently operational</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Product Stock</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ totalProducts.toLocaleString() }}
              </h2>
            </div>
            <div class="rounded-lg bg-purple-50 p-3 dark:bg-purple-500/10">
              <UIcon name="i-lucide-box" class="size-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500">Across all locations</p>
        </div>
      </div>

      <!-- Add Warehouse Form -->
      <div
        v-if="showForm"
        class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="mb-5 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Add New Warehouse</h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter the warehouse details below.
            </p>
          </div>

          <button
            type="button"
            @click="showForm = false"
            class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close form"
          >
            <UIcon name="i-lucide-x" class="size-5" />
          </button>
        </div>

        <form @submit.prevent="createWarehouse" class="space-y-5">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Warehouse Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="e.g. Main Warehouse"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Warehouse Code <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.code"
                type="text"
                required
                placeholder="e.g. WH-005"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Warehouse Manager <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.manager"
                type="text"
                required
                placeholder="Manager name"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <input
                v-model="form.phone"
                type="tel"
                placeholder="01XXXXXXXXX"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                City <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.city"
                type="text"
                required
                placeholder="e.g. Dhaka"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Address
              </label>
              <input
                v-model="form.address"
                type="text"
                placeholder="Street, area, location"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div class="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
            <button
              type="button"
              @click="showForm = false"
              class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              <UIcon name="i-lucide-plus" class="size-4" />
              Save Warehouse
            </button>
          </div>
        </form>
      </div>

      <!-- Warehouse Table -->
      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col gap-4 border-b border-gray-200 p-4 dark:border-gray-800 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Warehouse List</h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ filteredWarehouses.length }} warehouses found
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
                placeholder="Search warehouses..."
                class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-64 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <select
              v-model="statusFilter"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead
              class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/60 dark:text-gray-400"
            >
              <tr>
                <th class="px-5 py-4 font-semibold">Warehouse</th>
                <th class="px-5 py-4 font-semibold">Code</th>
                <th class="px-5 py-4 font-semibold">Manager</th>
                <th class="px-5 py-4 font-semibold">Contact</th>
                <th class="px-5 py-4 font-semibold">Location</th>
                <th class="px-5 py-4 text-right font-semibold">Products</th>
                <th class="px-5 py-4 font-semibold">Status</th>
                <th class="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="warehouse in filteredWarehouses"
                :key="warehouse.id"
                class="transition hover:bg-gray-50/70 dark:hover:bg-gray-800/40"
              >
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"
                    >
                      <UIcon name="i-lucide-warehouse" class="size-5 text-primary" />
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900 dark:text-white">
                        {{ warehouse.name }}
                      </p>
                      <p class="mt-1 text-xs text-gray-500">
                        {{ warehouse.address }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="px-5 py-4">
                  <span
                    class="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {{ warehouse.code }}
                  </span>
                </td>

                <td class="px-5 py-4 font-medium text-gray-700 dark:text-gray-300">
                  {{ warehouse.manager }}
                </td>

                <td class="px-5 py-4 text-gray-600 dark:text-gray-400">
                  {{ warehouse.phone || '—' }}
                </td>

                <td class="px-5 py-4 text-gray-600 dark:text-gray-400">
                  {{ warehouse.city }}
                </td>

                <td class="px-5 py-4 text-right font-semibold text-gray-900 dark:text-white">
                  {{ warehouse.products.toLocaleString() }}
                </td>

                <td class="px-5 py-4">
                  <span
                    :class="
                      warehouse.status === 'Active'
                        ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    "
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                  >
                    <span
                      :class="warehouse.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'"
                      class="size-1.5 rounded-full"
                    />
                    {{ warehouse.status }}
                  </span>
                </td>

                <td class="px-5 py-4">
                  <div class="flex justify-end gap-1">
                    <button
                      type="button"
                      @click="toggleStatus(warehouse)"
                      :title="
                        warehouse.status === 'Active'
                          ? 'Deactivate warehouse'
                          : 'Activate warehouse'
                      "
                      class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
                    >
                      <UIcon
                        :name="
                          warehouse.status === 'Active'
                            ? 'i-lucide-toggle-right'
                            : 'i-lucide-toggle-left'
                        "
                        class="size-4"
                      />
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="filteredWarehouses.length === 0">
                <td colspan="8" class="px-5 py-14 text-center">
                  <UIcon name="i-lucide-warehouse" class="mx-auto size-10 text-gray-300" />
                  <p class="mt-3 font-medium text-gray-700 dark:text-gray-300">
                    No warehouses found
                  </p>
                  <p class="mt-1 text-sm text-gray-500">Try changing your search or filter.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="flex flex-col gap-2 border-t border-gray-200 px-5 py-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
        >
          <p>Showing {{ filteredWarehouses.length }} of {{ warehouses.length }} warehouses</p>
          <p>Warehouse Management</p>
        </div>
      </div>
    </main>
  </Default>
</template>
