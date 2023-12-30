import { log } from "../modules/globalFunction.js";
import { popup, stillPopup, stopStillPopup } from "../modules/popup.js";
import { checkXTimesInternetConnection } from "../modules/checkInternetCo.js";


// ---------------------------------------------------------- //

export function listFalseJustifiedAbsences(json){
    const falseJust = []
    for (const date in json) {
        for (const time in json[date]) {
            if (json[date][time].justified === false) {
                //falseJust.push(json[date][time])
                falseJust.push({
                    date: date,
                    time: time,
                    data: json[date][time]
                })
                //console.log(`Justification fausse trouvée pour ${absencesJson[date][time].course_name} le ${date} à ${time}`);
            }
        }
    }
    return falseJust
}

// ---------------------------------------------------------- //

export function listJustifedAbsences(json){

    let justifiedAbsences = [];
    // Convertir l'objet en une liste d'absences
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

// Get schedule from myges website
export async function refreshingAbsences(startDate = null, endDate = null){
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

}

// ---------------------------------------------------------- //

// Read the local file and print it inside the software in absences page
export function absences(){
    console.log('refreshing abs')
    refreshingAbsences()
}