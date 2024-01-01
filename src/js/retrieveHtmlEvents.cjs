/*
* Author : Spatulox
* Date : 12/11/2023
*
* Desc : Functions called by the html files
*
*/


async function loadPageH(string, event){
    const { loadPage } = await import('../modules/loadPages.js');
    loadPage(string, event)
}

// --------- Retrieve onclicks functions on dashboard page ------- //
function zoomAgenda(e){
    const element = document.querySelectorAll('.lesson');
    element.forEach(lesson => {
        lesson.classList.remove('bigAgenda');
    });
    
    element[e].classList.add('bigAgenda')
}

async function refreshSchedule(){
    const { refreshingSchedule } = await import('../js/schedule.js')
    refreshingSchedule()
}

async function refreshAbsences(){
    const { refreshingAbsences } = await import('../js/absences.js')
    refreshingAbsences()
}

async function refreshGrades(){
    const { refreshingGrades } = await import('../js/grades.js')
    refreshingGrades()
}

async function eulaShow(){
    const eula = document.getElementById('eula')
    eula.classList.add('active')
}

async function changeLoginPassword(){
    //const eula = document.getElementById('eula')
    const connection = document.getElementById('connection')
    connection.classList.add('active')
}

// ------------ Retrieve clicks event on all pages --------- //

// Waiting for clicks
document.addEventListener("DOMContentLoaded", async (event) => {

    // Functions
    const { replaceValueJsonFile, readJsonFile, writeJsonFile, log } = await import('../modules/globalFunction.js');
    const { popup } = await import('../modules/popup.js');


    // Html tags / etc...
    const lightDark = document.getElementById('theme');
    const body = document.getElementsByTagName('body')[0]
    const stillpopup = document.querySelector('#stillpopup > div');
    const popupVar = document.querySelector('#normalpopup > div');
    const buttonEula = document.getElementById('buttonEula')
    const buttonConnection = document.getElementById('buttonConnection')
    

    //---------------- Header events ---------------- //
    lightDark.addEventListener('click', function() {

        if(body.classList == 'light'){
            lightDark.src = "./src/images/black-sun.png"
            replaceValueJsonFile("./config.json", "theme", "dark")
        }
        else{
            lightDark.src = "./src/images/black-moon.png"
            replaceValueJsonFile("./config.json", "theme", "light")
        }

        body.classList.toggle('light')
        body.classList.toggle('dark')

    });


    // ------------ Popup events -------------- //
    stillpopup.addEventListener('click', function() {
        stillpopup.classList.remove("active")
    })

    popupVar.addEventListener('click', function() {
        popupVar.classList.remove("active")
    })

    // ------------ Utilitites events -------------- //
    buttonEula.addEventListener('click', function() {
        const eula = document.getElementById('eula')
        replaceValueJsonFile('./config.json', "eula", "true")
        eula.classList.remove('active')
    })

    buttonConnection.addEventListener('click', function() {
        const connection = document.getElementById('connection')
        const username = document.getElementById('username')
        const password = document.getElementById('password')

        if(username.value == ""){
            popup("Veuillez renseigner le nom d'utilisateur")
            return
        }

        if(password.value == ""){
            popup("Veuillez renseigner un mot de passe")
            return
        }

        // Test if the connection is etablished with myges

        // Check if there is already a infos.json file to avoid overwriting some others datas
        const infos = readJsonFile("./src/data/infos.json")
        if(infos){
            infos.login = username.value
            infos.password = password.value
            writeJsonFile("./src/data/", "infos.json", infos)
            popup("Login et MdP sauvegardé !")
        }
        else{
            log("Impossible to reach the infos.json file, creating it")
            data = {
                "login": username.value,
                "password": password.value
            }
            writeJsonFile("./src/data/", "infos.json", data)
        }
        //remove the things
        connection.classList.remove('active')

    })




    //------------ document events -----------//
    // Used to close "zooms"/"detailled" elements

    document.addEventListener('click', function(e) {
        const lessons = document.querySelectorAll('.lesson');
        const lessonsArray = Array.from(lessons);
    
        const isClickInsideLesson = lessonsArray.some(lesson => lesson.contains(e.target));
    
        if (!isClickInsideLesson) {
            lessonsArray.forEach(lesson => {
                lesson.classList.remove('bigAgenda');
            });
        }
    });
    
})