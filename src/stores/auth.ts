import { ref } from "vue";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const user = ref("");
  const updateUser = (email: string) => {
    user.value = email;
  };

  return { user, updateUser };
});
