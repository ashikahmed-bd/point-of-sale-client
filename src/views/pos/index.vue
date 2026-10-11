<script setup>
import DraftSales from '@/components/DraftSales.vue'
import ProductCard from '@/components/ProductCard.vue'
import RecentSales from '@/components/RecentSales.vue'
import { useAuthStore } from '@/stores/auth'
import { useBrandStore } from '@/stores/brand'
import { useCartStore } from '@/stores/cart'
import { useCategoryStore } from '@/stores/category'
import { useCustomerStore } from '@/stores/customer'
import { useProductStore } from '@/stores/product'
import { useSaleStore } from '@/stores/sale'
import { storeToRefs } from 'pinia'
import { onMounted, reactive } from 'vue'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()
const categoryStore = useCategoryStore()
const brandStore = useBrandStore()
const productStore = useProductStore()
const cartStore = useCartStore()
const customerStore = useCustomerStore()
const saleStore = useSaleStore()

const toast = useToast()

const { categories } = storeToRefs(categoryStore)
const { brands } = storeToRefs(brandStore)
const { products } = storeToRefs(productStore)
const { cart } = storeToRefs(cartStore)
const { customers } = storeToRefs(customerStore)

const loadCategories = async () => {
  await categoryStore.all()
}

const loadBrands = async () => {
  await brandStore.all()
}

const loadProducts = async () => {
  await productStore.all()
}

const loadCart = async () => {
  await cartStore.getCart()
}

const search = reactive({
  category_id: '',
  brand_id: '',
  keywords: '',
})

const customer = reactive({
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  postcode: '',
  opening_balance: 0,
  credit_limit: null,
  notes: '',
})

const addCustomer = async (close) => {
  await customerStore.store(customer)
  close()
}

const form = reactive({
  customer_id: '',
  payable: 0,
  shipping: '',
})

const discount = reactive({
  amount: '',
  type: 'percent',
})

const addDiscount = async () => {
  await cartStore.discount(discount)
  loadCart()
}

const addShipping = async (close) => {
  await cartStore.shipping(form.shipping)

  close()
  loadCart()
  form.shipping = 0
}

const holdCart = async () => {
  try {
    await cartStore.holdCart(customerStore.customer?.id ?? null)

    toast.add({
      title: 'Cart hold successfully',
      color: 'success',
    })
  } catch (error) {
    toast.add({
      title: error.message ?? 'Failed to hold cart',
      color: 'error',
    })
  }
}

const placeOrder = async () => {
  try {
    const response = await saleStore.store(form)

    // cartStore.$reset()
    // await cartStore.getCart()

    console.log(response.data.data)

    // Print invoice after successful order
    printInvoice(response.data.data)
  } catch (error) {
    if (error.data) {
      toast.add({
        title: error.data?.message,
        color: 'error',
      })
    }
  }
}

onMounted(async () => {
  loadCategories()
  loadBrands()
  loadProducts()
  loadCart()
  await customerStore.all()

  form.customer_id = customerStore.customer?.id ?? null
})

