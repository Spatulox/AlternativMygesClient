import { loadPage } from "./src/modules/loadPages.js";
import { log, readJsonFile } from "./src/modules/globalFunction.js";

document.addEventListener("DOMContentLoaded", (event) => {
    // Check if there is a registered user
    const user = readJsonFile("./src/data/infos.json");
    const config = readJsonFile("./config.json")

    if(!user){
        log("Y'a pas d'utilisateur")
    }

    if(!config.eula || config.eula == "false")
    {
        const eula = document.getElementById('eula')
        eula.classList.add('active')
    }




    // Check the rest of things like the saved theme
    const theme = document.getElementsByTagName('body')[0]
    const themeImg = document.getElementById('theme')

    // Retrieve the saved theme inside the config.json
    const savedTheme = readJsonFile("./config.json");
    theme.classList = savedTheme.theme

    if(theme.classList == 'light'){
        themeImg.src = './src/images/black-moon.png'
    }
    else{
        themeImg.src = './src/images/black-sun.png'
    }

    log('Main Page loaded')
    loadPage('dashboard');

});