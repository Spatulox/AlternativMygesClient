/*
* Author : Spatulox
* Date : 01/01/2024
*
* Desc : Overlay of the myges js modules to extend functionnalities
*
*/

import { log } from "./globalFunction.cjs"
import { GesAPI } from 'myges/dist/ges-api.js';

// Return a class with functions => go to see ges-api.js to see functions
export async function loginUser(username, password){
	try{
		log(`Try to login into ${username} myGes`)
		const tmp = await GesAPI.login(username, password)
		log('Login myGes ok')
		return tmp
	}
	catch (error){
		log(`ERROR : Login myGes error for ${username}, ${error}`)
		return [error]
	}
}

// ---------------------------------------------------------------------

export async function getClasses(user, year) {
	// Return the class of the user, using the api
	//return await user.request('GET', `/me/${year}/classes`)
	let tmp = await user.request('GET', `/me/${year}/classes`)
	if(!tmp){
		return false
	}
	return tmp
}


// module.exports = {
// 	login,
// 	//getClasses
// }