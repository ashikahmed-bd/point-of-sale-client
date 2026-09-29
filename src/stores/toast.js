import { defineStore } from "pinia";

export const useToastStore = defineStore("toast", {
  state: () => ({
    visible: false,
    type: "success",
    message: "",
    duration: 3000,
  }),

  actions: {
    show(type, message, duration = 3000) {
      this.type = type;
      this.message = message;
      this.duration = duration;
      this.visible = true;

      setTimeout(() => {
        this.hide();
      }, duration);
    },

    success(message, duration = 3000) {
      this.show("success", message, duration);
    },

    error(message, duration = 3000) {
      this.show("error", message, duration);
    },

    warning(message, duration = 3000) {
      this.show("warning", message, duration);
    },

    info(message, duration = 3000) {
      this.show("info", message, duration);
    },

    hide() {
      this.visible = false;
    },
  },
});
