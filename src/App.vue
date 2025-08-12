<template>

  <h1>Pomodoro</h1>
  <TaskView :goal_object="taskStore.goals"/>
</template>
<script setup>



import {ref} from 'vue'
import TaskView from './components/taskView.vue'
import { useTaskStore } from '@/stores/taskStore';
const taskStore = useTaskStore()

const selected_goal = ref("")
/*
{
  title:"Add canvas with moving square",
  complete: false,
  sub_goals:[
    {
      title:'add canvas',
      complete:false,
      sub_goals:[
        {
          title:"resize canvas and change background",
          complete:false
        }
      ]
    }
  ]
}
*/


const startTask = (task)=>{
  const regex = /(\d{1,3})/
  const time_prompt = prompt("How many minutes before a break ? Default is 25min")
  const match = time_prompt.match(regex)
  const ringtone = new Audio('/src/assets/alarm.mp3')

  if(match){
    const task_time = parseInt(match[1]);
    if(task_time > 0 && task_time < 60){
      setTimeout(()=>{
        console.log("time elapsed")
        ringtone.play()
      },task_time*60000)
    }
  }else{
    setTimeout(()=>{
      console.log("time elapsed")
      ringtone.play()
    },25*60000)
  }
}





</script>
<style scoped></style>
