<template setup>

    <div>
		<timeManagementView></timeManagementView>
        <ul>
            <li>
                <button @click="exportTree()" popovertarget="popoverWindow">Export as JSON</button>
            </li>
            <li>
                <button popovertarget="popoverWindow" @click="popover_state = 'show_json'">Import as JSON</button>
            </li>
			<li>
                <button popovertarget="popoverWindow" @click="refreshKeys(true)">Load</button>
            </li>
			<li>
                <button @click="saveInLocalStorage()">Save</button>
            </li>
        </ul>
		<popover-view v-if="popover_state == 'show_json'">
			<form @submit.prevent="importTree(json_tree)">
				<textarea v-model="json_tree"></textarea>
				<button>Load</button>
			</form>
		</popover-view>
		<popover-view v-if="popover_state == 'show_saved_projects'">

			<div v-if="projects_keys.length == 0">
				<p>No saved projects</p>
			</div>

			<ul v-else v-for="key in projects_keys">
				<li>
					<button @click="loadTreeFromLocalStorage(key)" popovertarget='popoverWindow'>
						<h5>{{ key.title }}</h5>
						<p>{{ key.creation }}</p>
					</button>
				</li>
			</ul>
		</popover-view>

    </div>
</template>
<script setup>
import popoverView from '@/components/popoverView.vue'
import timeManagementView from '@/components/timeManagementView.vue';
import { useTaskStore } from '@/stores/taskStore';
import { useStorageStore } from '@/stores/storageStore';
import {ref} from 'vue';

const json_tree = ref();
const taskStore = useTaskStore();
const storageStore = useStorageStore();
const popover_state = ref("");
const projects_keys = ref([]);




const exportTree = ()=>{
    json_tree.value = taskStore.exportTreeAsJson();
}
const importTree = (tree)=>{
    taskStore.loadJsonTree(tree);
}



const loadTreeFromLocalStorage = (key)=>{
	try{
		taskStore.loadTree(storageStore.getFromLocalStorage(key.id));
		taskStore.key = key.id;
		taskStore.creation = key.creation
		taskStore.title = key.title
	}catch(err){
		window.alert("Cannot find local storage")
		console.log(err);
	}
}

const saveInLocalStorage = ()=>{
	/*Making the key and value that will be stored */
	let tree = taskStore.goals;

	const key = {
		id : taskStore.key,
		creation : taskStore.creation_date,
		title : taskStore.goals.title
	}

	//TODO Handle case where pom_key is null.
	/*Fetching existing keys */
	try{
		const stored_keys = storageStore.getFromLocalStorage("pom_key", [])
		/*Whether key was saved in stored_keys or not */
		let saved_status = 0;
		/*Searching key with identic id */
		for(const stored_key in stored_keys){
			if(stored_keys[stored_key].id == key.id){
				//actualising key with newer info
				stored_keys[stored_key] = key;
				saved_status = 1
				break;
			}
		}
		//if key wasn't saved no similar key was found we push it into the array.
		if(saved_status === 0){
			stored_keys.push(key);
		}
		/*Saving keys */
		storageStore.setLocalStorage("pom_key",stored_keys);
		storageStore.setLocalStorage(key.id, tree)

		//TODO Handle feedback
	}catch(err){
		window.alert("Cannot save project in local storage: Memory full. Please delete an unused project.")
	}
	
}

const refreshKeys = (open_popover = false)=>{
	try{
		cleanKeys();
		projects_keys.value = storageStore.getFromLocalStorage("pom_key");
		console.log(projects_keys.value);
		if(open_popover){
			popover_state.value = "show_saved_projects";
			console.log(projects_keys.value);
		}else{
			popover_state.value = ""
		}
	}catch(err){
		window.alert("Cannot retrieve projects from local storage");

	}
}

const cleanKeys = ()=>{
	const stored_keys = storageStore.getFromLocalStorage("pom_key");
	//Lookup every value associated with existing key. Delete the value if orphan
	for(const key in stored_keys){
		if(storageStore.getFromLocalStorage(stored_keys[key].id) === null){
			stored_keys.splice(key,1);
		}
	}
	storageStore.setLocalStorage("pom_key", stored_keys);
}



/*
	lookup localstorage.key if not empty
		open popover with list of project, and names.
		if user chooses one.
			lookup localstorage[chosenkey] use try catch
			when saving save under localstorage[chosenkey]
*/

</script>

<style>
textarea{
	min-height: 70vh;
	min-width: 60em;
	overflow-y: auto;
}
</style>