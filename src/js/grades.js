import { log, readJsonFile, replaceValueJsonFile } from "../modules/globalFunction.js";
import { popup, stillPopup, stopStillPopup } from "../modules/popup.js";
import { checkXTimesInternetConnection } from "../modules/checkInternetCo.js";

// Get schedule from myges website

// This function exist to avoid to forget a replaceValueJsonFile when doing a retur inside the refreshingGrades1()
export async function refreshingGrades(startDate = null, endDate = null){
    
    // Check if there's already a check
    const tmp = readJsonFile('./config.json')
  
    if(tmp.pendingGrades == "true"){
        log('There is already a refreching Grades')
        return
    }

    replaceValueJsonFile('./config.json', "pendingGrades", "true")
    try{
        await refreshingGrades1(startDate, endDate)
    }
    catch{
        log('Error when refreshingSchedule1()')
    }
    
    replaceValueJsonFile('./config.json', "pendingGrades", "false")
}

async function refreshingGrades1(startDate = null, endDate = null){
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

    console.log('refreshing grades')

    
    // Write the file


    stopStillPopup()
}

// Read the local file and print it inside the software in grades page
export function grades(){
    refreshingGrades()
}