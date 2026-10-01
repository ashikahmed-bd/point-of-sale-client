<script setup>
import Header from '@/components/Header.vue'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
const authStore = useAuthStore()

const sidebar = ref(false)

const navigation = [
  // 01. Dashboard
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/',
  },

  // 02. POS
  {
    label: 'POS',
    icon: 'i-lucide-shopping-cart',
    to: '/pos',
  },

  // 03. Sales
  {
    label: 'Sales',
    icon: 'i-lucide-receipt',
    children: [
      {
        label: 'All Sales',
        to: '/sales',
      },
      {
        label: 'Sales Returns',
        to: '/sales/returns',
      },
    ],
  },

  // 04. Purchases
  {
    label: 'Purchases',
    icon: 'i-lucide-shopping-bag',
    children: [
      {
        label: 'All Purchases',
        to: '/purchases',
      },
      {
        label: 'New Purchase',
        to: '/purchases/create',
      },
      {
        label: 'Purchase Returns',
        to: '/purchases/returns',
      },
    ],
  },

  // 05. Products
  {
    label: 'Products',
    icon: 'i-lucide-package',
    children: [
      {
        label: 'All Products',
        to: '/products',
      },
      {
        label: 'Add Product',
        to: '/products/create',
      },
      {
        label: 'Categories',
        to: '/categories',
      },
      {
        label: 'Brands',
        to: '/brands',
      },
    ],
  },

  // 06. Inventory
  {
    label: 'Inventory',
    icon: 'i-lucide-warehouse',
    children: [
      {
        label: 'Stock Overview',
        to: '/inventory',
      },
      {
        label: 'Low Stock',
        to: '/inventory/low-stock',
      },
      {
        label: 'Stock Adjustment',
        to: '/inventory/adjustments',
      },
      {
        label: 'Stock Transfer',
        to: '/inventory/transfers',
      },
      {
        label: 'Warehouses',
        to: '/inventory/warehouses',
      },
      {
        label: 'Units',
        to: '/inventory/units',
      },
      {
        label: 'Barcodes',
        to: '/inventory/barcodes',
      },
    ],
  },

  // 07. Customers
  {
    label: 'Customers',
    icon: 'i-lucide-users',
    children: [
      {
        label: 'All Customers',
        to: '/customers',
      },
      {
        label: 'Add Customer',
        to: '/customers/create',
      },
    ],
  },

  // 08. Suppliers
  {
    label: 'Suppliers',
    icon: 'i-lucide-truck',
    children: [
      {
        label: 'All Suppliers',
        to: '/suppliers',
      },
      {
        label: 'Add Supplier',
        to: '/suppliers/create',
      },
    ],
  },

  // 09. Expenses
  {
    label: 'Expenses',
    icon: 'i-lucide-wallet',
    children: [
      {
        label: 'All Expenses',
        to: '/expenses',
      },
      {
        label: 'Add Expense',
        to: '/expenses/create',
      },
      {
        label: 'Categories',
        to: '/expenses/categories',
      },
    ],
  },

  // 10. Accounting
  {
    label: 'Accounting',
    icon: 'i-lucide-calculator',
    children: [
      {
        label: 'Overview',
        to: '/accounting',
      },
      {
        label: 'Transactions',
        to: '/accounting/transactions',
      },
      {
        label: 'Accounts',
        to: '/accounting/accounts',
      },
      {
        label: 'Cash Flow',
        to: '/accounting/cash-flow',
      },
      {
        label: 'Profit & Loss',
        to: '/accounting/profit-loss',
      },
      {
        label: 'Balance Sheet',
        to: '/accounting/balance-sheet',
      },
    ],
  },

  // 11. Reports
  {
    label: 'Reports',
    icon: 'i-lucide-chart-no-axes-combined',
    children: [
      {
        label: 'Sales Report',
        to: '/reports/sales',
      },
      {
        label: 'Purchase Report',
        to: '/reports/purchases',
      },
      {
        label: 'Inventory Report',
        to: '/reports/inventory',
      },
      {
        label: 'Customer Report',
        to: '/reports/customers',
      },
      {
        label: 'Supplier Report',
        to: '/reports/suppliers',
      },
      {
        label: 'Expense Report',
        to: '/reports/expenses',
      },
    ],
  },

  // 12. Settings
  {
    label: 'Settings',
    icon: 'i-lucide-settings',
    children: [
      {
        label: 'General Settings',
        to: '/settings',
      },
      {
        label: 'Store Settings',
        to: '/settings/store',
      },
      {
        label: 'Users & Roles',
        to: '/settings/users',
      },
      {
        label: 'Appearance',
        to: '/settings/appearance',
      },
      {
        label: 'System',
        to: '/settings/system',
      },
    ],
  },
]

const logout = async () => {
  if (confirm('Are you sure you went to logout?')) {
    await authStore.logout()
  }
}
</script>

<template>
  <Header v-model:sidebar="sidebar" />

  <Transition name="fade">
    <div
      v-if="sidebar"
      class="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
      @click="sidebar = false"
    />
  </Transition>

  <aside
    class="fixed inset-y-0 left-0 top-16 z-40 flex w-60 flex-col overflow-hidden bg-white transition-transform duration-300 lg:translate-x-0"
    :class="sidebar ? 'translate-x-0' : '-translate-x-full'"
  >
    <nav class="scrollbar min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-3">
      <div v-for="item in navigation" :key="item.label">
        <details v-if="item.children?.length" class="group">
          <summary
            class="flex cursor-pointer list-none items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-body transition hover:bg-slate-100 hover:text-slate-900"
          >
            <!-- Icon -->
            <UIcon :name="item.icon" class="size-4 shrink-0" />

            <!-- Label -->
            <span class="min-w-0 flex-1 truncate">
              {{ item.label }}
            </span>

            <!-- Count -->
            <span
              v-if="item.count"
              class="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-primary"
            >
              {{ item.count }}
            </span>

            <!-- Chevron -->
            <UIcon
              name="i-lucide-chevron-right"
              class="size-4 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-90"
            />
          </summary>

          <!-- Children -->
          <div class="ml-5 mt-1 space-y-0.5 border-l border-slate-200 pl-2">
            <RouterLink
              v-for="child in item.children"
              :key="child.label"
              :to="child.to"
              class="group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-body transition hover:bg-slate-100 hover:text-primary"
              active-class="bg-primary/10 text-primary"
            >
              <span
                class="size-1.5 shrink-0 rounded-full bg-slate-300 transition group-hover:bg-primary"
              />

              <span class="min-w-0 truncate">
                {{ child.label }}
              </span>
            </RouterLink>
          </div>
        </details>

        <RouterLink
          v-else
          :to="item.to"
          class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-body transition hover:bg-slate-100 hover:text-slate-900"
          active-class="bg-primary/10 text-primary"
        >
          <!-- Icon -->
          <UIcon :name="item.icon" class="size-4 shrink-0" />

          <!-- Label -->
          <span class="min-w-0 flex-1 truncate">
            {{ item.label }}
          </span>
        </RouterLink>
      </div>
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-body transition hover:bg-slate-100 hover:text-slate-900"
        @click="logout"
      >
        <UIcon name="i-lucide-log-out" class="size-4 shrink-0" />

        <span class="text-left flex-1 truncate"> Logout </span>
      </button>
    </nav>
  </aside>

  <div class="lg:pl-60 mx-4 my-4">
    <slot />
  </div>
</template>

<style scoped></style>
