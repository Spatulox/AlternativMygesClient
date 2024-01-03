/*
* Author : Spatulox
* Date : 11/11/2023
*
* Desc : The dashbords.js which print the dashboard page
*
*/

import { getYear, log, readJsonFile, todayDate } from "../modules/globalFunction.js"
import { refreshingSchedule } from "./schedule.js"
import { newGrades, refreshingGrades, createTableGrades, createHeadTableGrades } from "./grades.js"
import { refreshingAbsences, listFalseJustifiedAbsences, listJustifedAbsences } from "./absences.js"

// ------------------------SCHEDULE-------------------------- //

async function recapSchedule(){

    // Call the function wich update the schedule
    await printRecapSchedule()
    await refreshingSchedule()
    await printRecapSchedule()
    log('Recap Schedule loaded !')
    
}

// ---------------------------------------------------------- //

function printRecapSchedule(){
    const agenda = document.getElementById('currAgenda')
    const year = getYear()
    const agendaJson = readJsonFile(`./src/data/${year}_agenda.json`)

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
        agenda.innerHTML = ""
        agenda.appendChild(dayDiv)

        log('No local agenda')
        return false
    }

    let nextLessonDay = todayDate()[0]
    let day = todayDate()[1]
    let isLesson = false

    // Check if there is a lesson the next 5 days
    for (let i = 0; i < 5; i++) {
        nextLessonDay = todayDate(i)[0]
        day = todayDate(i)[1]
        if(agendaJson[nextLessonDay]){
            isLesson = true
            break
        }
        else{
            isLesson = false
        }
    }

    const dayDiv = document.createElement("div")
    const dayDivTitle = document.createElement("h2")
    dayDiv.classList.add('marginAuto')
    dayDiv.style.width = "80%"
    dayDivTitle.classList.add('textCenter')
    dayDivTitle.classList.add('underline')

    if(isLesson == false){
        log('No Lessons')
        dayDivTitle.textContent = "No lesson for the 5th next days"
        dayDiv.appendChild(dayDivTitle)
    }
    else{
        dayDivTitle.textContent = day + " " + nextLessonDay
        dayDiv.appendChild(dayDivTitle)

        const cours = agendaJson[nextLessonDay].cours
        for (let i = 0; i < cours.length; i++) {
            const lessonDiv = document.createElement("div")
            const lessonHourDiv = document.createElement("h3")
            const lessonContentDiv = document.createElement("div")
            
            lessonDiv.classList.add('lesson')
            lessonDiv.classList.add('animatedBox')
            lessonDiv.setAttribute('onclick', `zoomAgenda(${i})`);
            
            lessonHourDiv.classList.add('underline')

            lessonDiv.appendChild(lessonHourDiv)
            lessonDiv.appendChild(lessonContentDiv)

            lessonHourDiv.textContent = cours[i].time;
            const tmp = `<div class="flex flexCenter wrap marginBottom10">
                <span class="underline bold width100">${cours[i].content.name}</span><span class="bold width100">${cours[i].content.modality} (Erard 12)</span>
                </div><br><br>
                <span class="underline">Type</span> : ${cours[i].content.type}<br>
                <span class="underline">Professeur</span> : ${cours[i].content.teacher}<br>
                <span class="underline">Classe</span> : ${cours[i].content.student_group_name}
                `

            lessonContentDiv.innerHTML = tmp
            
            dayDiv.appendChild(lessonDiv)
        }
    }

    if(document.getElementById('currAgenda') !== null){
        agenda.innerHTML = ""
        agenda.appendChild(dayDiv)
    }
}

// ------------------------ABSENCES--------------------------- //

async function recapAbsences(){
    await printRecapAbsences()
    await refreshingAbsences()
    await printRecapAbsences()
    log('Recap Absences loaded !')
}

// ---------------------------------------------------------- //

