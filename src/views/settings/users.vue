<script setup>
import { computed, reactive, ref, watch } from 'vue'
import Default from '@/layouts/Default.vue'

const activeTab = ref('users')
const search = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const message = ref('')
const formError = ref('')

const showUserModal = ref(false)
const showRoleModal = ref(false)
const editingUserId = ref(null)
const editingRoleId = ref(null)

const availablePermissions = [
  'Dashboard',
  'Users',
  'Roles',
  'Products',
  'Categories',
  'Sales',
  'Purchases',
  'Customers',
  'Suppliers',
  'Inventory',
  'Expenses',
  'Reports',
  'Settings',
]

const defaultUsers = [
  {
    id: 1,
    name: 'Admin User',
    username: 'admin',
    email: 'admin@example.com',
    role: 'Super Admin',
    status: 'Active',
    lastLogin: '2026-10-11 10:30 AM',
  },
  {
    id: 2,
    name: 'Rahim Ahmed',
    username: 'rahim',
    email: 'rahim@example.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2026-10-11 09:15 AM',
  },
  {
    id: 3,
    name: 'Karim Hasan',
    username: 'karim',
    email: 'karim@example.com',
    role: 'Sales Staff',
    status: 'Active',
    lastLogin: '2026-10-10 05:20 PM',
  },
  {
    id: 4,
    name: 'Nusrat Jahan',
    username: 'nusrat',
    email: 'nusrat@example.com',
    role: 'Accountant',
    status: 'Inactive',
    lastLogin: '2026-10-08 02:10 PM',
  },
  {
    id: 5,
    name: 'Sabbir Hossain',
    username: 'sabbir',
    email: 'sabbir@example.com',
    role: 'Sales Staff',
    status: 'Active',
    lastLogin: '2026-10-11 11:00 AM',
  },
]

const defaultRoles = [
  {
    id: 1,
    name: 'Super Admin',
    description: 'Full access to all system modules and settings.',
    permissions: ['Dashboard', 'Users', 'Roles', 'Products', 'Sales', 'Reports', 'Settings'],
    userCount: 1,
    system: true,
  },
  {
    id: 2,
    name: 'Manager',
    description: 'Manage daily operations, staff, inventory, and reports.',
    permissions: ['Dashboard', 'Products', 'Sales', 'Purchases', 'Inventory', 'Reports'],
    userCount: 1,
    system: false,
  },
  {
    id: 3,
    name: 'Sales Staff',
    description: 'Process sales, manage customers, and access POS.',
    permissions: ['Dashboard', 'Sales', 'Customers', 'Products'],
    userCount: 2,
    system: false,
  },
  {
    id: 4,
    name: 'Accountant',
    description: 'Manage financial records, expenses, and accounting reports.',
    permissions: ['Dashboard', 'Sales', 'Purchases', 'Expenses', 'Reports'],
    userCount: 1,
    system: false,
  },
]

function loadFromStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const users = ref(loadFromStorage('users-data', defaultUsers))
const roles = ref(loadFromStorage('roles-data', defaultRoles))

const filteredUsers = computed(() => {
  const query = search.value.trim().toLowerCase()

  return users.value.filter((user) => {
    const matchesSearch =
      !query ||
      user.name.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)

    const matchesRole = !roleFilter.value || user.role === roleFilter.value
    const matchesStatus = !statusFilter.value || user.status === statusFilter.value

    return matchesSearch && matchesRole && matchesStatus
  })
})

watch(
  users,
  (value) => {
    try {
      localStorage.setItem('users-data', JSON.stringify(value))
    } catch {
      // Storage may be unavailable.
    }
  },
  { deep: true },
)

watch(
  roles,
  (value) => {
    try {
      localStorage.setItem('roles-data', JSON.stringify(value))
    } catch {
      // Storage may be unavailable.
    }
  },
  { deep: true },
)

const emptyUserForm = () => ({
  name: '',
  username: '',
  email: '',
  role: '',
  status: 'Active',
  password: '',
})

const emptyRoleForm = () => ({
  name: '',
  description: '',
  permissions: [],
})

const userForm = reactive(emptyUserForm())
const roleForm = reactive(emptyRoleForm())

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}

function openUserModal(user = null) {
  formError.value = ''
  editingUserId.value = user?.id ?? null
  Object.assign(userForm, emptyUserForm())

  if (user) {
    Object.assign(userForm, user, { password: '' })
  } else {
    userForm.role = roles.value[0]?.name ?? ''
  }

  showUserModal.value = true
}

