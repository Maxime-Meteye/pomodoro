<!--© 2025 Maxime Météyé — Released under the MIT License-->
<template setup>
    <div>
		<div class="f-container f-col">	
			<timeManagementView ></timeManagementView>
			<div class="f-container f-row margin-inline-auto button-bar padding-bottom-s">
				<button class="btn glass" @click="exportTree()" popovertarget="popoverWindow">Export as JSON</button>
				<button class="btn glass" popovertarget="popoverWindow" @click="popover_state = 'show_json'">Import as JSON</button>
				<button class="btn glass" @click="resetTree()"><span class="material-symbols-outlined">new_window</span></button>
				<button class="btn glass" popovertarget="popoverWindow" @click="refreshKeys(true)"><span class="material-symbols-outlined">folder_open</span></button>
				<button class="btn glass" @click="saveInLocalStorage()"><span class="material-symbols-outlined">save</span></button>
			</div>
		</div>
		<popover-view v-if="popover_state == 'show_json'">
			<form @submit.prevent="importTree(json_tree)" >
				<button class="btn glass round margin-bottom-m">Load</button>
				<textarea v-model="json_tree" class="input" required></textarea>
			</form>
		</popover-view>
		<popover-view v-if="popover_state == 'show_saved_projects'">

			<div v-if="projects_keys.length == 0">
				<p class="glass round empty_project_list">No saved projects</p>
			</div>
			<div v-else>
				<p class="load_message">Select a project to load</p>
				<ul v-for="key in projects_keys">
					<li class="project_buttons button-bar margin-block-s">
						<button @click="loadTreeFromLocalStorage(key)" popovertarget='popoverWindow' class="glass round theme-dark padding-a-m">
							<h5>{{ key.title }}</h5>
							<p>{{creation_date(key.creation) }}</p>
						</button>
						<button @click="deleteTreeFromLocalStorage(key.id)" class="glass round theme-danger padding-a-m margin-left-s suppr_button"><span class="material-symbols-outlined">delete</span></button>
					</li>
				</ul>
			</div>
		</popover-view>
    </div>
</template>
<script setup>
import popoverView from '@/components/popoverView.vue'
import timeManagementView from '@/components/timeManagementView.vue';
import { useTaskStore } from '@/stores/taskStore';
import { useStorageStore } from '@/stores/storageStore';
import {ref, computed} from 'vue';

const json_tree = ref();
const taskStore = useTaskStore();
const storageStore = useStorageStore();
const popover_state = ref(""); //:string switches what is displayed in popover
const projects_keys = ref([]);

//Add leading zero to a number under 10;
//Useful for dates.
const leadZero = (num)=>{
	return  num < 10 ? `0${num}` : `${num}`;
}

const creation_date = computed(()=>(date)=>{
	const time = new Date(date)
	return  `${leadZero(time.getDate())}/${leadZero(time.getMonth()+1)}/${time.getFullYear()} ${leadZero(time.getHours())}:${leadZero(time.getMinutes())}`
})


const exportTree = ()=>{
    json_tree.value = taskStore.exportTreeAsJson();
}
const importTree = (tree)=>{
	try{
		taskStore.loadJsonTree(tree);
	}catch(err){
		window.alert(`Couldn't load project. Are you sure you copy pasted all the text ?`)
	}
}

const resetTree = ()=>{

	if(window.confirm("Are you sure ? Making a new tree doesn't save the one that is loaded now")){
		taskStore.resetTree();
	}
}


const deleteTreeFromLocalStorage = (key)=>{
	try{
		storageStore.deleteFromLocalStorage(key)
		let key_match = null; //the index where the key matches the id of the key deleted from local storage

		for(const index in projects_keys.value){
			if(projects_keys.value[index].id == key){
				key_match = index;
				break
			}
		}
		if(key_match != null){
			projects_keys.value.splice(key_match, 1)
		}
	}catch(err){
		//window.alert("Cannont delete the project")
	}
}


const loadTreeFromLocalStorage = (key)=>{
	try{
		taskStore.loadTree(storageStore.getFromLocalStorage(key.id));
		taskStore.key = key.id;
		taskStore.creation = key.creation
		taskStore.title = key.title
	}catch(err){
		window.alert("Cannot find local storage")
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
		window.alert("Saved successfuly");
	}catch(err){
		window.alert("Cannot save project in local storage: Memory full. Please delete an unused project.")
	}
	
}

//Loads the keys of every projects used
const refreshKeys = (open_popover = false)=>{
	try{
		cleanKeys();
		projects_keys.value = storageStore.getFromLocalStorage("pom_key");
		if(open_popover){
			popover_state.value = "show_saved_projects";
		}else{
			popover_state.value = ""
		}
	}catch(err){
		window.alert("Cannot retrieve projects from local storage");

	}
}

//cleans the key array of unused keys.
//More useful for developement but probably a good idea to keep it.
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




</script>

<style scoped>
textarea{
	min-height: 80vh;
	min-width: 80vw;
}

.theme-danger{
	background-color: rgb(209, 30, 46, 0.8);
}

.btn{
	height: auto;
}

.project_buttons{
	min-width: 10vw;
	min-height: 10vw;
}



@media screen and (width >= 1200px){
.suppr_button{
	display: none;
}

.project_buttons:hover .suppr_button{
	display: inline-block;
}	
}

.load_message{
	color: var(--text-color);
	margin-bottom: 0.5em;
}

</style>