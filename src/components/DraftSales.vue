<script setup>
import { useCartStore } from '@/stores/cart'
import { useSaleStore } from '@/stores/sale'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const saleStore = useSaleStore()
const cartStore = useCartStore()

const { drafts } = storeToRefs(saleStore)

const resumeDraft = async (draft) => {
  cartStore.cart = { ...draft }
}

onMounted(async () => {
  await saleStore.getDraftsSales()
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
      <UIcon name="i-lucide-file-pen-line" class="size-4" />
      <span>Draft</span>
    </button>
    <template #content="{ close }">
      <div class="px-4">
        <div class="flex items-center justify-between gap-3 py-2.5 border-b border-border">
          <div class="min-w-0">
            <h3 class="flex items-center gap-2">
              <span class="text-base font-semibold text-heading"> Draft Sales</span>
              <UIcon
                name="i-lucide-refresh-cw"
                class="size-4 text-primary cursor-pointer transition-transform"
                :class="{ 'animate-spin': saleStore.loading }"
                @click="!saleStore.loading && saleStore.getDraftsSales()"
              />
            </h3>
            <p class="text-sm text-body">View and resume your draft sales</p>
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
          <EmptyState v-if="!drafts.data?.length" />

          <table v-else class="w-full text-sm text-left">
            <thead>
              <tr>
                <th>Draft</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Subtotal</th>
                <th>Discount</th>
                <th>Tax</th>
                <th>Total</th>
                <th>Saved</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="draft in drafts.data" :key="draft.id">
                <td>#{{ draft.id.slice(-6).toUpperCase() }}</td>

                <td>
                  <p>{{ draft.customer?.name ?? 'Walk-in Customer' }}</p>
                  <p>{{ draft.customer?.phone ?? 'No phone' }}</p>
                </td>

                <td>{{ draft.items?.length ?? 0 }} Items</td>

                <td>
                  {{ $currency(draft.subtotal) }}
                </td>
                <td>
                  {{ $currency(draft.discount) }}
                </td>
                <td>
                  {{ $currency(draft.tax) }}
                </td>
                <td>
                  {{ $currency(draft.total) }}
                </td>

                <td>
                  {{
                    new Date(draft.created_at)
                      .toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })
                      .replace(',', '')
                  }}
                </td>

                <td>
                  <UButton
                    size="sm"
                    color="primary"
                    variant="soft"
                    icon="i-lucide-play"
                    label="Resume"
                    @click="
                      () => {
                        resumeDraft(draft)
                        close()
                      }
                    "
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
