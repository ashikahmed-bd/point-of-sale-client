<script setup>
import { computed, ref } from 'vue'
import Default from '@/layouts/Default.vue'

const search = ref('')
const statusFilter = ref('All')
const showForm = ref(false)

const units = ref([
  {
    id: 1,
    name: 'Piece',
    shortName: 'pcs',
    description: 'Individual items',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Kilogram',
    shortName: 'kg',
    description: 'Weight measurement',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Gram',
    shortName: 'g',
    description: 'Small weight measurement',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Liter',
    shortName: 'L',
    description: 'Liquid measurement',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Meter',
    shortName: 'm',
    description: 'Length measurement',
    status: 'Active',
  },
  {
    id: 6,
    name: 'Box',
    shortName: 'box',
    description: 'Packaged items',
    status: 'Active',
  },
  {
    id: 7,
    name: 'Dozen',
    shortName: 'doz',
    description: '12 pieces per unit',
    status: 'Inactive',
  },
])

const form = ref({
  name: '',
  shortName: '',
  description: '',
})

const filteredUnits = computed(() => {
  const query = search.value.toLowerCase().trim()

  return units.value.filter((unit) => {
    const matchesSearch = [unit.name, unit.shortName, unit.description].some((value) =>
      value.toLowerCase().includes(query),
    )

    const matchesStatus = statusFilter.value === 'All' || unit.status === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

const activeCount = computed(() => units.value.filter((unit) => unit.status === 'Active').length)

const inactiveCount = computed(
  () => units.value.filter((unit) => unit.status === 'Inactive').length,
)

function createUnit() {
  const name = form.value.name.trim()
  const shortName = form.value.shortName.trim()

  if (!name || !shortName) {
    alert('Please enter the unit name and abbreviation.')
    return
  }

  const duplicate = units.value.some(
    (unit) =>
      unit.name.toLowerCase() === name.toLowerCase() ||
      unit.shortName.toLowerCase() === shortName.toLowerCase(),
  )

  if (duplicate) {
    alert('Unit name or abbreviation already exists.')
    return
  }

  units.value.unshift({
    id: Date.now(),
    name,
    shortName,
    description: form.value.description.trim() || '—',
    status: 'Active',
  })

  resetForm()
}

function resetForm() {
  form.value = {
    name: '',
    shortName: '',
    description: '',
  }
  showForm.value = false
}

function toggleStatus(unit) {
  unit.status = unit.status === 'Active' ? 'Inactive' : 'Active'
}
</script>

<template>
  <Default>
    <main class="space-y-4 p-4">
      <!-- Header -->
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Units</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage product measurement units and abbreviations.
          </p>
        </div>

        <button
          type="button"
          @click="showForm = !showForm"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <UIcon name="i-lucide-plus" class="size-4" />
          Add Unit
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Units</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ units.length }}
              </h2>
            </div>
            <div class="rounded-lg bg-blue-50 p-3 dark:bg-blue-500/10">
              <UIcon name="i-lucide-ruler" class="size-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500">All measurement units</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Active Units</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ activeCount }}
              </h2>
            </div>
            <div class="rounded-lg bg-green-50 p-3 dark:bg-green-500/10">
              <UIcon
                name="i-lucide-check-circle"
                class="size-6 text-green-600 dark:text-green-400"
              />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500">Available for products</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Inactive Units</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ inactiveCount }}
              </h2>
            </div>
            <div class="rounded-lg bg-orange-50 p-3 dark:bg-orange-500/10">
              <UIcon
                name="i-lucide-circle-pause"
                class="size-6 text-orange-600 dark:text-orange-400"
              />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500">Currently unavailable</p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Measurement Types</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ new Set(units.map((unit) => unit.description)).size }}
              </h2>
            </div>
            <div class="rounded-lg bg-purple-50 p-3 dark:bg-purple-500/10">
              <UIcon name="i-lucide-layers" class="size-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500">Based on descriptions</p>
        </div>
      </div>

      <!-- Add Unit Form -->
      <div
        v-if="showForm"
        class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="mb-5 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Add New Unit</h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter the unit name and its abbreviation.
            </p>
          </div>

          <button
            type="button"
            @click="resetForm"
            class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close form"
          >
            <UIcon name="i-lucide-x" class="size-5" />
          </button>
        </div>

        <form @submit.prevent="createUnit" class="space-y-5">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Unit Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="e.g. Kilogram"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Abbreviation <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.shortName"
                type="text"
                required
                placeholder="e.g. kg"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <input
                v-model="form.description"
                type="text"
                placeholder="e.g. Weight measurement"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div class="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
            <button
              type="button"
              @click="resetForm"
              class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              <UIcon name="i-lucide-plus" class="size-4" />
              Save Unit
            </button>
          </div>
        </form>
      </div>

      <!-- Units Table -->
      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col gap-4 border-b border-gray-200 p-4 dark:border-gray-800 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Unit List</h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ filteredUnits.length }} units found
            </p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <div class="relative">
              <UIcon
                name="i-lucide-search"
                class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
              />
              <input
                v-model="search"
                type="search"
                placeholder="Search units..."
                class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-64 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <select
              v-model="statusFilter"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[750px] text-left text-sm">
            <thead
              class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/60 dark:text-gray-400"
            >
              <tr>
                <th class="px-5 py-4 font-semibold">Unit</th>
                <th class="px-5 py-4 font-semibold">Abbreviation</th>
                <th class="px-5 py-4 font-semibold">Description</th>
                <th class="px-5 py-4 font-semibold">Status</th>
                <th class="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="unit in filteredUnits"
                :key="unit.id"
                class="transition hover:bg-gray-50/70 dark:hover:bg-gray-800/40"
              >
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"
                    >
                      <UIcon name="i-lucide-ruler" class="size-5 text-primary" />
                    </div>
                    <span class="font-semibold text-gray-900 dark:text-white">
                      {{ unit.name }}
                    </span>
                  </div>
                </td>

                <td class="px-5 py-4">
                  <span
                    class="rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {{ unit.shortName }}
                  </span>
                </td>

                <td class="px-5 py-4 text-gray-600 dark:text-gray-400">
                  {{ unit.description }}
                </td>

                <td class="px-5 py-4">
                  <span
                    :class="
                      unit.status === 'Active'
                        ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    "
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                  >
                    <span
                      :class="unit.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'"
                      class="size-1.5 rounded-full"
                    />
                    {{ unit.status }}
                  </span>
                </td>

                <td class="px-5 py-4">
                  <div class="flex justify-end">
                    <button
                      type="button"
                      @click="toggleStatus(unit)"
                      :title="unit.status === 'Active' ? 'Deactivate unit' : 'Activate unit'"
                      class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
                    >
                      <UIcon
                        :name="
                          unit.status === 'Active'
                            ? 'i-lucide-toggle-right'
                            : 'i-lucide-toggle-left'
                        "
                        class="size-4"
                      />
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="filteredUnits.length === 0">
                <td colspan="5" class="px-5 py-14 text-center">
                  <UIcon name="i-lucide-ruler" class="mx-auto size-10 text-gray-300" />
                  <p class="mt-3 font-medium text-gray-700 dark:text-gray-300">No units found</p>
                  <p class="mt-1 text-sm text-gray-500">Try changing your search or filter.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="flex flex-col gap-2 border-t border-gray-200 px-5 py-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
        >
          <p>Showing {{ filteredUnits.length }} of {{ units.length }} units</p>
          <p>Unit Management</p>
        </div>
      </div>
    </main>
  </Default>
</template>
