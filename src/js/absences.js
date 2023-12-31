import { log, readJsonFile, replaceValueJsonFile } from "../modules/globalFunction.js";
import { popup, stillPopup, stopStillPopup } from "../modules/popup.js";
import { checkXTimesInternetConnection } from "../modules/checkInternetCo.js";


// ---------------------------------------------------------- //

export function listFalseJustifiedAbsences(json){
    const falseJust = []
    for (const date in json) {
        for (const time in json[date]) {
            if (json[date][time].justified === false) {
                falseJust.push({
                    date: date,
                    time: time,
                    data: json[date][time]
                })
            }
        }
    }
    return falseJust
}

// ---------------------------------------------------------- //

export function listJustifedAbsences(json){

    let justifiedAbsences = [];
    for (const date in json) {
        for (const time in json[date]) {
            if (json[date][time].justified === true) {
            justifiedAbsences.push({
                date: date,
                time: time,
                data: json[date][time]
            });
            }
        }
    }

    // Sort by date
    justifiedAbsences.sort((a, b) => new Date(b.date) - new Date(a.date));
    return justifiedAbsences

}

// ---------------------------------------------------------- //

// Check if there's already a check
// This function exist to avoid to forget a replaceValueJsonFile when doing a retur inside the refreshingAbsences1()
export async function refreshingAbsences(startDate = null, endDate = null){
    
    const tmp = readJsonFile('./config.json')
  
    if(tmp.pendingAbsences == "true"){
        log('There is already a refreching Absence')
        return
    }

    replaceValueJsonFile('./config.json', "pendingAbsences", "true")
    try{
        await refreshingAbsences1(startDate, endDate)
    }
    catch{
        log('Error when refreshingSchedule1()')
    }
    
    replaceValueJsonFile('./config.json', "pendingAbsences", "false")
}

// Get schedule from myges website
async function refreshingAbsences1(startDate = null, endDate = null){
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

    console.log('refreshing abs')


    // Write the file
    
    
    
    stopStillPopup()

}

// ---------------------------------------------------------- //

// Read the local file and print it inside the software in absences page
export function absences(){
    refreshingAbsences()
}