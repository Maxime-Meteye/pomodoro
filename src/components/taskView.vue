<template>
    <ul>
        <li v-if="editing_task != goal_object.id" :class="{complete: goal_object.complete, incomplete: !goal_object.complete}">
            <button @click="taskStore.select_toggle(goal_object.id)" v-on:dblclick="editTask(goal_object.id)">{{ goal_object.title }}</button>
            <div v-if="taskStore.selected_goal == goal_object.id">
                <button @click="add_child(goal_object.id)">+</button>
                <button @click="delete_child(goal_object.id)">-</button>
                <button @click="startTask(goal_object.title)"><span class="material-symbols-outlined">alarm</span></button>
                <button v-if="goal_object?.sub_goals?.length == 0 " @click="finishTask(goal_object.id)"><span class="material-symbols-outlined">check</span></button>
            </div>
        </li>
        <li v-else>
            <form @submit.prevent="editing_task = -1">
                <textarea v-model="goal_object.title">{{ goal_object.title }}</textarea>
                <button><span class="material-symbols-outlined">check</span></button>
            </form>
        </li>
        <ul v-for="task in goal_object.sub_goals">
            <TaskView :goal_object="task"/>
        </ul>
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

    const finishTask = (id)=>{
        taskStore.completeTask(id);
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
    .complete{
        background-color: green;
    }

    .incomplete{
        background-color: red;
    }
</style>
