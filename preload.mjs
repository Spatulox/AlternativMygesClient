import { loadPage } from "./src/modules/loadPages.js";
import { log } from "./src/modules/globalFunction.js";

document.addEventListener("DOMContentLoaded", (event) => {
    const theme = document.getElementsByTagName('body')[0]
    const themeImg = document.getElementById('theme')

    if(theme.classList == 'light'){
        themeImg.src = './src/images/black-moon.png'
    }
    else{
        themeImg.src = './src/images/black-sun.png'
    }

    log('Main Page loaded')
    loadPage('dashboard');

});