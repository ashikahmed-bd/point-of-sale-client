<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import Default from '@/layouts/Default.vue'

const storageKey = 'system-settings'

const defaults = {
  appName: 'My POS',
  appUrl: 'http://localhost:8000',
  appEnvironment: 'local',
  appDebug: false,
  maintenanceMode: false,
  maintenanceMessage: 'We are currently performing scheduled maintenance. Please try again later.',
  sessionLifetime: 120,
  paginationLimit: 15,
  uploadLimit: 10,
  timezone: 'Asia/Dhaka',
  backupEnabled: true,
  backupFrequency: 'daily',
  backupRetention: 7,
  logLevel: 'error',
}

const settings = reactive({ ...defaults })
const activeTab = ref('general')
const saving = ref(false)
const showResetConfirm = ref(false)
const message = ref('')
const messageType = ref('success')

const tabs = [
  { label: 'General', value: 'general', icon: 'i-lucide-settings' },
  { label: 'Security', value: 'security', icon: 'i-lucide-shield-check' },
  { label: 'Performance', value: 'performance', icon: 'i-lucide-gauge' },
  { label: 'Backup & Logs', value: 'backup', icon: 'i-lucide-database' },
]

const environmentOptions = [
  { label: 'Local', value: 'local' },
  { label: 'Development', value: 'development' },
  { label: 'Staging', value: 'staging' },
  { label: 'Production', value: 'production' },
]

const frequencyOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
]

const logLevelOptions = [
  { label: 'Emergency', value: 'emergency' },
  { label: 'Alert', value: 'alert' },
  { label: 'Critical', value: 'critical' },
  { label: 'Error', value: 'error' },
  { label: 'Warning', value: 'warning' },
  { label: 'Notice', value: 'notice' },
  { label: 'Info', value: 'info' },
  { label: 'Debug', value: 'debug' },
]

const systemCards = computed(() => [
  {
    title: 'Application',
    value: settings.appName || 'Not configured',
    description: 'Application name',
    icon: 'i-lucide-monitor',
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40',
  },
  {
    title: 'Environment',
    value: settings.appEnvironment,
    description: 'Current environment',
    icon: 'i-lucide-server',
    color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40',
  },
  {
    title: 'Maintenance',
    value: settings.maintenanceMode ? 'Enabled' : 'Disabled',
    description: 'Application availability',
    icon: 'i-lucide-construction',
    color: settings.maintenanceMode
      ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40'
      : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40',
  },
  {
    title: 'Debug Mode',
    value: settings.appDebug ? 'Enabled' : 'Disabled',
    description: 'Error reporting mode',
    icon: 'i-lucide-bug',
    color: settings.appDebug
      ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40'
      : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40',
  },
])

onMounted(() => {
  try {
    const saved = localStorage.getItem(storageKey)

    if (saved) {
      Object.assign(settings, defaults, JSON.parse(saved))
    }
  } catch (error) {
    console.error('Unable to load system settings:', error)
  }
})

function notify(text, type = 'success') {
  message.value = text
  messageType.value = type

  setTimeout(() => {
    message.value = ''
  }, 3000)
}

function saveSettings() {
  saving.value = true

  try {
    localStorage.setItem(storageKey, JSON.stringify({ ...settings }))
    notify('System settings saved successfully.')
  } catch (error) {
    console.error('Unable to save system settings:', error)
    notify('Unable to save settings. Please try again.', 'error')
  } finally {
    saving.value = false
  }
}

function resetSettings() {
  Object.assign(settings, defaults)
  localStorage.removeItem(storageKey)
  showResetConfirm.value = false
  notify('System settings restored to defaults.')
}

function clearBrowserCache() {
  const confirmed = window.confirm(
    'Clear this application’s saved browser cache? Other saved settings and records will not be removed.',
  )

  if (!confirmed) return

  // This demo clears only the current page's cached system settings.
  localStorage.removeItem(storageKey)
  Object.assign(settings, defaults)
  notify('System settings cache cleared.')
}

