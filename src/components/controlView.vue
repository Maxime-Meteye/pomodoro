<template setup>

    <div>
        <ul>
            <li>
                <button @click="exportTree()">Export as JSON</button>
            </li>
            <li>
                <button @click="importTree()">Import as JSON</button>
            </li>
        </ul>
    </div>
</template>
<script setup>
import { useTaskStore } from '@/stores/taskStore';

const taskStore = useTaskStore()

const exportTree = ()=>{
    window.alert(taskStore.exportTreeAsJson());
}
const importTree = ()=>{
    taskStore.loadTree(window.prompt())
}

</script>