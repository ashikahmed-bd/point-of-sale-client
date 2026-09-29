import { useToastStore } from "@/stores/toast";

export const toast = {
  success(message, duration = 3000) {
    const toastStore = useToastStore();
    toastStore.success(message, duration);
  },

  error(message, duration = 3000) {
    const toastStore = useToastStore();
    toastStore.error(message, duration);
  },

  warning(message, duration = 3000) {
    const toastStore = useToastStore();
    toastStore.warning(message, duration);
  },

  info(message, duration = 3000) {
    const toastStore = useToastStore();
    toastStore.info(message, duration);
  },
};
