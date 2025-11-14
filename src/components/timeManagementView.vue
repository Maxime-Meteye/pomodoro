<template>
	<div class="timer_wrapper">
		<div class="timer_background glass round">
			<div class="timer">
				<p class="timer_left">{{ time_left }}</p>
				<p class="glass working_state" :class="{working: !alarmStore.on_break, break: alarmStore.on_break}">{{ isOnBreak }}</p>
				<div class="timer_control_panel">
					<button class="btn glass play_button" v-bind:playing="is_playing" @click="playButton()"></button>
					<button class="btn glass stop_button" @click="stopTimer()"></button>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { useAlarmStore } from '@/stores/alarmStore.js';
import {computed, ref, onUnmounted} from 'vue';

const is_playing = ref(false);

const leadZero = (num)=>{
	return  num < 10 ? `0${num}` : `${num}`;
}

const time_left = computed(()=>{
	const time = new Date(alarmStore.time_before_alarm)
	return  `${leadZero(time.getMinutes())} : ${leadZero(time.getSeconds())}`
})

const isOnBreak = computed(()=>{
	if(alarmStore.on_break == true){
		return "On break";
	}
	return "Working";
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
})
document.addEventListener("break_cycle_complete",()=>{
	is_playing.value = false;
})


onUnmounted(()=>{
	document.removeEventListener("work_cycle_complete", CustomEvent)
	document.removeEventListener("break_cycle_complete", CustomEvent)
})
</script>

<style scoped>

	.timer_wrapper{
		align-content: center;
		width: min(100%, 2000px);
		padding-inline: 0.5em;
		padding-block: 1em;
		align-self: center;
		
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
		text-shadow: 7px 7px 7px #002;
	}

	.timer_control_panel{
		width: 100%;
	}
	.timer_control_panel > button{
		width: 50%;
		border-radius: 0;
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

	.working_state{
		font-size: 1.2em;
		border-radius: 2em 2em 0 0;
	
	}
	.working{
		background-color: rgb(209, 30, 46, 0.5);
	}
	.break{
		background-color:rgb(82, 120, 59, 0.8);
	}
</style>