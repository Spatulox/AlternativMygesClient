import { log, readJsonFile, replaceValueJsonFile } from "../modules/globalFunction.js";
import { popup, stillPopup, stopStillPopup } from "../modules/popup.js";
import { checkXTimesInternetConnection } from "../modules/checkInternetCo.js";

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
async function refreshingSchedule1(startDate = null, endDate = null){
    stillPopup('Checking internet')

    //let tmp = 
    if(!(await checkXTimesInternetConnection(1))){
        log('Definitely no Internet connection')
        popup('No internet connection')
        stopStillPopup()
    }
    else{
        //popup('Internet co !')
        stillPopup('Connecting to myGes api')
    }



    // Write the file


    stopStillPopup()
}

// Read the local file and print it inside the software in schedule page
export function schedule(){
    refreshingSchedule()
}