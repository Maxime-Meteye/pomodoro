<template>

  <h1>Pomodoro</h1>
  <TaskView :goal_object="taskStore.goals"/>
</template>
<script setup>



import TaskView from './components/taskView.vue'
import { useTaskStore } from '@/stores/taskStore';
const taskStore = useTaskStore()
</script>
<style scoped></style>
