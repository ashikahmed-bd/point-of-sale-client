<script setup>
import { reactive } from 'vue'
import Default from '@/layouts/Default.vue'
import BaseInput from '@/components/BaseInput.vue'
import { useCustomerStore } from '@/stores/customer'
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()
const customerStore = useCustomerStore()

const form = reactive({
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  postcode: '',
  opening_balance: 0,
  credit_limit: '',
  notes: '',
  is_active: true,
})

const submit = async () => {
  try {
    const response = await customerStore.store(form)
    console.log(response)
    toast.add({
      title: response.data?.message,
      color: 'success',
    })
    await router.push({
      name: 'customers',
    })
  } catch (error) {
    if (error.data) {
      toast.add({
        title: error.data?.message,
        color: 'error',
      })
    }
  }
}
</script>

<template>
  <Default>
    <main class="space-y-4">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-semibold text-title">Create Customer</h1>
          <p class="mt-1 text-sm text-body">Add a new customer to your business.</p>
        </div>

        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          @click="$router.back()"
        >
          <UIcon name="i-lucide-arrow-left" class="size-4" />
          Back
        </button>
      </div>

      <form class="space-y-4" @submit.prevent="submit">
        <!-- Basic Information -->
        <section class="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div class="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
            <div
              class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
            >
              <UIcon name="i-lucide-user-round" class="size-5" />
            </div>

            <div>
              <h2 class="text-sm font-semibold text-slate-800">Basic Information</h2>
              <p class="mt-0.5 text-xs text-slate-500">Customer name and contact details.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
            <BaseInput
              label="Customer Name"
              v-model="form.name"
              placeholder="Enter customer name"
              :required="true"
            />

            <BaseInput
              label="Phone Number"
              v-model="form.phone"
              placeholder="Enter phone number"
              :required="true"
            />

            <BaseInput
              label="Email Address"
              v-model="form.email"
              type="email"
              placeholder="example@company.com"
            />

            <BaseInput label="Address" v-model="form.address" placeholder="Enter full address" />

            <BaseInput label="City" v-model="form.city" placeholder="Enter city" />

            <BaseInput
              label="State / Division"
              v-model="form.state"
              placeholder="Enter state or division"
            />

            <BaseInput label="Postcode" v-model="form.postcode" placeholder="Enter postcode" />
          </div>
        </section>

        <!-- Account Information -->
        <section class="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div class="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
            <div
              class="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"
            >
              <UIcon name="i-lucide-wallet" class="size-5" />
            </div>

            <div>
              <h2 class="text-sm font-semibold text-slate-800">Account Information</h2>
              <p class="mt-0.5 text-xs text-slate-500">Customer balance and credit settings.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700"> Opening Balance </label>

              <BaseInput
                v-model="form.opening_balance"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
              />

              <p class="text-xs text-slate-400">Initial outstanding balance for this customer.</p>
            </div>

            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700"> Credit Limit </label>

              <BaseInput
                v-model="form.credit_limit"
                type="number"
                min="0"
                step="0.01"
                placeholder="No credit limit"
              />

              <p class="text-xs text-slate-400">Leave blank if there is no credit limit.</p>
            </div>
          </div>

          <div class="space-y-4 p-4">
            <!-- Notes -->
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700"> Notes </label>

              <textarea
                v-model="form.notes"
                rows="3"
                placeholder="Enter additional notes about this customer..."
                class="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
              ></textarea>
            </div>

            <!-- Customer Status -->
            <div
              class="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"
                >
                  <UIcon name="i-lucide-user-check" class="size-5" />
                </div>

                <div>
                  <p class="text-sm font-medium text-slate-800">Active Customer</p>
                  <p class="mt-0.5 text-xs text-slate-500">
                    Enable or disable this customer account.
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                :aria-checked="form.is_active"
                :class="form.is_active ? 'bg-primary' : 'bg-slate-300'"
                class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
                @click="form.is_active = !form.is_active"
              >
                <span
                  class="inline-block size-4 rounded-full bg-white shadow-sm transition-transform"
                  :class="form.is_active ? 'translate-x-6' : 'translate-x-1'"
                ></span>
              </button>
            </div>
          </div>
        </section>

        <!-- Actions -->
        <div class="flex justify-end gap-3">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            @click="$router.back()"
          >
            Cancel
          </button>

          <button
            type="submit"
            :disabled="customerStore.loading"
            class="inline-flex items-center justify-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UIcon
              :name="customerStore.loading ? 'i-lucide-loader-circle' : 'i-lucide-save'"
              class="size-4"
              :class="{ 'animate-spin': customerStore.loading }"
            />
            {{ customerStore.loading ? 'Creating...' : 'Create' }}
          </button>
        </div>
      </form>
    </main>
  </Default>
</template>