function saveUser() {
  formError.value = ''

  const username = userForm.username.trim().toLowerCase()
  const email = userForm.email.trim().toLowerCase()

  const duplicate = users.value.some((user) => {
    if (user.id === editingUserId.value) return false

    return user.username.toLowerCase() === username || user.email.toLowerCase() === email
  })

  if (duplicate) {
    formError.value = 'Username or email already exists.'
    return
  }

  if (!userForm.role || !roles.value.some((role) => role.name === userForm.role)) {
    formError.value = 'Please select a valid role.'
    return
  }

  const userData = {
    name: userForm.name.trim(),
    username,
    email,
    role: userForm.role,
    status: userForm.status,
    lastLogin: editingUserId.value
      ? users.value.find((user) => user.id === editingUserId.value)?.lastLogin || 'Never'
      : 'Never',
  }

  if (editingUserId.value) {
    const index = users.value.findIndex((user) => user.id === editingUserId.value)

    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...userData }
    }

    message.value = 'User updated successfully.'
  } else {
    users.value.push({
      id: Date.now(),
      ...userData,
    })

    message.value = 'User created successfully.'
  }

  updateRoleCounts()
  showUserModal.value = false
}

function toggleUserStatus(user) {
  user.status = user.status === 'Active' ? 'Inactive' : 'Active'
  message.value = `${user.name} is now ${user.status.toLowerCase()}.`
}

function deleteUser(id) {
  const user = users.value.find((item) => item.id === id)

  if (!user) return

  if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) return

  users.value = users.value.filter((item) => item.id !== id)
  updateRoleCounts()
  message.value = 'User deleted successfully.'
}

function updateRoleCounts() {
  roles.value.forEach((role) => {
    role.userCount = users.value.filter((user) => user.role === role.name).length
  })
}

function openRoleModal(role = null) {
  formError.value = ''
  editingRoleId.value = role?.id ?? null
  Object.assign(roleForm, emptyRoleForm())

  if (role) {
    Object.assign(roleForm, {
      name: role.name,
      description: role.description,
      permissions: [...role.permissions],
    })
  }

  showRoleModal.value = true
}

function saveRole() {
  formError.value = ''

  const name = roleForm.name.trim()

  const duplicate = roles.value.some(
    (role) => role.id !== editingRoleId.value && role.name.toLowerCase() === name.toLowerCase(),
  )

  if (duplicate) {
    formError.value = 'A role with this name already exists.'
    return
  }

  const previousRole = roles.value.find((role) => role.id === editingRoleId.value)

  if (editingRoleId.value && previousRole?.system) {
    formError.value = 'System roles cannot be renamed.'
    return
  }

  if (editingRoleId.value) {
    const role = roles.value.find((item) => item.id === editingRoleId.value)

    if (role) {
      const oldName = role.name
      role.name = name
      role.description = roleForm.description.trim()
      role.permissions = [...roleForm.permissions]

      if (oldName !== name) {
        users.value.forEach((user) => {
          if (user.role === oldName) user.role = name
        })
      }
    }

    message.value = 'Role updated successfully.'
  } else {
    roles.value.push({
      id: Date.now(),
      name,
      description: roleForm.description.trim(),
      permissions: [...roleForm.permissions],
      userCount: 0,
      system: false,
    })

    message.value = 'Role created successfully.'
  }

  updateRoleCounts()
  showRoleModal.value = false
}

function deleteRole(id) {
  const role = roles.value.find((item) => item.id === id)

  if (!role || role.system) return

  if (users.value.some((user) => user.role === role.name)) {
    window.alert('This role is assigned to users. Reassign those users before deleting it.')
    return
  }

  if (!window.confirm(`Are you sure you want to delete the "${role.name}" role?`)) return

  roles.value = roles.value.filter((item) => item.id !== id)
  message.value = 'Role deleted successfully.'
}
</script>

