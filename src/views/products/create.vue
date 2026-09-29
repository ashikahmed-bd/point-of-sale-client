<script setup>
import Default from '@/layouts/Default.vue'
import { useRoute, useRouter } from 'vue-router'

const steps = [
  {
    number: 1,
    title: 'Product Information',
    description: 'Basic details',
  },
  {
    number: 2,
    title: 'Pricing',
    description: 'Set price & MOQ',
  },
  {
    number: 3,
    title: 'Variants',
    description: 'Add product variants',
  },
  {
    number: 4,
    title: 'Media',
    description: 'Images & videos',
  },
  {
    number: 5,
    title: 'SEO',
    description: 'Search engine optimization',
  },
]

const tips = [
  'Use clear and descriptive product name',
  'Add high-quality product images',
  'Provide detailed specifications',
  'Set competitive pricing',
  'Choose the right category',
  'Add relevant tags',
]

const conditions = ['New', 'Used', 'Refurbished']
const countries = ['Bangladesh', 'China', 'India', 'United States']
</script>

<template>
  <Default>
    <main class="space-y-4">
      <header class="flex flex-wrap items-start justify-between gap-4">
        <div class="block">
          <h1 class="text-lg font-semibold text-title">Create Product</h1>
          <p class="mt-0.5 text-sm text-body">
            Add your product details to list it on the marketplace
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button type="button" class="base__button">
            <UIcon name="i-lucide-save" class="size-4" />
            <span>Save as Draft</span>
          </button>
        </div>
      </header>

      <StepProgress :current="1" />

      <!-- Main -->
      <div class="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <!-- Left -->
        <div class="min-w-0">
          <section class="rounded-xl border border-slate-200 bg-white">
            <!-- Section Header -->
            <div class="flex items-start gap-3 border-b border-slate-100 px-5 py-4">
              <div
                class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"
              >
                <UIcon name="i-lucide-package" class="size-4" />
              </div>

              <div>
                <h2 class="text-sm font-semibold text-slate-900">Product Information</h2>

                <p class="mt-0.5 text-sm text-slate-500">
                  Provide the basic information about your product
                </p>
              </div>
            </div>

            <div class="space-y-6 p-5">
              <!-- Product Name / SKU -->
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <!-- Product Name -->
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700">
                    Product Name
                    <span class="text-red-500">*</span>
                  </label>

                  <div class="relative">
                    <input
                      type="text"
                      placeholder="Enter product name"
                      class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-14 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />

                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      0/255
                    </span>
                  </div>
                </div>

                <!-- SKU -->
                <div>
                  <label class="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-700">
                    SKU
                    <span class="text-red-500">*</span>

                    <UIcon name="i-lucide-circle-help" class="size-3.5 text-slate-400" />
                  </label>

                  <input
                    type="text"
                    placeholder="Enter SKU"
                    class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <!-- Category / Brand -->
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700">
                    Category
                    <span class="text-red-500">*</span>
                  </label>

                  <select
                    class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select category</option>
                    <option>Electronics</option>
                    <option>Fashion & Apparel</option>
                    <option>Home & Living</option>
                    <option>Beauty & Personal Care</option>
                  </select>
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700"> Brand </label>

                  <select
                    class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select brand</option>
                    <option>Apple</option>
                    <option>Samsung</option>
                    <option>Nike</option>
                    <option>Adidas</option>
                  </select>
                </div>
              </div>

              <!-- Short Description -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700">
                  Short Description
                  <span class="text-red-500">*</span>
                </label>

                <div class="relative">
                  <textarea
                    rows="3"
                    placeholder="Write a short description about your product..."
                    class="min-h-[82px] w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-14 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />

                  <span class="absolute bottom-2 right-3 text-sm text-slate-400"> 0/500 </span>
                </div>
              </div>

              <!-- Full Description -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700">
                  Full Description
                </label>

                <div class="overflow-hidden rounded-lg border border-slate-200">
                  <!-- Toolbar -->
                  <div
                    class="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-1.5"
                  >
                    <button
                      type="button"
                      class="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-white"
                    >
                      Normal
                    </button>

                    <button
                      type="button"
                      class="flex size-7 items-center justify-center rounded-md text-sm font-semibold text-slate-600 hover:bg-white"
                    >
                      B
                    </button>

                    <button
                      type="button"
                      class="flex size-7 items-center justify-center rounded-md text-sm italic text-slate-600 hover:bg-white"
                    >
                      I
                    </button>

                    <button
                      type="button"
                      class="flex size-7 items-center justify-center rounded-md text-sm underline text-slate-600 hover:bg-white"
                    >
                      U
                    </button>

                    <span class="mx-1 h-5 w-px bg-slate-200" />

                    <button
                      type="button"
                      class="flex size-7 items-center justify-center rounded-md text-slate-600 hover:bg-white"
                    >
                      <UIcon name="i-lucide-list" class="size-4" />
                    </button>

                    <button
                      type="button"
                      class="flex size-7 items-center justify-center rounded-md text-slate-600 hover:bg-white"
                    >
                      <UIcon name="i-lucide-list-ordered" class="size-4" />
                    </button>

                    <button
                      type="button"
                      class="flex size-7 items-center justify-center rounded-md text-slate-600 hover:bg-white"
                    >
                      <UIcon name="i-lucide-link" class="size-4" />
                    </button>

                    <button
                      type="button"
                      class="flex size-7 items-center justify-center rounded-md text-slate-600 hover:bg-white"
                    >
                      <UIcon name="i-lucide-image" class="size-4" />
                    </button>
                  </div>

                  <div class="relative">
                    <textarea
                      rows="5"
                      placeholder="Write detailed description about your product..."
                      class="w-full resize-none border-0 px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0"
                    />

                    <span class="absolute bottom-2 right-3 text-sm text-slate-400"> 0/5000 </span>
                  </div>
                </div>
              </div>

              <!-- Divider -->
              <div class="border-t border-slate-100" />

              <!-- Product Details -->
              <div>
                <div class="mb-4 flex items-start gap-3">
                  <div
                    class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"
                  >
                    <UIcon name="i-lucide-clipboard-list" class="size-4" />
                  </div>

                  <div>
                    <h3 class="text-sm font-semibold text-slate-900">Product Details</h3>

                    <p class="mt-0.5 text-sm text-slate-500">
                      Add more details to help buyers understand your product
                    </p>
                  </div>
                </div>

                <!-- Condition / Country / HS Code -->
                <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700">
                      Condition
                    </label>

                    <select
                      class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Select condition</option>

                      <option v-for="item in conditions" :key="item">
                        {{ item }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700">
                      Country of Origin
                    </label>

                    <select
                      class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Select country</option>

                      <option v-for="country in countries" :key="country">
                        {{ country }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700">
                      HS Code
                      <span class="text-slate-400">(Optional)</span>
                    </label>

                    <input
                      type="text"
                      placeholder="Enter HS code"
                      class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <!-- Weight / Dimensions -->
                <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700">
                      Weight (kg)
                    </label>

                    <input
                      type="number"
                      placeholder="Enter weight"
                      class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700">
                      Dimensions (cm)
                    </label>

                    <div class="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        placeholder="Length"
                        class="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />

                      <input
                        type="number"
                        placeholder="Width"
                        class="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />

                      <input
                        type="number"
                        placeholder="Height"
                        class="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Sidebar -->
        <aside class="space-y-5">
          <!-- Tips -->
          <section class="rounded-xl border border-slate-200 bg-white p-4">
            <div class="mb-4 flex items-center gap-2">
              <div
                class="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-500"
              >
                <UIcon name="i-lucide-lightbulb" class="size-4" />
              </div>

              <h2 class="text-sm font-semibold text-slate-900">Tips for a great product listing</h2>
            </div>

            <div class="space-y-3">
              <div v-for="tip in tips" :key="tip" class="flex items-start gap-2">
                <UIcon
                  name="i-lucide-circle-check"
                  class="mt-0.5 size-4 shrink-0 text-emerald-500"
                />

                <p class="text-sm leading-5 text-slate-600">
                  {{ tip }}
                </p>
              </div>
            </div>
          </section>

          <!-- Preview -->
          <section class="rounded-xl border border-slate-200 bg-white p-4">
            <div class="mb-4 flex items-center gap-2">
              <div
                class="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"
              >
                <UIcon name="i-lucide-eye" class="size-4" />
              </div>

              <h2 class="text-sm font-semibold text-slate-900">Preview</h2>
            </div>

            <div class="overflow-hidden rounded-lg border border-slate-200">
              <!-- Image -->
              <div class="p-2.5">
                <div class="flex aspect-[4/3] items-center justify-center rounded-md bg-slate-100">
                  <UIcon name="i-lucide-image" class="size-9 text-slate-300" />
                </div>
              </div>

              <!-- Product Preview -->
              <div class="space-y-3 px-3 pb-3">
                <h3 class="truncate text-sm font-semibold text-slate-900">Product Name</h3>

                <div class="h-2 w-full rounded bg-slate-100" />
                <div class="h-2 w-3/4 rounded bg-slate-100" />

                <div class="space-y-2 pt-1">
                  <div class="flex items-center gap-2 text-sm text-slate-500">
                    <UIcon name="i-lucide-tag" class="size-4" />
                    <span>Category</span>
                  </div>

                  <div class="flex items-center gap-2 text-sm text-slate-500">
                    <UIcon name="i-lucide-store" class="size-4" />
                    <span>Brand</span>
                  </div>

                  <div class="flex items-center gap-2 text-sm text-slate-500">
                    <UIcon name="i-lucide-barcode" class="size-4" />
                    <span>SKU</span>
                  </div>
                </div>
              </div>
            </div>

            <p class="mt-3 text-sm leading-5 text-slate-400">
              This is how your product will appear to buyers
            </p>
          </section>
        </aside>
      </div>

      <div class="flex items-center justify-between gap-4">
        <RouterLink
          :to="{
            name: 'products',
          }"
          class="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <UIcon name="i-lucide-arrow-left" class="size-4" />

          Back
        </RouterLink>

        <RouterLink
          :to="{
            name: 'products-pricing',
            params: { product: '01m2wc2mth4m8j14fpp1jtdtpz' },
          }"
          class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Save & Next

          <UIcon name="i-lucide-arrow-right" class="size-4" />
        </RouterLink>
      </div>
    </main>
  </Default>
</template>
