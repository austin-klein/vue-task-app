<template>
  <p :class="{ done: task.done }">{{ task.content }}</p>
  <div class="buttons">
    <div @click="toggleDone(task.id)">&check;</div>
    <div @click="deleteTask(task.id)">&cross;</div>
  </div>
</template>
<script setup lang="ts">
import type { Task } from "../types/index";
export interface Props {
  task: Task;
  toggleDone: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}
defineProps<Props>();
</script>
