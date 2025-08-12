<template>
    <ul>
        <li v-if="editing_task != goal_object.id">
            <button @click="taskStore.select_toggle(goal_object.id)" v-on:dblclick="editTask(goal_object.id)">{{ goal_object.title }}</button>
            <div v-if="taskStore.selected_goal == goal_object.id">
                <button @click="add_child(goal_object.id)">+</button>
                <button @click="delete_child(goal_object.id)">-</button>
                <button @click="startTask(goal_object.title)"><span class="material-symbols-outlined">alarm</span></button>
                <button><span>...</span></button>
            </div>
        </li>
        <li v-else>
            <form @submit.prevent="">
                <textarea v-model="goal_object.title">{{ goal_object.title }}</textarea>
            </form>
        </li>
        <ul v-for="task in goal_object.sub_goals">
            <TaskView :goal_object="task"/>
        </ul>
    </ul>
</template>
<script setup>
    import { useTaskStore } from '@/stores/taskStore';
    import {ref} from 'vue'
    const taskStore = useTaskStore();
    const editing_task = ref(-1)

    //TODO Important : décider de comment tu vas permettre de modifier les éléments.

    defineProps(['goal_object'])

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
</script>

<style scoped>
    #alarm{
        background-color: aquamarine;
    }
</style>