const printInvoice = (sale) => {
  const printWindow = window.open('', '_blank', 'width=800,height=700,resizable=yes,scrollbars=yes')

  if (!printWindow) {
    alert('Popup blocked. Please allow popups for this site.')
    return
  }

  printWindow.document.open()

  printWindow.document.write(`
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice #${sale.invoice_no}</title>

    <style>
      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        padding: 0;
        background: #fff;
      }

      body {
        font-family: Arial, Helvetica, sans-serif;
        color: #111;
        font-size: 12px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
      }

      th,
      td {
        padding: 4px 0;
        vertical-align: top;
      }

      p {
        margin: 4px 0;
      }

      th {
        color: #555;
        font-size: 11px;
        font-weight: 600;
        border-bottom: 1px solid #ddd;
      }

      @media print {
        @page {
          margin: 0;
        }

        html,
        body {
          margin: 0;
          padding: 0;
        }
      }
    </style>
  </head>

  <body>
    <table style="max-width: 80mm; margin: 0 auto; padding: 20px">
      <!-- Header -->
      <tr>
        <td
          colspan="4"
          style="
            padding: 20px 10px 12px;
            text-align: center;
            border-bottom: 1px dashed #ccc;
          "
        >
          <p
            style="
              margin: 0 0 4px;
              font-size: 20px;
              line-height: 1.2;
              font-weight: 700;
            "
          >
            ${sale.store.name}
          </p>

          ${
            sale.store.address
              ? `
          <p
            style="
              margin: 0 0 4px;
              color: #555;
              font-size: 11px;
              line-height: 1.5;
            "
          >
            ${[sale.store.address, sale.store.city, sale.store.state, sale.store.postcode]
              .filter(Boolean)
              .join(', ')}
          </p>
          `
              : ''
          } ${
            sale.store.phone
              ? `
          <p style="margin: 3px 0; color: #555; font-size: 11px">
            Phone: ${sale.store.phone}
          </p>
          `
              : ''
          } ${
            sale.store.email
              ? `
          <p style="margin: 3px 0; color: #555; font-size: 11px">
            ${sale.store.email}
          </p>
          `
              : ''
          }
        </td>
      </tr>

      <!-- Invoice -->
      <tr>
        <td colspan="4" style="padding: 12px 0; border-bottom: none">
          <table>
            <tr>
              <td style="width: 35%; color: #666">Customer</td>
              <td style="text-align: right; font-weight: 600">
                ${sale.customer?.name ?? 'Walk-in'}
              </td>
            </tr>

            <tr>
              <td style="color: #666">Phone</td>
              <td style="text-align: right">
                ${sale.customer?.phone ?? 'N/A'}
              </td>
            </tr>

            <tr>
              <td style="color: #666">Payment</td>
              <td style="text-align: right; font-weight: 600">
                ${sale.payment_method ?? 'Cash'}
              </td>
            </tr>

            <tr>
              <td style="color: #666">Date</td>
              <td style="text-align: right">
                ${
                  sale.created_at
                    ? new Date(sale.created_at).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })
                    : new Date().toLocaleString('en-GB')
                }
              </td>
            </tr>

            <tr>
              <td style="color: #666">Invoice</td>
              <td style="text-align: right">#${sale.invoice_no}</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Items -->
      <tr>
        <td colspan="4" style="padding: 0; border-bottom: none">
          <table>
            <thead>
              <tr>
                <th style="text-align: left">Item</th>
                <th style="width: 35px; text-align: center">Qty</th>
                <th style="width: 55px; text-align: center">Tax</th>
                <th style="width: 75px; text-align: right">Total</th>
              </tr>
            </thead>

            <tbody>
              ${sale.items
                .map(
                  (item) => `
              <tr>
                <td
                  style="padding: 7px 4px 7px 0; border-bottom: 1px dashed #ccc"
                >
                  <span
                    style="
                      display: block;
                      font-weight: 600;
                      font-size: 11px;
                      line-height: 1.4;
                    "
                  >
                    ${item.name}
                  </span>

                  <span
                    style="
                      display: block;
                      margin-top: 2px;
                      font-size: 10px;
                      color: #666;
                    "
                  >
                    ${item.price} x ${item.quantity}
                  </span>
                </td>

                <td
                  style="
                    text-align: center;
                    white-space: nowrap;
                    border-bottom: 1px dashed #ccc;
                  "
                >
                  ${item.quantity}
                </td>

                <td
                  style="
                    text-align: center;
                    white-space: nowrap;
                    border-bottom: 1px dashed #ccc;
                  "
                >
                  ${item.tax}
                </td>

                <td
                  style="
                    text-align: right;
                    white-space: nowrap;
                    font-weight: 600;
                    border-bottom: 1px dashed #ccc;
                  "
                >
                  ${item.total}
                </td>
              </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
        </td>
      </tr>

      <!-- Summary -->
      <tr>
        <td colspan="4" style="padding: 12px 0 0; border-bottom: none">
          <table>
            <tr>
              <td style="padding: 5px 0">Subtotal</td>
              <td style="padding: 5px 0; text-align: right">
                ${sale.subtotal ?? 0}
              </td>
            </tr>

            <tr>
              <td style="padding: 5px 0">Discount</td>
              <td style="padding: 5px 0; text-align: right">
                - ${sale.discount ?? 0}
              </td>
            </tr>

            <tr>
              <td style="padding: 5px 0">
                Tax
                <span style="font-size: 10px; color: #777">
                  ${sale.tax_rate != null ? `(${sale.tax_rate}%)` : ''}
                </span>
              </td>
              <td style="padding: 5px 0; text-align: right">
                ${sale.tax ?? 0}
              </td>
            </tr>

            <tr>
              <td style="padding: 5px 0">Shipping</td>
              <td style="padding: 5px 0; text-align: right">
                ${sale.shipping ?? 0}
              </td>
            </tr>

            <tr>
              <td colspan="2" style="padding: 0; border-bottom: none">
                <table>
                  <tr>
                    <td
                      style="
                        padding: 8px 0;
                        border-top: 1px dashed #777;
                        font-size: 14px;
                        font-weight: 700;
                      "
                    >
                      Total
                    </td>
                    <td
                      style="
                        padding: 8px 0;
                        text-align: right;
                        border-top: 1px dashed #777;
                        font-size: 14px;
                        font-weight: 700;
                      "
                    >
                      ${sale.total ?? 0}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding: 5px 0">Paid</td>
              <td style="padding: 5px 0; text-align: right">
                ${sale.payable ?? 0}
              </td>
            </tr>

            <tr>
              <td style="padding: 6px 0; color: #c62828; font-weight: 700">
                Due
              </td>
              <td
                style="
                  padding: 6px 0;
                  text-align: right;
                  color: #c62828;
                  font-weight: 700;
                "
              >
                ${sale.due_amount ?? 0}
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td
          colspan="4"
          style="
            padding: 15px 5px 20px;
            text-align: center;
            border-top: 1px dashed #ccc;
          "
        >
          <p style="margin: 4px 0; font-weight: 600">
            Thank you for your purchase!
          </p>

          <p style="margin: 4px 0; color: #666">Powered by Gazi Sports</p>
        </td>
      </tr>
    </table>
  </body>
</html>
`)

  printWindow.document.close()

  printWindow.onload = () => {
    printWindow.focus()
    printWindow.print()
  }
}
</script>

<template>
  <div class="min-h-dvh bg-slate-200">
    <main class="grid min-h-0 grid-cols-1 gap-3 px-3 py-3 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <section class="flex min-h-0 min-w-0 flex-col rounded-xl bg-white">
        <header class="sticky top-0 z-10 rounded-t-xl border-b bg-white">
          <div class="flex items-center justify-between gap-3 px-4 py-3">
            <div v-if="authStore.store" class="">
              <div class="flex w-full items-center gap-2">
                <UIcon name="i-lucide-store" class="size-4 text-body" />

                <span class="flex-1 truncate">
                  {{ authStore.store?.name }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <RouterLink
                :to="{ name: 'home' }"
                class="flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              >
                <UIcon name="i-lucide-house" class="size-4" />
                <span class="hidden sm:inline">Home</span>
              </RouterLink>

              <DraftSales />

              <RecentSales />

              <button
                type="button"
                @click="holdCart"
                :disabled="cartStore.holding"
                class="flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <UIcon
                  :name="cartStore.holding ? 'i-lucide-loader' : 'i-lucide-pause-circle'"
                  class="size-4"
                  :class="{ 'animate-spin': cartStore.holding }"
                />
                <span>Hold</span>
              </button>
            </div>
          </div>
        </header>

        <div class="shrink-0 px-4 py-2.5">
          <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <select v-model="search.category_id" class="form__select">
              <option value="">All Categories</option>
              <option v-for="category in categories.data" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>

            <select v-model="search.brand_id" class="form__select">
              <option value="">All Brands</option>
              <option v-for="brand in brands.data" :key="brand.id" :value="brand.id">
                {{ brand.name }}
              </option>
            </select>

            <div class="relative sm:col-span-2 lg:col-span-1">
              <UIcon
                name="i-lucide-search"
                class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                v-model="search.keywords"
                placeholder="Search products..."
                class="form__control pl-9"
              />
            </div>
          </div>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto px-4 py-2 scrollbar-none">
          <div
            class="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
          >
            <ProductCard v-for="product in products.data" :key="product.id" :product="product" />
          </div>
        </div>
      </section>

      <!-- Cart -->
      <aside
        class="sticky top-2 flex min-h-0 max-h-[calc(100dvh-1rem)] flex-col rounded-xl bg-white px-4 py-2.5"
      >
        <header class="shrink-0 border-b border-border py-2.5">
          <div class="flex items-center justify-between gap-2">
            <UModal
              v-model:open="customerStore.dialog"
              title="Select Customer"
              description="Search and select a customer"
              :close="{
                color: 'primary',
                variant: 'outline',
                class: 'rounded-full',
              }"
              :ui="{
                content: 'z-30 sm:max-w-xl',
              }"
            >
              <button
                type="button"
                class="flex w-full items-center gap-2.5 rounded text-left transition hover:bg-slate-50"
              >
                <div
                  class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10"
                >
                  <UIcon name="i-lucide-user-round" class="size-4 text-primary" />
                </div>

                <div class="min-w-0 flex-1">
                  <h3 class="truncate text-sm font-semibold text-heading">
                    {{ customerStore.customer?.name ?? 'Loading ...' }}
                  </h3>
                  <span class="mt-0.5 block text-xs text-body">
                    {{ customerStore.customer?.phone ?? 'N/A' }}
                  </span>
                </div>
              </button>

              <template #body>
                <div class="space-y-4">
                  <UInput
                    icon="i-lucide-search"
                    placeholder="Search customer name or phone..."
                    autofocus
                    class="w-full"
                  />

                  <div class="max-h-80 overflow-y-auto">
                    <div class="space-y-1">
                      <button
                        v-for="customer in customers.data"
                        :key="customer.id"
                        type="button"
                        class="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition hover:bg-slate-50"
                        :class="{
                          'bg-primary/5': form.customer_id === customer.id,
                        }"
                        @click="customerStore.selectCustomer(customer)"
                      >
                        <div class="flex min-w-0 items-center gap-3">
                          <div
                            class="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100"
                          >
                            <UIcon name="i-lucide-user" class="size-4 text-slate-500" />
                          </div>

                          <div class="min-w-0">
                            <p class="truncate text-sm font-medium text-slate-700">
                              {{ customer.name }}
                            </p>

                            <p class="truncate text-xs text-slate-400">
                              {{ customer.phone }}
                            </p>
                          </div>
                        </div>

                        <UIcon
                          v-if="form.customer_id === customer.id"
                          name="i-lucide-check"
                          class="size-4 shrink-0 text-primary"
                        />
                      </button>

                      <!-- Empty -->
                      <div v-if="!customers.data?.length" class="py-8 text-center">
                        <UIcon
                          name="i-lucide-users-round"
                          class="mx-auto mb-2 size-8 text-slate-300"
                        />

                        <p class="text-sm font-medium text-slate-500">No customer found</p>

                        <p class="mt-1 text-xs text-slate-400">Try another name or phone number</p>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </UModal>

            <UModal
              title="Add Customer"
              description="Create a new customer profile"
              :close="{
                color: 'primary',
                variant: 'outline',
                class: 'rounded-full',
              }"
              :ui="{
                content: 'z-30 sm:max-w-xl',
              }"
            >
              <button
                type="button"
                class="flex shrink-0 items-center justify-center rounded-md bg-primary p-2 text-white transition hover:bg-primary/90 focus:outline-none"
                title="Add Customer"
              >
                <UIcon name="i-lucide-user-plus" class="size-4" />
              </button>

              <template #body>
                <div class="space-y-4">
                  <div class="grid grid-cols-2 gap-3">
                    <BaseInput
                      v-model="customer.name"
                      label="Name"
                      placeholder="Enter customer name"
                      :required="true"
                      error=""
                    />

                    <BaseInput
                      v-model="customer.phone"
                      label="Phone"
                      placeholder="Enter phone number"
                      :required="true"
                      error=""
                    />

                    <BaseInput
                      v-model="customer.email"
                      label="Email"
                      type="email"
                      placeholder="Enter email address"
                      :required="false"
                      error=""
                    />
                    <BaseInput
                      v-model="customer.address"
                      label="Address"
                      placeholder="Enter address"
                      :required="true"
                      error=""
                    />
                  </div>

                  <div class="grid grid-cols-3 gap-3">
                    <BaseInput
                      v-model="customer.city"
                      label="City"
                      placeholder="Enter city"
                      :required="false"
                      error=""
                    />

                    <BaseInput
                      v-model="customer.state"
                      label="State"
                      placeholder="Enter state"
                      :required="false"
                      error=""
                    />

                    <BaseInput
                      v-model="customer.postcode"
                      label="Postcode"
                      placeholder="Enter postcode"
                      :required="false"
                      error=""
                    />
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <BaseInput
                      v-model="customer.opening_balance"
                      label="Opening Balance"
                      type="number"
                      placeholder="0.00"
                      :required="false"
                      error=""
                    />

                    <BaseInput
                      v-model="customer.credit_limit"
                      label="Credit Limit"
                      type="number"
                      placeholder="0.00"
                      :required="false"
                      error=""
                    />
                  </div>

                  <BaseInput
                    label="Notes"
                    v-model="customer.notes"
                    placeholder="Add notes..."
                    :required="false"
                    error=""
                  />
                </div>
              </template>

              <template #footer="{ close }">
                <div class="flex w-full justify-end gap-2">
                  <UButton color="neutral" variant="outline" label="Cancel" @click="close" />

                  <UButton
                    @click="addCustomer(close)"
                    :loading="customerStore.loading"
                    :disabled="customerStore.loading"
                    color="primary"
                    label="Submit"
                    icon="i-lucide-user-plus"
                  />
                </div>
              </template>
            </UModal>
          </div>
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto py-2 scrollbar-none">
          <div class="space-y-1">
            <template v-if="cart?.items?.length">
              <article
                v-for="item in cart.items"
                :key="item.id"
                class="bg-slate-100 rounded flex items-start gap-2 px-2 py-1.5"
              >
                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <h3 class="truncate text-sm font-medium text-heading">
                        {{ item.name }}
                      </h3>

                      <p class="mt-0.5 text-xs text-slate-400">
                        {{ $currency(item.price) }} x {{ item.quantity }}

                        <span
                          v-if="item.tax_rate > 0"
                          class="ml-1.5 before:mr-1.5 before:content-['·']"
                        >
                          {{ item.tax_rate }}% tax
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      @click="cartStore.remove(item.id)"
                      class="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <UIcon name="i-lucide-trash-2" class="size-4" />
                    </button>
                  </div>

                  <div class="flex items-center justify-between gap-2">
                    <div class="inline-flex items-center">
                      <button
                        type="button"
                        @click="cartStore.decrement(item.id)"
                        :disabled="item.quantity <= 1"
                        class="flex size-7 items-center justify-center text-slate-500 transition hover:bg-slate-50 hover:text-red-500"
                      >
                        <UIcon name="i-lucide-minus" class="size-3.5" />
                      </button>

                      <span
                        class="flex min-w-8 items-center justify-center text-xs font-semibold text-body"
                      >
                        {{ item.quantity }}
                      </span>

                      <button
                        type="button"
                        @click="cartStore.increment(item.id)"
                        class="flex size-7 items-center justify-center transition hover:bg-slate-50 hover:text-emerald-600"
                      >
                        <UIcon name="i-lucide-plus" class="size-3.5" />
                      </button>
                    </div>

                    <span class="text-sm font-semibold"> {{ $currency(item.total) }} </span>
                  </div>
                </div>
              </article>
            </template>
            <template v-else>
              <article class="flex min-h-20 items-center justify-center py-6">
                <div class="flex flex-col items-center justify-center gap-3 text-center">
                  <div class="flex rounded-full bg-primary/10 p-3">
                    <UIcon name="i-lucide-shopping-bag" class="size-8 text-primary" />
                  </div>

                  <div>
                    <p class="text-sm font-medium text-slate-700">Your cart is empty</p>
                    <p class="mt-1 text-xs text-slate-400">Add items to your cart to get started</p>
                  </div>
                </div>
              </article>
            </template>
          </div>
        </div>

        <div class="bg-white shrink-0">
          <div class="flex items-center gap-2 py-2">
            <div class="relative flex-1">
              <UIcon
                name="i-lucide-tag"
                class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                v-model="discount.amount"
                placeholder="Enter discount"
                class="w-full rounded border border-border bg-slate-50 py-2 pl-9 pr-16 text-sm text-body outline-none transition placeholder:text-slate-400"
              />

              <select
                v-model="discount.type"
                class="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer rounded text-xs text-muted font-medium outline-none appearance"
              >
                <option value="percent">Percent</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>

            <button
              type="button"
              @click="addDiscount"
              class="shrink-0 rounded bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Apply
            </button>
          </div>
          <div class="space-y-0.5 py-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-body">Subtotal</span>
              <span class="text-body">
                {{ $currency(cartStore.cart?.subtotal ?? 0) }}
              </span>
            </div>

            <div class="flex items-center justify-between text-sm">
              <span class="text-body">Discount</span>
              <span class="text-danger"> - {{ $currency(cartStore.cart?.discount ?? 0) }} </span>
            </div>

            <div class="flex items-center justify-between text-sm">
              <span class="text-body"> Tax </span>
              <span class="text-body">
                {{ $currency(cartStore.cart?.tax ?? 0) }}
              </span>
            </div>

            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-1">
                <span class="text-body">Shipping</span>

                <UModal
                  title="Add Shipping Charge"
                  :close="{
                    color: 'primary',
                    variant: 'outline',
                    class: 'rounded-full',
                  }"
                >
                  <button
                    type="button"
                    class="flex items-center justify-center rounded p-1 text-body transition hover:bg-primary/5 hover:text-primary"
                    title="Add shipping"
                  >
                    <UIcon name="i-lucide-truck" class="size-3.5" />
                  </button>

                  <template #body>
                    <BaseInput
                      v-model="form.shipping"
                      label="Shipping"
                      type="number"
                      placeholder="Enter shipping charge"
                    />
                  </template>

                  <template #footer="{ close }">
                    <div class="flex justify-end gap-2">
                      <UButton color="neutral" variant="outline" label="Cancel" @click="close" />

                      <UButton
                        color="primary"
                        label="Apply"
                        icon="i-lucide-check"
                        @click="addShipping(close)"
                      />
                    </div>
                  </template>
                </UModal>
              </div>

              <span class="text-body">
                {{ $currency(cartStore.cart?.shipping ?? 0) }}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-body"> Grand Total </span>
              <span class="text-base font-bold text-primary">
                {{ $currency(cartStore.cart?.total ?? 0) }}
              </span>
            </div>
          </div>

          <div class="space-y-2.5">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-xs font-medium text-slate-500"> Received Amount </label>

                <span class="text-xs font-medium text-slate-500"> Change </span>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <input
                  v-model.number="form.payable"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  class="w-full rounded border border-border bg-white px-4 py-1.5 text-sm font-semibold text-body outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                <div
                  class="flex items-center justify-end rounded border border-emerald-100 bg-emerald-50 px-3 text-sm font-bold text-emerald-600"
                >
                  {{ $currency(Math.max(Number(form.payable) - Number(cartStore.cart?.total), 0)) }}
                </div>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-red-600"> Due Amount </span>
                <span class="text-sm font-bold text-red-600">
                  {{ $currency(Math.max(Number(cartStore.cart?.total) - Number(form.payable), 0)) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="py-2.5">
          <button
            type="button"
            @click="placeOrder"
            class="w-full flex items-center justify-center gap-2 rounded bg-primary py-2.5 text-sm font-semibold text-white"
          >
            <UIcon v-if="saleStore.loading" name="i-lucide-loader" class="size-4" />
            <UIcon v-else name="i-lucide-credit-card" class="size-4" />
            <span>Pay Now</span>
          </button>
        </div>
      </aside>
    </main>
  </div>
</template>
