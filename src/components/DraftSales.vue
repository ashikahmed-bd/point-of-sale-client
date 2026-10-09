<script setup>
import { useCartStore } from '@/stores/cart'
import { useSaleStore } from '@/stores/sale'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const saleStore = useSaleStore()
const cartStore = useCartStore()

const { drafts } = storeToRefs(saleStore)

const resumeDraft = async (draft) => {
  console.log(draft)
  cartStore.cart = { ...draft }
  cartStore.draft = false
}

onMounted(async () => {
  await saleStore.getDraftsSales()
})
</script>

<template>
  <UModal
    v-model:open="cartStore.draft"
    title="Draft Sales"
    description="View and resume your draft sales"
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
      <UIcon name="i-lucide-file-pen-line" class="size-4" />
      <span>Draft</span>
    </button>

    <template #body>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
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
                  @click="resumeDraft(draft, close)"
                />
              </td>
            </tr>

            <tr v-if="!drafts.data?.length">
              <td colspan="6">No draft orders found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </UModal>
</template>
