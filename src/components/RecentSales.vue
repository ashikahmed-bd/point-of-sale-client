<script setup>
import { useSaleStore } from '@/stores/sale'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const saleStore = useSaleStore()

const { sales } = storeToRefs(saleStore)

onMounted(async () => {
  await saleStore.getRecentSales()
})
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
              <th>Payment</th>
              <th>Status</th>
              <th class="text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="sale in sales.data" :key="sale.id">
              <td>
                <div class="font-medium text-body">#{{ sale.invoice_no }}</div>
                <div class="mt-0.5 text-xs text-muted">
                  {{ sale.account?.name }}
                </div>
              </td>

              <td>
                <div class="font-medium text-body">
                  {{ sale.customer?.name ?? 'Walk-in Customer' }}
                </div>

                <div v-if="sale.customer?.phone" class="text-xs text-muted">
                  {{ sale.customer.phone }}
                </div>
              </td>

              <td>
                <span class="text-sm text-body">
                  {{ sale.items?.length ?? 0 }}
                </span>

                <span class="ml-1 text-sm text-muted">
                  {{ (sale.items?.length ?? 0) === 1 ? 'Item' : 'Items' }}
                </span>
              </td>

              <td>
                <div class="font-semibold text-body">
                  {{ $currency(sale.total) }}
                </div>

                <div v-if="Number(sale.due_amount) > 0" class="text-xs text-error">
                  Due {{ $currency(sale.due_amount) }}
                </div>
              </td>

              <td>
                <span class="text-sm text-body">
                  {{ $date(sale.created_at) }}
                </span>
              </td>
              <td>
                <span class="text-xs text-muted">
                  {{ sale.payment }}
                </span>
              </td>
              <td>
                <span class="text-xs text-muted">
                  {{ sale.status }}
                </span>
              </td>

              <td class="text-right">
                <UButton
                  size="sm"
                  color="primary"
                  variant="soft"
                  icon="i-lucide-eye"
                  label="View"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </UModal>
</template>