<template>
  <Default>
    <main class="space-y-4 p-4">
      <!-- Page Header -->
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Users & Roles</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage system users, roles, and permissions.
          </p>
        </div>

        <button
          type="button"
          @click="openUserModal()"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          <UIcon name="i-lucide-user-plus" class="h-4 w-4" />
          Add User
        </button>
      </div>

      <!-- Statistics -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              <h3 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ users.length }}
              </h3>
            </div>
            <div
              class="rounded-lg bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            >
              <UIcon name="i-lucide-users" class="h-6 w-6" />
            </div>
          </div>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
              <h3 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ users.filter((user) => user.status === 'Active').length }}
              </h3>
            </div>
            <div
              class="rounded-lg bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            >
              <UIcon name="i-lucide-user-check" class="h-6 w-6" />
            </div>
          </div>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Inactive Users</p>
              <h3 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ users.filter((user) => user.status === 'Inactive').length }}
              </h3>
            </div>
            <div
              class="rounded-lg bg-orange-100 p-3 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
            >
              <UIcon name="i-lucide-user-x" class="h-6 w-6" />
            </div>
          </div>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Roles</p>
              <h3 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ roles.length }}
              </h3>
            </div>
            <div
              class="rounded-lg bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
            >
              <UIcon name="i-lucide-shield-check" class="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-6 border-b border-gray-200 dark:border-gray-800">
        <button
          type="button"
          @click="activeTab = 'users'"
          class="border-b-2 px-1 pb-3 text-sm font-medium transition"
          :class="
            activeTab === 'users'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          "
        >
          Users
        </button>

        <button
          type="button"
          @click="activeTab = 'roles'"
          class="border-b-2 px-1 pb-3 text-sm font-medium transition"
          :class="
            activeTab === 'roles'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          "
        >
          Roles & Permissions
        </button>
      </div>

      <!-- Users Tab -->
      <section
        v-if="activeTab === 'users'"
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <!-- Search and Filters -->
        <div
          class="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="relative w-full sm:max-w-sm">
            <UIcon
              name="i-lucide-search"
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            />
            <input
              v-model="search"
              type="text"
              placeholder="Search users..."
              class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div class="flex flex-wrap gap-3">
            <select
              v-model="roleFilter"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="">All Roles</option>
              <option v-for="role in roles" :key="role.id" :value="role.name">
                {{ role.name }}
              </option>
            </select>

            <select
              v-model="statusFilter"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <!-- Users Table -->
        <div class="overflow-x-auto">
          <table class="w-full min-w-[800px] text-left text-sm">
            <thead
              class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/70 dark:text-gray-400"
            >
              <tr>
                <th class="px-5 py-4 font-medium">User</th>
                <th class="px-5 py-4 font-medium">Username</th>
                <th class="px-5 py-4 font-medium">Role</th>
                <th class="px-5 py-4 font-medium">Status</th>
                <th class="px-5 py-4 font-medium">Last Login</th>
                <th class="px-5 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr
                v-for="user in filteredUsers"
                :key="user.id"
                class="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                    >
                      {{ getInitials(user.name) }}
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ user.name }}
                      </p>
                      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {{ user.email }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="px-5 py-4 text-gray-600 dark:text-gray-300">
                  {{ user.username }}
                </td>

                <td class="px-5 py-4">
                  <span
                    class="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  >
                    {{ user.role }}
                  </span>
                </td>

                <td class="px-5 py-4">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="
                      user.status === 'Active'
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    "
                  >
                    <span
                      class="h-1.5 w-1.5 rounded-full"
                      :class="user.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'"
                    ></span>
                    {{ user.status }}
                  </span>
                </td>

                <td class="px-5 py-4 text-gray-500 dark:text-gray-400">
                  {{ user.lastLogin || 'Never' }}
                </td>

                <td class="px-5 py-4">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      title="Edit User"
                      @click="openUserModal(user)"
                      class="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                    >
                      <UIcon name="i-lucide-pencil" class="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      :title="user.status === 'Active' ? 'Deactivate User' : 'Activate User'"
                      @click="toggleUserStatus(user)"
                      class="rounded-lg p-2 text-gray-500 transition hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-400"
                    >
                      <UIcon
                        :name="user.status === 'Active' ? 'i-lucide-user-x' : 'i-lucide-user-check'"
                        class="h-4 w-4"
                      />
                    </button>

                    <button
                      type="button"
                      title="Delete User"
                      @click="deleteUser(user.id)"
                      class="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    >
                      <UIcon name="i-lucide-trash-2" class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="filteredUsers.length === 0">
                <td colspan="6" class="px-5 py-12 text-center">
                  <UIcon
                    name="i-lucide-users"
                    class="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600"
                  />
                  <p class="mt-3 font-medium text-gray-700 dark:text-gray-300">No users found</p>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Try changing your search or filters.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="border-t border-gray-200 px-5 py-4 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400"
        >
          Showing {{ filteredUsers.length }} of {{ users.length }} users
        </div>
      </section>

      <!-- Roles Tab -->
      <section v-if="activeTab === 'roles'" class="space-y-4">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Roles & Permissions</h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage access levels for different user roles.
            </p>
          </div>

          <button
            type="button"
            @click="openRoleModal()"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            <UIcon name="i-lucide-plus" class="h-4 w-4" />
            Add Role
          </button>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div
            v-for="role in roles"
            :key="role.id"
            class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="rounded-lg bg-primary/10 p-3 text-primary">
                  <UIcon name="i-lucide-shield-check" class="h-5 w-5" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    {{ role.name }}
                  </h3>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {{ role.userCount }} assigned users
                  </p>
                </div>
              </div>

              <div class="flex gap-1">
                <button
                  type="button"
                  title="Edit Role"
                  @click="openRoleModal(role)"
                  class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
                >
                  <UIcon name="i-lucide-pencil" class="h-4 w-4" />
                </button>

                <button
                  v-if="!role.system"
                  type="button"
                  title="Delete Role"
                  @click="deleteRole(role.id)"
                  class="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                >
                  <UIcon name="i-lucide-trash-2" class="h-4 w-4" />
                </button>
              </div>
            </div>

            <p class="mt-4 min-h-10 text-sm leading-5 text-gray-500 dark:text-gray-400">
              {{ role.description }}
            </p>

            <div class="mt-4 border-t border-gray-200 pt-4 dark:border-gray-800">
              <p
                class="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Permissions
              </p>

              <div class="flex flex-wrap gap-2">
                <span
                  v-for="permission in role.permissions"
                  :key="permission"
                  class="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                  {{ permission }}
                </span>

                <span v-if="role.permissions.length === 0" class="text-xs text-gray-400">
                  No permissions assigned
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- User Modal -->
      <div
        v-if="showUserModal"
        class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
        @click.self="showUserModal = false"
      >
        <div class="my-auto w-full max-w-xl rounded-xl bg-white shadow-xl dark:bg-gray-900">
          <div
            class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800"
          >
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ editingUserId ? 'Edit User' : 'Add New User' }}
              </h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter user details and assign a role.
              </p>
            </div>

            <button
              type="button"
              @click="showUserModal = false"
              class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <UIcon name="i-lucide-x" class="h-5 w-5" />
            </button>
          </div>

          <form @submit.prevent="saveUser" class="space-y-4 p-5">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="userForm.name"
                required
                type="text"
                placeholder="Enter full name"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="userForm.username"
                  required
                  type="text"
                  placeholder="Enter username"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="userForm.email"
                  required
                  type="email"
                  placeholder="user@example.com"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="userForm.role"
                  required
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="" disabled>Select role</option>
                  <option v-for="role in roles" :key="role.id" :value="role.name">
                    {{ role.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  v-model="userForm.status"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password {{ editingUserId ? '(Leave blank to keep unchanged)' : '*' }}
              </label>
              <input
                v-model="userForm.password"
                :required="!editingUserId"
                type="password"
                :autocomplete="editingUserId ? 'new-password' : 'new-password'"
                placeholder="Enter password"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <p v-if="formError" class="text-sm text-red-500">
              {{ formError }}
            </p>

            <div class="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
              <button
                type="button"
                @click="showUserModal = false"
                class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                class="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
              >
                {{ editingUserId ? 'Update User' : 'Create User' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Role Modal -->
      <div
        v-if="showRoleModal"
        class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
        @click.self="showRoleModal = false"
      >
        <div class="my-auto w-full max-w-lg rounded-xl bg-white shadow-xl dark:bg-gray-900">
          <div
            class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800"
          >
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ editingRoleId ? 'Edit Role' : 'Create Role' }}
            </h2>

            <button
              type="button"
              @click="showRoleModal = false"
              class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <UIcon name="i-lucide-x" class="h-5 w-5" />
            </button>
          </div>

          <form @submit.prevent="saveRole" class="space-y-4 p-5">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="roleForm.name"
                required
                type="text"
                placeholder="e.g. Sales Manager"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                v-model="roleForm.description"
                rows="2"
                placeholder="Describe this role"
                class="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              ></textarea>
            </div>

            <div>
              <p class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Permissions</p>

              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label
                  v-for="permission in availablePermissions"
                  :key="permission"
                  class="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-3 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <input
                    v-model="roleForm.permissions"
                    type="checkbox"
                    :value="permission"
                    class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  {{ permission }}
                </label>
              </div>
            </div>

            <p v-if="formError" class="text-sm text-red-500">
              {{ formError }}
            </p>

            <div class="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
              <button
                type="button"
                @click="showRoleModal = false"
                class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                class="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
              >
                {{ editingRoleId ? 'Update Role' : 'Create Role' }}
              </button>
            </div>
          </form>
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
