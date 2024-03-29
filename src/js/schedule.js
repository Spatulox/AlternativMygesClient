/*
* Author : Spatulox
* Date : 01/01/2024
*
* Desc : Functions to call the child process wich update the schedule
*
*/


import { getYear, readJsonFile, replaceValueJsonFile, log, todayDate, getDateInfo } from "../modules/globalFunction.js";
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
     catch (err){
        console.log(err)
        log(`Error when refreshingSchedule1() : ${err}`)
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

    stillPopup('Connecting to the myGes account')
    log('Connection to the myGes account')

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
                //console.log(msg)
            }
            else{
                lastMsg = msg
                //console.log(msg)
                log(msg)
                stillPopup(msg)
            }
        });
    });

    // Try to bypass the child process...
    // const { retrieveScheduleFromMyGES } = require("./src/modules/retrieveSchedule.js")
    // await retrieveScheduleFromMyGES()

    let { lastMsg, object } = waitForChildMessage;
    lastMsg += ""
    popup(lastMsg);
    log(lastMsg);

    // Writing the schedule
    const currYear = getYear()

    // Read the file
    let appendSchedule
    appendSchedule = readJsonFile(`./src/data/${currYear}_agenda.json`)
    if(!appendSchedule){
        log(`creating ${currYear}_agenda.json`)
        appendSchedule = {}
    }

    // Create the var to write the correct files
    let nextYearSchedule = {}

    // Delete the day of schedule of not exist anymore in the online schedule
    for (let i = 0; i < 7; i++) {

        // Take the date (string)
        let dateTmp = todayDate(i)[0]

        if(!object.hasOwnProperty(dateTmp)){
            if(appendSchedule[dateTmp]){
                delete appendSchedule[dateTmp];
            }
        }
    }

    // Boucle on the object elements to add it into the appendSchedule 
    for (let date in object){
        let yearOfDate = new Date(date).getFullYear();

        // Check if the year is good to store it inside the good file
        if(yearOfDate > currYear){
            nextYearSchedule[date] = object[date]
        }else{
            appendSchedule[date] = object[date]
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

export function printBigSchedule(){

    const year = getYear()
    const agendaJson = readJsonFile(`./src/data/${year}_agenda.json`)
    const containerAbs = document.getElementById('allContainerAbsences')

    let countCoursForZoomAgenda = 0;

    if(!agendaJson){
        const dayDiv = document.createElement("div")
        const dayDivTitle = document.createElement("h2")
        const dayDivInput = document.createElement("input")

        dayDiv.classList.add('marginAuto')
        dayDiv.classList.add('textCenter')
        dayDiv.style.width = "80%"
        dayDivTitle.classList.add('textCenter')
        dayDivTitle.classList.add('underline')

        dayDivInput.classList.add('marginAuto')
        dayDivInput.value = 'Rafraichir'
        dayDivInput.type = 'button'
        dayDivInput.setAttribute('onclick', `refreshSchedule()`);

        dayDivTitle.textContent = "Pas d'agenda enregistré en local, attendez le refresh d'internet"
        dayDiv.appendChild(dayDivTitle)
        dayDiv.appendChild(dayDivInput)
        containerAbs.innerHTML = ""
        containerAbs.appendChild(dayDiv)

        log('No local agenda')
        return false
    }


    let nextLessonDay = todayDate()[0]
    let day = todayDate()[1]
    let isLesson = false

    // Check if there is a lesson the next 5 days
    let printAgenda = []
    for (let i = 0; i < 7; i++) {
        nextLessonDay = todayDate(i)[0]
        day = todayDate(i)[1]
        if(agendaJson[nextLessonDay]){
            printAgenda.push(nextLessonDay)
            isLesson = true
        }
    }

    if(isLesson == false){

        
        const dayDivTitle = document.createElement("h2")
        dayDivTitle.classList.add('textCenter')
        dayDivTitle.classList.add('underline')
        log('No Lessons')
        dayDivTitle.textContent = "No lesson for the 7th next days"
        containerAbs.innerHTML = ""
        containerAbs.appendChild(dayDivTitle)
    }
    else{
        containerAbs.innerHTML = ""

        const reminder = readJsonFile(`./src/data/${year}_reminder.json`)

        for (let i = 0; i < printAgenda.length; i++) {

            const dayDiv = document.createElement("div")
            const dayDivTitle = document.createElement("h2")
            dayDiv.classList.add('marginAuto')
            dayDiv.style.width = "auto"
            dayDivTitle.classList.add('textCenter')
            dayDivTitle.classList.add('underline')
            
            // console.log(todayDate(i))
            // console.log(getDateInfo(printAgenda[i])[1])
            day = getDateInfo(printAgenda[i])[1]
            dayDivTitle.textContent = day + " " + printAgenda[i]
            dayDiv.appendChild(dayDivTitle)

            const cours = agendaJson[printAgenda[i]].cours
            const dailyReminder = reminder[printAgenda[i]]

            let numberEvent = 0
            if(dailyReminder){
                console.log(dailyReminder)
                for (const key in dailyReminder) {

                    numberEvent++

                    const lessonDiv = document.createElement("div")
                    const lessonHourDiv = document.createElement("h3")
                    const lessonContentDiv = document.createElement("div")
                    
                    lessonDiv.classList.add('lesson')
                    lessonDiv.classList.add('animatedBox')
                    lessonDiv.style.backgroundColor = dailyReminder[key].color
                    lessonDiv.style.maxHeight = "inherit"
                    
                    lessonHourDiv.classList.add('underline')
        
                    lessonDiv.appendChild(lessonHourDiv)
                    lessonDiv.appendChild(lessonContentDiv)
        
                    lessonHourDiv.textContent = key;
                    let tmp = ""

                    tmp = dailyReminder[key].description

                    lessonContentDiv.innerHTML = tmp
                
                    dayDiv.appendChild(lessonDiv)
                }
            }

            for (let j = 0; j < cours.length; j++) {
                const lessonDiv = document.createElement("div")
                const lessonHourDiv = document.createElement("h3")
                const lessonContentDiv = document.createElement("div")
                
                lessonDiv.classList.add('lesson')
                lessonDiv.classList.add('animatedBox')
                lessonDiv.setAttribute('onclick', `zoomAgenda(${countCoursForZoomAgenda+numberEvent})`);
                countCoursForZoomAgenda++
                lessonHourDiv.classList.add('underline')

                lessonDiv.appendChild(lessonHourDiv)
                lessonDiv.appendChild(lessonContentDiv)

                lessonHourDiv.textContent = cours[j].time;

                let salle = `(${cours[j].content.campus} : ${cours[j].content.room})`
                let tmp = ""
                if (cours[j].content.campus == "N/A" || cours[j].content.room == "N/A"){
                    tmp = `<div class="flex flexCenter wrap marginBottom10">
                    <span class="underline bold width100">${cours[j].content.name}</span><span class="bold width100">Salle : Non définie</span>
                    </div><br><br>
                    <span class="underline">Type</span> : ${cours[j].content.type}<br>
                    <span class="underline">Modalité</span> : ${cours[j].content.modality}<br>
                    <span class="underline">Professeur</span> : ${cours[j].content.teacher}<br>
                    <span class="underline">Classe</span> : ${cours[j].content.student_group_name}
                    `
                }
                else{
                    tmp = `<div class="flex flexCenter wrap marginBottom10">
                    <span class="underline bold width100">${cours[j].content.name}</span><span class="bold width100">${salle}</span>
                    </div><br><br>
                    <span class="underline">Type</span> : ${cours[j].content.type}<br>
                    <span class="underline">Modalité</span> : ${cours[j].content.modality}<br>
                    <span class="underline">Professeur</span> : ${cours[j].content.teacher}<br>
                    <span class="underline">Classe</span> : ${cours[j].content.student_group_name}
                    `
                }

                lessonContentDiv.innerHTML = tmp
                
                dayDiv.appendChild(lessonDiv)
            }
            containerAbs.appendChild(dayDiv)
        }
    }





}

// Read the local file and print it inside the software in schedule page
export function schedule(){
    refreshingSchedule()
    printBigSchedule()
}