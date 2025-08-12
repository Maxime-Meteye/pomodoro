import {defineStore} from 'pinia'
import {ref,watch} from 'vue'

export const useTaskStore =  defineStore('taskStore',()=>{
    let ID = ref(0);
    const selected_goal = ref("")
    const goals = ref({}) /*
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
    console.log('>add_sub_goal', parent, child_name)
    console.log(parent == -1 && goals.value.title == undefined )
    if(parent == -1 && goals.value.title == undefined || goals.value.title == ""){//create the first goal, if no goal is provided
        console.log('>>add_sub_goal, creating first goal')
        goals.value = {
            title: child_name,
            complete: false,
            sub_goals:[],
            id:ID.value
        }
        console.log(JSON.stringify(goals.value))
        ID.value++;
    }else{
        add_in_tree(child_name, parent ,goals.value)
    }
}

function deleteFromTree(target_id){

    findInTree(target_id,goals.value,(el)=>{
        console.log(("found"),el)
        el.sub_goals.splice(el.sub_goals.findIndex(child=>
            child.id == target_id
        ),1)
    },"MATCH_PARENT")
}

const add_in_tree = (new_goal, parent ,obj)=>{
    findInTree(parent,obj,(element)=>{
        element.sub_goals.push({
            title: new_goal,
            complete: false,
            sub_goals:[],
            id: ID.value
        })
        select_toggle(ID.value)
        ID.value++;
    })
}

const findInTree = (target_id, obj,callbackFunction = ()=>{},mode = "")=>{
    let filter = obj.id == target_id
    if(mode == "MATCH_PARENT"){
        filter = obj.sub_goals.findIndex((element)=>
            element.id == target_id
        ) > -1;
    }
    //console.log('filter',filter)
    if(filter){
        console.log(obj.title)
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
  const ringtone = new Audio('/src/assets/alarm.mp3')

  if(match){
    const task_time = parseInt(match[1]);
    if(task_time > 0 && task_time < 60){
      setTimeout(()=>{
        console.log("time elapsed")
        ringtone.play()
      },task_time*60000)
    }
  }else{
    setTimeout(()=>{
      console.log("time elapsed")
      ringtone.play()
    },25*60000)
  }
}


watch(goals,()=>{
  console.log(goals.value)
},{deep:true})

return{goals,selected_goal,select_toggle,add_sub_goal, startTask, deleteFromTree}
})