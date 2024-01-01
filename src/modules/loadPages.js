/*
* Author : Spatulox
* Date : 11/11/2023
*
* Desc : Get the pages and print it inside the index.html page
*
*/

import { log } from './globalFunction.js';
import { updatePages } from '../js/updatePages.js'

export async function loadPage(string, event = null){

    log(`Loading ${string} page`)

    const mainPart = document.getElementById("replace")
    const headerTitle = document.getElementById("headerTitle")

    try {
        const response = await fetch("./src/"+string+".html")
        const data = await response.text()
        mainPart.innerHTML = data

        updatePages(string)

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