function downloadSettings() {
  const blob = new Blob([JSON.stringify({ ...settings }, null, 2)], { type: 'application/json' })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'system-settings.json'
  link.click()

  URL.revokeObjectURL(url)
  notify('Settings file exported.')
}
</script>

<template>
  <Default>
    <main class="space-y-6 p-4 sm:p-6">
      <!-- Page Header -->
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage application configuration, security, performance and backups.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            @click="downloadSettings"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <UIcon name="i-lucide-download" class="h-4 w-4" />
            Export
          </button>

          <button
            type="button"
            @click="saveSettings"
            :disabled="saving"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UIcon :name="saving ? 'i-lucide-loader-circle' : 'i-lucide-save'" class="h-4 w-4" />
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>

      <!-- Notification -->
      <div
        v-if="message"
        class="flex items-center gap-3 rounded-xl border p-4"
        :class="
          messageType === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
            : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300'
        "
      >
        <UIcon
          :name="messageType === 'success' ? 'i-lucide-check-circle' : 'i-lucide-alert-circle'"
          class="h-5 w-5 shrink-0"
        />
        <p class="text-sm font-medium">{{ message }}</p>
      </div>

      <!-- System Overview -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="card in systemCards"
          :key="card.title"
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ card.title }}
              </p>
              <p class="mt-2 text-xl font-bold capitalize text-gray-900 dark:text-white">
                {{ card.value }}
              </p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ card.description }}
              </p>
            </div>

            <div class="flex h-11 w-11 items-center justify-center rounded-xl" :class="card.color">
              <UIcon :name="card.icon" class="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <!-- Maintenance Warning -->
      <div
        v-if="settings.maintenanceMode"
        class="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30"
      >
        <UIcon name="i-lucide-alert-triangle" class="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <p class="font-semibold text-amber-800 dark:text-amber-300">
            Maintenance mode is enabled
          </p>
          <p class="mt-1 text-sm text-amber-700 dark:text-amber-400">
            This is currently a saved UI setting. It will not block visitors until connected to your
            Laravel backend.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 items-start gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
        <!-- Sidebar Tabs -->
        <aside
          class="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
        >
          <p class="px-3 pb-3 pt-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Configuration
          </p>

          <nav class="space-y-1">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              type="button"
              @click="activeTab = tab.value"
              class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition"
              :class="
                activeTab === tab.value
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              "
            >
              <UIcon :name="tab.icon" class="h-5 w-5" />
              {{ tab.label }}
              <UIcon
                v-if="activeTab === tab.value"
                name="i-lucide-chevron-right"
                class="ml-auto h-4 w-4"
              />
            </button>
          </nav>

          <div class="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/70">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-info" class="h-4 w-4 text-gray-500" />
              <span class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                Configuration tip
              </span>
            </div>
            <p class="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
              Save your changes before leaving this page.
            </p>
          </div>
        </aside>

        <!-- Settings Content -->
        <section class="min-w-0 space-y-6">
          <!-- General -->
          <div
            v-if="activeTab === 'general'"
            class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
          >
            <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800 sm:px-6">
              <h2 class="font-semibold text-gray-900 dark:text-white">General Configuration</h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Basic application identity and environment information.
              </p>
            </div>

            <div class="space-y-5 p-5 sm:p-6">
              <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Application Name
                  </label>
                  <input
                    v-model="settings.appName"
                    type="text"
                    placeholder="My POS"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Application URL
                  </label>
                  <input
                    v-model="settings.appUrl"
                    type="url"
                    placeholder="https://example.com"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Environment
                  </label>
                  <select
                    v-model="settings.appEnvironment"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option
                      v-for="option in environmentOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Timezone
                  </label>
                  <select
                    v-model="settings.timezone"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="Asia/Dhaka">Asia/Dhaka (Bangladesh)</option>
                    <option value="Asia/Kolkata">Asia/Kolkata (India)</option>
                    <option value="Asia/Dubai">Asia/Dubai (UAE)</option>
                    <option value="UTC">UTC</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="America/New_York">America/New_York</option>
                  </select>
                </div>
              </div>

              <div class="border-t border-gray-200 pt-5 dark:border-gray-800">
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      Maintenance Mode
                    </p>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Display a maintenance notice when implemented in the backend.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    :aria-checked="settings.maintenanceMode"
                    @click="settings.maintenanceMode = !settings.maintenanceMode"
                    class="relative h-6 w-11 shrink-0 rounded-full transition"
                    :class="
                      settings.maintenanceMode ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
                    "
                  >
                    <span
                      class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
                      :class="settings.maintenanceMode ? 'left-[22px]' : 'left-0.5'"
                    />
                  </button>
                </div>

                <div v-if="settings.maintenanceMode" class="mt-4">
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Maintenance Message
                  </label>
                  <textarea
                    v-model="settings.maintenanceMessage"
                    rows="3"
                    placeholder="Enter maintenance message..."
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Security -->
          <div
            v-else-if="activeTab === 'security'"
            class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
          >
            <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800 sm:px-6">
              <h2 class="font-semibold text-gray-900 dark:text-white">Security Settings</h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Configure session duration and debug-related preferences.
              </p>
            </div>

            <div class="space-y-6 p-5 sm:p-6">
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Session Lifetime (minutes)
                </label>
                <input
                  v-model.number="settings.sessionLifetime"
                  type="number"
                  min="5"
                  max="1440"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white md:max-w-sm"
                />
                <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Recommended: 120 minutes. The Laravel session configuration must be updated
                  separately.
                </p>
              </div>

              <div class="border-t border-gray-200 pt-5 dark:border-gray-800">
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">Debug Mode</p>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Enables a saved preference for verbose error reporting.
                    </p>
                    <p
                      v-if="settings.appDebug && settings.appEnvironment === 'production'"
                      class="mt-2 text-xs font-medium text-red-600 dark:text-red-400"
                    >
                      Warning: Debug mode should remain disabled in production.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    :aria-checked="settings.appDebug"
                    @click="settings.appDebug = !settings.appDebug"
                    class="relative h-6 w-11 shrink-0 rounded-full transition"
                    :class="settings.appDebug ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'"
                  >
                    <span
                      class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
                      :class="settings.appDebug ? 'left-[22px]' : 'left-0.5'"
                    />
                  </button>
                </div>
              </div>

              <div class="border-t border-gray-200 pt-5 dark:border-gray-800">
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Log Level
                </label>
                <select
                  v-model="settings.logLevel"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white md:max-w-sm"
                >
                  <option
                    v-for="option in logLevelOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  This preference does not change Laravel's active logging configuration.
                </p>
              </div>
            </div>
          </div>

          <!-- Performance -->
          <div
            v-else-if="activeTab === 'performance'"
            class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
          >
            <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800 sm:px-6">
              <h2 class="font-semibold text-gray-900 dark:text-white">Performance Settings</h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Configure pagination and upload preferences.
              </p>
            </div>

            <div class="space-y-6 p-5 sm:p-6">
              <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pagination Limit
                  </label>
                  <select
                    v-model.number="settings.paginationLimit"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option :value="10">10 records</option>
                    <option :value="15">15 records</option>
                    <option :value="25">25 records</option>
                    <option :value="50">50 records</option>
                    <option :value="100">100 records</option>
                  </select>
                  <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    Default number of rows per page.
                  </p>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Maximum Upload Size (MB)
                  </label>
                  <select
                    v-model.number="settings.uploadLimit"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option :value="2">2 MB</option>
                    <option :value="5">5 MB</option>
                    <option :value="10">10 MB</option>
                    <option :value="20">20 MB</option>
                    <option :value="50">50 MB</option>
                    <option :value="100">100 MB</option>
                  </select>
                  <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    Actual uploads are also limited by PHP and Laravel validation.
                  </p>
                </div>
              </div>

              <div
                class="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30"
              >
                <div class="flex items-start gap-3">
                  <UIcon
                    name="i-lucide-lightbulb"
                    class="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400"
                  />
                  <div>
                    <p class="text-sm font-semibold text-blue-800 dark:text-blue-300">
                      Performance note
                    </p>
                    <p class="mt-1 text-sm leading-6 text-blue-700 dark:text-blue-400">
                      These values are saved in browser storage. To apply them globally, expose a
                      Laravel API and connect the relevant pagination, upload validation and cache
                      configuration.
                    </p>
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-200 pt-5 dark:border-gray-800">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                  Cache Management
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Clear this page's saved settings and restore its default values.
                </p>
                <button
                  type="button"
                  @click="clearBrowserCache"
                  class="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <UIcon name="i-lucide-trash-2" class="h-4 w-4" />
                  Clear Settings Cache
                </button>
              </div>
            </div>
          </div>

          <!-- Backup & Logs -->
          <div
            v-else-if="activeTab === 'backup'"
            class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
          >
            <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800 sm:px-6">
              <h2 class="font-semibold text-gray-900 dark:text-white">Backup & Logs</h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Configure backup preferences and retain your settings export.
              </p>
            </div>

            <div class="space-y-6 p-5 sm:p-6">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Scheduled Backup</p>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Save your preferred backup schedule.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  :aria-checked="settings.backupEnabled"
                  @click="settings.backupEnabled = !settings.backupEnabled"
                  class="relative h-6 w-11 shrink-0 rounded-full transition"
                  :class="settings.backupEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'"
                >
                  <span
                    class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
                    :class="settings.backupEnabled ? 'left-[22px]' : 'left-0.5'"
                  />
                </button>
              </div>

              <div
                v-if="settings.backupEnabled"
                class="grid grid-cols-1 gap-5 border-t border-gray-200 pt-5 dark:border-gray-800 md:grid-cols-2"
              >
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Backup Frequency
                  </label>
                  <select
                    v-model="settings.backupFrequency"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option
                      v-for="option in frequencyOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Retention Period (days)
                  </label>
                  <input
                    v-model.number="settings.backupRetention"
                    type="number"
                    min="1"
                    max="365"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div
                class="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30"
              >
                <div class="flex items-start gap-3">
                  <UIcon
                    name="i-lucide-shield-alert"
                    class="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
                  />
                  <div>
                    <p class="text-sm font-semibold text-amber-800 dark:text-amber-300">
                      Backup execution is not connected
                    </p>
                    <p class="mt-1 text-sm leading-6 text-amber-700 dark:text-amber-400">
                      This section stores backup preferences only. Real database backups require a
                      protected Laravel backend endpoint, scheduler and secure storage.
                    </p>
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-200 pt-5 dark:border-gray-800">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                  Export Configuration
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Download a JSON copy of the current settings for reference.
                </p>
                <button
                  type="button"
                  @click="downloadSettings"
                  class="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <UIcon name="i-lucide-file-json" class="h-4 w-4" />
                  Download Configuration
                </button>
              </div>
            </div>
          </div>

          <!-- Reset Settings -->
          <div
            class="flex flex-col justify-between gap-4 rounded-xl border border-red-200 bg-white p-5 dark:border-red-900/70 dark:bg-gray-900 sm:flex-row sm:items-center"
          >
            <div class="flex items-start gap-3">
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
              >
                <UIcon name="i-lucide-rotate-ccw" class="h-5 w-5" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">Reset System Settings</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Restore the default values for this settings page.
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="showResetConfirm = true"
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              <UIcon name="i-lucide-rotate-ccw" class="h-4 w-4" />
              Reset Defaults
            </button>
          </div>
        </section>
      </div>

      <!-- Reset Confirmation -->
      <div
        v-if="showResetConfirm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="showResetConfirm = false"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
          >
            <UIcon name="i-lucide-alert-triangle" class="h-6 w-6" />
          </div>

          <h2 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">
            Reset system settings?
          </h2>
          <p class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            All settings on this page will return to their default values. This action cannot be
            undone.
          </p>

          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              @click="showResetConfirm = false"
              class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="resetSettings"
              class="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Yes, Reset
            </button>
          </div>
        </div>
      </div>
    </main>
  </Default>
</template>
