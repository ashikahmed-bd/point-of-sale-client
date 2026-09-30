<script setup>
import Default from '@/layouts/Default.vue'
import { reactive, ref } from 'vue'

const form = reactive({
  name: '',
  slug: '',
  sku: '',
  barcode: '',
  description: '',

  cost_price: 0,
  selling_price: 0,
  compare_price: null,

  min_stock: 0,
  max_stock: null,

  track_stock: true,
  allow_backorder: false,
  has_variants: false,

  status: 'active',

  image: null,
  gallery: [],

  category_id: '',
  brand_id: '',
  tax_id: '',
  unit_id: '',
})

const saveProduct = () => {
  console.log(form)
}
</script>

<template>
  <Default>
    <main class="min-h-dvh bg-slate-50">
      <!-- Header -->
      <header class="border-b border-slate-200 bg-white">
        <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div class="min-w-0">
            <div class="mb-1 flex items-center gap-2 text-xs text-slate-500">
              <NuxtLink to="/products" class="hover:text-slate-900"> Products </NuxtLink>

              <UIcon name="i-lucide-chevron-right" class="size-3.5" />

              <span>Create</span>
            </div>

            <h1 class="truncate text-lg font-semibold text-slate-900">Create Product</h1>

            <p class="mt-0.5 text-sm text-body">Add a new product to your inventory.</p>
          </div>

          <div class="flex shrink-0 items-center gap-2">
            <NuxtLink
              to="/products"
              class="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-body transition hover:bg-slate-50 hover:text-slate-900"
            >
              <UIcon name="i-lucide-x" class="size-4" />
              Cancel
            </NuxtLink>

            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <UIcon name="i-lucide-save" class="size-4" />
              Save Product
            </button>
          </div>
        </div>
      </header>

      <!-- Content -->
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <!-- Main -->
          <div class="min-w-0 space-y-6">
            <!-- Basic Information -->
            <section class="rounded-lg border border-slate-200 bg-white">
              <div class="border-b border-slate-200 px-5 py-4">
                <h2 class="text-sm font-semibold text-slate-900">Basic Information</h2>

                <p class="mt-1 text-xs text-body">Basic details about your product.</p>
              </div>

              <div class="space-y-5 p-5">
                <!-- Name -->
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700">
                    Product Name
                    <span class="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Real Madrid Home Jersey 2026/27"
                    class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <!-- Description -->
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700">
                    Description
                  </label>

                  <textarea
                    rows="5"
                    placeholder="Write a short description about this product..."
                    class="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <!-- SKU / Barcode -->
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700">
                      SKU
                      <span class="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      placeholder="RM-HOME-2627"
                      class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    />
                  </div>

                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700"> Barcode </label>

                    <input
                      type="text"
                      placeholder="8901234567890"
                      class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    />
                  </div>
                </div>
              </div>
            </section>

            <!-- Organization -->
            <section class="rounded-lg border border-slate-200 bg-white">
              <div class="border-b border-slate-200 px-5 py-4">
                <h2 class="text-sm font-semibold text-slate-900">Organization</h2>

                <p class="mt-1 text-xs text-body">
                  Assign this product to a category, brand and unit.
                </p>
              </div>

              <div class="grid gap-5 p-5 sm:grid-cols-2">
                <!-- Category -->
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700">
                    Category
                    <span class="text-red-500">*</span>
                  </label>

                  <select
                    class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  >
                    <option value="">Select category</option>
                    <option>Jerseys</option>
                    <option>T-Shirts</option>
                    <option>Football</option>
                    <option>Shoes</option>
                  </select>
                </div>

                <!-- Brand -->
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700"> Brand </label>

                  <select
                    class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  >
                    <option value="">Select brand</option>
                    <option>Adidas</option>
                    <option>Nike</option>
                    <option>Puma</option>
                    <option>Real Madrid</option>
                  </select>
                </div>

                <!-- Unit -->
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700">
                    Unit
                    <span class="text-red-500">*</span>
                  </label>

                  <select
                    class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  >
                    <option value="">Select unit</option>
                    <option>Piece</option>
                    <option>Pair</option>
                    <option>Box</option>
                    <option>Dozen</option>
                  </select>
                </div>

                <!-- Tax -->
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700"> Tax </label>

                  <select
                    class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  >
                    <option value="">No Tax</option>
                    <option>VAT 5%</option>
                    <option>VAT 10%</option>
                    <option>VAT 15%</option>
                  </select>
                </div>
              </div>
            </section>

            <!-- Pricing -->
            <section class="rounded-lg border border-slate-200 bg-white">
              <div class="border-b border-slate-200 px-5 py-4">
                <h2 class="text-sm font-semibold text-slate-900">Pricing</h2>

                <p class="mt-1 text-xs text-body">
                  Set the cost and selling price for this product.
                </p>
              </div>

              <div class="grid gap-5 p-5 sm:grid-cols-3">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700">
                    Cost Price
                  </label>

                  <div class="relative">
                    <span
                      class="absolute inset-y-0 left-0 flex items-center border-r border-slate-200 px-3 text-sm text-body"
                    >
                      ৳
                    </span>

                    <input
                      type="number"
                      placeholder="0.00"
                      class="w-full rounded-md border border-slate-200 py-2 pl-12 pr-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700">
                    Selling Price
                    <span class="text-red-500">*</span>
                  </label>

                  <div class="relative">
                    <span
                      class="absolute inset-y-0 left-0 flex items-center border-r border-slate-200 px-3 text-sm text-body"
                    >
                      ৳
                    </span>

                    <input
                      type="number"
                      placeholder="0.00"
                      class="w-full rounded-md border border-slate-200 py-2 pl-12 pr-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700">
                    Compare Price
                  </label>

                  <div class="relative">
                    <span
                      class="absolute inset-y-0 left-0 flex items-center border-r border-slate-200 px-3 text-sm text-body"
                    >
                      ৳
                    </span>

                    <input
                      type="number"
                      placeholder="0.00"
                      class="w-full rounded-md border border-slate-200 py-2 pl-12 pr-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    />
                  </div>
                </div>
              </div>
            </section>

            <!-- Inventory -->
            <section class="rounded-lg border border-slate-200 bg-white">
              <div class="border-b border-slate-200 px-5 py-4">
                <h2 class="text-sm font-semibold text-slate-900">Inventory</h2>

                <p class="mt-1 text-xs text-body">Configure stock tracking and inventory limits.</p>
              </div>

              <div class="space-y-5 p-5">
                <!-- Track Stock -->
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="text-sm font-medium text-slate-800">Track Inventory</p>

                    <p class="mt-1 text-xs text-body">
                      Automatically track stock quantity for this product.
                    </p>
                  </div>

                  <label class="relative inline-flex cursor-pointer">
                    <input type="checkbox" checked class="peer sr-only" />

                    <span
                      class="h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-slate-900 peer-focus:ring-2 peer-focus:ring-slate-200 after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5"
                    />
                  </label>
                </div>

                <div class="grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-3">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700">
                      Opening Stock
                    </label>

                    <input
                      type="number"
                      placeholder="0"
                      class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    />
                  </div>

                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700">
                      Minimum Stock
                    </label>

                    <input
                      type="number"
                      placeholder="0"
                      class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    />
                  </div>

                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-slate-700">
                      Maximum Stock
                    </label>

                    <input
                      type="number"
                      placeholder="Optional"
                      class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    />
                  </div>
                </div>

                <!-- Backorder -->
                <div class="flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
                  <div>
                    <p class="text-sm font-medium text-slate-800">Allow Backorders</p>

                    <p class="mt-1 text-xs text-body">
                      Allow customers to order when stock is unavailable.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    class="size-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                  />
                </div>
              </div>
            </section>

            <!-- Variants -->
            <section class="rounded-lg border border-slate-200 bg-white">
              <div
                class="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4"
              >
                <div>
                  <h2 class="text-sm font-semibold text-slate-900">Product Variants</h2>

                  <p class="mt-1 text-xs text-body">Add size, color or other product variations.</p>
                </div>

                <button
                  type="button"
                  class="inline-flex shrink-0 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-body transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <UIcon name="i-lucide-plus" class="size-4" />
                  Add Variant
                </button>
              </div>

              <div class="p-5">
                <!-- Variant row -->
                <div class="overflow-hidden rounded-md border border-slate-200">
                  <div
                    class="grid grid-cols-[minmax(0,1fr)_120px_120px_40px] border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-500"
                  >
                    <span>Variant</span>
                    <span>Price</span>
                    <span>Stock</span>
                    <span></span>
                  </div>

                  <div
                    class="grid grid-cols-[minmax(0,1fr)_120px_120px_40px] items-center gap-3 px-4 py-3"
                  >
                    <div>
                      <p class="text-sm font-medium text-slate-800">Black / M / Home</p>

                      <p class="mt-0.5 text-xs text-body">SKU: RM-HOME-BLK-M</p>
                    </div>

                    <span class="text-sm text-slate-700"> ৳5,500 </span>

                    <span class="text-sm text-slate-700"> 15 </span>

                    <button
                      type="button"
                      class="inline-flex size-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <UIcon name="i-lucide-trash-2" class="size-4" />
                    </button>
                  </div>
                </div>

                <!-- Empty state -->
                <div
                  class="mt-4 flex flex-col items-center justify-center rounded-md border border-dashed border-slate-200 px-5 py-8 text-center"
                >
                  <div class="flex size-10 items-center justify-center rounded-full bg-slate-100">
                    <UIcon name="i-lucide-layers-2" class="size-5 text-slate-500" />
                  </div>

                  <p class="mt-3 text-sm font-medium text-slate-800">Manage product variants</p>

                  <p class="mt-1 max-w-md text-xs leading-5 text-body">
                    Add variants such as color, size, type or sleeve. Each variant can have its own
                    SKU, price and stock.
                  </p>

                  <button
                    type="button"
                    class="mt-4 inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    <UIcon name="i-lucide-plus" class="size-4" />
                    Add Variant
                  </button>
                </div>
              </div>
            </section>
          </div>

          <!-- Sidebar -->
          <aside class="min-w-0 space-y-6">
            <!-- Status -->
            <section class="rounded-lg border border-slate-200 bg-white">
              <div class="border-b border-slate-200 px-5 py-4">
                <h2 class="text-sm font-semibold text-slate-900">Product Status</h2>
              </div>

              <div class="space-y-4 p-5">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700"> Status </label>

                  <select
                    class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  >
                    <option>Active</option>
                    <option>Draft</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
            </section>

            <!-- Product Image -->
            <section class="rounded-lg border border-slate-200 bg-white">
              <div class="border-b border-slate-200 px-5 py-4">
                <h2 class="text-sm font-semibold text-slate-900">Product Image</h2>

                <p class="mt-1 text-xs text-body">Upload the main product image.</p>
              </div>

              <div class="p-5">
                <label
                  class="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center transition hover:border-slate-400 hover:bg-slate-100"
                >
                  <UIcon name="i-lucide-image-plus" class="size-7 text-slate-400" />

                  <span class="mt-3 text-sm font-medium text-slate-700"> Upload image </span>

                  <span class="mt-1 text-xs text-body"> PNG, JPG or WEBP </span>

                  <input type="file" class="sr-only" accept="image/png,image/jpeg,image/webp" />
                </label>
              </div>
            </section>

            <!-- Gallery -->
            <section class="rounded-lg border border-slate-200 bg-white">
              <div class="border-b border-slate-200 px-5 py-4">
                <h2 class="text-sm font-semibold text-slate-900">Product Gallery</h2>
              </div>

              <div class="p-5">
                <label
                  class="flex cursor-pointer items-center justify-center rounded-md border border-dashed border-slate-300 px-4 py-5 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-images" class="size-4 text-slate-400" />

                    <span class="text-sm font-medium text-body"> Add gallery images </span>
                  </div>

                  <input
                    type="file"
                    multiple
                    class="sr-only"
                    accept="image/png,image/jpeg,image/webp"
                  />
                </label>
              </div>
            </section>

            <!-- Quick Summary -->
            <section class="rounded-lg border border-slate-200 bg-white">
              <div class="border-b border-slate-200 px-5 py-4">
                <h2 class="text-sm font-semibold text-slate-900">Quick Summary</h2>
              </div>

              <div class="divide-y divide-slate-100">
                <div class="flex items-center justify-between gap-4 px-5 py-3">
                  <span class="text-sm text-body"> Product Type </span>

                  <span class="text-sm font-medium text-slate-800"> Simple </span>
                </div>

                <div class="flex items-center justify-between gap-4 px-5 py-3">
                  <span class="text-sm text-body"> Variants </span>

                  <span class="text-sm font-medium text-slate-800"> 0 </span>
                </div>

                <div class="flex items-center justify-between gap-4 px-5 py-3">
                  <span class="text-sm text-body"> Stock </span>

                  <span class="text-sm font-medium text-slate-800"> 0 </span>
                </div>

                <div class="flex items-center justify-between gap-4 px-5 py-3">
                  <span class="text-sm text-body"> Selling Price </span>

                  <span class="text-sm font-semibold text-slate-900"> ৳0.00 </span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  </Default>
</template>
