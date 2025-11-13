<template>
    <ul class="glass round task" :class="{complete: goal_object.complete, incomplete: !goal_object.complete}">
        <li v-if="editing_task != goal_object.id"  >
            <button @click="taskStore.select_toggle(goal_object.id)" v-on:dblclick="editTask(goal_object.id)" class="task_name">{{ goal_object.title }}</button>
			<button @click="editTask(goal_object.id)" class="btn glass more_btn">...</button>
            <div v-if="taskStore.selected_goal == goal_object.id">
                <button class="btn glass" @click="add_child(goal_object.id)">+</button>
                <button class="btn glass" @click="delete_child(goal_object.id)">-</button>
				<!--
                <button @click="startTask(goal_object.title)"><span class="material-symbols-outlined">alarm</span></button>
				-->
                <button class="btn glass" v-if="goal_object?.sub_goals?.length == 0 " @click="toggleTaskCompletion(goal_object.id)">
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
			<ul  class="sub_goals">
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
        taskStore.add_sub_goal(parent,prompt(`what's your task ?`))
    }
    const delete_child = (target_id)=>{
        taskStore.deleteFromTree(target_id)
    }
    const startTask = (task)=>{
        taskStore.startTask(task);
    }

    const editTask = (id)=>{
        editing_task.value = id
        console.log("edit")
    }

    const toggleTaskCompletion = (id)=>{
        taskStore.toggleTaskCompletion(id);
    }
    /*
    watch(prop_goal_object,()=>{
        if(prop_goal_object.sub_goals.some(el=>!el.complete) && prop_goal_object.sub_goals.length > 0){
            console.log("watcher complete false",prop_goal_object.title);
            prop_goal_object.complete = false;
        }else{
            console.log("watcher complete true",prop_goal_object.title);
            prop_goal_object.complete = true;
        }
    },{ deep: 1 })
    */
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
		width: 15em;
		height: 2em;
	}

	.task{
		min-width: fit-content;
		max-width: 100%;
		padding: 1.5em;
		flex: 1;
		margin-inline: auto;
	}

	.task_name{
		background-color: #0000;
		color: var(--text-color);
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
        background-color: rgb(82, 104,59, 0.2);
		--background-on-hover: rgb(82, 104,59, 0.3);
		--background-on-active: rgb(82, 120,59, 0.5);
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
	}

	:is(.incomplete,.complete):hover:not(:has(:is(.complete,.incomplete):hover)) > li > .more_btn{
		opacity: 1;
	}

</style>
