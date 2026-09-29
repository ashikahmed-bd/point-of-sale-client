<script setup>
import Header from '@/components/Header.vue'
import { ref } from 'vue'

const sidebar = ref(false)

const navigation = [
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/',
    active: true,
  },

  {
    label: 'POS (New Sale)',
    icon: 'i-lucide-shopping-cart',
    to: '/pos',
  },

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
        label: 'Product Variants',
        to: '/products/variants',
      },
    ],
  },

  {
    label: 'Categories',
    icon: 'i-lucide-tags',
    to: '/categories',
  },

  {
    label: 'Brands',
    icon: 'i-lucide-award',
    to: '/brands',
  },

  {
    label: 'Inventory',
    icon: 'i-lucide-warehouse',
    children: [
      {
        label: 'Stock Overview',
        to: '/inventory',
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
        label: 'Low Stock',
        to: '/inventory/low-stock',
      },
    ],
  },

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

  {
    label: 'Sales',
    icon: 'i-lucide-receipt',
    children: [
      {
        label: 'All Sales',
        to: '/sales',
      },
      {
        label: 'New Sale',
        to: '/pos',
      },
      {
        label: 'Sales Returns',
        to: '/sales/returns',
      },
    ],
  },

  {
    label: 'Returns',
    icon: 'i-lucide-rotate-ccw',
    children: [
      {
        label: 'Sales Returns',
        to: '/returns/sales',
      },
      {
        label: 'Purchase Returns',
        to: '/returns/purchases',
      },
    ],
  },

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
        label: 'Expense Categories',
        to: '/expenses/categories',
      },
    ],
  },

  {
    label: 'Accounting',
    icon: 'i-lucide-calculator',
    children: [
      {
        label: 'Overview',
        to: '/accounting',
      },
      {
        label: 'Income',
        to: '/accounting/income',
      },
      {
        label: 'Transactions',
        to: '/accounting/transactions',
      },
      {
        label: 'Cash Flow',
        to: '/accounting/cash-flow',
      },
    ],
  },

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
        label: 'Profit & Loss',
        to: '/reports/profit-loss',
      },
      {
        label: 'Expense Report',
        to: '/reports/expenses',
      },
    ],
  },

  {
    label: 'Settings',
    icon: 'i-lucide-settings',
    dropdown: false,
    children: [
      {
        label: 'General Settings',
        to: '/settings',
      },
      {
        label: 'Users & Roles',
        to: '/settings/users',
      },
      {
        label: 'Store Settings',
        to: '/settings/store',
      },
    ],
  },
]
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
    class="fixed inset-y-0 left-0 top-16 z-40 flex w-60 flex-col bg-white transition-transform duration-300 lg:translate-x-0"
    :class="sidebar ? 'translate-x-0' : '-translate-x-full'"
  >
    <nav class="scrollbar flex-1 space-y-1 overflow-y-auto px-3 py-3">
      <div v-for="item in navigation" :key="item.label">
        <details v-if="item.children?.length" class="group">
          <summary
            class="flex cursor-pointer list-none items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-body transition hover:bg-slate-100 hover:text-slate-900"
          >
            <UIcon :name="item.icon" class="size-4 shrink-0" />

            <span class="min-w-0 flex-1 truncate">
              {{ item.label }}
            </span>

            <span
              v-if="item.count"
              class="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-primary"
            >
              {{ item.count }}
            </span>

            <UIcon
              name="i-lucide-chevron-right"
              class="size-4 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-90"
            />
          </summary>

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
          <UIcon :name="item.icon" class="size-4 shrink-0" />

          <span class="min-w-0 flex-1 truncate">
            {{ item.label }}
          </span>
        </RouterLink>
      </div>
    </nav>
  </aside>

  <main class="min-h-screen bg-surface transition-all duration-300 lg:pl-60">
    <slot />
  </main>
</template>

<style scoped></style>
