<template>

  <h1 class="col-12 row-1">Pomodoro</h1>
  <controlView class="col-12 row-6"></controlView>
  <taskView class="col-12 row-5" :goal_object="taskStore.goals"/>
</template>
<script setup>



import taskView from './components/taskView.vue'
import controlView from './components/controlView.vue'
import { useTaskStore } from '@/stores/taskStore';
const taskStore = useTaskStore()

</script>
<style>
	#app{
		backdrop-filter: blur(16px);
		min-height: 100vh;
		min-height: 100dvh;
	}

	.button-bar{
		--border-radius: 2em;
	}
	
	.button-bar button{
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

	.glass{
		background-color: #aaa2;
		backdrop-filter: blur(4px);
		border-radius: max(10vw, 80px);
		box-shadow: inset 0 0 19px 16px #ddd5,inset 0px 0 7px 3px #ddd5;
		outline: #fff5 solid 2px;
	}

</style>
