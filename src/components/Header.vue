<script setup>
defineProps({
  sidebar: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:sidebar'])

const switchStore = async (store) => {
  await apiClient.post('/api/store/switch', {
    store_id: store.id,
  })

  window.location.reload()
}
</script>

<template>
  <header class="sticky top-0 z-50 py-2.5 border-b border-border bg-white">
    <div class="flex h-full items-center">
      <button
        type="button"
        class="ml-2 flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 lg:hidden"
        @click="emit('update:sidebar', !sidebar)"
      >
        <UIcon :name="sidebar ? 'i-lucide-x' : 'i-lucide-menu'" class="size-5" />
      </button>

      <div class="flex h-full w-60 shrink-0 items-center px-4">
        <RouterLink to="/" class="flex items-center">
          <img src="/logo.png" alt="Buyzin" class="h-9 w-auto" />
        </RouterLink>
      </div>

      <div class="flex min-w-0 flex-1 items-center gap-3 px-4">
        <div class="relative w-full max-w-sm hidden sm:block">
          <UIcon
            name="i-lucide-search"
            class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            placeholder="Search orders, products, customers..."
            class="w-full rounded border border-slate-200 bg-slate-50 py-2 pl-9 pr-16 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />

          <div
            class="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-400 sm:flex"
          >
            <UIcon name="i-lucide-command" class="size-3" />
            <span>K</span>
          </div>
        </div>

        <div class="ml-auto flex shrink-0 items-center gap-1">
          <button
            type="button"
            class="relative flex size-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
          >
            <UIcon name="i-lucide-bell" class="size-5" />

            <span
              class="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold leading-none text-white ring-2 ring-white"
            >
              12
            </span>
          </button>

          <button
            type="button"
            class="flex items-center gap-2 rounded-lg p-1.5 text-left transition hover:bg-slate-50"
          >
            <img
              src="https://placehold.co/80x80"
              alt="Administrator"
              class="size-8 shrink-0 rounded-full object-cover"
            />

            <div class="hidden min-w-0 lg:block">
              <p class="max-w-32 truncate text-sm font-semibold leading-4 text-slate-800">
                Administrator
              </p>

              <p class="mt-0.5 max-w-32 truncate text-xs leading-4 text-slate-500">
                Buyzin Express
              </p>
            </div>

            <UIcon name="i-lucide-chevron-down" class="hidden size-4 text-slate-400 lg:block" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
