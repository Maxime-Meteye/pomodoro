<template>
	<div class="timer_wrapper">
		<div class="timer_background glass round">
			<div class="timer">
				<p class="timer_left">{{ time_left }}</p>
				<div class="timer_control_panel button-bar">
					<button class="btn glass play_button" v-bind:playing="is_playing" @click="playButton()"></button>
					<button class="btn glass stop_button" @click="stopTimer()"></button>
					<!--
					{{ alarmStore.can_make_new_alarm }}
					{{ alarmStore.work_cycles_complete }}
					{{ alarmStore.alarm_timeout_id }}
					-->
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { useAlarmStore } from '@/stores/alarmStore.js';
import {computed, ref} from 'vue';

const is_playing = ref(false);

const leadZero = (num)=>{
	return  num < 10 ? `0${num}` : `${num}`;
}

const time_left = computed(()=>{
	const time = new Date(alarmStore.time_before_alarm)
	return  `${leadZero(time.getMinutes())} : ${leadZero(time.getSeconds())}`
})

const alarmStore = useAlarmStore();

const playButton = ()=>{
	if(is_playing.value){
		pauseTimer();
	}else{
		startTimer();
	}
}

function startTimer(){
	is_playing.value = true
	alarmStore.startTimer();
}

function pauseTimer(){
	is_playing.value = false;
	alarmStore.pauseTimer();
}
function stopTimer(){
	alarmStore.stopTimer();
}

document.addEventListener("work_cycle_complete",()=>{
	is_playing.value = false;
	console.log("work done")
})
document.addEventListener("break_cycle_complete",()=>{
	is_playing.value = false;
	console.log("break done")
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

<style scoped>

	.timer_wrapper{
		/*
		height: 50vh;
		height: 50dvh;
		*/
		align-content: center;
		width: min(100%, 2000px);
		padding-inline: 0.2em;
		
	}


	.timer_background{
		height: 80%;
		align-content: center;
	}

	.timer{
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.timer > * {
		flex: auto;
		align-content: center;
	}

	.timer_left{
		font-size:3em;
	}

	.timer_control_panel{
		width: 100%;
	}
	.timer_control_panel > button{
		width: 50%;
		/*width: min(15em,20vw);*/
	}

	.play_button::before,.play_button::after,.stop_button::after{
		content: "";
		position: absolute;
		display: block;
		width: 2em;
		height: 2em;
		background-color: var(--text-color);
		inset: 0;
		margin-inline: auto;
		margin-block: auto;
		transition: transform 0.2s ease-in;
		transform: scale(100%);
	}
	
	.play_button::before{
		clip-path: polygon(20% 10%, 25% 10%, 25% 90%, 20% 90%);
		transition: clip-path 0.3s ease-in;
		
	}

	.play_button::after{
		
		clip-path: polygon(25% 10%, 80% 50%, 55% 70%, 25% 90%);		
		transition: clip-path 0.3s ease-in;
	}

	.play_button[playing=true]::before{
		transition: clip-path 0.3s ease-in;
		clip-path: polygon(0 10%, 30% 10%, 30% 90%, 0% 90%);
	}

	.play_button[playing=true]::after{
		transition: clip-path 0.3s ease-in;
		clip-path: polygon(40% 10%, 70% 10%, 70% 90%, 40% 90%);
	}

	.stop_button::after{
		width: 1.5em;
		height: 1.5em;
		
		
	}
	.stop_button:hover::after,.play_button:hover::after,.play_button:hover::before{
		transform: scale(120%);
	}

</style>