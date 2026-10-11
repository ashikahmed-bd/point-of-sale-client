<script setup>
import { computed, reactive, ref, watch } from 'vue'
import Default from '@/layouts/Default.vue'

const storageKey = 'appearance-settings'
const message = ref('')

const themes = [
  {
    value: 'light',
    label: 'Light',
    description: 'Bright and clean',
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Easy on the eyes',
  },
  {
    value: 'system',
    label: 'System',
    description: 'Follow device settings',
  },
]

const accentColors = [
  { value: 'blue', label: 'Blue', hex: '#2563eb' },
  { value: 'indigo', label: 'Indigo', hex: '#4f46e5' },
  { value: 'violet', label: 'Violet', hex: '#7c3aed' },
  { value: 'purple', label: 'Purple', hex: '#9333ea' },
  { value: 'pink', label: 'Pink', hex: '#db2777' },
  { value: 'red', label: 'Red', hex: '#dc2626' },
  { value: 'orange', label: 'Orange', hex: '#ea580c' },
  { value: 'green', label: 'Green', hex: '#16a34a' },
  { value: 'teal', label: 'Teal', hex: '#0d9488' },
]

const defaults = {
  theme: 'light',
  accentColor: 'blue',
  sidebarPosition: 'left',
  contentWidth: 'full',
  density: 'comfortable',
  collapsedSidebar: false,
  stickyHeader: true,
  roundedCorners: true,
  fontSize: 14,
  showBreadcrumbs: true,
  animations: true,
  reduceMotion: false,
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

const selectedAccentLabel = computed(
  () => accentColors.find((color) => color.value === settings.accentColor)?.label || 'Blue',
)

const selectedAccentHex = computed(
  () => accentColors.find((color) => color.value === settings.accentColor)?.hex || '#2563eb',
)

function applyTheme(theme) {
  if (typeof document === 'undefined') return

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)

  document.documentElement.classList.toggle('dark', isDark)
}

function applyAccentColor(colorName) {
  if (typeof document === 'undefined') return

  const color = accentColors.find((item) => item.value === colorName)
  if (!color) return

  document.documentElement.style.setProperty('--color-primary', color.hex)
}

function applyAppearance() {
  applyTheme(settings.theme)
  applyAccentColor(settings.accentColor)
}

watch(
  () => [settings.theme, settings.accentColor],
  () => applyAppearance(),
  { immediate: true },
)

function saveSettings() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(settings))
    applyAppearance()
    message.value = 'Appearance settings saved successfully.'
  } catch {
    message.value = 'Unable to save settings in this browser.'
  }
}

function resetSettings() {
  Object.assign(settings, defaults)

  try {
    localStorage.removeItem(storageKey)
  } catch {
    // Browser storage may be unavailable.
  }

  applyAppearance()
  message.value = 'Appearance settings have been reset.'
}
</script>

