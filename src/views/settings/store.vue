<script setup>
import { reactive, ref } from 'vue'
import Default from '@/layouts/Default.vue'

const storageKey = 'store-settings'
const message = ref('')

const defaults = {
  store_name: '',
  store_code: '',
  store_type: 'retail',
  store_manager: '',
  store_phone: '',
  store_email: '',
  branch_name: '',
  store_status: 'active',

  address: '',
  city: '',
  state: '',
  postcode: '',
  country: 'Bangladesh',

  default_warehouse: 'main',
  low_stock_threshold: 10,
  stock_valuation: 'fifo',
  track_inventory: true,
  allow_negative_stock: false,
  low_stock_alerts: true,
  expiry_tracking: false,
  stock_transfers: true,

  default_customer: 'Walk-in Customer',
  default_payment_method: 'cash',
  invoice_prefix: 'INV-',
  default_discount: 0,
  invoice_footer: 'Thank you for shopping with us!',
  require_customer: false,
  auto_print_invoice: false,
  show_tax: true,
}

function loadSettings() {
  try {
    const saved = localStorage.getItem(storageKey)
    return saved ? { ...defaults, ...JSON.parse(saved) } : { ...defaults }
  } catch {
    return { ...defaults }
  }
}

const settings = reactive(loadSettings())

function saveSettings() {
  if (!settings.store_name.trim()) {
    message.value = 'Store name is required.'
    return
  }

  if (
    settings.low_stock_threshold < 0 ||
    settings.default_discount < 0 ||
    settings.default_discount > 100
  ) {
    message.value = 'Please check the stock threshold and discount values.'
    return
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify(settings))
    message.value = 'Store settings saved successfully.'
  } catch {
    message.value = 'Unable to save settings in this browser.'
  }
}

function resetSettings() {
  Object.assign(settings, defaults)
  message.value = ''

  try {
    localStorage.removeItem(storageKey)
  } catch {
    message.value = 'Settings were reset in the form but could not be cleared from storage.'
  }
}
</script>

