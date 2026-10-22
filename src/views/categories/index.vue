<script setup>
import Default from '@/layouts/Default.vue'
import { useCategoryStore } from '@/stores/category'
import { storeToRefs } from 'pinia'
import { onMounted, reactive } from 'vue'

const categoryStore = useCategoryStore()

const { categories } = storeToRefs(categoryStore)

const form = reactive({
  name: '',
  slug: '',
  parent_id: '',
  description: '',
  image: null,
  is_active: true,
})

const loadCategories = async () => {
  await categoryStore.all()
}

const submit = async () => {
  const formData = new FormData()

  formData.append('name', form.name)
  formData.append('slug', form.slug)
  formData.append('parent_id', form.parent_id ?? '')
  formData.append('description', form.description ?? '')
  formData.append('is_active', form.is_active ? '1' : '0')

  if (form.image instanceof File) {
    formData.append('image', form.image)
  }

  await categoryStore.store(formData)
  await loadCategories()
}

onMounted(() => {
  loadCategories()
})
</script>

<template>
  <Default>
    <main class="space-y-4">
      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-lg font-bold text-body">Categories</h1>
          <p class="mt-0.5 text-sm text-body/60">
            Manage product categories and category hierarchy
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-semibold text-body shadow-sm transition hover:bg-slate-50"
          >
            <UIcon name="i-lucide-download" class="size-4" />

            Export
          </button>
        </div>
      </div>

      <div class="grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section
          class="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white px-4 py-6"
        >
          <div class="flex items-center justify-between gap-4 border-b border-slate-100 p-2">
            <div class="relative">
              <UIcon
                name="i-lucide-search"
                class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-body/40"
              />

              <input
                type="text"
                placeholder="Search categories..."
                class="h-9 w-full rounded-md border border-slate-200 pl-9 pr-3 text-sm text-body outline-none focus:border-primary"
              />
            </div>

            <select
              class="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-body outline-none focus:border-primary"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div class="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Parent Category</th>
                  <th>Products</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="category in categories.data" :key="category.id">
                  <td>
                    <div class="flex items-center gap-2.5">
                      <div
                        class="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-100 bg-slate-50"
                      >
                        <img
                          :src="category.image_url"
                          :alt="category.name"
                          class="size-full object-cover"
                        />
                      </div>

                      <div class="min-w-0">
                        <div class="truncate text-sm font-semibold text-body">
                          {{ category.name }}
                        </div>

                        <div class="truncate text-xs text-body/50">
                          {{ category.slug }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    {{ category.parent?.name }}
                  </td>

                  <td>({{ category.products_count }})</td>

                  <td>
                    <span
                      class="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-sm font-medium text-emerald-600"
                    >
                      {{ category.status }}
                    </span>
                  </td>

                  <td>
                    <div class="flex items-center gap-1">
                      <button
                        type="button"
                        title="View"
                        class="flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-body/60 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                      >
                        <UIcon name="i-lucide-eye" class="size-4" />
                      </button>

                      <button
                        type="button"
                        title="Edit"
                        class="flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-body/60 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                      >
                        <UIcon name="i-lucide-pencil" class="size-4" />
                      </button>

                      <button
                        type="button"
                        title="Delete"
                        class="flex size-8 items-center justify-center rounded-md border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
                      >
                        <UIcon name="i-lucide-trash-2" class="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <aside class="h-fit rounded-lg border border-slate-200 bg-white">
          <div class="border-b border-slate-100 px-4 py-3">
            <h2 class="text-lg font-bold text-body">Add New Category</h2>
          </div>

          <form @submit.prevent="submit" class="space-y-4 p-4">
            <div>
              <label for="category-name" class="mb-1.5 block text-sm font-medium text-body">
                Category Name
                <span class="text-red-500">*</span>
              </label>

              <input
                id="category-name"
                v-model="form.name"
                type="text"
                placeholder="Enter category name"
                class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-body outline-none placeholder:text-body/40 focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <div>
              <label for="category-slug" class="mb-1.5 block text-sm font-medium text-body">
                Slug
                <span class="text-red-500">*</span>
              </label>

              <input
                id="category-slug"
                v-model="form.slug"
                type="text"
                placeholder="category-slug"
                class="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-body outline-none placeholder:text-body/40 focus:border-primary focus:ring-1 focus:ring-primary/20"
              />

              <p class="mt-1 text-xs leading-4 text-body/50">
                URL friendly version (e.g. t-shirts)
              </p>
            </div>

            <BaseSelect
              label="Parent"
              v-model="form.parent_id"
              :options="
                categories.data?.map((category) => ({
                  id: category.id,
                  name: category.name,
                }))
              "
            />

            <BaseTextarea
              label="Description"
              v-model="form.description"
              placeholder="Enter description (optional)"
            />

            <div class="form__group">
              <label class="form__label"> Category Image </label>
              <UFileUpload
                label="Drop your image here"
                v-model="form.image"
                description="SVG, PNG, JPG or GIF (max. 2MB)"
                class="min-h-28"
              />
            </div>

            <div class="flex items-center justify-between gap-2">
              <span class="text-sm font-medium text-body"> Active </span>
              <USwitch v-model="form.is_active" />
            </div>

            <div class="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                class="h-10 rounded-md bg-slate-100 px-3 text-sm font-semibold text-body transition hover:bg-slate-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                class="h-10 rounded-md bg-primary px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
              >
                Save Category
              </button>
            </div>
          </form>
        </aside>
      </div>
    </main>
  </Default>
</template>
