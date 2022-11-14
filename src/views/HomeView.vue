<template>
  <div class="container">
    <div>
      <p @click="logoutUser" class="logout">logout</p>
      <h1 class="title">Tasks for {{ user }}</h1>
    </div>
    <form v-on:submit.prevent="addTask" class="group">
      <input type="text" placeholder="enter a task" v-model="newTaskContent" />
      <button :disabled="!newTaskContent" class="btn">Add</button>
    </form>
    <div v-auto-animate>
      <div v-for="task in tasks" v-bind:key="task.id" class="item">
        <TaskItemVue
          :task="task"
          :toggleDone="toggleDone"
          :deleteTask="deleteTask"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Task } from "../types/index";
import TaskItemVue from "@/components/TaskItem.vue";
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/firebase";
import { useAuthStore } from "@/stores/auth";
import { signOut } from "@firebase/auth";
import router from "@/router";

const { user, updateUser } = useAuthStore();
const tasks = ref<Task[]>([]);
const tasksCollectionRef = collection(db, "tasks");
const tasksCollectionQuery = query(
  tasksCollectionRef,
  where("user", "==", user),
  orderBy("date", "desc")
);

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
      user,
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
const logoutUser = async () => {
  try {
    await signOut(auth);
    updateUser("");
    router.push("/register");
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

.title {
  font-size: 1.4rem;
}

.logout {
  text-decoration: underline;
  cursor: pointer;
  width: fit-content;
}

.btn {
  background-color: rgb(46, 150, 225);
  border: 1px solid rgb(46, 150, 225);
  color: #fff;
  font-weight: bold;
  padding: 1rem;

  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background-color: rgb(28, 95, 144);
  transition: all 0.4s;
}

.group {
  display: flex;
  justify-content: center;
  align-items: center;
}

.group input {
  padding: 1rem;
  border: 1px solid rgba(128, 128, 128, 0.336);
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  width: 100%;
}

.item {
  margin-top: 1rem;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  padding: 1rem;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.done {
  text-decoration: line-through;
  color: gray;
}

.buttons {
  display: flex;
}

.buttons div {
  border: none;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  margin: 0 4px;
  border-radius: 5px;
}

.buttons div:hover {
  transform: scale(1.1);
  transition: transform 0.2s;
}

.buttons div:first-of-type {
  background-color: rgba(0, 128, 0, 0.1);
  color: green;
}
.buttons div:last-of-type {
  background-color: rgba(255, 0, 0, 0.1);
  color: red;
}
</style>
