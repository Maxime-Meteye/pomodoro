<template>

  <h1>Pomodoro</h1>
  <controlView></controlView>
  <taskView :goal_object="taskStore.goals"/>
</template>
<script setup>



import taskView from './components/taskView.vue'
import controlView from './components/controlView.vue'
import { useTaskStore } from '@/stores/taskStore';
const taskStore = useTaskStore()
</script>
<style scoped></style>
