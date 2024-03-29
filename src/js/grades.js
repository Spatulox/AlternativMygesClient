import { getYear, log, readJsonFile, replaceValueJsonFile, writeJsonFile } from "../modules/globalFunction.js";
import { popup, stillPopup, stopStillPopup } from "../modules/popup.js";
import { checkXTimesInternetConnection } from "../modules/checkInternetCo.js";




// Retrieve the new grades :
export function newGrades(string = null, semester = 1)
{
    if(string == null){
        log('Specifie a course_name for newGrades function')
        return false
    }
    const year = getYear()
    
    let lastGrades = readJsonFile(`./src/data/${year}_lastGrades.json`)
    let Grades = readJsonFile(`./src/data/${year}_grades.json`)

    // Lack of one file
    if(!lastGrades){
        log('No lastGrade.json')
        if(Grades){
            writeJsonFile('./src/data/', `${year}_lastGrades.json`, Grades)
            lastGrades = Grades
        }
        else{
            return false
        }
        
    }

    if(!Grades){
        log('No grades.json')
        return false
    }

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

export function createHeadTableGrades(maxColumns){
    let thead = document.createElement("thead");
    let headerRow = document.createElement("tr");
    let matiereHeader = document.createElement("th");
    matiereHeader.appendChild(document.createTextNode("Matières"));
    headerRow.appendChild(matiereHeader)

    // Create the head of the table
    let coefHeader = document.createElement("th");
    coefHeader.appendChild(document.createTextNode("Coef"));
    headerRow.appendChild(coefHeader);
    for (let i = 1; i <= maxColumns; i++) {
        let noteHeader = document.createElement("th");
        noteHeader.appendChild(document.createTextNode("Nv Note " + i));
        headerRow.appendChild(noteHeader);
    }
    
    // Add the head of the table
    thead.appendChild(headerRow);
    return thead
}

export function createTableGrades(Grades, maxColumns, thing = null, semesterNum = "N/A"){
    let tbody = document.createElement("tbody");

    let newGradesVar = newGrades(Grades[0].course)
    console.log(newGradesVar)
    if(!newGradesVar){
        return false
    }

    let tmpSemester = 1
    // Auto detect the semester
    if(semesterNum === "N/A"){

        for (let i = 0; i < Grades.length; i++) {

            // Check if the second semester exist and have new grades
            if(Grades[i].trimester_name.includes("2")){

                let newGradesVar = newGrades(Grades[i].course)
                //console.log(Grades[i].course, newGradesVar)

                for (let i = 0; i < newGradesVar.length; i++) {
                    // Check for new grade (just an int)
                    // Reminder of possibilities :
                    //- Integer
                    //- String (no-new <grade>)
                    //- String (replaced <grade>)
                    if(typeof(newGradesVar[i]) == "number"){
                        tmpSemester = 2;
                    }
                }
            }
        }
        semesterNum = tmpSemester
    }

    // Create the html table
    for (let i = 0; i < Grades.length; i++) {

        // Create and fill the line
        // Need to fill only id there is new notes
        if(Grades[i].trimester_name.includes(semesterNum)){

            let newGradesVar = newGrades(Grades[i].course)
            //console.log(newGradesVar)
            if(!newGradesVar){
                return false
            }

            //console.log(newGradesVar)
            if(newGradesVar.length != 0){
                for (let j = 0; j < newGradesVar.length; j++) {
                    if(thing != "big"){
                        
                        //console.log(newGradesVar[j])
                        if(typeof(newGradesVar[j]) !== "string"){

                            var row = document.createElement("tr");
                            let cellMatiere = document.createElement("td");
                            cellMatiere.appendChild(document.createTextNode(Grades[i].course));
                            row.appendChild(cellMatiere);
                            

                            let cellCoef = document.createElement("td")
                            cellCoef.classList.add("bold")
                            cellCoef.appendChild(document.createTextNode(Grades[i].coef))
                            row.appendChild(cellCoef)
                        }
                        else if(typeof(note) === "string" && newGradesVar[j].includes('no new')){
                            var row = document.createElement("tr");
                            let cellMatiere = document.createElement("td");
                            cellMatiere.appendChild(document.createTextNode(Grades[i].course));
                            row.appendChild(cellMatiere);
                            

                            let cellCoef = document.createElement("td")
                            cellCoef.classList.add("bold")
                            cellCoef.appendChild(document.createTextNode(Grades[i].coef))
                            row.appendChild(cellCoef)
                        }
                        else if(typeof(newGradesVar[j]) === "string" && newGradesVar[j].includes('replaced')){
                            var row = document.createElement("tr");
                            let cellMatiere = document.createElement("td");
                            cellMatiere.appendChild(document.createTextNode(Grades[i].course));
                            row.appendChild(cellMatiere);
                            

                            let cellCoef = document.createElement("td")
                            cellCoef.classList.add("bold")
                            cellCoef.appendChild(document.createTextNode(Grades[i].coef))
                            row.appendChild(cellCoef)
                        }
                        else if(typeof(newGradesVar[i]) === "string" && !(newGradesVar[j].includes('no new'))){
                            
                            var row = document.createElement("tr");
                            let cellMatiere = document.createElement("td");
                            cellMatiere.appendChild(document.createTextNode(Grades[i].course));
                            row.appendChild(cellMatiere);
                            

                            let cellCoef = document.createElement("td")
                            cellCoef.classList.add("bold")
                            cellCoef.appendChild(document.createTextNode(Grades[i].coef))
                            row.appendChild(cellCoef)
                        }
                    }
                    else{
                        if(Grades[i].trimester_name == "Semestre "+ semesterNum){
                            var row = document.createElement("tr");
                            let cellMatiere = document.createElement("td");
                            cellMatiere.appendChild(document.createTextNode(Grades[i].course));
                            row.appendChild(cellMatiere);
                            

                            let cellCoef = document.createElement("td")
                            cellCoef.classList.add("bold")
                            cellCoef.appendChild(document.createTextNode(Grades[i].coef))
                            row.appendChild(cellCoef)
                        }
                    }
                }
            }

            // Fill the grades
            newGradesVar.forEach(note => {
                
                if(typeof(note) === "string" && note.includes('replaced')){
                    let cellNote = document.createElement("td")
                    let span = document.createElement("span")

                    note = note.split(' - ')[1]
                    span.style.color = "orange"

                    span.appendChild(document.createTextNode(note))
                    cellNote.appendChild(span)
                    row.appendChild(cellNote)

                }
                else if(typeof(note) === "string" && note.includes('no new') && thing == "big"){
                    let cellNote = document.createElement("td")
                    let span = document.createElement("span")
                    
                    note = note.split(' - ')[1]
                    span.style.color = "black"

                    span.appendChild(document.createTextNode(note))
                    cellNote.appendChild(span)
                    row.appendChild(cellNote)
                }
                else if(typeof(note) === "number"){
                    let cellNote = document.createElement("td")
                    let span = document.createElement("span")

                    span.style.color = "green"

                    span.appendChild(document.createTextNode(note))
                    cellNote.appendChild(span)
                    row.appendChild(cellNote)
                }

            })
            
            if(row){
                let cellCount = row.getElementsByTagName("td").length;
                // +2 because courses_name and coef
                for (let j = cellCount; j < maxColumns+2; j++) {
                    let cellEmpty = document.createElement("td");
                    cellEmpty.appendChild(document.createTextNode(""));
                    row.appendChild(cellEmpty);
                }

                tbody.appendChild(row);
            }
        }

    }

    return tbody
}
// Get schedule from myges website

// This function exist to avoid to forget a replaceValueJsonFile when doing a retur inside the refreshingGrades1()
export async function refreshingGrades(){
    
    // Check if there's already a check
    const tmp = readJsonFile('./config.json')
  
    if(tmp.pendingGrades == "true"){
        log('There is already a refreching Grades')
        return
    }

    replaceValueJsonFile('./config.json', "pendingGrades", "true")
    try{
        await refreshingGrades1()
    }
    catch{
        log('Error when refreshingGrades1()')
    }
    
    replaceValueJsonFile('./config.json', "pendingGrades", "false")
}

async function refreshingGrades1(){
    const { fork } = require('child_process')

    stillPopup('Checking internet')

    //let tmp = 
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

    const forked = fork('./src/modules/retrieveGrades.js');

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

    let { lastMsg, object } = waitForChildMessage;
    lastMsg += ""
    popup(lastMsg);
    log(lastMsg);
    
    
    // Write the file
    let date = new Date()
	let year = date.getFullYear();
    let Grades = readJsonFile(`./src/data/${year}_grades.json`)

    if (JSON.stringify(Grades) != JSON.stringify(object)){
        await writeJsonFile(`./src/data`, `${year}_lastGrades.json`, Grades)
        await writeJsonFile(`./src/data`, `${year}_grades.json`, object)
    }
    else{
        log("No new grades")
    }


    stopStillPopup()
}


function printBigGrades(){
    
    const year = getYear()
    let Grades = readJsonFile(`./src/data/${year}_grades.json`)

    let semester1ID = document.getElementById('semester1')
    let semester2ID = document.getElementById('semester2')
    semester1.innerHTML = "Something went wrong"
    semester2.innerHTML = "Something went wrong"

    if(!Grades){
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
        dayDivInput.setAttribute('onclick', `refreshGrades()`);

        dayDivTitle.textContent = "Pas de notes enregistrées en local, attendez le refresh d'internet"
        dayDiv.appendChild(dayDivTitle)
        dayDiv.appendChild(dayDivInput)
        semester1.innerHTML = ""
        semester1.appendChild(dayDiv)

        semester2.remove()

        log('No local grades')
        return false
    }


    let maxColumnsSem1 = 1
    let maxColumnsSem2 = 1
    for (let i = 0; i < Grades.length; i++) {
        let newGradesVar = newGrades(Grades[i].course)

        if(Grades[i].trimester_name.includes(1)){
            if(newGradesVar.length > maxColumnsSem1){
                maxColumnsSem1 = newGradesVar.length
            }
        }
        else if(Grades[i].trimester_name.includes(2)){
            if(newGradesVar.length > maxColumnsSem2){
                maxColumnsSem2 = newGradesVar.length
            }
        }
    }


    // Semester 1

    semester1.innerHTML = ""
    let htmlAray = document.createElement("table");
    

    let tbody = createTableGrades(Grades, maxColumnsSem1, "big", 1)
    if(!tbody){
        log('Can\'t create the tableGrades cause there is no lastGrades.json nor grades.json')
        return false
    }
    

    if (tbody.innerHTML === "") {
        log('Tbody empty for Semester 2')
    }
    else{
        let thead = createHeadTableGrades(maxColumnsSem1)
        htmlAray.appendChild(thead);
        
        htmlAray.appendChild(tbody);

        let title = document.createElement("h1")
        title.innerHTML = "Semestre 1"
        semester1ID.appendChild(title)
        semester1ID.appendChild(htmlAray);
    }

    //Semester 2

    semester2.innerHTML = ""
    htmlAray = document.createElement("table");
    
    tbody = null
    tbody = createTableGrades(Grades, maxColumnsSem2, "big", 2)
    if(!tbody){
        log('Can\'t create the tableGrades cause there is no lastGrades.json nor grades.json')
        return false
    }
    if (tbody.innerHTML === "") {
        log('Tbody empty for Semester 2')
    }
    else{
        let thead = createHeadTableGrades(maxColumnsSem2)
        htmlAray.appendChild(thead);

        htmlAray.appendChild(tbody);

        let title = document.createElement("h1")
        title.innerHTML = "Semestre 2"
        semester2ID.appendChild(title)
        semester2ID.appendChild(htmlAray);

        let tmp = document.createElement('hr')
        semester2ID.appendChild(tmp)
    }
}
// Read the local file and print it inside the software in grades page
export function grades(){
    refreshingGrades()
    printBigGrades()
}