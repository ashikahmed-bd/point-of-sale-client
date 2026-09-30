<script setup>
import Default from '@/layouts/Default.vue'
import { reactive } from 'vue'

const categories = [
  {
    id: 1,
    name: 'Jerseys',
    slug: '/jerseys',
    parent: '— (Main Category)',
    products: 128,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80',
  },
  {
    id: 2,
    name: 'T-Shirts',
    slug: '/t-shirts',
    parent: '— (Main Category)',
    products: 320,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80',
  },
  {
    id: 3,
    name: 'Shoes',
    slug: '/shoes',
    parent: '— (Main Category)',
    products: 86,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80',
  },
  {
    id: 4,
    name: 'Accessories',
    slug: '/accessories',
    parent: '— (Main Category)',
    products: 142,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&q=80',
  },
  {
    id: 5,
    name: 'Football',
    slug: '/football',
    parent: '— (Main Category)',
    products: 64,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100&q=80',
  },
  {
    id: 6,
    name: 'Caps',
    slug: '/caps',
    parent: 'Accessories',
    products: 28,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=100&q=80',
  },
  {
    id: 7,
    name: 'Bottles',
    slug: '/bottles',
    parent: 'Accessories',
    products: 35,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100&q=80',
  },
  {
    id: 8,
    name: 'Gloves',
    slug: '/gloves',
    parent: 'Accessories',
    products: 18,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=100&q=80',
  },
  {
    id: 9,
    name: 'Shorts',
    slug: '/shorts',
    parent: 'T-Shirts',
    products: 76,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=100&q=80',
  },
  {
    id: 10,
    name: 'Socks',
    slug: '/socks',
    parent: 'Accessories',
    products: 52,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?w=100&q=80',
  },
]

const form = reactive({
  name: '',
  slug: '',
  parent_id: '',
  description: '',
  image: null,
  status: true,
})

const handleImage = (event) => {
  form.image = event.target.files?.[0] || null
}
</script>

<template>
  <Default>
    <main class="min-h-full p-4">
      <div class="mx-auto max-w-7xl">
        <!-- Header -->
        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-lg font-bold text-body">Categories</h1>

            <p class="mt-0.5 text-sm text-body/60">
              Manage product categories and category hierarchy
            </p>
          </div>

          <div class="flex items-center gap-2">
            <!-- Export -->
            <button
              type="button"
              class="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-semibold text-body shadow-sm transition hover:bg-slate-50"
            >
              <UIcon name="i-lucide-download" class="size-4" />

              Export
            </button>

            <!-- Add Category -->
            <RouterLink
              :to="{ name: 'categories.create' }"
              class="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              <UIcon name="i-lucide-plus" class="size-4" />

              Add Category
            </RouterLink>
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
                  <tr v-for="category in categories" :key="category.id">
                    <td>
                      <div class="flex items-center gap-2.5">
                        <div
                          class="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-100 bg-slate-50"
                        >
                          <img
                            :src="category.image"
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
                      {{ category.parent }}
                    </td>

                    <td>
                      {{ category.products }}
                    </td>

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

            <div
              class="flex flex-col gap-3 border-t border-slate-100 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <p class="text-sm text-body/60">Showing 1 to 10 of 24 categories</p>

              <div class="flex flex-wrap items-center justify-between gap-3">
                <!-- Pagination -->
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-body/50 transition hover:bg-slate-50"
                  >
                    <UIcon name="i-lucide-chevron-left" class="size-4" />
                  </button>

                  <button
                    type="button"
                    class="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-semibold text-white"
                  >
                    1
                  </button>

                  <button
                    type="button"
                    class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-sm text-body transition hover:bg-slate-50"
                  >
                    2
                  </button>

                  <button
                    type="button"
                    class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-sm text-body transition hover:bg-slate-50"
                  >
                    3
                  </button>

                  <button
                    type="button"
                    class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-body transition hover:bg-slate-50"
                  >
                    <UIcon name="i-lucide-chevron-right" class="size-4" />
                  </button>
                </div>

                <!-- Per Page -->
                <div class="flex items-center gap-2">
                  <span class="text-sm text-body/60"> Show </span>

                  <select
                    class="h-8 rounded-md border border-slate-200 bg-white px-2 text-sm text-body outline-none focus:border-primary"
                  >
                    <option>10</option>

                    <option>20</option>

                    <option>50</option>
                  </select>

                  <span class="text-sm text-body/60"> per page </span>
                </div>
              </div>
            </div>
          </section>

          <!-- Add Category -->
          <aside class="h-fit rounded-lg border border-slate-200 bg-white shadow-sm">
            <!-- Aside Header -->
            <div class="border-b border-slate-100 px-4 py-3">
              <h2 class="text-lg font-bold text-body">Add New Category</h2>
            </div>

            <!-- Form -->
            <form class="space-y-4 p-4" @submit.prevent>
              <!-- Category Name -->
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
                  class="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-body outline-none placeholder:text-body/40 focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <!-- Slug -->
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

              <!-- Parent Category -->
              <div>
                <label for="parent-category" class="mb-1.5 block text-sm font-medium text-body">
                  Parent Category
                </label>

                <div class="relative">
                  <select
                    id="parent-category"
                    v-model="form.parent_id"
                    class="h-10 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 pr-9 text-sm text-body outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="">None (Main Category)</option>

                    <option value="1">Accessories</option>

                    <option value="2">T-Shirts</option>

                    <option value="3">Football</option>
                  </select>

                  <UIcon
                    name="i-lucide-chevron-down"
                    class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-body/60"
                  />
                </div>
              </div>

              <!-- Description -->
              <div>
                <label for="description" class="mb-1.5 block text-sm font-medium text-body">
                  Description
                </label>

                <textarea
                  id="description"
                  v-model="form.description"
                  rows="3"
                  placeholder="Enter description (optional)"
                  class="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm leading-5 text-body outline-none placeholder:text-body/40 focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <!-- Category Image -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-body"> Category Image </label>

                <label
                  class="flex min-h-20 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50/50 px-3 py-4 text-center transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    class="hidden"
                    @change="handleImage"
                  />

                  <UIcon name="i-lucide-image" class="mb-1.5 size-6 text-primary" />

                  <span class="text-sm font-medium text-primary">
                    Click to upload
                    <span class="font-normal text-body/60"> or drag and drop </span>
                  </span>

                  <span class="mt-0.5 text-xs text-body/50"> PNG, JPG or WebP (Max 2MB) </span>
                </label>

                <p v-if="form.image" class="mt-1 text-xs text-body/60">
                  {{ form.image.name }}
                </p>
              </div>

              <!-- Status -->
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  role="switch"
                  :aria-checked="form.status"
                  class="relative h-5 w-9 rounded-full transition"
                  :class="form.status ? 'bg-primary' : 'bg-slate-300'"
                  @click="form.status = !form.status"
                >
                  <span
                    class="absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition"
                    :class="form.status ? 'left-4' : 'left-0.5'"
                  />
                </button>

                <span class="text-sm font-medium text-body"> Status </span>
              </div>

              <!-- Actions -->
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
      </div>
    </main>
  </Default>
</template>
