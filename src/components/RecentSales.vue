<script setup>
import { useSaleStore } from '@/stores/sale'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const saleStore = useSaleStore()

const { recent } = storeToRefs(saleStore)

onMounted(async () => {
  await saleStore.getRecentSales()
})
</script>

<template>
  <UModal
    :ui="{
      content: 'z-30 sm:max-w-5xl',
    }"
  >
    <button
      type="button"
      class="flex items-center gap-2 text-sm font-medium text-body transition hover:text-primary"
    >
      <UIcon name="i-lucide-file-clock" class="size-4" />
      <span>Recent</span>
    </button>

    <template #content="{ close }">
      <div class="px-4">
        <div class="flex items-center justify-between gap-3 py-2.5 border-b border-border">
          <div class="min-w-0">
            <h3 class="flex items-center gap-2">
              <span class="text-base font-semibold text-heading">Recent Sales</span>
              <UIcon
                name="i-lucide-refresh-cw"
                class="size-4 text-primary cursor-pointer transition-transform"
                :class="{ 'animate-spin': saleStore.loading }"
                @click="!saleStore.loading && saleStore.getRecentSales()"
              />
            </h3>
            <p class="text-sm text-body">View your recent sales</p>
          </div>

          <button
            type="button"
            class="flex size-8 items-center justify-center rounded-full border border-primary/30 text-primary transition hover:bg-primary hover:text-white"
            @click="close"
          >
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>
        <div class="overflow-x-auto py-2.5">
          <EmptyState v-if="!recent.data?.length" />
          <table v-else>
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
              <tr v-for="sale in recent.data" :key="sale.id">
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
                  <span
                    class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 capitalize"
                  >
                    {{ sale.payment }}
                  </span>
                </td>

                <td>
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize"
                    :class="{
                      'bg-green-50 text-green-700': sale.status === 'completed',
                      'bg-yellow-50 text-yellow-700': sale.status === 'pending',
                      'bg-red-50 text-red-700': sale.status === 'cancelled',
                      'bg-gray-100 text-gray-700': !['completed', 'pending', 'cancelled'].includes(
                        sale.status,
                      ),
                    }"
                  >
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
      </div>
    </template>
  </UModal>
</template>
