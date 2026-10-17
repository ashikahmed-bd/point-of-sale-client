<script setup>
import Default from '@/layouts/Default.vue'
import { useBrandStore } from '@/stores/brand'
import { useCategoryStore } from '@/stores/category'
import { useProductStore } from '@/stores/product'
import { useTaxStore } from '@/stores/tax'
import { useUnitStore } from '@/stores/unit'
import { storeToRefs } from 'pinia'
import { onMounted, reactive } from 'vue'

const categoryStore = useCategoryStore()
const brandStore = useBrandStore()
const taxStore = useTaxStore()
const unitStore = useUnitStore()
const productStore = useProductStore()

const { categories } = storeToRefs(categoryStore)
const { brands } = storeToRefs(brandStore)
const { taxes } = storeToRefs(taxStore)
const { units } = storeToRefs(unitStore)
const { errors } = storeToRefs(productStore)

const form = reactive({
  name: 'Classic Slim Fit Shirt',
  sku: 'SHT-001',
  barcode: '8901002204012',
  description: 'Premium quality classic slim fit shirt made with soft and comfortable fabric.',

  cost_price: 850,
  selling_price: 1290,
  compare_price: 1490,

  stock: 50,
  min_stock: 10,
  max_stock: 100,

  track_stock: true,
  allow_backorder: true,

  status: 'active',

  cover: null,
  gallery: [],

  category_id: '',
  brand_id: '',
  tax_id: '',
  unit_id: '',

  has_variants: false,
  variants: [],
})

const submit = async () => {
  const formData = new FormData()

  formData.append('name', form.name)
  formData.append('sku', form.sku)
  formData.append('barcode', form.barcode)
  formData.append('description', form.description)

  formData.append('cost_price', form.cost_price)
  formData.append('selling_price', form.selling_price)

  if (form.compare_price !== null && form.compare_price !== '') {
    formData.append('compare_price', form.compare_price)
  }

  formData.append('stock', form.stock)
  formData.append('min_stock', form.min_stock)

  if (form.max_stock !== null && form.max_stock !== '') {
    formData.append('max_stock', form.max_stock)
  }

  formData.append('track_stock', form.track_stock ? '1' : '0')
  formData.append('allow_backorder', form.allow_backorder ? '1' : '0')

  formData.append('status', form.status)

  if (form.cover) {
    formData.append('cover', form.cover)
  }

  form.gallery.forEach((file) => {
    formData.append('gallery[]', file)
  })

  formData.append('category_id', form.category_id)
  formData.append('brand_id', form.brand_id)
  formData.append('tax_id', form.tax_id)
  formData.append('unit_id', form.unit_id)

  formData.append('has_variants', form.has_variants)
  formData.append('variants', JSON.stringify(form.variants))

  await productStore.store(formData)
}

const loadCategories = async () => {
  await categoryStore.all()
}

const loadBrands = async () => {
  await brandStore.all()
}

const loadTaxes = async () => {
  await taxStore.all()
}

const loadUnits = async () => {
  await unitStore.all()
}

onMounted(() => {
  loadCategories()
  loadBrands()
  loadTaxes()
  loadUnits()
})

const addOption = () => {
  form.options.push({
    name: '',
    options: [],
    input: '',
  })
}

const removeOption = (index) => {
  form.options.splice(index, 1)
}

const addOptionValue = (index) => {
  const option = form.options[index]
  const value = option.input.trim()

  if (!value) return

  if (!option.options.includes(value)) {
    option.options.push(value)
  }

  option.input = ''
}

const removeOptionValue = (optionIndex, valueIndex) => {
  form.options[optionIndex].options.splice(valueIndex, 1)
}

const generateVariants = () => {
  const options = form.options
    .filter((option) => option.name.trim() && option.options.length)
    .map((option) => ({
      name: option.name.trim(),
      options: option.options,
    }))

  if (!options.length) {
    form.variants = []
    return
  }

  const combinations = options.reduce(
    (combinations, option) => {
      return combinations.flatMap((combination) =>
        option.options.map((value) => ({
          ...combination,
          [option.name]: value,
        })),
      )
    },
    [{}],
  )

  form.variants = combinations.map((combination, index) => ({
    name: Object.values(combination).join(' / '),

    sku: `${form.sku}-${index + 1}`,

    barcode: '',

    options: combination,

    cost_price: form.cost_price ?? 0,
    selling_price: form.selling_price ?? 0,
    compare_price: form.compare_price ?? null,

    stock: 0,
    min_stock: form.min_stock ?? 0,
    max_stock: form.max_stock ?? null,

    track_stock: form.track_stock ?? true,
    allow_backorder: form.allow_backorder ?? true,

    is_default: index === 0,
    active: true,
  }))
}

