<template setup>

    <div>
        <ul>
            <li>
                <button @click="exportTree()" popovertarget="treeWindow">Export as JSON</button>
            </li>
            <li>
                <button popovertarget="popoverWindow">Import as JSON</button>
            </li>
			<li>
                <button popovertarget="popoverWindow" @click="saveInLocalStorage">Save</button>
            </li>
        </ul>
		<popover-view>
			<form @submit.prevent="importTree(json_tree)">
				<textarea v-model="json_tree"></textarea>
				<button>Load</button>
			</form>
		</popover-view>
    </div>
</template>
<script setup>
import popoverView from '@/components/popoverView.vue'
import { useTaskStore } from '@/stores/taskStore';
import {ref} from 'vue';

const json_tree = ref();
const taskStore = useTaskStore();

const exportTree = ()=>{
    json_tree.value = taskStore.exportTreeAsJson();
}
const importTree = (tree)=>{
    taskStore.loadTree(tree);
}


const saveInLocalStorage = ()=>{
	let tree = taskStore.exportTreeAsJson();

}

localStorage.key = JSON.stringify(["1","2"])


if(json_tree.value == undefined){
	console.log(JSON.parse(localStorage.key))
}

/*
	lookup localstorage.key if not empty
		open popover with list of project, and names.
		if user chooses one.
			lookup localstorage[chosenkey] use try catch
			when saving save under localstorage[chosenkey]
*/


//localStorage.key

console.log(localStorage);

</script>

<style>
textarea{
	min-height: 70vh;
	min-width: 60em;
	overflow-y: auto;
}
</style>