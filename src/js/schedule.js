/*
* Author : Spatulox
* Date : 01/01/2024
*
* Desc : Functions to call the child process wich update the schedule
*
*/


import { getYear, readJsonFile, replaceValueJsonFile, log } from "../modules/globalFunction.js";
import { popup, stillPopup, stopStillPopup } from "../modules/popup.js";
import { checkXTimesInternetConnection } from "../modules/checkInternetCo.js";
import { writeJsonFile } from "../modules/childProcessGlobalFunctions.js";

// Get schedule from myges website
//Check if there is already a refreshing
// This function exist to avoid to forget a replaceValueJsonFile when doing a retur inside the refreshingSchedule1()
export async function refreshingSchedule(startDate = null, endDate = null){
    const tmp = readJsonFile('./config.json')

    if(tmp.pendingSchedule == "true"){
        log('There is already a refreching Schedule')
        return
    }

    replaceValueJsonFile('./config.json', "pendingSchedule", "true")
    try{
        await refreshingSchedule1(startDate, endDate)
    }
     catch{
         log('Error when refreshingSchedule1()')
    }
    
    replaceValueJsonFile('./config.json', "pendingSchedule", "false")
}

// Refresh the Schedule
async function refreshingSchedule1(startD = null, endD = null){
    const { fork } = require('child_process')

    stillPopup('Checking internet')

    if(!(await checkXTimesInternetConnection(1))){
        log('Definitely no Internet connection')
        popup('No internet connection')
        stopStillPopup()
    }
    else{
        stillPopup('Connecting to myGes api')
    }

    stillPopup('Connecing to the myGes account')
    log('Connectiong to the myGes account')

    const forked = fork('./src/modules/retrieveSchedule.js');

    const waitForChildMessage = await new Promise((resolve) => {
        var lastMsg
        var object = null
        forked.on('message', (msg) => {

            if(msg == true || msg == false){
                resolve({ lastMsg, object }); // Résoudre la promesse avec le message du processus enfant
            }
            else if(typeof(msg) === "object"){
                object = msg
            }
            else{
                lastMsg = msg
                console.log(msg)
                log(msg)
                stillPopup(msg)
            }
        });
    });

    let { lastMsg, object } = waitForChildMessage;
    lastMsg += ""
    popup(lastMsg);
    log(lastMsg);

    // Writing the schedule
    const currYear = getYear()

    // Read the file
    let appendSchedule
    try{
        appendSchedule = readJsonFile(`./src/data/${currYear}_agenda.json`)
    }
    catch{
        appendSchedule = {}
    }

    // Create the var to write the correct files
    let nextYearSchedule = {}

    for (let date in object){
        let yearOfDate = new Date(date).getFullYear();

        // Check if the year is good to store it inside the good file
        if(yearOfDate > currYear){
            nextYearSchedule[date] = object[date]
        }else{
            if(!appendSchedule[date]){
                appendSchedule[date] = object[date]
            }
        }
    }

    if (Object.keys(appendSchedule).length !== 0){
        await writeJsonFile(`./src/data/`, `${currYear}_agenda.json`, appendSchedule)
    }
    if (Object.keys(nextYearSchedule).length !== 0){
        await writeJsonFile(`./src/data`, `${currYear+1}_agenda.json`, nextYearSchedule)
    }

    stopStillPopup()

    return false
}

// Read the local file and print it inside the software in schedule page
export function schedule(){
    refreshingSchedule()
}