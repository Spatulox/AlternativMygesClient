import { getYear, log, readJsonFile, replaceValueJsonFile } from "../modules/globalFunction.js";
import { popup, stillPopup, stopStillPopup } from "../modules/popup.js";
import { checkXTimesInternetConnection } from "../modules/checkInternetCo.js";




// Retrieve the new grades :
export function newGrades(string = null)
{
    if(string == null){
        log('Specifie a course_name for newGrades function')
        return false
    }
    const year = getYear()
    
    let lastGrades = readJsonFile(`./src/data/${year}_lastGrades.json`)
    let Grades = readJsonFile(`./src/data/${year}_grades.json`)


    for (let i = 0; i < lastGrades.length; i++)
    {
        if(lastGrades[i].course == string){
            lastGrades = lastGrades[i]
            break
        }
    }

    for (let i = 0; i < Grades.length; i++)
    {
        if(Grades[i].course == string){
            Grades = Grades[i]
            break
        }
    }

    let element = []
    for (let i = 0; i < Grades.grades.length; i++) {

        //console.log(lastGrades.grades[i])
        // If new grades
        if(!lastGrades.grades[i])
        {
            element.push(Grades.grades[i])
        }
        else if(lastGrades.grades[i] != Grades.grades[i]) {
            element.push(`replaced - ${Grades.grades[i]}`)
        }
        else{
            element.push(`no new - ${Grades.grades[i]}`)
        }
        
    }
    return element
}
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