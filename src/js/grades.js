import { getYear, log, readJsonFile, replaceValueJsonFile, writeJsonFile } from "../modules/globalFunction.js";
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

    // Lack of one file
    if(!lastGrades){
        log('No lastGrade.json')
        return false
    }

    if(!Grades){
        log('No grades.json')
        return false
    }

    // The file are the same
    if(JSON.stringify(Grades) == JSON.stringify(lastGrades)){
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

export function createTableGrades(Grades, maxColumns, thing = null){
    let tbody = document.createElement("tbody");

    let newGradesVar = newGrades(Grades[0].course)
    if(!newGradesVar){
        return false
    }

    // Create the html table
    for (let i = 0; i < Grades.length; i++) {

        // Create and fill the line
        // Need to fill only id there is new notes
        let newGradesVar = newGrades(Grades[i].course)
        if(!newGradesVar){
            return false
        }

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
                console.log(msg)
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

// Read the local file and print it inside the software in grades page
export function grades(){
    refreshingGrades()
}