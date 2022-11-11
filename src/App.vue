<template>
  <div class="container">
    <h1>Task Tracker</h1>
    <form v-on:submit.prevent="addTask" class="group">
      <input type="text" placeholder="enter a task" v-model="newTaskContent" />
      <button :disabled="!newTaskContent">Enter</button>
    </form>

    <div class="card">
      <div
        v-for="task in tasks"
        v-bind:key="task.id"
        class="item"
        :class="{ done: task.done }"
      >
        {{ task.content }} <button @click="toggleDone(task.id)">&check;</button>
        <button @click="deleteTask(task.id)">&cross;</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Task } from "./types/index";
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

const tasks = ref<Task[]>([]);
const tasksCollectionRef = collection(db, "tasks");
const tasksCollectionQuery = query(tasksCollectionRef, orderBy("date", "desc"));

onMounted(async () => {
  onSnapshot(tasksCollectionQuery, (querySnapshot) => {
    let tasksFirebase: Task[] = [];
    querySnapshot.forEach((doc) => {
      const task = {
        id: doc.id,
        content: doc.data().content,
        done: doc.data().done,
      };
      tasksFirebase.push(task);
    });
    tasks.value = tasksFirebase;
  });
});

const newTaskContent = ref("");

const addTask = async () => {
  try {
    await addDoc(tasksCollectionRef, {
      content: newTaskContent.value,
      done: false,
      date: Date.now(),
    });
    newTaskContent.value = "";
  } catch (error) {
    console.log(error);
  }
};

const deleteTask = async (id: string) => {
  try {
    await deleteDoc(doc(tasksCollectionRef, id));
  } catch (error) {
    console.log(error);
  }
};

const toggleDone = async (id: string) => {
  const task = tasks.value.find((task) => task.id === id);

  try {
    await updateDoc(doc(tasksCollectionRef, id), {
      done: !task?.done,
    });
  } catch (error) {
    console.log(error);
  }
};
</script>

<style>
.container {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
}

.group {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  padding: 2rem;
  border: 1px solid #000;
}

.item {
  margin-top: 1rem;
}

.done {
  background-color: green;
}
</style>
