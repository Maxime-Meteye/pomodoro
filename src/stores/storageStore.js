import { defineStore } from "pinia";
import {ref,watch} from "vue"


export const useStorageStore = defineStore('storageStore',()=>{
	const can_write = ref(true);
	const can_read = ref(true);
	const available_space = ref(-1)

	watch(can_read,(old_state, new_state)=>{
		if(new_state === false){
			can_write = false;
		}
	})

	function isStorageAvailable(){
		const test_key = "pom-testKey";
		try{
			localStorage.setItem(test_key, "test_value");
		}catch(err){
			can_write.value = false;
		}
		try{
			localStorage.getItem(test_key);
		}catch(err){
			can_read.value = false;
		}
		try{
			localStorage.removeItem(test_key);
		}catch(err){}
	}


	//(keys:array):int
	function calculateAvailableSpace(keys){
		const minimum_total_space = 500000000; //The smallest limit imposed by the browser in bytes
		let bytecounter = 0;
		try{
			keys.forEach( element => {
				const str = localStorage.getItem(element);
				bytecounter = bytecounter + (str.length * 2); //The length of the string * 2 to account for utf-16 encoding
			})
			available_space = minimum_total_space - bytecounter;
		}catch(err){
			can_write.value = false;
		}
	}

	function getFromLocalStorage(key,fallback = {}){
		try{
			return JSON.parse(localStorage.getItem(key));
		}catch(err){
			can_read = false;
			return fallback;
		}
	}

	function setLocalStorage(key,value){
		try{
			localStorage.setItem(key,JSON.stringify(value));
		}catch(err){
			can_write = false;
		}
	}
	
	return {
		can_write,
		can_read,
		available_space,
		calculateAvailableSpace,
		isStorageAvailable,
		getFromLocalStorage,
		setLocalStorage
	}
})