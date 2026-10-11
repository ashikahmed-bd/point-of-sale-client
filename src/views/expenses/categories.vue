<script setup>
import { reactive, ref } from 'vue'
import Default from '@/layouts/Default.vue'
import BaseInput from '@/components/BaseInput.vue'

const form = reactive({
  name: '',
  description: '',
  is_active: true,
})

const categories = ref([
  {
    id: 1,
    name: 'Office Rent',
    description: 'Monthly office rental expenses',
    is_active: true,
  },
  {
    id: 2,
    name: 'Utilities',
    description: 'Electricity, water and gas bills',
    is_active: true,
  },
  {
    id: 3,
    name: 'Transportation',
    description: 'Travel and transport expenses',
    is_active: false,
  },
])

const submit = () => {
  if (!form.name.trim()) return

  categories.value.unshift({
    id: Date.now(),
    name: form.name.trim(),
    description: form.description.trim(),
    is_active: form.is_active,
  })

  form.name = ''
  form.description = ''
  form.is_active = true
}

const removeCategory = (id) => {
  categories.value = categories.value.filter((item) => item.id !== id)
}
</script>

<template>
  <Default>
    <main class="space-y-4 p-4">
      <!-- Header -->
      <div class="flex items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-semibold text-slate-800">Expense Categories</h1>
          <p class="mt-1 text-sm text-slate-500">Manage and organize your expense categories.</p>
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          @click="$router.back()"
        >
          <UIcon name="i-lucide-arrow-left" class="size-4" />
          Back
        </button>
      </div>

      <!-- Left List / Right Create -->
      <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-5">
        <!-- Category List -->
        <section class="overflow-hidden rounded-xl border border-slate-200 bg-white lg:col-span-3">
          <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div class="flex items-center gap-3">
              <div
                class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
              >
                <UIcon name="i-lucide-tags" class="size-5" />
              </div>

              <div>
                <h2 class="text-sm font-semibold text-slate-800">Category List</h2>
                <p class="mt-0.5 text-xs text-slate-500">All expense categories</p>
              </div>
            </div>

            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {{ categories.length }} Categories
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th class="px-5 py-3 font-medium">Category</th>
                  <th class="px-4 py-3 font-medium">Status</th>
                  <th class="px-4 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="category in categories"
                  :key="category.id"
                  class="transition hover:bg-slate-50/70"
                >
                  <td class="px-5 py-4">
                    <div class="flex items-start gap-3">
                      <div
                        class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                      >
                        <UIcon name="i-lucide-folder" class="size-4" />
                      </div>

                      <div class="min-w-0">
                        <p class="font-medium text-slate-800">
                          {{ category.name }}
                        </p>
                        <p class="mt-1 max-w-64 truncate text-xs text-slate-500">
                          {{ category.description || 'No description' }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td class="px-4 py-4">
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                      :class="
                        category.is_active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      "
                    >
                      <span
                        class="size-1.5 rounded-full"
                        :class="category.is_active ? 'bg-emerald-500' : 'bg-slate-400'"
                      ></span>
                      {{ category.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>

                  <td class="px-4 py-4">
                    <div class="flex justify-end">
                      <button
                        type="button"
                        title="Delete category"
                        class="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        @click="removeCategory(category.id)"
                      >
                        <UIcon name="i-lucide-trash-2" class="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="categories.length === 0">
                  <td colspan="3" class="px-5 py-12 text-center">
                    <UIcon name="i-lucide-folder-open" class="mx-auto size-8 text-slate-300" />
                    <p class="mt-2 text-sm font-medium text-slate-600">No categories found</p>
                    <p class="mt-1 text-xs text-slate-400">Create a category using the form.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
            Showing {{ categories.length }} categories
          </div>
        </section>

        <!-- Create Category -->
        <section class="overflow-hidden rounded-xl border border-slate-200 bg-white lg:col-span-2">
          <div class="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
            <div
              class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
            >
              <UIcon name="i-lucide-plus-circle" class="size-5" />
            </div>

            <div>
              <h2 class="text-sm font-semibold text-slate-800">Create Category</h2>
              <p class="mt-0.5 text-xs text-slate-500">Add a new expense category.</p>
            </div>
          </div>

          <form class="space-y-5 p-5" @submit.prevent="submit">
            <BaseInput
              v-model="form.name"
              label="Category Name"
              placeholder="e.g. Office Rent"
              :required="true"
            />

            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700"> Description </label>

              <textarea
                v-model="form.description"
                rows="4"
                placeholder="Write category description..."
                class="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
              ></textarea>

              <p class="text-xs text-slate-400">Optional description for this category.</p>
            </div>

            <!-- Active Status -->
            <div
              class="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
            >
              <div class="flex items-center gap-2.5">
                <UIcon
                  :name="form.is_active ? 'i-lucide-check-circle' : 'i-lucide-circle-pause'"
                  class="size-5"
                  :class="form.is_active ? 'text-emerald-600' : 'text-slate-400'"
                />

                <div>
                  <p class="text-sm font-medium text-slate-700">Active Status</p>
                  <p class="text-xs text-slate-500">
                    {{ form.is_active ? 'Category enabled' : 'Category disabled' }}
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                :aria-checked="form.is_active"
                :class="form.is_active ? 'bg-primary' : 'bg-slate-300'"
                class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
                @click="form.is_active = !form.is_active"
              >
                <span
                  class="inline-block size-4 rounded-full bg-white shadow-sm transition-transform"
                  :class="form.is_active ? 'translate-x-6' : 'translate-x-1'"
                ></span>
              </button>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="reset"
                class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Reset
              </button>

              <button
                type="submit"
                class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <UIcon name="i-lucide-plus" class="size-4" />
                Create
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  </Default>
</template>
