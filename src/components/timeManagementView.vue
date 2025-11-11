<template>
	<div>
		<button @click="startTimer()">PLAY</button>
		<button @click="pauseTimer()">PAUSE</button>
		<button @click="stopTimer()">STOP</button>
		{{ alarmStore.time_before_alarm }}
		{{ alarmStore.can_make_new_alarm }}
		{{ alarmStore.work_cycles_complete }}
	</div>
</template>
<script setup>
import { useAlarmStore } from '@/stores/alarmStore.js';
import {watch} from 'vue';

const alarmStore = useAlarmStore();

function startTimer(){
	alarmStore.startTimer();
}

function pauseTimer(){
	alarmStore.pauseTimer();
}
function stopTimer(){
	alarmStore.deleteAlarm();
}

watch(()=>alarmStore.end_of_work_cycle,(old_value, new_value)=>{
	if(new_value){
		console.log('end of work cycle')
	}
})

watch(()=>alarmStore.end_of_break_cycle,(old_value, new_value)=>{
	if(new_value){
		console.log('end of break cycle')
	}
})


/*
function startTask(){
  const regex = /(\d{1,3})/
  const time_prompt = prompt("How many minutes before a break ? Default is 25min")
  const match = time_prompt.match(regex)
  const ringtone = new Audio('/src/assets/audio/alarm.mp3')

  if(match){
    const task_time = parseInt(match[1]);
    if(task_time > 0 && task_time < 60){
      setTimeout(()=>{
        ringtone.play()
      },task_time*60000)
    }
  }else{
    setTimeout(()=>{
      ringtone.play()
    },25*60000)
  }
}
*/
</script>