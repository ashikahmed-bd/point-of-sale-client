<script setup>
const sales = [
  {
    id: 'SALE-1024',
    customer: 'Ashik',
    items: 3,
    total: 2450,
    date: '10:42 AM',
  },
  {
    id: 'SALE-1023',
    customer: 'Walk-in Customer',
    items: 2,
    total: 1200,
    date: '10:15 AM',
  },
  {
    id: 'SALE-1022',
    customer: 'Rahim',
    items: 5,
    total: 4850,
    date: '09:38 AM',
  },
]
</script>

<template>
  <UModal
    title="Recent Sales"
    description="View your recent sales"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }"
    :ui="{
      content: 'z-30 sm:max-w-5xl',
    }"
  >
    <button
      type="button"
      class="flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
    >
      <UIcon name="i-lucide-file-clock" class="size-4" />
      <span>Recent</span>
    </button>

    <template #body>
      <div class="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="sale in sales" :key="sale.id">
              <td class="font-medium text-body">#{{ sale.id }}</td>

              <td>
                {{ sale.customer }}
              </td>

              <td>{{ sale.items }} Items</td>

              <td class="font-semibold text-body">৳{{ sale.total.toLocaleString() }}</td>

              <td>
                {{ sale.date }}
              </td>

              <td class="text-right">
                <UButton size="sm" color="primary" variant="soft" label="View" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </UModal>
</template>