<template>
  <Default>
    <main class="space-y-4 p-4">
      <!-- Page Header -->
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Store Settings</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your store information, inventory, and POS preferences.
          </p>
        </div>

        <div class="flex gap-3">
          <button
            type="button"
            @click="resetSettings"
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Reset
          </button>

          <button
            type="button"
            @click="saveSettings"
            class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      </div>

      <form class="space-y-6" @submit.prevent="saveSettings">
        <!-- Store Information -->
        <section
          class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
            <h2 class="text-base font-semibold text-gray-900 dark:text-white">Store Information</h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Basic information about your store or branch.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label
                for="store_name"
                class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Store Name <span class="text-red-500">*</span>
              </label>
              <input
                id="store_name"
                v-model="settings.store_name"
                type="text"
                required
                placeholder="Enter store name"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label
                for="store_code"
                class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Store Code
              </label>
              <input
                id="store_code"
                v-model="settings.store_code"
                type="text"
                placeholder="e.g. STR-001"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label
                for="store_type"
                class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Store Type
              </label>
              <select
                id="store_type"
                v-model="settings.store_type"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="retail">Retail Store</option>
                <option value="wholesale">Wholesale</option>
                <option value="warehouse">Warehouse</option>
                <option value="showroom">Showroom</option>
              </select>
            </div>

            <div>
              <label
                for="store_manager"
                class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Store Manager
              </label>
              <input
                id="store_manager"
                v-model="settings.store_manager"
                type="text"
                placeholder="Enter manager name"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label
                for="store_phone"
                class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Phone Number
              </label>
              <input
                id="store_phone"
                v-model="settings.store_phone"
                type="tel"
                placeholder="Enter phone number"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label
                for="store_email"
                class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address
              </label>
              <input
                id="store_email"
                v-model="settings.store_email"
                type="email"
                placeholder="store@example.com"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label
                for="branch_name"
                class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Branch Name
              </label>
              <input
                id="branch_name"
                v-model="settings.branch_name"
                type="text"
                placeholder="Enter branch name"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label
                for="store_status"
                class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Store Status
              </label>
              <select
                id="store_status"
                v-model="settings.store_status"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Store Address -->
        <section
          class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
            <h2 class="text-base font-semibold text-gray-900 dark:text-white">Store Address</h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Set the physical location of your store.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
            <div class="sm:col-span-2 lg:col-span-3">
              <label
                for="address"
                class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Street Address
              </label>
              <textarea
                id="address"
                v-model="settings.address"
                rows="3"
                placeholder="Enter full store address"
                class="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              ></textarea>
            </div>

            <div>
              <label
                for="city"
                class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                City
              </label>
              <input
                id="city"
                v-model="settings.city"
                type="text"
                placeholder="Enter city"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label
                for="state"
                class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                State / Division
              </label>
              <input
                id="state"
                v-model="settings.state"
                type="text"
                placeholder="Enter state or division"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label
                for="postcode"
                class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Postcode
              </label>
              <input
                id="postcode"
                v-model="settings.postcode"
                type="text"
                placeholder="Enter postcode"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div class="sm:col-span-2 lg:col-span-3">
              <label
                for="country"
                class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Country
              </label>
              <input
                id="country"
                v-model="settings.country"
                type="text"
                placeholder="Enter country"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </section>

        <!-- Inventory Settings -->
        <section
          class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
            <h2 class="text-base font-semibold text-gray-900 dark:text-white">
              Inventory Settings
            </h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Configure stock tracking and inventory behavior.
            </p>
          </div>

          <div class="space-y-5 p-5">
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  for="default_warehouse"
                  class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Default Warehouse
                </label>
                <select
                  id="default_warehouse"
                  v-model="settings.default_warehouse"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="main">Main Warehouse</option>
                  <option value="branch">Branch Warehouse</option>
                  <option value="store">Store Stock</option>
                </select>
              </div>

              <div>
                <label
                  for="low_stock_threshold"
                  class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Low Stock Threshold
                </label>
                <input
                  id="low_stock_threshold"
                  v-model.number="settings.low_stock_threshold"
                  type="number"
                  min="0"
                  required
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label
                  for="stock_valuation"
                  class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Stock Valuation Method
                </label>
                <select
                  id="stock_valuation"
                  v-model="settings.stock_valuation"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="fifo">FIFO</option>
                  <option value="lifo">LIFO</option>
                  <option value="average">Weighted Average Cost</option>
                </select>
              </div>
            </div>

            <div class="divide-y divide-gray-200 dark:divide-gray-800">
              <label class="flex cursor-pointer items-center justify-between gap-4 py-4">
                <span>
                  <span class="block text-sm font-medium text-gray-900 dark:text-white">
                    Track Inventory
                  </span>
                  <span class="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                    Automatically update stock when purchases and sales occur.
                  </span>
                </span>
                <input
                  v-model="settings.track_inventory"
                  type="checkbox"
                  class="h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </label>

              <label class="flex cursor-pointer items-center justify-between gap-4 py-4">
                <span>
                  <span class="block text-sm font-medium text-gray-900 dark:text-white">
                    Allow Negative Stock
                  </span>
                  <span class="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                    Allow sales when available inventory reaches zero.
                  </span>
                </span>
                <input
                  v-model="settings.allow_negative_stock"
                  type="checkbox"
                  class="h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </label>

              <label class="flex cursor-pointer items-center justify-between gap-4 py-4">
                <span>
                  <span class="block text-sm font-medium text-gray-900 dark:text-white">
                    Low Stock Alerts
                  </span>
                  <span class="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                    Notify when a product falls below the stock threshold.
                  </span>
                </span>
                <input
                  v-model="settings.low_stock_alerts"
                  type="checkbox"
                  class="h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </label>

              <label class="flex cursor-pointer items-center justify-between gap-4 py-4">
                <span>
                  <span class="block text-sm font-medium text-gray-900 dark:text-white">
                    Expiry Date Tracking
                  </span>
                  <span class="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                    Track product expiry dates for applicable products.
                  </span>
                </span>
                <input
                  v-model="settings.expiry_tracking"
                  type="checkbox"
                  class="h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </label>

              <label class="flex cursor-pointer items-center justify-between gap-4 py-4">
                <span>
                  <span class="block text-sm font-medium text-gray-900 dark:text-white">
                    Enable Stock Transfers
                  </span>
                  <span class="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                    Allow stock transfers between stores and warehouses.
                  </span>
                </span>
                <input
                  v-model="settings.stock_transfers"
                  type="checkbox"
                  class="h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </label>
            </div>
          </div>
        </section>

        <!-- POS Settings -->
        <section
          class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
            <h2 class="text-base font-semibold text-gray-900 dark:text-white">POS Settings</h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Configure default behavior for point-of-sale transactions.
            </p>
          </div>

          <div class="space-y-5 p-5">
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  for="default_customer"
                  class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Default Customer
                </label>
                <input
                  id="default_customer"
                  v-model="settings.default_customer"
                  type="text"
                  placeholder="Walk-in Customer"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label
                  for="default_payment_method"
                  class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Default Payment Method
                </label>
                <select
                  id="default_payment_method"
                  v-model="settings.default_payment_method"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="mobile_banking">Mobile Banking</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label
                  for="invoice_prefix"
                  class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Invoice Prefix
                </label>
                <input
                  id="invoice_prefix"
                  v-model="settings.invoice_prefix"
                  type="text"
                  placeholder="INV-"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label
                  for="default_discount"
                  class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Default Discount (%)
                </label>
                <input
                  id="default_discount"
                  v-model.number="settings.default_discount"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div class="sm:col-span-2">
                <label
                  for="invoice_footer"
                  class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Invoice Footer
                </label>
                <textarea
                  id="invoice_footer"
                  v-model="settings.invoice_footer"
                  rows="3"
                  placeholder="Thank you for shopping with us!"
                  class="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                ></textarea>
              </div>
            </div>

            <div class="divide-y divide-gray-200 dark:divide-gray-800">
              <label class="flex cursor-pointer items-center justify-between gap-4 py-4">
                <span>
                  <span class="block text-sm font-medium text-gray-900 dark:text-white">
                    Require Customer Selection
                  </span>
                  <span class="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                    Require a customer before completing a sale.
                  </span>
                </span>
                <input
                  v-model="settings.require_customer"
                  type="checkbox"
                  class="h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </label>

              <label class="flex cursor-pointer items-center justify-between gap-4 py-4">
                <span>
                  <span class="block text-sm font-medium text-gray-900 dark:text-white">
                    Automatically Print Invoice
                  </span>
                  <span class="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                    Print the invoice after a successful sale.
                  </span>
                </span>
                <input
                  v-model="settings.auto_print_invoice"
                  type="checkbox"
                  class="h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </label>

              <label class="flex cursor-pointer items-center justify-between gap-4 py-4">
                <span>
                  <span class="block text-sm font-medium text-gray-900 dark:text-white">
                    Show Tax on POS
                  </span>
                  <span class="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                    Display tax details during checkout.
                  </span>
                </span>
                <input
                  v-model="settings.show_tax"
                  type="checkbox"
                  class="h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </label>
            </div>
          </div>
        </section>

        <!-- Bottom Actions -->
        <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            @click="resetSettings"
            class="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Reset Settings
          </button>

          <button
            type="submit"
            class="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Save Settings
          </button>
        </div>

        <p
          v-if="message"
          class="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
          role="status"
        >
          {{ message }}
        </p>
      </form>
    </main>
  </Default>
</template>
