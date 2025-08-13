import {defineStore} from 'pinia'
import {ref,watch} from 'vue'

export const useTaskStore =  defineStore('taskStore',()=>{
    let ID = ref(0);
    const selected_goal = ref("")
    const goals = ref({
          title: 'Your project name',
          complete: false,
          sub_goals:[],
          id:ID.value
      }) /*
{
  title:"Add canvas with moving square",
  complete: false,
  sub_goals:[
    {
      title:'add canvas',
      complete:false,
      sub_goals:[
        {
          title:"resize canvas and change background",
          complete:false
        }
      ]
    }
  ]
}
*/

function select_toggle (id){
  if(selected_goal.value == id){
    selected_goal.value = -1
  }else{
    selected_goal.value = id
  }
}

function add_sub_goal( parent = -1, child_name){
  if(parent == -1 && goals.value.title == undefined || goals.value.title == ""){//create the first goal, if no goal is provided
    console.log('>>>>>first element')
      goals.value = {
          title: child_name,
          complete: false,
          sub_goals:[],
          id:ID.value
      }
      //console.log(JSON.stringify(goals.value))
      ID.value++;
  }else{
      add_in_tree(child_name, parent ,goals.value)
      refreshTasksState(goals.value);
      console.log('tracer',child_name)
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

function completeTask(target_id){
  findInTree(target_id, goals.value,(el)=>{
    el.complete = true;
  })
  refreshTasksState(goals.value);
}



const refreshTasksState = (obj)=>{
  obj.sub_goals.forEach(element => {
    const child_incomplete_task = refreshTasksState(element)
    obj.complete = child_incomplete_task === 0;
    return obj.complete;
  });

  
  let incomplete_task = obj.complete?0:1
  return incomplete_task;
}
const OLDrefreshTasksState = (obj)=>{
  obj.sub_goals.forEach(element => {
    const child_incomplete_task = refreshTasksState(element)
    if( child_incomplete_task > 0){
      //console.log(">>>>>>>>",child_incomplete_task)
      //console.log("incomplete child:",element,"Parent :",obj.title)
      obj.complete = false
      incomplete_task += child_incomplete_task
    }else if(child_incomplete_task == 0){
      //console.log("No incomplete child found",obj.title)
      obj.complete = true
      incomplete_task = obj.complete?0:1
    }
  });


  let incomplete_task = obj.complete?0:1
  return incomplete_task;
}

//// Fonction simple comme findintree, mais retourne un nombre chaque appel à la fonction retourne ce nombre puis incrémente de 1 en fonction de ce qui est recherché.
// si retour > 0 mettre le goal en pas fini.
// Si 0 > mettre le goal en fini.

const add_in_tree = (new_goal, parent ,obj)=>{
  ID.value++;
  findInTree(parent,obj,(element)=>{
      element.sub_goals.push({
          title: new_goal,
          complete: false,
          sub_goals:[],
          id: ID.value
      })
      select_toggle(ID.value)
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


watch(goals,()=>{
  //console.log('watcher goals',goals.value)
},{deep:true})

return{goals,selected_goal,select_toggle,add_sub_goal, startTask, deleteFromTree, completeTask}
})