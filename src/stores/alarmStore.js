import {ref, watch} from "vue";
import { defineStore } from "pinia";
import alarm from '@/assets/audio/alarm.mp3';


export const useAlarmStore = defineStore("alarmStore",()=>{
	let alarm_timeout_id = ref(0) ; //TimeoutID :int
	let timer_interval_id = ref(0);  //TimeoutID :int
	const time_before_alarm = ref(-1) ; //Time left before alarm rings :int
	const work_duration = ref(3000); // 25*60000 Time used as reference for work duration :int
	const short_break_duration = ref(5*1000); //Time used as reference for short break duration :int
	const long_break_duration = ref(25*1000); //Time used as reference for long break duration :int
	const ringtones = [new Audio(alarm)]; //contains every ringtones used
	const work_ringtone = ref(0); //:int index of the ringtone to use
	const break_ringtone = ref(1);//:int index of the ringtone to use
	const can_make_new_alarm = ref(true);
	const work_cycles_before_long_break = ref(3);
	const work_cycles_complete = ref(0);
	const end_of_work_cycle = ref(false); //is used similarly to event. In conjunction with watchers
	const end_of_break_cycle = ref(false); //is used similarly to event. In conjunction with watchers
	const on_break = ref(false);

	function  createAlarm (duration,callback = ()=>{}){
		if(can_make_new_alarm.value){
			console.log("debug")
			deleteAlarm();
			alarm_timeout_id.value = setTimeout(()=>{
				ringtones[work_ringtone.value].play(); //can be changed later to customise ringtone for each situation.
				clearInterval(timer_interval_id.value);
				time_before_alarm.value = -1;
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
		console.log(can_make_new_alarm.value)
	}

	function stopTimer(){
		deleteAlarm();
		time_before_alarm.value = -1;
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

	function emitEvent(event){
		
		event.value = true;
		setTimeout(()=>{
			event.value = false;
		},200)
	}

	function completeWorkCycle(){
		work_cycles_complete.value ++;
		if(work_cycles_complete.value <= work_cycles_before_long_break.value){
			emitEvent(end_of_work_cycle);
		}else{
			work_cycles_complete.value = 0;
			emitEvent(end_of_work_cycle);
		}
		on_break.value = true;
	}

	function startBreak(){
		if(work_cycles_complete.value != 0){
			createAlarm(short_break_duration.value,()=>{
				emitEvent(end_of_break_cycle);
				on_break.value = false;
			});
		}else{
			createAlarm(long_break_duration.value,()=>{
				emitEvent(end_of_break_cycle);
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
		if(time_before_alarm.value == -1){
			startCycle();
		}else{
			createAlarm(time_before_alarm.value,()=>{
				if(!on_break.value){
					emitEvent(end_of_work_cycle)
					on_break.value = true;
					startBreak();
				}else{
					emitEvent(end_of_break_cycle);
				}
			})
		}
	}

	return{
		startBreak,
		startWork,
		resumeTimer,
		pauseTimer,
		deleteAlarm,
		startCycle,
		startTimer,
		time_before_alarm,
		end_of_work_cycle,
		work_cycles_complete,
		end_of_break_cycle,
		can_make_new_alarm
		
		
	};
})