<script setup>
import Default from '@/layouts/Default.vue'
import { reactive } from 'vue'

const brands = [
  {
    id: 1,
    name: 'Adidas',
    slug: '/adidas',
    products: 86,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Nike',
    slug: '/nike',
    products: 124,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Puma',
    slug: '/puma',
    products: 64,
    status: 'Active',
  },
  {
    id: 4,
    name: 'Under Armour',
    slug: '/under-armour',
    products: 42,
    status: 'Active',
  },
  {
    id: 5,
    name: 'New Balance',
    slug: '/new-balance',
    products: 38,
    status: 'Active',
  },
  {
    id: 6,
    name: 'Reebok',
    slug: '/reebok',
    products: 29,
    status: 'Active',
  },
  {
    id: 7,
    name: 'Umbro',
    slug: '/umbro',
    products: 24,
    status: 'Inactive',
  },
  {
    id: 8,
    name: 'Kappa',
    slug: '/kappa',
    products: 18,
    status: 'Active',
  },
]

const form = reactive({
  name: '',
  slug: '',
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
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h1 class="text-lg font-bold text-body">Brands</h1>

            <p class="mt-0.5 text-sm text-body/60">Manage product brands and brand information</p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-semibold text-body hover:bg-slate-50"
            >
              <UIcon name="i-lucide-download" class="size-4" />

              Export
            </button>

            <RouterLink
              :to="{ name: 'brands.create' }"
              class="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90"
            >
              <UIcon name="i-lucide-plus" class="size-4" />

              Add Brand
            </RouterLink>
          </div>
        </div>

        <!-- Content -->
        <div class="grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
          <!-- Brands List -->
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
                  placeholder="Search brands..."
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

            <!-- Table -->
            <div class="overflow-x-auto px-2">
              <table>
                <thead>
                  <tr>
                    <th class="w-10">#</th>

                    <th>Brand</th>

                    <th>Slug</th>

                    <th>Products</th>

                    <th>Status</th>

                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="brand in brands" :key="brand.id">
                    <td>
                      {{ brand.id }}
                    </td>

                    <td>
                      <div class="flex items-center gap-3">
                        <div
                          class="flex size-9 items-center justify-center rounded-md border border-slate-200 bg-slate-50"
                        >
                          <UIcon name="i-lucide-tag" class="size-4 text-body/40" />
                        </div>

                        <span class="font-semibold text-body">
                          {{ brand.name }}
                        </span>
                      </div>
                    </td>

                    <td class="text-body/60">
                      {{ brand.slug }}
                    </td>

                    <td class="font-medium">
                      {{ brand.products }}
                    </td>

                    <td>
                      <span
                        class="inline-flex rounded-full px-2.5 py-1 text-sm font-medium"
                        :class="
                          brand.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-slate-100 text-body/60'
                        "
                      >
                        {{ brand.status }}
                      </span>
                    </td>

                    <td>
                      <div class="flex items-center gap-1">
                        <button
                          type="button"
                          class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-body/60 hover:bg-primary/5 hover:text-primary"
                        >
                          <UIcon name="i-lucide-eye" class="size-4" />
                        </button>

                        <button
                          type="button"
                          class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-body/60 hover:bg-primary/5 hover:text-primary"
                        >
                          <UIcon name="i-lucide-pencil" class="size-4" />
                        </button>

                        <button
                          type="button"
                          class="flex size-8 items-center justify-center rounded-md border border-red-100 bg-red-50 text-red-500 hover:bg-red-100"
                        >
                          <UIcon name="i-lucide-trash-2" class="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between border-t border-slate-100 px-3 py-3">
              <p class="text-sm text-body/60">Showing 1 to 8 of 24 brands</p>

              <div class="flex items-center gap-1">
                <button
                  type="button"
                  class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-body/50 hover:bg-slate-50"
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
                  class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-sm text-body hover:bg-slate-50"
                >
                  2
                </button>

                <button
                  type="button"
                  class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-sm text-body hover:bg-slate-50"
                >
                  3
                </button>

                <button
                  type="button"
                  class="flex size-8 items-center justify-center rounded-md border border-slate-200 text-body hover:bg-slate-50"
                >
                  <UIcon name="i-lucide-chevron-right" class="size-4" />
                </button>
              </div>
            </div>
          </section>

          <!-- Add Brand -->
          <aside class="h-fit rounded-lg border border-slate-200 bg-white shadow-sm">
            <div class="border-b border-slate-100 px-4 py-3">
              <h2 class="text-lg font-bold text-body">Add New Brand</h2>
            </div>

            <form class="space-y-4 p-4" @submit.prevent>
              <!-- Name -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-body">
                  Brand Name
                  <span class="text-red-500">*</span>
                </label>

                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Enter brand name"
                  class="h-10 w-full rounded-md border border-slate-200 px-3 text-sm text-body outline-none placeholder:text-body/40 focus:border-primary"
                />
              </div>

              <!-- Slug -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-body">
                  Slug
                  <span class="text-red-500">*</span>
                </label>

                <input
                  v-model="form.slug"
                  type="text"
                  placeholder="brand-slug"
                  class="h-10 w-full rounded-md border border-slate-200 px-3 text-sm text-body outline-none placeholder:text-body/40 focus:border-primary"
                />

                <p class="mt-1 text-xs text-body/50">URL friendly version</p>
              </div>

              <!-- Description -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-body"> Description </label>

                <textarea
                  v-model="form.description"
                  rows="3"
                  placeholder="Enter description (optional)"
                  class="w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-sm text-body outline-none placeholder:text-body/40 focus:border-primary"
                />
              </div>

              <!-- Image -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-body"> Brand Logo </label>

                <label
                  class="flex min-h-20 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50/50 px-3 py-4 text-center hover:border-primary/40 hover:bg-primary/5"
                >
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    class="hidden"
                    @change="handleImage"
                  />

                  <UIcon name="i-lucide-image" class="mb-1.5 size-6 text-primary" />

                  <span class="text-sm font-medium text-primary"> Click to upload </span>

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

              <!-- Buttons -->
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  class="h-10 rounded-md bg-slate-100 text-sm font-semibold text-body hover:bg-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  class="h-10 rounded-md bg-primary text-sm font-semibold text-white hover:bg-primary/90"
                >
                  Save Brand
                </button>
              </div>
            </form>
          </aside>
        </div>
      </div>
    </main>
  </Default>
</template>
