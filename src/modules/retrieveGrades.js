/*
* Author : Spatulox
* Date : 01/01/2024
*
* Desc : The child process to retrieve the Schedule to the myGes API
*
*/

import { loginUser } from "./overlayMyGES.js"
import { readJsonFile, getWeekMonday, getWeekSaturday } from "./childProcessGlobalFunctions.js"
import { getYear, todayDate } from "./globalFunction.js"



async function Grades(user){
	
	process.send('Checking grades')

    let date = new Date()
	let year = date.getFullYear();

    const today = todayDate();

    if(parseInt(today[0].split('/')[1]) < 7){
        year -= 1
    }


	let grades = await user.getGrades(year)

    process.send(grades)


    process.send("Fetching Grades finished")
    process.send(false)

    return false
}


async function retrieveGradesFromMyGES(){
    let tmp = await readJsonFile('./src/data/infos.json')

    const username = tmp.login
    const password = tmp.password
    const user = await loginUser(username, password)
    let userTmp = user+""
    if(userTmp.includes('Bad password')){
        process.send('Error when connecting to you account, Bad password ?');
        process.send(false);
        return false
    }

    await new Promise(resolve => {
        setTimeout(resolve, 2000);
      });

    let gradesVar = await Grades(user);

    // I think it's useless
    if(!gradesVar){
        process.send(gradesVar)
    }


}


await retrieveGradesFromMyGES()