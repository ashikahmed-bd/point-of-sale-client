<script setup>
import Default from '@/layouts/Default.vue'
import { useCustomerStore } from '@/stores/customer'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const customerStore = useCustomerStore()
const { customers } = storeToRefs(customerStore)

const loadCustomers = async () => {
  await customerStore.all()
}

onMounted(() => {
  loadCustomers()
})
</script>

<template>
  <Default>
    <main class="space-y-4 p-4">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-lg font-bold text-body">Customers</h1>
          <p class="mt-0.5 text-sm text-body/60">Manage your customers and their information</p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-body hover:bg-slate-50"
          >
            <UIcon name="i-lucide-download" class="size-4" />
            Export
          </button>

          <button
            type="button"
            @click="$router.push({ name: 'customers.create' })"
            class="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            <UIcon name="i-lucide-plus" class="size-4" />
            Add Customer
          </button>
        </div>
      </div>

      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div class="flex items-center justify-between gap-3 border-b border-slate-100 p-3">
          <div class="relative max-w-sm flex-1">
            <UIcon
              name="i-lucide-search"
              class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-body/40"
            />

            <input
              type="search"
              placeholder="Search customers..."
              class="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-body outline-none placeholder:text-body/40 focus:border-primary"
            />
          </div>

          <div class="text-sm text-body/50">12 customers</div>
        </div>

        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="customer in customers.data" :key="customer.id">
                <td>
                  <div class="flex items-center gap-3">
                    <div
                      class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                    >
                      {{ customer.name?.charAt(0)?.toUpperCase() }}
                    </div>

                    <div class="min-w-0">
                      <p class="truncate text-sm font-semibold text-body">
                        {{ customer.name }}
                      </p>

                      <p class="truncate text-xs text-body/50">
                        {{ customer.email || 'No email' }}
                      </p>
                    </div>
                  </div>
                </td>

                <td>
                  <div class="flex items-center gap-2 text-sm text-body">
                    <UIcon name="i-lucide-phone" class="size-4 text-body/40" />

                    {{ customer.phone }}
                  </div>
                </td>

                <td>
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-map-pin" class="size-4 text-body/40" />

                    <div>
                      <p class="text-sm text-body">
                        {{ customer.city || '-' }}
                      </p>

                      <p class="text-xs text-body/50">
                        {{ customer.postcode || '' }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="text-right">
                  <p
                    class="text-sm font-semibold"
                    :class="Number(customer.opening_balance) > 0 ? 'text-amber-600' : 'text-body'"
                  >
                    {{ $currency(customer.opening_balance) }}
                  </p>

                  <p class="text-xs text-body/40">Limit {{ $currency(customer.credit_limit) }}</p>
                </td>

                <td class="text-center">
                  <span
                    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                    :class="
                      customer.is_active
                        ? 'bg-green-50 text-green-600'
                        : 'bg-slate-100 text-slate-500'
                    "
                  >
                    {{ customer.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>

                <td class="text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      title="View"
                      class="rounded-md p-1.5 text-body/50 hover:bg-slate-100 hover:text-body"
                      @click="viewCustomer(customer)"
                    >
                      <UIcon name="i-lucide-eye" class="size-4" />
                    </button>

                    <button
                      type="button"
                      title="Edit"
                      class="rounded-md p-1.5 text-body/50 hover:bg-primary/10 hover:text-primary"
                      @click="editCustomer(customer)"
                    >
                      <UIcon name="i-lucide-pencil" class="size-4" />
                    </button>

                    <button
                      type="button"
                      title="Delete"
                      class="rounded-md p-1.5 text-body/50 hover:bg-red-50 hover:text-red-600"
                      @click="deleteCustomer(customer)"
                    >
                      <UIcon name="i-lucide-trash-2" class="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </Default>
</template>
