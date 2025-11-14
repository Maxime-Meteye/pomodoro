<template>
	<header class="col-12 row-1">
		<h1 class="italic">Pomodoro</h1>
	</header>
	<main class="col-12 row-10 center">
		<controlView class="col-12 row-3"></controlView>
		<div class="taskview-wrapper col-12 row-9">
			<taskView :goal_object="taskStore.goals" class="origin_taskview"/>
		</div>
	</main >
	<footer class="glass col-12 row-1">
		<h5>© 2025 Maxime Météyé — Released under the MIT License</h5>
	</footer>
</template>
<script setup>



import taskView from './components/taskView.vue'
import controlView from './components/controlView.vue'
import { useTaskStore } from '@/stores/taskStore';
const taskStore = useTaskStore()




</script>
<style>
	h1{
		font-size: clamp(25px,4vw,40px);
	}
	h5{
		font-size: clamp(12px,2vw, 40px);
	}
	main{
		justify-self: center;
		width: 100%;
	}
	footer{
		align-content: center;
	}
	header{
		align-content: top;
	}
	body{
		
		max-height: 100vh;
		max-height: 100dvh;
		max-width: 100vh;
		max-width: 100dvh;
	}

	::-webkit-scrollbar{
		background: #0000;
	}

	::-webkit-scrollbar-thumb{
		background-color: #aaa0;
		backdrop-filter: blur(4px);
		box-shadow: inset 0px 0 7px 3px #ddd5;
		outline: #fff5 solid 2px;
		border-radius: 2em;
		transition: background-color 0.2s ease-in;
	}
	::-webkit-scrollbar-thumb:hover{
		background-color: #aaa2;
	}

	::-webkit-scrollbar-thumb:active{
		background-color: #aaa5;
	}

	#app{
		backdrop-filter: blur(32px);
		height: 100vh;
		height: 100dvh;
		max-height: 100vh;
		max-height: 100dvh;
		width: 100vw;
		width: 100dvw;
		max-width: 100vw;
		max-width: 100dvw;
	}
	
	@media screen and (width >= 1200px)  {
		main{
			max-width: 80vw;
			max-width: 80dvw;
		}
	}


	.glass{
		background-color: #aaa2;
		backdrop-filter: blur(4px);
		box-shadow: inset 0px 0 7px 3px #ddd5, 5px 5px 10px 0px #2225;
		mix-blend-mode: screen;
	}
	.btn{
		--border:0;
		border: none;
		outline: 0;
	}

	.round{
		border-radius: max(10vw, 80px) !important;
	}

	
	.button-bar{
		--border-radius: 2em;
	}
	
	.button-bar > *:is(button){
		border-radius: 0 ;
	}

	.button-bar button:last-of-type{
		border-top-right-radius: var(--border-radius);
		border-bottom-right-radius: var(--border-radius);
	}
	.button-bar button:first-of-type{
		border-top-left-radius: var(--border-radius);
		border-bottom-left-radius: var(--border-radius);
	}

	.taskview-wrapper{
		margin-block: auto;
		margin-inline: auto;
		min-width: 0;
		max-height: 100%;
		height: 65%;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
	}

	.origin_taskview{
		overflow-y: auto;
		min-height: 0;
		max-height: auto;
		height: auto;
	}


</style>
