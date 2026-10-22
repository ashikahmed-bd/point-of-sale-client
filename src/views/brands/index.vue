<script setup>
import Default from '@/layouts/Default.vue'
import { useBrandStore } from '@/stores/brand'
import { storeToRefs } from 'pinia'
import { onMounted, reactive } from 'vue'

const brandStore = useBrandStore()

const { brands } = storeToRefs(brandStore)

const loadBrands = async () => {
  await brandStore.all()
}

const form = reactive({
  name: '',
  slug: '',
  description: '',
  logo: null,
  is_active: true,
})

const submit = async () => {
  const formData = new FormData()

  formData.append('name', form.name)
  formData.append('slug', form.slug)
  formData.append('description', form.description ?? '')
  formData.append('is_active', form.is_active ? '1' : '0')

  if (form.logo instanceof File) {
    formData.append('logo', form.logo)
  }

  await brandStore.store(formData)
  await loadBrands()
}

onMounted(() => {
  loadBrands()
})
</script>

<template>
  <Default>
    <main class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-lg font-bold text-body">Brands</h1>
          <p class="mt-0.5 text-sm text-body/60">Manage product brands and brand information</p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-body hover:bg-slate-50"
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

          <div class="overflow-x-auto px-2">
            <table>
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Slug</th>
                  <th>Products</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="brand in brands.data" :key="brand.id">
                  <td>
                    <div class="flex items-center gap-3">
                      <div
                        class="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                      >
                        <img
                          :src="brand.logo_url"
                          :alt="brand.name"
                          class="size-full object-cover"
                        />
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
        </section>

        <aside class="h-fit rounded-lg border border-slate-200 bg-white">
          <div class="border-b border-slate-100 px-4 py-3">
            <h2 class="text-lg font-bold text-body">Add New Brand</h2>
          </div>

          <form @submit.prevent="submit" class="space-y-4 p-4">
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

            <BaseTextarea
              label="Description"
              v-model="form.description"
              placeholder="Enter description (optional)"
            />

            <div class="form__group">
              <label class="form__label"> Logo </label>
              <UFileUpload
                label="Drop your image here"
                v-model="form.logo"
                description="SVG, PNG, JPG or GIF (max. 2MB)"
                class="min-h-28"
              />
            </div>

            <div class="flex items-center justify-between gap-2">
              <span class="text-sm font-medium text-body"> Active </span>
              <USwitch v-model="form.is_active" />
            </div>

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
    </main>
  </Default>
</template>
