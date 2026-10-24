import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // Auth
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

  // 01. Dashboard
  {
    path: '/',
    name: 'home',
    component: () => import('../views/dashboard/index.vue'),
  },

  // 02. POS
  {
    path: '/pos',
    name: 'pos',
    component: () => import('../views/pos/index.vue'),
  },

  // 03. Sales
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
  {
    path: '/sales/:id',
    name: 'sales.view',
    component: () => import('../views/sales/view.vue'),
  },

  /*
  |--------------------------------------------------------------------------
  | Purchases
  |--------------------------------------------------------------------------
  */
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
    path: '/purchases/:id',
    name: 'purchases.show',
    component: () => import('../views/purchases/show.vue'),
  },

  // Purchases returns
  {
    path: '/purchases/returns',
    name: 'purchase-returns',
    component: () => import('@/views/purchases/returns/index.vue'),
  },
  {
    path: '/purchases/returns/create',
    name: 'purchase-returns.create',
    component: () => import('@/views/purchases/returns/create.vue'),
  },
  {
    path: '/purchases/returns/:id',
    name: 'purchase-returns.show',
    component: () => import('@/views/purchases/returns/show.vue'),
  },
  {
    path: '/purchases/returns/:id/edit',
    name: 'purchase-returns.edit',
    component: () => import('@/views/purchases/returns/edit.vue'),
  },

  // 05. Products
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

  // 06. Inventory
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
    path: '/inventory/expired-products',
    name: 'inventory.expired-products',
    component: () => import('../views/inventory/expired-products.vue'),
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

  // 07. Customers
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

  {
    path: '/customers/:id/edit',
    name: 'customers.edit',
    component: () => import('../views/customers/edit.vue'),
  },

  {
    path: '/customers/:id',
    name: 'customers.show',
    component: () => import('../views/customers/show.vue'),
  },

  // 08. Suppliers
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

  // 09. Expenses
  {
    path: '/expenses',
    name: 'expenses',
    component: () => import('../views/expenses/index.vue'),
  },
  {
    path: '/expenses/categories',
    name: 'expenses.categories',
    component: () => import('../views/expenses/categories.vue'),
  },

  // 10. Accounting
  {
    path: '/accounting',
    name: 'accounting',
    component: () => import('../views/accounting/index.vue'),
  },
  {
    path: '/accounting/accounts',
    name: 'accounting.accounts',
    component: () => import('../views/accounting/accounts.vue'),
  },
  {
    path: '/accounting/transactions',
    name: 'accounting.transactions',
    component: () => import('../views/accounting/transactions.vue'),
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

  // 11. Reports
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

  // 12. Settings
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

  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Authentication Guard
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!auth.user) {
    await auth.getUser()
  }

  if (to.meta.guest) {
    if (auth.loggedIn) {
      return { name: 'home' }
    }

    return true
  }

  if (!auth.loggedIn) {
    return { name: 'login' }
  }

  return true
})

export default router
