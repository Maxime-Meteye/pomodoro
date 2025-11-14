//© 2025 Maxime Météyé — Released under the MIT License
import {defineStore} from 'pinia'
import {ref,watch} from 'vue'

export const useTaskStore =  defineStore('taskStore',()=>{
    let ID = ref(0);
	const creation_date = ref(Date.now());
	const key = ref(`pom-${Math.random()}-${creation_date.value}`);
    const selected_goal = ref("")
	const goals = ref({
          title: 'Your project name',
          complete: false,
          sub_goals:[],
          id:ID.value
      })
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

function selectToggle (id){
  if(selected_goal.value == id){
    selected_goal.value = -1
  }else{
    selected_goal.value = id
  }
}

function addSubGoal( parent = -1, child_name){

  if(parent == -1 && goals.value.title == undefined || goals.value.title == ""){//create the first goal, if no goal is provided
      goals.value = {
          title: child_name,
          complete: false,
          sub_goals:[],
          id:ID.value
      }
      ID.value++;
  }else{
      add_in_tree(child_name, parent ,goals.value)
      refreshTasksState(goals.value);
  }
}

function deleteFromTree(target_id){

    findInTree(target_id,goals.value,(el)=>{
        el.sub_goals.splice(el.sub_goals.findIndex(child=>
            child.id == target_id
        ),1)
    },"MATCH_PARENT")
    refreshTasksState(goals.value);
}

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

const add_in_tree = (new_goal, parent ,obj)=>{
  ID.value++;
  findInTree(parent,obj,(element)=>{
      element.sub_goals.push({
          title: new_goal,
          complete: false,
          sub_goals:[],
          id: ID.value
      })
      selectToggle(ID.value)
  })
  refreshTasksState(goals.value);
}

const findInTree = (target_id, obj,callbackFunction = ()=>{},mode = "")=>{
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
          findInTree(target_id,el,callbackFunction,mode)
      })
  }
}

const sub_goal_validation = (submited_sub_goal)=>{
  return !taskExists(submited_sub_goal, goals.value)
}

const taskExists = (search, obj) => {
  let find = obj.title == search;
  if(!find){
    find = obj.sub_goals.find(el => {
      return taskExists(search, el);
    })
    find = find != undefined
  }
  return find != false;
}

function startTask(task){
  const regex = /(\d{1,3})/
  const time_prompt = prompt("How many minutes before a break ? Default is 25min")
  const match = time_prompt.match(regex)
  const ringtone = new Audio('/src/assets/audio/alarm.mp3')

  if(match){
    const task_time = parseInt(match[1]);
    if(task_time > 0 && task_time < 60){
      setTimeout(()=>{
        ringtone.play()
      },task_time*60000)
    }
  }else{
    setTimeout(()=>{
      ringtone.play()
    },25*60000)
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

watch(goals,()=>{
},{deep:false})

return{
	goals,
	selected_goal,
	creation_date,
	key,
	selectToggle,
	addSubGoal,
	startTask,
	deleteFromTree,
	toggleTaskCompletion,
	exportTreeAsJson,
	loadTree,
	loadJsonTree,
	resetTree
}
})