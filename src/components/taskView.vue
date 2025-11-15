<!--© 2025 Maxime Météyé — Released under the MIT License-->
<template>
    <ul class="glass round task" :class="{complete: goal_object.complete, incomplete: !goal_object.complete}">
        <li v-if="editing_task != goal_object.id" class="task_container">
			<div>
				<button @click="taskStore.selectToggle(goal_object.id)" v-on:dblclick="editTask(goal_object.id)" class="task_name">{{ goal_object.title }}</button>
				<button @click="editTask(goal_object.id)" class="btn glass more_btn"><span class="material-symbols-outlined">edit</span></button>
			</div>
            <div v-if="taskStore.selected_goal == goal_object.id" class="padding-block-s padding-inline-s">
                <button class="btn glass" @click="add_child(goal_object.id)"><span class="material-symbols-outlined">add</span></button>
                <button class="btn glass" @click="delete_child(goal_object.id)"><span class="material-symbols-outlined">remove</span></button>
                <button class="btn glass complete_button" v-if="goal_object?.sub_goals?.length == 0 " @click="toggleTaskCompletion(goal_object.id)">
                    <span class="material-symbols-outlined" v-if="!goal_object.complete">check</span>
                    <span class="material-symbols-outlined" v-else>close</span>
                </button>
            </div>
        </li>
        <li v-else>
            <form @submit.prevent="editing_task = -1" class="form">
                <textarea rows="20" cols="20" v-model="goal_object.title" class="input glass">{{ goal_object.title }}</textarea>
                <button class="btn glass" ><span class="material-symbols-outlined">check</span></button>
            </form>
        </li>
		<li>
			<ul  class="sub_goals padding-a-s">
            	<TaskView v-for="task in goal_object.sub_goals" :goal_object="task"/>
        	</ul>
		</li>
    </ul>
</template>
<script setup>

    import { useTaskStore } from '@/stores/taskStore';
    import {ref, watch} from 'vue'
    const taskStore = useTaskStore();
    const editing_task = ref(-1)

    const props = defineProps(['goal_object'])
    const prop_goal_object = props.goal_object

    const add_child = (parent)=>{
        taskStore.addSubGoal(parent,prompt(`what's your task ?`))
    }
    const delete_child = (target_id)=>{
        taskStore.deleteFromTree(target_id)
    }

    const editTask = (id)=>{
        editing_task.value = id
    }

    const toggleTaskCompletion = (id)=>{
        taskStore.toggleTaskCompletion(id);
    }
</script>

<style scoped>

	button{
		height: auto;
		text-wrap:wrap;
		width: 1em;
	}
	textarea{
		min-width: auto;
		min-height: auto;
		width: clamp(20px, 16vw, 150px);
		height: 2em;
	}

	.task{
		min-width: 100%;
		max-width: 100%;
		margin-inline: auto;
		height: fit-content;
		max-height: 100%;
		opacity: 1;
		transition: 
			opacity 0.3s ease-in,
			background-color 0.3s ease-in,
			transform 0.2s ease-in;
		transform: scale(100%);
		@starting-style{
			opacity: 0;
			transition: 
				opacity 0.3s ease-in,
				transform 0.4s ease-in;

			transform: scale(50%);
		}
	}

	.task_name{
		background-color: #0000;
		color: var(--text-color);
		width: 100%;
	}

	.sub_goals{
		overflow: auto;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		
	}
	.sub_goals > * {
		flex: 1;
	}

    .complete{
        background-color: rgb(82, 104,59, 0.5);
		--background-on-hover: rgb(82, 104,59, 0.6);
		--background-on-active: rgb(82, 120,59, 0.7);
    }
	:is(.complete,.incomplete):hover{
		background: var(--background-on-hover);
		
	}

	:is(.complete,.incomplete):active{
		background: var(--background-on-active);
	}
    .incomplete{
        background-color: rgb(209, 63, 88, 0.2);
		--background-on-hover: rgb(209, 63, 88, 0.3);
		--background-on-active: rgb(209, 30, 46, 0.5);
    }

	.more_btn{
		opacity: 0;
		margin-inline-start: 50%;
	}

	:is(.incomplete,.complete):hover:not(:has(:is(.complete,.incomplete):hover)) > li > div > .more_btn{
		opacity: 1;
	}

	.origin_taskview > li >.task_name{
		font-style: italic;
	}

	.task_container{
		display: flex;
		flex-direction: column;
	}

	.complete_button{
		margin-left: 0.5em;
	}

</style>
