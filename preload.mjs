/*
* Author : Spatulox
* Date : 11/11/2023
*
* Desc : The preload.js file which check and reset some data
*
*/

import { loadPage } from "./src/modules/loadPages.js";
import { log, readJsonFile, writeJsonFile, replaceValueJsonFile } from "./src/modules/globalFunction.js";
import fs from 'fs'

document.addEventListener("DOMContentLoaded", (event) => {
    const config = readJsonFile("./config.json")
    const user = readJsonFile("./src/data/infos.json");

    // Check if folders exist
    if (!fs.existsSync('src')) {
        fs.mkdirSync('src');
      
        // Créer les sous-dossiers
        fs.mkdirSync('src/data');
    }


    // Create the file is not exist
    if(!config){
        writeJsonFile(".", "config.json", {
            "eula": "",
            "theme": "",
            "pendingSchedule":"false",
            "pendingAbsences":"false",
            "pendingGrades":"false",
            "clientId":"1196836862447329351"
          })
    }
    else{
        replaceValueJsonFile('./config.json', 'pendingSchedule', "false")
        replaceValueJsonFile('./config.json', 'pendingAbsences', "false")
        replaceValueJsonFile('./config.json', 'pendingGrades', "false")
    }

    // Check if there is a registered user
    if(!user.login || !user.password){
        log("No users registered, or can't acces to the data.")
        const connection = document.getElementById('connection')
        connection.classList.add('active')

    }

    // Check if the eula is accepted
    if(!config.eula || config.eula == "false")
    {
        const eula = document.getElementById('eula')
        eula.classList.add('active')
    }

    // Apply the theme
    const theme = document.getElementsByTagName('body')[0]
    const themeImg = document.getElementById('theme')
    if(config.theme){
        theme.classList = config.theme
    }

    if(theme.classList == 'light'){
        themeImg.src = './src/images/black-sun.png'
    }
    else{
        themeImg.src = './src/images/black-moon.png'
    }


    // Load the main page
    log('Main Page loaded')
    loadPage('dashboard');

});