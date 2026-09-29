<script setup>
import Default from '@/layouts/Default.vue'

import { ref } from 'vue'

const attributes = ref([
  {
    id: 1,
    name: 'Color',
    icon: 'i-lucide-palette',
    values: ['Red', 'Blue', 'Black', 'White', 'Green'],
  },
  {
    id: 2,
    name: 'Size',
    icon: 'i-lucide-ruler',
    values: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 3,
    name: 'Material',
    icon: 'i-lucide-layers-3',
    values: ['Cotton', 'Polyester', 'Blend'],
  },
])

const variants = ref([
  {
    id: 1,
    image: null,
    values: ['Red', 'M', 'Cotton'],
    sku: 'TSH-RED-M-CT',
    price: '25.00',
    stock: 100,
    status: true,
  },
  {
    id: 2,
    image: null,
    values: ['Blue', 'L', 'Cotton'],
    sku: 'TSH-BLU-L-CT',
    price: '25.00',
    stock: 80,
    status: true,
  },
  {
    id: 3,
    image: null,
    values: ['Black', 'M', 'Polyester'],
    sku: 'TSH-BLK-M-PL',
    price: '27.00',
    stock: 60,
    status: true,
  },
  {
    id: 4,
    image: null,
    values: ['White', 'XL', 'Cotton'],
    sku: 'TSH-WHT-XL-CT',
    price: '25.00',
    stock: 45,
    status: true,
  },
])

const selectedVariants = ref([])

const addValue = (attribute) => {
  attribute.values.push('New Value')
}

const removeValue = (attribute, index) => {
  attribute.values.splice(index, 1)
}

const toggleAll = () => {
  if (selectedVariants.value.length === variants.value.length) {
    selectedVariants.value = []
    return
  }

  selectedVariants.value = variants.value.map((variant) => variant.id)
}
</script>