<template>
  <Default>
    <main class="space-y-4 p-4">
      <!-- Page Header -->
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Appearance Settings</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Customize your dashboard theme, colors, and display preferences.
          </p>
        </div>

        <button
          type="button"
          @click="resetSettings"
          class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Reset
        </button>
      </div>

      <!-- Theme Settings -->
      <section
        class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="border-b border-gray-200 p-5 dark:border-gray-800">
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-primary/10 p-2.5 text-primary">
              <UIcon name="i-lucide-palette" class="h-5 w-5" />
            </div>
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Theme Settings</h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Choose how your application looks.
              </p>
            </div>
          </div>
        </div>

        <div class="space-y-5 p-5">
          <div>
            <h3 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">Color Theme</h3>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <button
                v-for="theme in themes"
                :key="theme.value"
                type="button"
                @click="settings.theme = theme.value"
                class="rounded-xl border-2 p-3 text-left transition"
                :class="
                  settings.theme === theme.value
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                "
              >
                <div
                  class="mb-3 flex h-24 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                  :class="theme.value === 'dark' ? 'bg-gray-900' : 'bg-gray-50'"
                >
                  <div
                    class="w-1/4"
                    :class="theme.value === 'dark' ? 'bg-gray-800' : 'bg-white'"
                  ></div>
                  <div class="flex-1 space-y-2 p-3">
                    <div
                      class="h-2 w-3/4 rounded"
                      :class="theme.value === 'dark' ? 'bg-gray-600' : 'bg-gray-300'"
                    ></div>
                    <div
                      class="h-2 w-1/2 rounded"
                      :class="theme.value === 'dark' ? 'bg-gray-700' : 'bg-gray-200'"
                    ></div>
                    <div class="h-5 w-1/2 rounded bg-primary"></div>
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ theme.label }}
                    </p>
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {{ theme.description }}
                    </p>
                  </div>

                  <UIcon
                    v-if="settings.theme === theme.value"
                    name="i-lucide-circle-check"
                    class="h-5 w-5 text-primary"
                  />
                </div>
              </button>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-5 dark:border-gray-800">
            <h3 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">Accent Color</h3>
            <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Select your preferred primary color.
            </p>

            <div class="flex flex-wrap gap-3">
              <button
                v-for="color in accentColors"
                :key="color.value"
                type="button"
                :title="color.label"
                :aria-label="color.label"
                @click="settings.accentColor = color.value"
                class="flex h-10 w-10 items-center justify-center rounded-full border-2 transition"
                :class="
                  settings.accentColor === color.value
                    ? 'border-gray-900 ring-2 ring-gray-300 ring-offset-2 dark:border-white dark:ring-gray-600 dark:ring-offset-gray-900'
                    : 'border-transparent hover:scale-110'
                "
                :style="{ backgroundColor: color.hex }"
              >
                <UIcon
                  v-if="settings.accentColor === color.value"
                  name="i-lucide-check"
                  class="h-5 w-5 text-white"
                />
              </button>
            </div>

            <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Selected: {{ selectedAccentLabel }}
            </p>
          </div>
        </div>
      </section>

      <!-- Layout Settings -->
      <section
        class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="border-b border-gray-200 p-5 dark:border-gray-800">
          <div class="flex items-center gap-3">
            <div
              class="rounded-lg bg-blue-100 p-2.5 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            >
              <UIcon name="i-lucide-layout-dashboard" class="h-5 w-5" />
            </div>
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Layout Settings</h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Configure the layout of your dashboard.
              </p>
            </div>
          </div>
        </div>

        <div class="space-y-5 p-5">
          <div>
            <label class="mb-3 block text-sm font-medium text-gray-900 dark:text-white">
              Sidebar Position
            </label>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                type="button"
                @click="settings.sidebarPosition = 'left'"
                class="flex items-center gap-4 rounded-xl border-2 p-4 text-left transition"
                :class="
                  settings.sidebarPosition === 'left'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                "
              >
                <div
                  class="flex h-14 w-20 overflow-hidden rounded border border-gray-200 dark:border-gray-700"
                >
                  <div class="w-5 bg-primary/70"></div>
                  <div class="flex-1 bg-gray-100 dark:bg-gray-800"></div>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Left Sidebar</p>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Navigation on the left
                  </p>
                </div>
                <UIcon
                  v-if="settings.sidebarPosition === 'left'"
                  name="i-lucide-circle-check"
                  class="h-5 w-5 text-primary"
                />
              </button>

              <button
                type="button"
                @click="settings.sidebarPosition = 'right'"
                class="flex items-center gap-4 rounded-xl border-2 p-4 text-left transition"
                :class="
                  settings.sidebarPosition === 'right'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                "
              >
                <div
                  class="flex h-14 w-20 overflow-hidden rounded border border-gray-200 dark:border-gray-700"
                >
                  <div class="flex-1 bg-gray-100 dark:bg-gray-800"></div>
                  <div class="w-5 bg-primary/70"></div>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Right Sidebar</p>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Navigation on the right
                  </p>
                </div>
                <UIcon
                  v-if="settings.sidebarPosition === 'right'"
                  name="i-lucide-circle-check"
                  class="h-5 w-5 text-primary"
                />
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                for="contentWidth"
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Content Width
              </label>
              <select
                id="contentWidth"
                v-model="settings.contentWidth"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="full">Full Width</option>
                <option value="wide">Wide</option>
                <option value="boxed">Boxed</option>
              </select>
            </div>

            <div>
              <label
                for="density"
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Interface Density
              </label>
              <select
                id="density"
                v-model="settings.density"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </select>
            </div>
          </div>

          <div
            class="divide-y divide-gray-200 border-t border-gray-200 dark:divide-gray-800 dark:border-gray-800"
          >
            <label class="flex cursor-pointer items-center justify-between gap-4 py-4">
              <span>
                <span class="block text-sm font-medium text-gray-900 dark:text-white">
                  Collapsed Sidebar
                </span>
                <span class="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                  Use icon-only navigation to save space.
                </span>
              </span>
              <input
                v-model="settings.collapsedSidebar"
                type="checkbox"
                class="h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </label>

            <label class="flex cursor-pointer items-center justify-between gap-4 py-4">
              <span>
                <span class="block text-sm font-medium text-gray-900 dark:text-white">
                  Sticky Header
                </span>
                <span class="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                  Keep the page header visible while scrolling.
                </span>
              </span>
              <input
                v-model="settings.stickyHeader"
                type="checkbox"
                class="h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </label>

            <label class="flex cursor-pointer items-center justify-between gap-4 py-4">
              <span>
                <span class="block text-sm font-medium text-gray-900 dark:text-white">
                  Rounded Corners
                </span>
                <span class="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                  Use rounded cards, buttons, and form fields.
                </span>
              </span>
              <input
                v-model="settings.roundedCorners"
                type="checkbox"
                class="h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </label>
          </div>
        </div>
      </section>

      <!-- Display Settings -->
      <section
        class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="border-b border-gray-200 p-5 dark:border-gray-800">
          <div class="flex items-center gap-3">
            <div
              class="rounded-lg bg-purple-100 p-2.5 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
            >
              <UIcon name="i-lucide-monitor" class="h-5 w-5" />
            </div>
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Display Preferences</h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Adjust text and interface visibility.
              </p>
            </div>
          </div>
        </div>

        <div class="space-y-5 p-5">
          <div>
            <div class="mb-3 flex items-center justify-between gap-3">
              <label for="fontSize" class="text-sm font-medium text-gray-900 dark:text-white">
                Font Size
              </label>
              <span
                class="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                {{ settings.fontSize }} px
              </span>
            </div>

            <input
              id="fontSize"
              v-model.number="settings.fontSize"
              type="range"
              min="12"
              max="18"
              step="1"
              class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-primary dark:bg-gray-700"
            />

            <div class="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Small</span>
              <span>Default</span>
              <span>Large</span>
            </div>
          </div>

          <div
            class="divide-y divide-gray-200 border-t border-gray-200 dark:divide-gray-800 dark:border-gray-800"
          >
            <label class="flex cursor-pointer items-center justify-between gap-4 py-4">
              <span>
                <span class="block text-sm font-medium text-gray-900 dark:text-white">
                  Show Breadcrumbs
                </span>
                <span class="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                  Display navigation paths at the top of pages.
                </span>
              </span>
              <input
                v-model="settings.showBreadcrumbs"
                type="checkbox"
                class="h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </label>

            <label class="flex cursor-pointer items-center justify-between gap-4 py-4">
              <span>
                <span class="block text-sm font-medium text-gray-900 dark:text-white">
                  Show Page Animations
                </span>
                <span class="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                  Enable subtle transitions between interface elements.
                </span>
              </span>
              <input
                v-model="settings.animations"
                type="checkbox"
                class="h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </label>

            <label class="flex cursor-pointer items-center justify-between gap-4 py-4">
              <span>
                <span class="block text-sm font-medium text-gray-900 dark:text-white">
                  Reduce Motion
                </span>
                <span class="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                  Prefer reduced motion effects throughout the interface.
                </span>
              </span>
              <input
                v-model="settings.reduceMotion"
                type="checkbox"
                class="h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </label>
          </div>
        </div>
      </section>

      <!-- Live Preview -->
      <section
        class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="border-b border-gray-200 p-5 dark:border-gray-800">
          <h2 class="font-semibold text-gray-900 dark:text-white">Preview</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Preview your selected accent color.
          </p>
        </div>

        <div class="space-y-4 p-5">
          <div
            class="flex flex-col gap-4 rounded-xl border border-gray-200 p-5 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">Dashboard Overview</p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                This is how your interface elements will look.
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="rounded-lg px-4 py-2 text-sm font-medium text-white"
                :style="{ backgroundColor: selectedAccentHex }"
              >
                Primary Button
              </button>
              <span
                class="rounded-lg px-3 py-2 text-sm font-medium"
                :style="{
                  color: selectedAccentHex,
                  backgroundColor: selectedAccentHex + '15',
                }"
              >
                Accent Label
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
              <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">৳ 45,800</p>
              <p class="mt-1 text-xs font-medium" :style="{ color: selectedAccentHex }">
                +12.5% this month
              </p>
            </div>

            <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
              <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">256</p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">This month</p>
            </div>

            <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <p class="text-sm text-gray-500 dark:text-gray-400">Products</p>
              <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">1,240</p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">In inventory</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Save Actions -->
      <div class="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-gray-500 dark:text-gray-400">Changes are saved in this browser.</p>

        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="resetSettings"
            class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Reset
          </button>

          <button
            type="button"
            @click="saveSettings"
            class="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      </div>

      <!-- Feedback -->
      <div
        v-if="message"
        class="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-lg border border-green-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-lg dark:border-green-900 dark:bg-gray-900 dark:text-white"
        role="status"
      >
        <UIcon name="i-lucide-check-circle" class="h-5 w-5 shrink-0 text-green-500" />
        {{ message }}
        <button
          type="button"
          @click="message = ''"
          class="ml-2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
        >
          <UIcon name="i-lucide-x" class="h-4 w-4" />
        </button>
      </div>
    </main>
  </Default>
</template>
