//© 2025 Maxime Météyé — Released under the MIT License
import { defineStore } from "pinia";
import {ref,watch} from "vue"


export const useStorageStore = defineStore('storageStore',()=>{
	const can_write = ref(true); //:boolean whether we can write in local storage
	const can_read = ref(true); //:boolean whether we can read the local storage
	const available_space = ref(-1) //:int How much space is available in local storage unused for now

	//Switches can write to false if we cannot read the local storage
	watch(can_read,(old_state, new_state)=>{
		if(new_state === false){
			can_write.value = false;
		}
	})

	//Tests if we can read and write in the local storage
	//Flawed because not being able to write will result in an error.
	//So if storage is full we will detect local storage as simply unavailable, which it is not necessarily
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

	
	//(keys:array
	//Estimates the available space is unused for now.
	//Should be refactored before being used anyway.
	//Doesn't take into account the keys sizes
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

	/*	key :string key of the wanted item.
		fallback :typeless will output fallback if no data is found.
		A "dirty" trick to ensure calling function always gets data as a form it expects.
	*/
	function getFromLocalStorage(key, fallback = {}){
		try{
			
			const value = localStorage.getItem(key)
			if(value != null){
				return JSON.parse(value);
			}else{
				throw new Error("No value found");
			}
		}catch(err){
			can_read.value = false;
			return fallback;
		}
	}

	/* 	key :string
		value :object || :array
	*/
	function setLocalStorage(key,value){
		try{
			localStorage.setItem(key,JSON.stringify(value));
		}catch(err){
			can_write.value = false;
		}
	}

	// key :string
	function deleteFromLocalStorage(key){
		try{
			localStorage.removeItem(key)
			can_write.value = true
		}catch(err){
			
		}
	}
	
	return {
		can_write,
		can_read,
		available_space,
		calculateAvailableSpace,
		isStorageAvailable,
		getFromLocalStorage,
		setLocalStorage,
		deleteFromLocalStorage
	}
})