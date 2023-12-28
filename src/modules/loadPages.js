import { log } from './globalFunction.js';
import { stillPopup, popup } from './popup.js'

export async function loadPage(string, event = null){

    log(`Loading ${string} page`)
    popup(`Loading ${string} page`)

    const mainPart = document.getElementById("replace")
    const headerTitle = document.getElementById("headerTitle")

    try {
        const response = await fetch("./src/"+string+".html")
        const data = await response.text()
        mainPart.innerHTML = data
    } catch{
        log("ERROR : An error occured in the loadPage function")
    }

    if (event != null){
        try{
            headerTitle.innerHTML = event.target.innerHTML
        }
        catch{
            log("ERROR : Impossible to load the title")
        }   
    }
}