<template>
  <Default>
    <main class="space-y-4">
      <header class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div class="block">
          <h1 class="text-lg font-semibold text-title">Create Product</h1>
          <p class="mt-0.5 text-sm text-body">Add product variants and manage variant details</p>
        </div>

        <div class="flex items-center gap-2">
          <button type="button" class="base__button">
            <UIcon name="i-lucide-save" class="size-4" />
            <span>Save as Draft</span>
          </button>
        </div>
      </header>

      <StepProgress :current="3" />

      <section class="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div
          class="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 sm:px-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex min-w-0 items-start gap-3">
            <div
              class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"
            >
              <UIcon name="i-lucide-box" class="size-4" />
            </div>

            <div class="min-w-0">
              <h2 class="text-sm font-semibold text-slate-900">Product Variants</h2>

              <p class="mt-0.5 text-sm text-slate-500">
                Add product variants like size, color, or other attributes
              </p>
            </div>
          </div>

          <button
            type="button"
            class="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <UIcon name="i-lucide-plus" class="size-4" />

            Add Variant Option
          </button>
        </div>

        <div class="px-4 py-4">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="attribute in attributes"
              :key="attribute.id"
              class="group rounded-lg border border-slate-200 bg-white p-3"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="flex min-w-0 items-center gap-2">
                  <div
                    class="flex size-7 shrink-0 items-center justify-center rounded-md bg-slate-50 text-slate-600"
                  >
                    <UIcon :name="attribute.icon" class="size-4" />
                  </div>

                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-slate-800">
                      {{ attribute.name }}
                    </p>

                    <p class="text-sm text-slate-400">{{ attribute.values.length }} values</p>
                  </div>
                </div>

                <button
                  type="button"
                  class="flex size-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <UIcon name="i-lucide-more-vertical" class="size-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              class="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50/50 px-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50/50"
            >
              <div
                class="flex size-7 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500"
              >
                <UIcon name="i-lucide-plus" class="size-4" />
              </div>

              <div>
                <p class="text-sm font-semibold text-slate-700">Add Attribute</p>

                <p class="mt-0.5 text-sm text-slate-400">e.g. Size, Color, Material</p>
              </div>
            </button>
          </div>

          <div class="mt-4 space-y-3">
            <div
              v-for="attribute in attributes"
              :key="`values-${attribute.id}`"
              class="flex flex-wrap items-center gap-2"
            >
              <div class="flex items-center gap-1">
                <span class="text-sm font-semibold text-slate-700">
                  {{ attribute.name }}
                </span>

                <span class="text-sm text-slate-400"> ({{ attribute.values.length }} values) </span>
              </div>

              <div class="flex flex-1 flex-wrap items-center gap-2">
                <span
                  v-for="(value, index) in attribute.values"
                  :key="`${attribute.id}-${value}-${index}`"
                  class="inline-flex h-8 items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 text-sm text-slate-700"
                >
                  <span
                    v-if="attribute.name === 'Color'"
                    class="size-2.5 rounded-full border border-slate-200"
                    :class="{
                      'bg-red-500': value === 'Red',
                      'bg-blue-500': value === 'Blue',
                      'bg-black': value === 'Black',
                      'bg-white': value === 'White',
                      'bg-emerald-500': value === 'Green',
                    }"
                  />

                  {{ value }}

                  <button
                    type="button"
                    class="flex size-4 items-center justify-center text-slate-400 hover:text-slate-700"
                    @click="removeValue(attribute, index)"
                  >
                    <UIcon name="i-lucide-x" class="size-3" />
                  </button>
                </span>

                <button
                  type="button"
                  class="inline-flex h-8 items-center gap-1.5 px-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  @click="addValue(attribute)"
                >
                  <UIcon name="i-lucide-plus" class="size-3.5" />

                  Add Value
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex flex-col gap-4 px-4 py-4 sm:px-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"
            >
              <UIcon name="i-lucide-settings-2" class="size-4" />
            </div>

            <div>
              <h2 class="text-sm font-semibold text-slate-900">Variant Combinations</h2>

              <p class="mt-0.5 text-sm text-slate-500">
                Manage SKU, price, stock and other details for each variant combination.
              </p>
            </div>
          </div>

          <button
            type="button"
            class="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <UIcon name="i-lucide-wand-sparkles" class="size-4" />

            Generate
          </button>
        </div>

        <div class="px-4">
          <div class="overflow-hidden rounded-lg border border-slate-200">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-slate-200 bg-slate-50">
                    <th class="px-2.5 py-2.5 text-left">
                      <input
                        type="checkbox"
                        :checked="
                          variants.length > 0 && selectedVariants.length === variants.length
                        "
                        class="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        @change="toggleAll"
                      />
                    </th>

                    <th class="px-3 py-2.5 text-left text-sm font-semibold text-slate-600">
                      Variant
                    </th>

                    <th class="px-3 py-2.5 text-left text-sm font-semibold text-slate-600">
                      SKU
                      <span class="text-red-500">*</span>
                    </th>

                    <th class="px-3 py-2.5 text-left text-sm font-semibold text-slate-600">
                      Price (BDT)
                      <span class="text-red-500">*</span>
                    </th>

                    <th class="px-3 py-2.5 text-left text-sm font-semibold text-slate-600">
                      Stock
                      <span class="text-red-500">*</span>
                    </th>

                    <th class="px-3 py-2.5 text-left text-sm font-semibold text-slate-600">
                      Status
                    </th>

                    <th class="px-3 py-2.5 text-left text-sm font-semibold text-slate-600">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-slate-100">
                  <tr
                    v-for="variant in variants"
                    :key="variant.id"
                    class="bg-white transition hover:bg-slate-50/60"
                  >
                    <td class="px-2.5 py-2.5">
                      <input
                        v-model="selectedVariants"
                        type="checkbox"
                        :value="variant.id"
                        class="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>

                    <td class="px-3 py-2.5">
                      <div class="flex items-center gap-2.5">
                        <div
                          class="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                        >
                          <img
                            v-if="variant.image"
                            :src="variant.image"
                            alt=""
                            class="size-full object-cover"
                          />

                          <UIcon v-else name="i-lucide-shirt" class="size-4 text-slate-400" />
                        </div>

                        <div class="flex items-center gap-1.5">
                          <template v-for="(value, index) in variant.values" :key="index">
                            <span class="whitespace-nowrap text-sm text-slate-600">
                              {{ value }}
                            </span>

                            <span v-if="index < variant.values.length - 1" class="text-slate-300">
                              /
                            </span>
                          </template>
                        </div>
                      </div>
                    </td>

                    <td class="px-3 py-2.5">
                      <input
                        v-model="variant.sku"
                        type="text"
                        placeholder="SKU"
                        class="h-8 w-full min-w-32 rounded-md border border-slate-200 bg-white px-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    <td class="px-3 py-2.5">
                      <div class="relative">
                        <span
                          class="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-slate-400"
                        >
                          ৳
                        </span>

                        <input
                          v-model="variant.price"
                          type="number"
                          min="0"
                          step="0.01"
                          class="h-8 w-full min-w-28 rounded-md border border-slate-200 bg-white pl-6 pr-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </td>

                    <td class="px-3 py-2.5">
                      <input
                        v-model="variant.stock"
                        type="number"
                        min="0"
                        class="h-8 w-full min-w-20 rounded-md border border-slate-200 bg-white px-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>

                    <td class="px-3 py-2.5">
                      <button
                        type="button"
                        class="inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-sm font-medium transition"
                        :class="
                          variant.status
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                        "
                        @click="variant.status = !variant.status"
                      >
                        <span
                          class="size-1.5 rounded-full"
                          :class="variant.status ? 'bg-emerald-500' : 'bg-slate-400'"
                        />

                        {{ variant.status ? 'Active' : 'Inactive' }}

                        <UIcon name="i-lucide-chevron-down" class="size-3.5 opacity-60" />
                      </button>
                    </td>

                    <td class="px-3 py-2.5">
                      <div class="flex items-center gap-1">
                        <button
                          type="button"
                          class="flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                          title="Duplicate"
                        >
                          <UIcon name="i-lucide-copy" class="size-3.5" />
                        </button>

                        <button
                          type="button"
                          class="flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                          title="Delete"
                        >
                          <UIcon name="i-lucide-trash-2" class="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <div class="flex items-center justify-between gap-4">
        <RouterLink
          :to="{
            name: 'products-pricing',
            params: { product: '01m2wc2mth4m8j14fpp1jtdtpz' },
          }"
          class="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <UIcon name="i-lucide-arrow-left" class="size-4" />

          Previous
        </RouterLink>

        <RouterLink
          :to="{
            name: 'products-media',
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
