import {ref, watch} from "vue";
import { defineStore } from "pinia";
import alarm from '@/assets/audio/alarm.mp3';


export const useAlarmStore = defineStore("alarmStore",()=>{
	let alarm_timeout_id = ref(0) ; //TimeoutID :int
	let timer_interval_id = ref(0);  //TimeoutID :int
	const time_before_alarm = ref(0) ; //Time left before alarm rings :int
	const work_duration = ref(3000); // 25*60000 Time used as reference for work duration :int
	const short_break_duration = ref(5*1000); //Time used as reference for short break duration :int
	const long_break_duration = ref(25*1000); //Time used as reference for long break duration :int
	const ringtones = [new Audio(alarm)]; //contains every ringtones used
	const work_ringtone = ref(0); //:int index of the ringtone to use
	const break_ringtone = ref(1);//:int index of the ringtone to use
	const can_make_new_alarm = ref(true);
	const work_cycles_before_long_break = ref(3);
	const work_cycles_complete = ref(0);
	const on_break = ref(false);
	const break_event_name = "break_cycle_complete";
	const work_event_name = "work_cycle_complete";

	function  createAlarm (duration,callback = ()=>{}){
		if(can_make_new_alarm.value){
			console.log("debug")
			deleteAlarm();
			alarm_timeout_id.value = setTimeout(()=>{
				ringtones[work_ringtone.value].play(); //can be changed later to customise ringtone for each situation.
				clearInterval(timer_interval_id.value);
				alarm_timeout_id.value = 0;
				time_before_alarm.value = 0;
				callback();
			},duration)
			time_before_alarm.value = duration;
			timer_interval_id.value = setInterval(()=>{
				time_before_alarm.value -= 1000;
			},1000);
		}
	}

	watch(alarm_timeout_id,(new_id,old_id)=>{
		if(new_id === 0 || new_id === -1){ 
			can_make_new_alarm.value = true;
		}else{
			can_make_new_alarm.value = false;
		}
	})

	function deleteAlarm(){
		can_make_new_alarm.value = true;
		clearTimeout(alarm_timeout_id.value);
		clearInterval(timer_interval_id.value);
		alarm_timeout_id.value = 0;
		timer_interval_id.value = 0;
	}

	function pauseTimer(){
		console.log("pause")
		deleteAlarm();

	}

	function stopTimer(){
		deleteAlarm();
		time_before_alarm.value = 0;
	}

	function resumeTimer(){
		createAlarm(time_before_alarm.value)
	}

	function updateTimer(new_duration){
		pauseTimer();
		createAlarm(new_duration);
	}

	function startWork(){
		createAlarm(work_duration.value, ()=>{
			completeWorkCycle()
		});
	}

	function emitEvent(name){
		document.dispatchEvent(new CustomEvent(name));
	}

	function completeWorkCycle(){
		work_cycles_complete.value ++;
		if(work_cycles_complete.value <= work_cycles_before_long_break.value){
			emitEvent(work_event_name);
		}else{
			emitEvent(work_event_name);
			work_cycles_complete.value = 0;
		}
		on_break.value = true;
	}

	function startBreak(){
		
		if(work_cycles_complete.value != 0){
			createAlarm(short_break_duration.value,()=>{
				emitEvent(break_event_name);
				on_break.value = false;
			});
		}else{
			createAlarm(long_break_duration.value,()=>{
				emitEvent(break_event_name);
				on_break.value = false;
			});
		}
	}

	function startCycle(){
		if(!on_break.value){
			startWork();
		}else{
			startBreak();
		}
	}

	function startTimer(){
		if(time_before_alarm.value == 0){
			startCycle();
		}else{
			createAlarm(time_before_alarm.value,()=>{
				if(!on_break.value){
					emitEvent(work_event_name)
					on_break.value = true;
					startBreak();
				}else{
					emitEvent(break_event_name);
					
				}
			})
		}
	}

	return{
		startBreak,
		startWork,
		resumeTimer,
		pauseTimer,
		stopTimer,
		startCycle,
		startTimer,
		time_before_alarm,
		work_cycles_complete,
		can_make_new_alarm,
		alarm_timeout_id
	};
})