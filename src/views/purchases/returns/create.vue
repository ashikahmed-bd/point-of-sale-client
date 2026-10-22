<script setup>
import Default from '@/layouts/Default.vue'
import { reactive, computed } from 'vue'

const form = reactive({
  return_no: 'PRET-' + new Date().toISOString().slice(0, 10).replaceAll('-', ''),
  purchase_id: '',
  supplier_id: '',
  return_date: new Date().toISOString().slice(0, 10),
  reference: '',
  note: '',
  discount: 0,
  other_charge: 0,
  items: [
    {
      product_id: '',
      product_name: '',
      sku: '',
      purchased_quantity: 0,
      quantity: 1,
      unit_cost: 0,
    },
  ],
})

const addItem = () => {
  form.items.push({
    product_id: '',
    product_name: '',
    sku: '',
    purchased_quantity: 0,
    quantity: 1,
    unit_cost: 0,
  })
}

const removeItem = (index) => {
  form.items.splice(index, 1)
}

const submit = async () => {}
</script>

<template>
  <Default>
    <main class="space-y-4">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Create Purchase Return</h1>
          <p class="mt-1 text-sm text-gray-500">Record products returned to a supplier.</p>
        </div>

        <div class="flex gap-2">
          <RouterLink
            to="/purchases/returns"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </RouterLink>

          <button
            type="submit"
            form="purchase-return-form"
            class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Save Return
          </button>
        </div>
      </div>

      <form @submit.prevent="submit" class="space-y-4">
        <section class="rounded-xl border border-gray-200 bg-white">
          <div class="border-b border-gray-200 px-5 py-4">
            <h2 class="font-semibold text-gray-900">Return Information</h2>
            <p class="mt-1 text-sm text-gray-500">Enter the purchase and supplier details.</p>
          </div>

          <div class="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
            <BaseInput
              label="Return Number"
              v-model="form.return_no"
              placeholder="Return number"
              required
            />

            <div class="space-y-1.5">
              <label class="text-sm font-medium text-gray-700">
                Purchase
                <span class="text-red-500">*</span>
              </label>

              <select
                v-model="form.purchase_id"
                required
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option value="" disabled>Select purchase</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-sm font-medium text-gray-700"> Supplier </label>

              <select
                v-model="form.supplier_id"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option value="">Select supplier</option>
              </select>
            </div>

            <BaseInput label="Return Date" v-model="form.return_date" type="date" required />

            <BaseInput
              label="Reference"
              v-model="form.reference"
              placeholder="Enter reference number"
            />
          </div>
        </section>

        <!-- Return Items -->
        <section class="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div
            class="flex flex-col justify-between gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center"
          >
            <div>
              <h2 class="font-semibold text-gray-900">Return Items</h2>
              <p class="mt-1 text-sm text-gray-500">Add products and specify return quantities.</p>
            </div>

            <button
              type="button"
              @click="addItem"
              class="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              + Add Item
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th class="px-4 py-3 font-medium">#</th>
                  <th class="px-4 py-3 font-medium">Product</th>
                  <th class="px-4 py-3 font-medium">Purchased Qty</th>
                  <th class="px-4 py-3 font-medium">Return Qty</th>
                  <th class="px-4 py-3 font-medium">Unit Cost</th>
                  <th class="px-4 py-3 text-right font-medium">Total</th>
                  <th class="px-4 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-100">
                <tr v-for="(item, index) in form.items" :key="index">
                  <td class="px-4 py-4 text-gray-500">
                    {{ index + 1 }}
                  </td>

                  <td class="px-4 py-4">
                    <input
                      v-model="item.product_name"
                      placeholder="Select product"
                      class="w-44 rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-primary-500"
                    />
                    <p class="mt-1 text-xs text-gray-400">SKU: {{ item.sku || '—' }}</p>
                  </td>

                  <td class="px-4 py-4">
                    <span class="text-gray-600">
                      {{ item.purchased_quantity }}
                    </span>
                  </td>

                  <td class="px-4 py-4">
                    <input
                      v-model.number="item.quantity"
                      type="number"
                      min="1"
                      :max="item.purchased_quantity || undefined"
                      class="w-24 rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-primary-500"
                    />
                  </td>

                  <td class="px-4 py-4">
                    <input
                      v-model.number="item.unit_cost"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-28 rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-primary-500"
                    />
                  </td>

                  <td class="px-4 py-4 text-right font-medium text-gray-900">1000</td>

                  <td class="px-4 py-4 text-right">
                    <button
                      type="button"
                      @click="removeItem(index)"
                      :disabled="form.items.length === 1"
                      class="rounded-md p-2 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                      title="Remove item"
                    >
                      <icon name="trash-2" size="sm" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="border-t border-gray-200 px-5 py-3 text-sm text-gray-500">
            Total items: {{ form.items.length }}
          </div>
        </section>

        <!-- Notes and Summary -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section class="rounded-xl border border-gray-200 bg-white p-5">
            <h2 class="mb-4 font-semibold text-gray-900">Return Notes</h2>

            <label class="mb-1.5 block text-sm font-medium text-gray-700"> Reason / Notes </label>

            <textarea
              v-model="form.note"
              rows="5"
              placeholder="Write the reason for returning these products..."
              class="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </section>

          <section class="rounded-xl border border-gray-200 bg-white p-5">
            <h2 class="mb-5 font-semibold text-gray-900">Return Summary</h2>

            <div class="space-y-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Subtotal</span>
                <span class="font-medium text-gray-900"> ৳500 </span>
              </div>

              <div class="flex items-center justify-between gap-4 text-sm">
                <label for="discount" class="text-gray-500"> Discount </label>
                <input
                  id="discount"
                  v-model.number="form.discount"
                  type="number"
                  min="0"
                  max="2500"
                  class="w-32 rounded-md border border-gray-300 px-3 py-2 text-right outline-none focus:border-primary-500"
                />
              </div>

              <div class="flex items-center justify-between gap-4 text-sm">
                <label for="other-charge" class="text-gray-500"> Other Charges </label>
                <input
                  id="other-charge"
                  v-model.number="form.other_charge"
                  type="number"
                  min="0"
                  class="w-32 rounded-md border border-gray-300 px-3 py-2 text-right outline-none focus:border-primary-500"
                />
              </div>

              <div class="border-t border-dashed border-gray-200 pt-4">
                <div class="flex items-center justify-between">
                  <span class="font-semibold text-gray-900"> Total Return </span>
                  <span class="text-xl font-bold text-primary-600"> ৳8000 </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="flex justify-end gap-3">
          <RouterLink
            to="/purchases/returns"
            class="rounded border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </RouterLink>

          <button
            type="submit"
            class="rounded bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            Save Purchase Return
          </button>
        </div>
      </form>
    </main>
  </Default>
</template>
