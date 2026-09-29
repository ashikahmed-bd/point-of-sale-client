<script setup>
import { storeToRefs } from "pinia";
import { useToastStore } from "@/stores/toast";

const toastStore = useToastStore();

const { visible, type, message } = storeToRefs(toastStore);

const close = () => {
  toastStore.hide();
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="visible"
        class="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm sm:right-6 sm:top-6"
      >
        <div
          class="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-xl"
          :class="{
            'border-emerald-200': type === 'success',
            'border-red-200': type === 'error',
            'border-amber-200': type === 'warning',
            'border-blue-200': type === 'info',
          }"
        >
          <!-- Icon -->
          <div
            class="flex size-9 shrink-0 items-center justify-center rounded-full"
            :class="{
              'bg-emerald-100 text-emerald-600': type === 'success',
              'bg-red-100 text-red-600': type === 'error',
              'bg-amber-100 text-amber-600': type === 'warning',
              'bg-blue-100 text-blue-600': type === 'info',
            }"
          >
            <UIcon
              v-if="type === 'success'"
              name="i-lucide-circle-check"
              class="size-5"
            />

            <UIcon
              v-else-if="type === 'error'"
              name="i-lucide-circle-x"
              class="size-5"
            />

            <UIcon
              v-else-if="type === 'warning'"
              name="i-lucide-triangle-alert"
              class="size-5"
            />

            <UIcon v-else name="i-lucide-circle-info" class="size-5" />
          </div>

          <p
            class="flex-1 text-sm font-medium leading-5"
            :class="{
              'text-emerald-700': type === 'success',
              'text-red-700': type === 'error',
              'text-amber-700': type === 'warning',
              'text-blue-700': type === 'info',
            }"
          >
            {{ message }}
          </p>

          <button
            type="button"
            class="flex size-7 shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            @click="close"
          >
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
