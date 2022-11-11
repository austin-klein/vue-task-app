<template>
  <button @click="signInWithGoogle">Sign In With Google</button>
</template>

<script setup lang="ts">
import router from "@/router";
import { auth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    router.push("/");
  } catch (error) {
    console.log(error);
  }
};
</script>
