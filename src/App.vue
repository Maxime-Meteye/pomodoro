<template>

  <h1>Pomodoro</h1>

  <div v-if="goals?.title != undefined">
    <ul>
      <li><button>{{ goals.title }}</button></li>
      <ul v-for="(item, index) in goals?.sub_goals">
        <li><button @click="select_toggle(item.title)">{{ item.title }}</button></li>
        <ul v-for="(sub_item,sub_index) in item?.sub_goals">
          <li><button @click="select_toggle(sub_item.title)">{{ sub_item.title }}</button><button @click="startTask(goals.sub_goals[index].sub_goals[sub_index])" v-if="sub_item.title == selected_goal">Start chrono</button></li>
        </ul>
      </ul>
    </ul>
  </div>

  <div v-if="selected_goal != '' ">
    <h2>selected goal : {{ selected_goal }}</h2>
     
  </div>

  <form @submit.prevent="">
    <div v-if="!goals?.title">
      <label class="col">Type today's goal (1 day)<textarea required rows="5" cols="50" v-model="submited_goal"></textarea></label>
      <button @click="goals = {title: submited_goal,complete:false,sub_goals:[]};submited_goal = ''">Add</button>
    </div>

    <div v-if="goals?.title != undefined && selected_goal == ''">
      <label class="col">Type an intermediate goal (1 hour/1 hour and a half)<input type="text" v-model="submited_goal"></label>
      <button @click="if(sub_goal_validation(submited_goal)){goals.sub_goals.push({title:submited_goal,complete:false,sub_goals:[]});submited_goal = ''}">Add</button>
    </div>

    <div v-if="selected_goal != ''">
      <label class="col">Type a mini goal<input type="text" v-model="submited_goal"></label>
      <button @click="if(sub_goal_validation(submited_goal)){add_sub_goal(selected_goal,submited_goal)};submited_goal = ''">Add</button>
    </div>
  </form>

</template>
<script setup>

import {ref,watch} from 'vue'
const submited_goal = ref("")
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

const select_toggle = (title)=>{
  if(selected_goal.value == title){
    selected_goal.value = ""
  }else{
    selected_goal.value = title
  }
}
const add_sub_goal = (parent,child_value)=>{
  for(const index in goals.value.sub_goals){
    if(goals.value.sub_goals[index].title == parent){
      goals.value.sub_goals[index].sub_goals.push({
        title: child_value,
        complete: false
      })
      break;
    }
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

const startTask = (task)=>{
  const regex = /(\d{1,3})/
  const time_prompt = prompt("How many minutes before a break ? Default is 15min")
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
    },15*60000)
  }
}


watch(goals,()=>{
  console.log(goals.value)
},{deep:true})




</script>
<style scoped></style>
