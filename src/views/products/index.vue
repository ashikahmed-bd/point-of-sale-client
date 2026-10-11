<script setup>
import Default from '@/layouts/Default.vue'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const productStore = useProductStore()

const { products } = storeToRefs(productStore)

const loadProducts = async () => {
  await productStore.all()
}

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <Default>
    <main class="space-y-4 p-4">
      <div class="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 class="text-sm font-semibold text-body">Products</h1>

          <p class="mt-1 text-sm text-body/60">Manage your products, stock, pricing and more.</p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-body transition hover:bg-slate-50"
          >
            <UIcon name="i-lucide-download" class="size-4" />

            Export
          </button>

          <RouterLink
            :to="{ name: 'products.create' }"
            class="flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            <UIcon name="i-lucide-plus" class="size-4" />

            Add Product
          </RouterLink>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total Products -->
        <div class="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
          >
            <UIcon name="i-lucide-box" class="size-5" />
          </div>
          <div class="min-w-0">
            <p class="text-sm text-body/60">Total Products</p>
            <div class="mt-0.5 flex items-center gap-2">
              <span class="text-sm font-semibold text-body">1,240</span>
              <span class="text-sm font-medium text-emerald-600">+12%</span>
            </div>
            <p class="mt-0.5 text-xs text-body/40">vs last month</p>
          </div>
        </div>

        <!-- Low Stock -->
        <div class="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500"
          >
            <UIcon name="i-lucide-triangle-alert" class="size-5" />
          </div>
          <div class="min-w-0">
            <p class="text-sm text-body/60">Low Stock</p>
            <div class="mt-0.5 flex items-center gap-2">
              <span class="text-sm font-semibold text-body">28</span>
              <span class="text-sm font-medium text-emerald-600">+5%</span>
            </div>
            <p class="mt-0.5 text-xs text-body/40">vs last month</p>
          </div>
        </div>

        <!-- Out of Stock -->
        <div class="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500"
          >
            <UIcon name="i-lucide-circle-x" class="size-5" />
          </div>
          <div class="min-w-0">
            <p class="text-sm text-body/60">Out of Stock</p>
            <div class="mt-0.5 flex items-center gap-2">
              <span class="text-sm font-semibold text-body">12</span>
              <span class="text-sm font-medium text-emerald-600">+8%</span>
            </div>
            <p class="mt-0.5 text-xs text-body/40">vs last month</p>
          </div>
        </div>

        <!-- Active Products -->
        <div class="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-500"
          >
            <UIcon name="i-lucide-tag" class="size-5" />
          </div>
          <div class="min-w-0">
            <p class="text-sm text-body/60">Active Products</p>
            <div class="mt-0.5 flex items-center gap-2">
              <span class="text-sm font-semibold text-body">1,180</span>
              <span class="text-sm font-medium text-emerald-600">+10%</span>
            </div>
            <p class="mt-0.5 text-xs text-body/40">vs last month</p>
          </div>
        </div>
      </div>

      <section class="overflow-hidden rounded-lg border border-slate-200 bg-white px-4 py-6">
        <div
          class="flex flex-col gap-2 border-b border-slate-100 p-2 lg:flex-row lg:items-center lg:justify-between"
        >
          <!-- Search -->
          <div class="relative w-full lg:max-w-sm">
            <UIcon
              name="i-lucide-search"
              class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-body/40"
            />

            <input
              type="text"
              placeholder="Search products by name, SKU or barcode..."
              class="w-full rounded-md border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-sm text-body outline-none transition placeholder:text-body/40 focus:border-primary focus:bg-white"
            />
          </div>

          <!-- Filters -->
          <div class="flex w-full flex-wrap items-center justify-end gap-2">
            <select
              class="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-body outline-none focus:border-primary"
            >
              <option value="">All Categories</option>
              <option value="jerseys">Jerseys</option>
              <option value="t-shirts">T-Shirts</option>
              <option value="shoes">Shoes</option>
              <option value="accessories">Accessories</option>
            </select>

            <select
              class="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-body outline-none focus:border-primary"
            >
              <option value="">All Brands</option>
              <option value="adidas">Adidas</option>
              <option value="nike">Nike</option>
              <option value="puma">Puma</option>
              <option value="sony">Sony</option>
            </select>

            <select
              class="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-body outline-none focus:border-primary"
            >
              <option value="">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            <button
              type="button"
              class="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-body transition hover:bg-slate-50"
            >
              <UIcon name="i-lucide-list-filter" class="size-4" />

              Filter
            </button>

            <button type="button" class="px-1 text-sm text-primary hover:underline">Reset</button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="product in products.data" :key="product.id">
                <td>
                  <div class="flex items-center gap-3">
                    <div
                      class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                    >
                      <img
                        :src="product.cover_url"
                        :alt="product.name"
                        class="size-full object-cover"
                      />
                    </div>

                    <div class="min-w-0">
                      <p class="truncate text-sm font-medium text-body">
                        {{ product.name }}
                      </p>

                      <p class="mt-0.5 truncate text-xs text-body/50">Code: {{ product.code }}</p>
                    </div>
                  </div>
                </td>

                <td>
                  <span class="text-sm text-body">
                    {{ product.category?.name ?? '-' }}
                  </span>
                </td>

                <td>
                  <span class="text-sm text-body">
                    {{ product.brand?.name ?? '-' }}
                  </span>
                </td>

                <td>
                  <div>
                    <p class="text-sm font-medium text-body">
                      {{ $currency(product.price, product.currency) }}
                    </p>
                    <p v-if="product.base_price" class="text-xs text-body/40 line-through">
                      {{ $currency(product.base_price, product.currency) }}
                    </p>
                  </div>
                </td>

                <td>
                  <div>
                    <p class="text-sm font-medium text-body">
                      {{ product.stock }}
                    </p>

                    <p class="text-xs text-body/40">Min: {{ product.min_stock }}</p>
                  </div>
                </td>

                <td>
                  <span
                    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                    :class="
                      product.status === 'active'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-slate-100 text-slate-500'
                    "
                  >
                    {{ product.status }}
                  </span>
                </td>
                <td>
                  <div class="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      class="rounded-md p-1.5 text-body/60 hover:bg-slate-100 hover:text-body"
                      title="View"
                    >
                      <UIcon name="i-lucide-eye" class="size-4" />
                    </button>

                    <button
                      type="button"
                      class="rounded-md p-1.5 text-body/60 hover:bg-slate-100 hover:text-primary"
                      title="Edit"
                    >
                      <UIcon name="i-lucide-pencil" class="size-4" />
                    </button>

                    <button
                      type="button"
                      class="rounded-md p-1.5 text-body/60 hover:bg-red-50 hover:text-red-600"
                      title="Delete"
                      @click="deleteProduct(product)"
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
    </main>
  </Default>
</template>
