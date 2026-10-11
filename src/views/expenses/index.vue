<script setup>
import { reactive, ref } from 'vue'
import Default from '@/layouts/Default.vue'
import BaseInput from '@/components/BaseInput.vue'

const form = reactive({
  store_id: '',
  category_id: '',
  expense_no: '',
  amount: '',
  currency: 'BDT',
  expense_date: new Date().toISOString().slice(0, 16),
  payment_method: 'cash',
  description: '',
})

const stores = ref([
  { id: 'store-1', name: 'Main Store' },
  { id: 'store-2', name: 'Branch Store' },
])

const categories = ref([
  { id: 'cat-1', name: 'Office Rent' },
  { id: 'cat-2', name: 'Utilities' },
  { id: 'cat-3', name: 'Transportation' },
  { id: 'cat-4', name: 'Office Supplies' },
])

const expenses = ref([
  {
    id: 1,
    expense_no: 'EXP-2026-001',
    category: 'Office Rent',
    store: 'Main Store',
    amount: 15000,
    currency: 'BDT',
    expense_date: '2026-10-10',
    payment_method: 'bank_transfer',
  },
  {
    id: 2,
    expense_no: 'EXP-2026-002',
    category: 'Utilities',
    store: 'Main Store',
    amount: 3500,
    currency: 'BDT',
    expense_date: '2026-10-09',
    payment_method: 'cash',
  },
  {
    id: 3,
    expense_no: 'EXP-2026-003',
    category: 'Transportation',
    store: 'Branch Store',
    amount: 1200,
    currency: 'BDT',
    expense_date: '2026-10-08',
    payment_method: 'mobile_banking',
  },
])

const paymentMethods = [
  { label: 'Cash', value: 'cash' },
  { label: 'Bank Transfer', value: 'bank_transfer' },
  { label: 'Mobile Banking', value: 'mobile_banking' },
  { label: 'Card', value: 'card' },
  { label: 'Cheque', value: 'cheque' },
]

const currencies = [
  { label: 'BDT - Bangladeshi Taka', value: 'BDT' },
  { label: 'USD - US Dollar', value: 'USD' },
  { label: 'EUR - Euro', value: 'EUR' },
  { label: 'INR - Indian Rupee', value: 'INR' },
]

const generateExpenseNo = () => {
  const nextNumber = expenses.value.length + 1
  return `EXP-${new Date().getFullYear()}-${String(nextNumber).padStart(3, '0')}`
}

form.expense_no = generateExpenseNo()

const formatAmount = (amount, currency) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

