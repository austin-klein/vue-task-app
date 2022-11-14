<template>
  <button @click="signInWithGoogle" class="btn">Sign In With Google</button>
</template>

<style>
.btn {
  background-color: rgb(46, 150, 225);
  border: 1px solid rgb(46, 150, 225);
  color: #fff;
  font-weight: bold;
  padding: 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: rgb(28, 95, 144);
  transition: all 0.4s;
}
</style>

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
