import { loadPage } from "./src/modules/loadPages.js";
import { log, readJsonFile, writeJsonFile, replaceValueJsonFile } from "./src/modules/globalFunction.js";

document.addEventListener("DOMContentLoaded", (event) => {
    const config = readJsonFile("./config.json")
    const user = readJsonFile("./src/data/infos.json");

    // Create the file is not exist
    if(!config){
        writeJsonFile(".", "config.json", {"theme":"","eula":""})
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
        themeImg.src = './src/images/black-moon.png'
    }
    else{
        themeImg.src = './src/images/black-sun.png'
    }


    // Load the main page
    log('Main Page loaded')
    loadPage('dashboard');

});