const formatDate = (date) => {
  if (!date) return '-'

  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getPaymentLabel = (value) => {
  return paymentMethods.find((item) => item.value === value)?.label || value
}

const submit = () => {
  if (
    !form.store_id ||
    !form.category_id ||
    !form.expense_no.trim() ||
    !form.amount ||
    Number(form.amount) <= 0 ||
    !form.expense_date ||
    !form.payment_method
  ) {
    return
  }

  const selectedStore = stores.value.find((item) => item.id === form.store_id)

  const selectedCategory = categories.value.find((item) => item.id === form.category_id)

  expenses.value.unshift({
    id: Date.now(),
    expense_no: form.expense_no.trim(),
    category: selectedCategory?.name || '',
    store: selectedStore?.name || '',
    amount: Number(form.amount),
    currency: form.currency,
    expense_date: form.expense_date.slice(0, 10),
    payment_method: form.payment_method,
  })

  form.store_id = ''
  form.category_id = ''
  form.expense_no = ''
  form.amount = ''
  form.currency = 'BDT'
  form.expense_date = new Date().toISOString().slice(0, 16)
  form.payment_method = 'cash'
  form.description = ''
  form.expense_no = generateExpenseNo()
}

const resetForm = () => {
  form.store_id = ''
  form.category_id = ''
  form.expense_no = generateExpenseNo()
  form.amount = ''
  form.currency = 'BDT'
  form.expense_date = new Date().toISOString().slice(0, 16)
  form.payment_method = 'cash'
  form.description = ''
}

const removeExpense = (id) => {
  expenses.value = expenses.value.filter((item) => item.id !== id)
}
</script>

<template>
  <Default>
    <main class="space-y-4 p-4">
      <!-- Header -->
      <div class="flex items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-semibold text-slate-800">Expenses</h1>
          <p class="mt-1 text-sm text-slate-500">Track and manage your business expenses.</p>
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          @click="$router.back()"
        >
          <UIcon name="i-lucide-arrow-left" class="size-4" />
          Back
        </button>
      </div>

      <!-- Expense List / Create Form -->
      <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-5">
        <!-- Expense List -->
        <section class="overflow-hidden rounded-xl border border-slate-200 bg-white lg:col-span-3">
          <div class="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
            <div class="flex items-center gap-3">
              <div
                class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
              >
                <UIcon name="i-lucide-receipt" class="size-5" />
              </div>

              <div>
                <h2 class="text-sm font-semibold text-slate-800">Expense List</h2>
                <p class="mt-0.5 text-xs text-slate-500">All recorded expenses</p>
              </div>
            </div>

            <span
              class="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {{ expenses.length }} Records
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th class="whitespace-nowrap px-5 py-3 font-medium">Expense</th>
                  <th class="whitespace-nowrap px-4 py-3 font-medium">Amount</th>
                  <th class="whitespace-nowrap px-4 py-3 font-medium">Date</th>
                  <th class="px-4 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="expense in expenses"
                  :key="expense.id"
                  class="transition hover:bg-slate-50/70"
                >
                  <td class="px-5 py-4">
                    <div class="flex items-start gap-3">
                      <div
                        class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                      >
                        <UIcon name="i-lucide-wallet" class="size-4" />
                      </div>

                      <div class="min-w-0">
                        <p class="font-medium text-slate-800">
                          {{ expense.expense_no }}
                        </p>
                        <p class="mt-1 text-xs text-slate-500">
                          {{ expense.category }}
                        </p>
                        <p class="mt-1 text-xs text-slate-400">
                          {{ expense.store }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td class="whitespace-nowrap px-4 py-4">
                    <p class="font-semibold text-slate-800">
                      {{ formatAmount(expense.amount, expense.currency) }}
                    </p>
                    <p class="mt-1 text-xs text-slate-500">
                      {{ getPaymentLabel(expense.payment_method) }}
                    </p>
                  </td>

                  <td class="whitespace-nowrap px-4 py-4 text-xs text-slate-500">
                    {{ formatDate(expense.expense_date) }}
                  </td>

                  <td class="px-4 py-4">
                    <div class="flex justify-end">
                      <button
                        type="button"
                        title="Edit expense"
                        class="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-green-50 hover:text-green-600"
                      >
                        <UIcon name="i-lucide-eye" class="size-4" />
                      </button>
                      <button
                        type="button"
                        title="Delete expense"
                        class="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        @click="removeExpense(expense.id)"
                      >
                        <UIcon name="i-lucide-trash-2" class="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="expenses.length === 0">
                  <td colspan="4" class="px-5 py-12 text-center">
                    <UIcon name="i-lucide-receipt-text" class="mx-auto size-8 text-slate-300" />
                    <p class="mt-2 text-sm font-medium text-slate-600">No expenses found</p>
                    <p class="mt-1 text-xs text-slate-400">Add an expense using the form.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
            Showing {{ expenses.length }} expenses
          </div>
        </section>

        <!-- Create Expense Form -->
        <section class="overflow-hidden rounded-xl border border-slate-200 bg-white lg:col-span-2">
          <div class="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
            <div
              class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
            >
              <UIcon name="i-lucide-plus-circle" class="size-5" />
            </div>

            <div>
              <h2 class="text-sm font-semibold text-slate-800">Create Expense</h2>
              <p class="mt-0.5 text-xs text-slate-500">Enter expense details below.</p>
            </div>
          </div>

          <form class="space-y-4 p-5" @submit.prevent="submit">
            <!-- Store -->
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">
                Store <span class="text-red-500">*</span>
              </label>

              <select
                v-model="form.store_id"
                required
                class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="" disabled>Select store</option>
                <option v-for="store in stores" :key="store.id" :value="store.id">
                  {{ store.name }}
                </option>
              </select>
            </div>

            <!-- Expense Category -->
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">
                Expense Category <span class="text-red-500">*</span>
              </label>

              <select
                v-model="form.category_id"
                required
                class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="" disabled>Select category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- Expense Number -->
            <BaseInput
              v-model="form.expense_no"
              label="Expense Number"
              placeholder="EXP-2026-001"
              :required="true"
            />

            <!-- Amount / Currency -->
            <div class="grid grid-cols-2 gap-3">
              <BaseInput
                v-model="form.amount"
                label="Amount"
                input-type="number"
                placeholder="0.00"
                :required="true"
              />

              <div class="space-y-1.5">
                <label class="text-sm font-medium text-slate-700">
                  Currency <span class="text-red-500">*</span>
                </label>

                <select
                  v-model="form.currency"
                  required
                  class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option
                    v-for="currency in currencies"
                    :key="currency.value"
                    :value="currency.value"
                  >
                    {{ currency.value }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Expense Date -->
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">
                Expense Date <span class="text-red-500">*</span>
              </label>

              <input
                v-model="form.expense_date"
                type="datetime-local"
                required
                class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <!-- Payment Method -->
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">
                Payment Method <span class="text-red-500">*</span>
              </label>

              <select
                v-model="form.payment_method"
                required
                class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option v-for="method in paymentMethods" :key="method.value" :value="method.value">
                  {{ method.label }}
                </option>
              </select>
            </div>

            <!-- Description -->
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700"> Description </label>

              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Enter expense details..."
                class="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
              ></textarea>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                @click="resetForm"
              >
                Reset
              </button>

              <button
                type="submit"
                class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <UIcon name="i-lucide-save" class="size-4" />
                Create Expense
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  </Default>
</template>
