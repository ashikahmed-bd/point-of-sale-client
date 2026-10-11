<template>
  <Default>
    <main class="space-y-6 p-4">
      <!-- Page Header -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">General Settings</h1>
          <p class="mt-1 text-sm text-gray-500">
            Manage your company information and application preferences.
          </p>
        </div>

        <div class="flex gap-2">
          <button
            type="button"
            @click="resetSettings"
            class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <UIcon name="i-lucide-rotate-ccw" class="mr-1 inline size-4" />
            Reset
          </button>

          <button
            type="button"
            @click="saveSettings"
            class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            <UIcon name="i-lucide-save" class="mr-1 inline size-4" />
            Save Changes
          </button>
        </div>
      </div>

      <!-- Company Information -->
      <section
        class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="border-b border-gray-200 p-5 dark:border-gray-800">
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
            >
              <UIcon name="i-lucide-building-2" class="size-5" />
            </div>
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Company Information</h2>
              <p class="text-sm text-gray-500">Basic information about your business.</p>
            </div>
          </div>
        </div>

        <div class="grid gap-5 p-5 md:grid-cols-2">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Company Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.company_name"
              type="text"
              placeholder="Enter company name"
              class="settings-input"
              required
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Business Type
            </label>
            <select v-model="form.business_type" class="settings-input">
              <option value="Retail">Retail</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Service">Service</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Company Email
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="company@example.com"
              class="settings-input"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="+880 1XXX-XXXXXX"
              class="settings-input"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"> Website </label>
            <input
              v-model="form.website"
              type="url"
              placeholder="https://example.com"
              class="settings-input"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tax / VAT Number
            </label>
            <input
              v-model="form.tax_number"
              type="text"
              placeholder="Enter VAT or tax number"
              class="settings-input"
            />
          </div>

          <div class="space-y-1.5 md:col-span-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Company Address
            </label>
            <textarea
              v-model="form.address"
              rows="3"
              placeholder="Enter complete business address"
              class="settings-input resize-y"
            ></textarea>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"> City </label>
            <input v-model="form.city" type="text" placeholder="Dhaka" class="settings-input" />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"> Country </label>
            <select v-model="form.country" class="settings-input">
              <option value="Bangladesh">Bangladesh</option>
              <option value="India">India</option>
              <option value="Pakistan">Pakistan</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Regional Preferences -->
      <section
        class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="border-b border-gray-200 p-5 dark:border-gray-800">
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600"
            >
              <UIcon name="i-lucide-globe" class="size-5" />
            </div>
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Regional Preferences</h2>
              <p class="text-sm text-gray-500">Configure currency, timezone and date formats.</p>
            </div>
          </div>
        </div>

        <div class="grid gap-5 p-5 md:grid-cols-2">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"> Currency </label>
            <select v-model="form.currency" class="settings-input">
              <option value="BDT">BDT — Bangladeshi Taka (৳)</option>
              <option value="USD">USD — US Dollar ($)</option>
              <option value="INR">INR — Indian Rupee (₹)</option>
              <option value="EUR">EUR — Euro (€)</option>
              <option value="GBP">GBP — British Pound (£)</option>
              <option value="SAR">SAR — Saudi Riyal</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"> Timezone </label>
            <select v-model="form.timezone" class="settings-input">
              <option value="Asia/Dhaka">Asia/Dhaka (UTC+06:00)</option>
              <option value="Asia/Kolkata">Asia/Kolkata (UTC+05:30)</option>
              <option value="Asia/Karachi">Asia/Karachi (UTC+05:00)</option>
              <option value="UTC">UTC</option>
              <option value="Europe/London">Europe/London</option>
              <option value="America/New_York">America/New_York</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Date Format
            </label>
            <select v-model="form.date_format" class="settings-input">
              <option value="DD-MM-YYYY">DD-MM-YYYY (11-10-2026)</option>
              <option value="MM-DD-YYYY">MM-DD-YYYY (10-11-2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2026-10-11)</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Time Format
            </label>
            <select v-model="form.time_format" class="settings-input">
              <option value="12">12-hour (02:30 PM)</option>
              <option value="24">24-hour (14:30)</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"> Language </label>
            <select v-model="form.language" class="settings-input">
              <option value="en">English</option>
              <option value="bn">বাংলা</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Default Payment Method
            </label>
            <select v-model="form.payment_method" class="settings-input">
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Mobile Banking">Mobile Banking</option>
            </select>
          </div>
        </div>
      </section>

      <!-- System Preferences -->
      <section
        class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="border-b border-gray-200 p-5 dark:border-gray-800">
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600"
            >
              <UIcon name="i-lucide-settings-2" class="size-5" />
            </div>
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">System Preferences</h2>
              <p class="text-sm text-gray-500">Set your default application behavior.</p>
            </div>
          </div>
        </div>

        <div class="divide-y divide-gray-100 dark:divide-gray-800">
          <label class="flex cursor-pointer items-center justify-between gap-4 p-5">
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">Enable Notifications</p>
              <p class="mt-1 text-sm text-gray-500">
                Allow the application to display system notifications.
              </p>
            </div>
            <input v-model="form.notifications" type="checkbox" class="size-5 accent-primary" />
          </label>

          <label class="flex cursor-pointer items-center justify-between gap-4 p-5">
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">Low Stock Alerts</p>
              <p class="mt-1 text-sm text-gray-500">
                Enable alerts when products reach their minimum stock level.
              </p>
            </div>
            <input v-model="form.low_stock_alerts" type="checkbox" class="size-5 accent-primary" />
          </label>

          <label class="flex cursor-pointer items-center justify-between gap-4 p-5">
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">Show Tax on Invoices</p>
              <p class="mt-1 text-sm text-gray-500">
                Display tax details on sales invoices by default.
              </p>
            </div>
            <input v-model="form.show_tax" type="checkbox" class="size-5 accent-primary" />
          </label>

          <label class="flex cursor-pointer items-center justify-between gap-4 p-5">
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">Auto Print Invoice</p>
              <p class="mt-1 text-sm text-gray-500">
                Automatically open the print dialog after completing a sale.
              </p>
            </div>
            <input v-model="form.auto_print" type="checkbox" class="size-5 accent-primary" />
          </label>
        </div>
      </section>

      <!-- Feedback -->
      <div
        v-if="message"
        class="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
      >
        <UIcon name="i-lucide-check-circle" class="size-5" />
        {{ message }}
      </div>

      <div class="flex justify-end gap-3 pb-4">
        <button
          type="button"
          @click="resetSettings"
          class="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200"
        >
          Reset
        </button>
        <button
          type="button"
          @click="saveSettings"
          class="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <UIcon name="i-lucide-save" class="mr-1 inline size-4" />
          Save Changes
        </button>
      </div>
    </main>
  </Default>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import Default from '@/layouts/Default.vue'

