import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/login.vue'),
      meta: { guest: true },
    },

    {
      path: '/forgot',
      name: 'forgot',
      component: () => import('../views/auth/forgot.vue'),
      meta: { guest: true },
    },

    // Dashboard
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/dashboard/index.vue'),
    },

    // POS
    {
      path: '/pos',
      name: 'pos',
      component: () => import('../views/pos/index.vue'),
    },

    // Sales
    {
      path: '/sales',
      name: 'sales',
      component: () => import('../views/sales/index.vue'),
    },
    {
      path: '/sales/returns',
      name: 'sales.returns',
      component: () => import('../views/sales/returns.vue'),
    },

    // Purchases
    {
      path: '/purchases',
      name: 'purchases',
      component: () => import('../views/purchases/index.vue'),
    },
    {
      path: '/purchases/create',
      name: 'purchases.create',
      component: () => import('../views/purchases/create.vue'),
    },
    {
      path: '/purchases/returns',
      name: 'purchases.returns',
      component: () => import('../views/purchases/returns.vue'),
    },

    // Products
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/products/index.vue'),
    },
    {
      path: '/products/create',
      name: 'products.create',
      component: () => import('../views/products/create.vue'),
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/categories/index.vue'),
    },
    {
      path: '/brands',
      name: 'brands',
      component: () => import('../views/brands/index.vue'),
    },

    // Inventory
    {
      path: '/inventory',
      name: 'inventory',
      component: () => import('../views/inventory/index.vue'),
    },
    {
      path: '/inventory/low-stock',
      name: 'inventory.low-stock',
      component: () => import('../views/inventory/low-stock.vue'),
    },
    {
      path: '/inventory/adjustments',
      name: 'inventory.adjustments',
      component: () => import('../views/inventory/adjustments.vue'),
    },
    {
      path: '/inventory/transfers',
      name: 'inventory.transfers',
      component: () => import('../views/inventory/transfers.vue'),
    },
    {
      path: '/inventory/warehouses',
      name: 'inventory.warehouses',
      component: () => import('../views/inventory/warehouses.vue'),
    },
    {
      path: '/inventory/units',
      name: 'inventory.units',
      component: () => import('../views/inventory/units.vue'),
    },
    {
      path: '/inventory/barcodes',
      name: 'inventory.barcodes',
      component: () => import('../views/inventory/barcodes.vue'),
    },

    // Customers
    {
      path: '/customers',
      name: 'customers',
      component: () => import('../views/customers/index.vue'),
    },
    {
      path: '/customers/create',
      name: 'customers.create',
      component: () => import('../views/customers/create.vue'),
    },

    // Suppliers
    {
      path: '/suppliers',
      name: 'suppliers',
      component: () => import('../views/suppliers/index.vue'),
    },
    {
      path: '/suppliers/create',
      name: 'suppliers.create',
      component: () => import('../views/suppliers/create.vue'),
    },

    // Expenses
    {
      path: '/expenses',
      name: 'expenses',
      component: () => import('../views/expenses/index.vue'),
    },
    {
      path: '/expenses/create',
      name: 'expenses.create',
      component: () => import('../views/expenses/create.vue'),
    },
    {
      path: '/expenses/categories',
      name: 'expenses.categories',
      component: () => import('../views/expenses/categories.vue'),
    },

    // Accounting
    {
      path: '/accounting',
      name: 'accounting',
      component: () => import('../views/accounting/index.vue'),
    },
    {
      path: '/accounting/transactions',
      name: 'accounting.transactions',
      component: () => import('../views/accounting/transactions.vue'),
    },
    {
      path: '/accounting/accounts',
      name: 'accounting.accounts',
      component: () => import('../views/accounting/accounts.vue'),
    },
    {
      path: '/accounting/cash-flow',
      name: 'accounting.cash-flow',
      component: () => import('../views/accounting/cash-flow.vue'),
    },
    {
      path: '/accounting/profit-loss',
      name: 'accounting.profit-loss',
      component: () => import('../views/accounting/profit-loss.vue'),
    },
    {
      path: '/accounting/balance-sheet',
      name: 'accounting.balance-sheet',
      component: () => import('../views/accounting/balance-sheet.vue'),
    },

    // Reports
    {
      path: '/reports/sales',
      name: 'reports.sales',
      component: () => import('../views/reports/sales.vue'),
    },
    {
      path: '/reports/purchases',
      name: 'reports.purchases',
      component: () => import('../views/reports/purchases.vue'),
    },
    {
      path: '/reports/inventory',
      name: 'reports.inventory',
      component: () => import('../views/reports/inventory.vue'),
    },
    {
      path: '/reports/customers',
      name: 'reports.customers',
      component: () => import('../views/reports/customers.vue'),
    },
    {
      path: '/reports/suppliers',
      name: 'reports.suppliers',
      component: () => import('../views/reports/suppliers.vue'),
    },
    {
      path: '/reports/expenses',
      name: 'reports.expenses',
      component: () => import('../views/reports/expenses.vue'),
    },

    // Settings
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/settings/index.vue'),
    },
    {
      path: '/settings/store',
      name: 'settings.store',
      component: () => import('../views/settings/store.vue'),
    },
    {
      path: '/settings/users',
      name: 'settings.users',
      component: () => import('../views/settings/users.vue'),
    },
    {
      path: '/settings/appearance',
      name: 'settings.appearance',
      component: () => import('../views/settings/appearance.vue'),
    },
    {
      path: '/settings/system',
      name: 'settings.system',
      component: () => import('../views/settings/system.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!auth.user) {
    await auth.getUser()
  }

  if (to.meta.auth && !auth.loggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guest && auth.loggedIn) {
    return '/'
  }
})

export default router