function printRecapAbsences(){
    const recapAbsences = document.getElementById('recapAbsences')
    const year = getYear()
    const absencesJson = readJsonFile(`./src/data/${year}_absences.json`)



    if(!absencesJson){
        const absDiv = document.createElement("div")
        const absDivTitle = document.createElement("h2")
        const absDivInput = document.createElement("input")

        absDiv.classList.add('marginAuto')
        absDiv.classList.add('textCenter')
        absDiv.style.width = "80%"
        absDivTitle.classList.add('textCenter')
        absDivTitle.classList.add('underline')

        absDivInput.classList.add('marginAuto')
        absDivInput.value = 'Rafraichir'
        absDivInput.type = 'button'
        absDivInput.setAttribute('onclick', `refreshAbsences()`);

        absDivTitle.textContent = "Pas d'absences enregistrée en local, attendez le refresh d'internet"
        absDiv.appendChild(absDivTitle)
        absDiv.appendChild(absDivInput)
        recapAbsences.innerHTML = ""
        recapAbsences.appendChild(absDiv)

        log('No local absences')
        return false
    }
    
    // Detect False justification :
    const falseJust = listFalseJustifiedAbsences(absencesJson)
    //Only take the 3rd last absences
    const justifiedAbsences = listJustifedAbsences(absencesJson).slice(0, 3)

    const absDiv = document.createElement("div")
    const absDivTitle = document.createElement("h2")
    const absArrayDiv = document.createElement("div")

    // Create html array
    const htmlArray = document.createElement("table");
    var head = htmlArray.createTHead();
    var linehead = head.insertRow(0);

    var cellHead1 = document.createElement("th");
    cellHead1.appendChild(document.createTextNode("Date"));
    linehead.appendChild(cellHead1);

    var cellHead2 = document.createElement("th");
    cellHead2.appendChild(document.createTextNode("Heure"));
    linehead.appendChild(cellHead2);

    var cellHead3 = document.createElement("th");
    cellHead3.appendChild(document.createTextNode("Justifié"));
    linehead.appendChild(cellHead3);

    var cellHead4 = document.createElement("th");
    cellHead4.appendChild(document.createTextNode("Cours"));
    linehead.appendChild(cellHead4);
   

    absDiv.classList.add('marginAuto')
    absDiv.classList.add('textCenter')
    absDivTitle.classList.add('textCenter')
    absDivTitle.classList.add('underline')
    

    if(falseJust.length == 0 && justifiedAbsences.length == 0){
        absDivTitle.textContent = "Pas d'absences"
        absDiv.appendChild(absDivTitle)
        recapAbsences.innerHTML = ""
        recapAbsences.appendChild(absDiv)
        log('No absences')
        return
    }

    absDivTitle.textContent = "Absences"
    absDiv.appendChild(absDivTitle)

    if(falseJust.length != 0){

        // Création de l'en-tête du tableau
        // Création du corps du tableau
        let corps = htmlArray.createTBody();

        // Ajout des données au tableau
        for (let i = 0; i < falseJust.length; i++) {
            var ligne = corps.insertRow(i);
            var cell1 = ligne.insertCell(0);
            var cell2 = ligne.insertCell(1);
            var cell3 = ligne.insertCell(2);
            var cell4 = ligne.insertCell(3);
            cell1.innerHTML = falseJust[i].date;
            cell2.innerHTML = falseJust[i].time;
            cell3.innerHTML = falseJust[i].data.justified;
            cell3.style.color = "red"
            cell4.innerHTML = falseJust[i].data.course_name;
        }

        absArrayDiv.appendChild(htmlArray)
    }

    if(justifiedAbsences.length != 0){

        // Création de l'en-tête du tableau
        // Création du corps du tableau
        let corps = htmlArray.createTBody();

        // Ajout des données au tableau
        for (let i = 0; i < justifiedAbsences.length; i++) {
            var ligne = corps.insertRow(i);
            var cell1 = ligne.insertCell(0);
            var cell2 = ligne.insertCell(1);
            var cell3 = ligne.insertCell(2);
            var cell4 = ligne.insertCell(3);
            cell1.innerHTML = justifiedAbsences[i].date;
            cell2.innerHTML = justifiedAbsences[i].time;
            cell3.innerHTML = justifiedAbsences[i].data.justified;
            cell3.style.color = "green"
            cell4.innerHTML = justifiedAbsences[i].data.course_name;
        }

        absArrayDiv.appendChild(htmlArray)
    }

    if(document.getElementById('recapAbsences') !== null){
        absDiv.appendChild(absArrayDiv)
        recapAbsences.innerHTML = ""
        recapAbsences.appendChild(absDiv)
    }
}