const storageKey = 'general-settings'
const message = ref('')

const defaults = {
  company_name: '',
  business_type: 'Retail',
  email: '',
  phone: '',
  website: '',
  tax_number: '',
  address: '',
  city: 'Dhaka',
  country: 'Bangladesh',
  currency: 'BDT',
  timezone: 'Asia/Dhaka',
  date_format: 'DD-MM-YYYY',
  time_format: '12',
  language: 'en',
  payment_method: 'Cash',
  notifications: true,
  low_stock_alerts: true,
  show_tax: true,
  auto_print: false,
}

const form = reactive({ ...defaults })

onMounted(() => {
  try {
    const saved = localStorage.getItem(storageKey)

    if (saved) {
      Object.assign(form, defaults, JSON.parse(saved))
    }
  } catch (error) {
    console.error('Could not load general settings:', error)
  }
})

function saveSettings() {
  if (!form.company_name.trim()) {
    message.value = 'Please enter your company name.'
    return
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify({ ...form }))
    message.value = 'General settings saved successfully.'
  } catch (error) {
    console.error('Could not save general settings:', error)
    message.value = 'Unable to save settings in this browser.'
  }
}

function resetSettings() {
  Object.assign(form, defaults)
  message.value = ''
}
</script>

<style scoped>
.settings-input {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: transparent;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  color: inherit;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.settings-input:focus {
  border-color: var(--color-primary, #6366f1);
  box-shadow: 0 0 0 2px rgb(99 102 241 / 10%);
}

.settings-input::placeholder {
  color: #9ca3af;
}

.dark .settings-input {
  border-color: #374151;
  color: #f9fafb;
  color-scheme: dark;
}
</style>