const removeVariant = (index) => {
  form.variants.splice(index, 1)
}
</script>

<template>
  <Default>
    <main class="space-y-4">
      <header class="border-b border-slate-200">
        <div class="flex items-center justify-between gap-4">
          <div class="min-w-0">
            <h1 class="truncate text-lg font-semibold text-slate-900">Create Product</h1>

            <p class="mt-0.5 text-sm text-body">Add a new product to your inventory.</p>
          </div>

          <div class="flex shrink-0 items-center gap-2">
            <RouterLink
              to="/products"
              class="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-body transition hover:bg-slate-50 hover:text-slate-900"
            >
              <UIcon name="i-lucide-x" class="size-4" />
              Cancel
            </RouterLink>

            <button
              type="button"
              :disabled="productStore.loading"
              @click="submit"
              class="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UIcon
                :name="productStore.loading ? 'i-lucide-loader' : 'i-lucide-save'"
                :class="['size-4', productStore.loading && 'animate-spin']"
              />

              {{ productStore.loading ? 'Saving...' : 'Save Product' }}
            </button>
          </div>
        </div>
      </header>

      <!-- Content -->
      <div class="space-y-4 py-6">
        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <!-- Main Content -->
          <div class="min-w-0 space-y-6">
            <!-- Product Information -->
            <section class="rounded-lg border border-slate-200 bg-white">
              <div class="border-b border-slate-200 px-5 py-4">
                <h2 class="text-sm font-semibold text-slate-900">Product Information</h2>

                <p class="mt-1 text-xs text-body">Enter the basic information for this product.</p>
              </div>

              <div class="space-y-5 p-5">
                <!-- Name -->
                <div class="form__group">
                  <label class="form__label">
                    Name
                    <span class="text-danger">*</span>
                  </label>

                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="Enter product name"
                    class="form__control"
                  />

                  <small v-if="errors.name" class="text-danger">
                    {{ errors.name }}
                  </small>
                </div>

                <!-- SKU / Barcode -->
                <div class="grid gap-4 sm:grid-cols-2">
                  <div class="form__group">
                    <label class="form__label">
                      SKU
                      <span class="text-danger">*</span>
                    </label>

                    <input
                      v-model="form.sku"
                      type="text"
                      placeholder="RM-HOME-2627"
                      class="form__control"
                    />

                    <small v-if="errors.sku" class="text-danger">
                      {{ errors.sku }}
                    </small>
                  </div>

                  <div class="form__group">
                    <label class="form__label">
                      Barcode
                      <span class="text-danger">*</span>
                    </label>

                    <input
                      v-model="form.barcode"
                      type="text"
                      placeholder="8901234567890"
                      class="form__control"
                    />

                    <small v-if="errors.barcode" class="text-danger">
                      {{ errors.barcode }}
                    </small>
                  </div>
                </div>

                <!-- Description -->
                <div class="form__group">
                  <label class="form__label">
                    Description
                    <span class="text-danger">*</span>
                  </label>

                  <textarea
                    v-model="form.description"
                    rows="6"
                    placeholder="Write a short description about this product..."
                    class="form__control"
                  ></textarea>

                  <small v-if="errors.description" class="text-danger">
                    {{ errors.description }}
                  </small>
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
                <!-- Cost Price -->
                <div class="form__group">
                  <label class="form__label">
                    Cost Price
                    <span class="text-danger">*</span>
                  </label>

                  <input
                    v-model="form.cost_price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    class="form__control"
                  />

                  <small v-if="errors.cost_price" class="text-danger">
                    {{ errors.cost_price }}
                  </small>
                </div>

                <!-- Selling Price -->
                <div class="form__group">
                  <label class="form__label">
                    Selling Price
                    <span class="text-danger">*</span>
                  </label>

                  <input
                    v-model="form.selling_price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    class="form__control"
                  />

                  <small v-if="errors.selling_price" class="text-danger">
                    {{ errors.selling_price }}
                  </small>
                </div>

                <!-- Compare Price -->
                <div class="form__group">
                  <label class="form__label"> Compare Price </label>

                  <input
                    v-model="form.compare_price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    class="form__control"
                  />

                  <small v-if="errors.compare_price" class="text-danger">
                    {{ errors.compare_price }}
                  </small>
                </div>
              </div>
            </section>

            <!-- Organization -->
            <section class="rounded-lg border border-slate-200 bg-white">
              <div class="border-b border-slate-200 px-4 py-4">
                <h2 class="text-sm font-semibold text-slate-900">Organization</h2>

                <p class="mt-1 text-xs text-body">
                  Assign this product to a category, brand, tax and unit.
                </p>
              </div>

              <div class="grid sm:grid-cols-2 gap-4 p-3.5">
                <!-- Category -->
                <div class="form__group">
                  <label class="form__label">
                    Category
                    <span class="text-danger">*</span>
                  </label>

                  <select v-model="form.category_id" class="form__select">
                    <option value="">Select category</option>

                    <option
                      v-for="category in categories.data"
                      :key="category.id"
                      :value="category.id"
                    >
                      {{ category.name }}
                    </option>
                  </select>

                  <small v-if="errors.category_id" class="text-danger">
                    {{ errors.category_id }}
                  </small>
                </div>

                <!-- Brand -->
                <div class="form__group">
                  <label class="form__label"> Brand </label>

                  <select v-model="form.brand_id" class="form__select">
                    <option value="">No Brand</option>

                    <option v-for="brand in brands.data" :key="brand.id" :value="brand.id">
                      {{ brand.name }}
                    </option>
                  </select>

                  <small v-if="errors.brand_id" class="text-danger">
                    {{ errors.brand_id }}
                  </small>
                </div>

                <!-- Unit -->
                <div class="form__group">
                  <label class="form__label">
                    Unit
                    <span class="text-danger">*</span>
                  </label>
                  <select v-model="form.unit_id" class="form__select">
                    <option value="" disabled>Select unit</option>
                    <option v-for="unit in units.data" :key="unit.id" :value="unit.id">
                      {{ unit.name }}
                    </option>
                  </select>

                  <small v-if="errors.unit_id" class="text-danger">
                    {{ errors.unit_id }}
                  </small>
                </div>

                <!-- Tax -->
                <div class="form__group">
                  <label class="form__label"> Tax </label>

                  <select v-model="form.tax_id" class="form__select">
                    <option value="" disabled>No Tax</option>

                    <option v-for="tax in taxes.data" :key="tax.id" :value="tax.id">
                      {{ tax.name }}
                    </option>
                  </select>

                  <small v-if="errors.tax_id" class="text-danger">
                    {{ errors.tax_id }}
                  </small>
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
                <!-- Track Inventory -->
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="text-sm font-medium text-slate-800">Track Inventory</p>

                    <p class="mt-1 text-xs text-body">
                      Automatically track stock quantity for this product.
                    </p>
                  </div>

                  <USwitch v-model="form.track_stock" />
                </div>

                <!-- Stock -->
                <div
                  v-if="form.track_stock"
                  class="grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-3"
                >
                  <!-- Opening Stock -->
                  <div class="form__group">
                    <label class="form__label"> Opening Stock </label>

                    <input
                      v-model.number="form.stock"
                      type="number"
                      min="0"
                      placeholder="0"
                      class="form__control"
                    />

                    <small v-if="errors.stock" class="text-danger">
                      {{ errors.stock }}
                    </small>
                  </div>

                  <!-- Minimum Stock -->
                  <div class="form__group">
                    <label class="form__label"> Minimum Stock </label>

                    <input
                      v-model.number="form.min_stock"
                      type="number"
                      min="0"
                      placeholder="0"
                      class="form__control"
                    />

                    <small v-if="errors.min_stock" class="text-danger">
                      {{ errors.min_stock }}
                    </small>
                  </div>

                  <!-- Maximum Stock -->
                  <div class="form__group">
                    <label class="form__label"> Maximum Stock </label>

                    <input
                      v-model.number="form.max_stock"
                      type="number"
                      min="0"
                      placeholder="Optional"
                      class="form__control"
                    />

                    <small v-if="errors.max_stock" class="text-danger">
                      {{ errors.max_stock }}
                    </small>
                  </div>
                </div>

                <!-- Backorder -->
                <div class="flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
                  <div>
                    <p class="text-sm font-medium text-slate-800">Allow Backorders</p>

                    <p class="mt-1 text-xs text-body">Allow sales when stock is unavailable.</p>
                  </div>

                  <USwitch v-model="form.allow_backorder" />
                </div>
              </div>
            </section>

            <section v-if="form.has_variants" class="rounded-lg border border-slate-200 bg-white">
              <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <h2 class="text-sm font-semibold text-slate-900">Product Variants</h2>

                  <p class="mt-1 text-xs text-body">Add options and generate product variants.</p>
                </div>

                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  @click="addOption"
                >
                  <UIcon name="i-lucide-plus" class="size-4" />

                  Add Option
                </button>
              </div>

              <!-- Options -->
              <div class="p-5">
                <div
                  v-for="(option, index) in form.options"
                  :key="index"
                  class="mb-3 flex items-end gap-3 last:mb-0"
                >
                  <!-- Name -->
                  <div>
                    <label class="mb-1.5 block text-xs font-medium text-slate-700"> Name </label>

                    <input
                      v-model="option.name"
                      type="text"
                      placeholder="Color"
                      class="form__control"
                    />
                  </div>

                  <!-- Values -->
                  <div class="flex-1">
                    <label class="mb-1.5 block text-xs font-medium text-slate-700"> Values </label>

                    <div
                      class="flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border border-slate-200 px-2 py-1.5"
                    >
                      <button
                        v-for="(value, valueIndex) in option.options"
                        :key="valueIndex"
                        type="button"
                        class="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1.5 text-sm text-slate-700 transition hover:bg-red-50 hover:text-red-600"
                        @click="removeOptionValue(index, valueIndex)"
                      >
                        {{ value }}

                        <UIcon name="i-lucide-x" class="size-3.5" />
                      </button>

                      <input
                        v-model="option.input"
                        type="text"
                        placeholder="Type value and press Enter"
                        class="flex-1 border-0 bg-transparent px-1 py-1 text-sm outline-none"
                        @keydown.enter.prevent="addOptionValue(index)"
                      />
                    </div>
                  </div>

                  <!-- Remove Option -->
                  <button
                    type="button"
                    class="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    @click="removeOption(index)"
                  >
                    <UIcon name="i-lucide-trash-2" class="size-4" />
                  </button>
                </div>

                <!-- Empty -->
                <div
                  v-if="!form.options.length"
                  class="rounded-lg border border-dashed border-slate-300 px-5 py-8 text-center"
                >
                  <UIcon name="i-lucide-layers-2" class="mx-auto size-8 text-slate-300" />

                  <p class="mt-2 text-sm font-medium text-slate-700">No options added</p>

                  <p class="mt-1 text-xs text-body">
                    Click Add Option to create your first option.
                  </p>
                </div>

                <!-- Generate -->
                <div v-if="form.options.length" class="mt-5 flex justify-end">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                    @click="generateVariants"
                  >
                    <UIcon name="i-lucide-layers-2" class="size-4" />

                    Generate Variants
                  </button>
                </div>
              </div>
            </section>
          </div>

          <aside class="min-w-0 space-y-6 lg:sticky lg:top-6 lg:self-start">
            <section class="rounded-lg border border-slate-200 bg-white">
              <div class="border-b border-slate-200 px-5 py-4">
                <h2 class="text-sm font-semibold text-slate-900">Product Status</h2>
              </div>

              <div class="space-y-4 p-5">
                <div class="form__group">
                  <label class="form__label"> Status </label>
                  <select v-model="form.status" class="form__select">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </section>

            <section class="rounded-lg border border-slate-200 bg-white">
              <div class="border-b border-slate-200 px-5 py-4">
                <h2 class="text-sm font-semibold text-slate-900">Product Image</h2>
                <p class="text-xs text-body">Upload the main product image.</p>
              </div>

              <div class="p-2.5">
                <UFileUpload
                  v-model="form.cover"
                  label="Drop your image here"
                  description="SVG, PNG, JPG or GIF (max. 2MB)"
                  class="min-h-48"
                />
              </div>
            </section>

            <section class="rounded-lg border border-slate-200 bg-white">
              <div class="border-b border-slate-200 px-5 py-4">
                <h2 class="text-sm font-semibold text-slate-900">Product Gallery</h2>
              </div>

              <div class="p-2.5">
                <UFileUpload
                  v-model="form.gallery"
                  label="Drop your images here"
                  description="SVG, PNG, JPG or GIF (max. 2MB each)"
                  multiple
                  :max-files="10"
                  accept="image/*"
                  class="min-h-48"
                />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  </Default>
</template>