// ------------------------GRADES---------------------------- //

async function recapGrades(){
    await printRecapGrades()
    await refreshingGrades()
    await printRecapGrades()
    log('Recap Grades loaded !')
}

// ---------------------------------------------------------- //

function printRecapGrades(){
    const recapGrades = document.getElementById('recapGrades')
    const year = getYear()
    let Grades = readJsonFile(`./src/data/${year}_grades.json`)

    if(!Grades){
        const gradesDiv = document.createElement("div")
        const gradesDivTitle = document.createElement("h2")
        const gradesDivInput = document.createElement("input")

        gradesDiv.classList.add('marginAuto')
        gradesDiv.classList.add('textCenter')
        gradesDiv.style.width = "80%"
        gradesDivTitle.classList.add('textCenter')
        gradesDivTitle.classList.add('underline')

        gradesDivInput.classList.add('marginAuto')
        gradesDivInput.value = 'Rafraichir'
        gradesDivInput.type = 'button'
        gradesDivInput.setAttribute('onclick', `refreshGrades()`);

        gradesDivTitle.textContent = "Pas de notes enregistrés en local, attendez le refresh d'internet"
        gradesDiv.appendChild(gradesDivTitle)
        gradesDiv.appendChild(gradesDivInput)
        recapGrades.innerHTML = ""
        recapGrades.appendChild(gradesDiv)

        log('No local grades')
        return false
    }
    else{

        let Grades = readJsonFile(`./src/data/${year}_grades.json`)

        const gradesDiv = document.createElement("div")
        const gradesDivTitle = document.createElement("h2")
        const gradesArrayDiv = document.createElement("div")

        let htmlAray = document.createElement("table");

        gradesDiv.classList.add('marginAuto')
        gradesDiv.classList.add('textCenter')
        gradesDivTitle.classList.add('textCenter')
        gradesDivTitle.classList.add('underline')

        gradesDivTitle.textContent = "Nouvelles Notes"
        
        // Count the max of grades
        let maxColumns = 1
        for (let i = 0; i < Grades.length; i++) {
            let newGradesVar = newGrades(Grades[i].course)

            if(!newGradesVar){
                gradesDivTitle.textContent = "Pas de nouvelles notes"
                gradesDiv.appendChild(gradesDivTitle)
                recapGrades.innerHTML = ""
                recapGrades.appendChild(gradesDiv);
                log('Creating table of grades aborded cause no lastGrade.json or grades.json')
                return false
            }
            if(newGradesVar.length > maxColumns){
                maxColumns = newGradesVar.length
            }
        }

        let thead = createHeadTableGrades(maxColumns)
        htmlAray.appendChild(thead);

        let tbody = createTableGrades(Grades, maxColumns)
        if(!tbody){
            log('Can\'t create the tableGrades cause there is no lastGrades.json nor grades.json')
            return false
        }

        htmlAray.appendChild(tbody);
        gradesArrayDiv.appendChild(htmlAray)

        gradesDiv.appendChild(gradesDivTitle)
        gradesDiv.appendChild(gradesArrayDiv)

        if(document.getElementById('recapGrades') !== null){
            recapGrades.innerHTML = ""
            recapGrades.appendChild(gradesDiv);
        }
          
    }
}

// ---------------------------------------------------------- //

export function dashboard(){
    recapSchedule()
    recapAbsences()
    recapGrades()
    
}