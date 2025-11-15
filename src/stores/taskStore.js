//© 2025 Maxime Météyé — Released under the MIT License
import {defineStore} from 'pinia'
import {ref,watch} from 'vue'

export const useTaskStore =  defineStore('taskStore',()=>{
    let ID = ref(0); //UID for the tasks
	const creation_date = ref(Date.now());
	const key = ref(`pom-${Math.random()}-${creation_date.value}`); //The key under which the project is saved in local storage
	/*
		Logicaly belongs in the taskView component. Should have been made using custom event.
	 */
    const selected_goal = ref("")
	/*
		Contains the whole tasks/project tree.
		In hindsight should have made use of a class.
	 */
	const goals = ref({
          title: 'Your project name',
          complete: false,
          sub_goals:[],
          id:ID.value
      })


	//Resets the tree to it's original state. Is used whe, creating a new project.
	function resetTree(){
		ID.value = 0;
		creation_date.value = Date.now();	
		key.value = `pom-${Math.random()}-${creation_date.value}`;
		selected_goal.value = "";
		goals.value = {
			title: 'Your project name',
			complete: false,
			sub_goals:[],
			id:ID.value
		}
	}

	// id :int
	// Is used to toggle the selected state of a task
	function selectToggle (id){
		if(selected_goal.value == id){
			selected_goal.value = -1
		}else{
			selected_goal.value = id
		}
	}


	//parent :int The id of the parent we want to add goal to
	//child_name :string
	function addSubGoal( parent, child_name){
		addInTree(child_name, parent ,goals.value)
		refreshTasksState(goals.value);
	}

	//target_id :int The id of the task we must delete
	function deleteFromTree(target_id){
		findInTree(target_id,goals.value,(el)=>{
			el.sub_goals.splice(el.sub_goals.findIndex(child=>
				child.id == target_id
			),1)
		},"MATCH_PARENT")
		refreshTasksState(goals.value);
	}

	//target_id :int Id of the task that must be marked as complete or incomplete
	function toggleTaskCompletion(target_id){
		findInTree(target_id, goals.value,(el)=>{
			if(el.complete){
			el.complete = false;
			}else{
			el.complete = true;
			}
		})
		refreshTasksState(goals.value);
	}


	//obj :goal Recursive function that explores obj and evaluates if parent tasks must be marked as complete or incomplete
	const refreshTasksState = (obj)=>{
		let child_incomplete_task = 0
		obj.sub_goals.forEach(element => {
			child_incomplete_task += refreshTasksState(element)
			obj.complete = child_incomplete_task === 0;
			if(!obj.complete){
			child_incomplete_task ++;
			}
			return obj.complete;
		});  
		let incomplete_task = obj.complete?0:1
		return incomplete_task;
	}

	/*	new_goal :string name of the new goal
		parent :int id of the parent we must add a child to
		obj :goal The root goal object we must add a task in
	*/
	const addInTree = (new_goal, parent ,obj)=>{
		ID.value++;
		findInTree(parent,obj,(element)=>{
			element.sub_goals.push({
				title: new_goal,
				complete: false,
				sub_goals:[],
				id: ID.value
			})
			//By default selects the newly created task
			selectToggle(ID.value)
		})
		refreshTasksState(goals.value);
	}

	/* target_id :int
		obj :goal
		mode :string Defines if the function searches the task with the targeted id or it's parent
		callbackFunction :function is executed upon finding the object with correct target_id or it's parent
		is being passed the found object.
	*/
	const findInTree = (target_id, obj, callbackFunction = ()=>{}, mode = "")=>{
		let filter = obj.id == target_id
		if(mode == "MATCH_PARENT"){
			filter = obj.sub_goals.findIndex((element)=>
				element.id == target_id
			) > -1;
		}
		if(filter){
			callbackFunction(obj);
		}else{
			obj.sub_goals.find(el=>{
				findInTree(target_id, el, callbackFunction, mode)
			})
		}
	}

	function exportTreeAsJson(){
		return JSON.stringify(goals.value)
	}

	function loadTree(tree_to_load){
		goals.value = (tree_to_load);
	}

	function loadJsonTree(json){
		loadTree(JSON.parse(json));
	}

	return{
		goals,
		selected_goal,
		creation_date,
		key,
		selectToggle,
		addSubGoal,
		deleteFromTree,
		toggleTaskCompletion,
		exportTreeAsJson,
		loadTree,
		loadJsonTree,
		resetTree
	}
})