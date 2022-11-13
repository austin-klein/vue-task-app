<template>
  <button @click="signInWithGoogle">Sign In With Google</button>
</template>

<script setup lang="ts">
import router from "@/router";
import { auth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuthStore } from "@/stores/auth";

const { updateUser } = useAuthStore();

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const res = await signInWithPopup(auth, provider);
    updateUser(res.user.email as string);
    router.push("/");
  } catch (error) {
    console.log(error);
  }
};
</script>
