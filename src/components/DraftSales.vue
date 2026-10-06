<script setup>
const drafts = [
  {
    id: 'DRAFT-1024',
    customer: 'Ashik',
    items: 3,
    total: 2450,
    date: '10:42 AM',
  },
  {
    id: 'DRAFT-1023',
    customer: 'Walk-in Customer',
    items: 2,
    total: 1200,
    date: '10:15 AM',
  },
  {
    id: 'DRAFT-1022',
    customer: 'Rahim',
    items: 5,
    total: 4850,
    date: '09:38 AM',
  },
]
</script>

<template>
  <UModal
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
      <UIcon name="i-lucide-pause-circle" class="size-4" />
      <span>Hold</span>
    </button>

    <template #body>
      <div class="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Draft</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Saved</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="draft in drafts" :key="draft.id">
              <td class="font-medium text-body">#{{ draft.id }}</td>

              <td>
                {{ draft.customer }}
              </td>

              <td>{{ draft.items }} Items</td>

              <td class="font-semibold text-body">৳{{ draft.total.toLocaleString() }}</td>

              <td>
                {{ draft.date }}
              </td>

              <td class="text-right">
                <UButton
                  size="sm"
                  color="primary"
                  variant="soft"
                  icon="i-lucide-play"
                  label="Resume"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </UModal>
</template>
