<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import Default from '@/layouts/Default.vue'
import { useSupplierStore } from '@/stores/supplier'
import { storeToRefs } from 'pinia'

const supplierStore = useSupplierStore()

const { suppliers } = storeToRefs(supplierStore)

const filters = reactive({
  search: '',
  status: '',
  page: 1,
})

const loadSuppliers = async () => {
  await supplierStore.all(filters)
}

onMounted(() => {
  loadSuppliers()
})
</script>

<template>
  <Default>
    <main class="space-y-4">
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

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            {{ suppliers.data?.length }}
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

          <h2 class="mt-4 text-2xl font-bold text-slate-900">44</h2>

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

          <h2 class="mt-4 text-2xl font-bold text-slate-900">42</h2>

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

          <h2 class="mt-4 text-2xl font-bold text-slate-900">4242</h2>

          <p class="mt-2 text-xs text-slate-500">Combined opening balances</p>
        </div>
      </div>

      <div class="overflow-hidden rounded-xl bg-white">
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
                v-model="filters.search"
                type="text"
                placeholder="Search supplier..."
                class="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:w-64"
                @input="loadSuppliers"
              />
            </div>

            <select
              v-model="filters.status"
              class="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-primary"
              @change="loadSuppliers"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <UIcon name="i-lucide-rotate-ccw" class="size-4" />
              Reset
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Opening Balance</th>
                <th>Credit Limit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="supplier in suppliers.data"
                :key="supplier.id"
                class="transition hover:bg-slate-50/70"
              >
                <td>
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

                <td>
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

                <td>
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

                <td>
                  {{ $currency(supplier.opening_balance) }}
                </td>

                <td>
                  <span class="text-sm font-medium text-slate-700">
                    {{
                      supplier.credit_limit != null ? $urrency(supplier.credit_limit) : 'No Limit'
                    }}
                  </span>
                </td>

                <td>
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

                <td>
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
              <tr v-if="suppliers.data?.length === 0">
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
      </div>
    </main>
  </Default>
</template>
