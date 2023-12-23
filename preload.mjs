import { loadPage } from "./src/modules/loadPages.js";
import { log } from "./src/modules/globalFunction.js";

document.addEventListener("DOMContentLoaded", (event) => {
    log('Main Page loaded')
    loadPage('dashboard');

});