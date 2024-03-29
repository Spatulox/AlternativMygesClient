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

async function deleteOldData(){
    const { popup } = await import('../modules/popup.js')
    popup("Under contruction")
}

async function deconnectionFromMyges(){
    const { replaceValueJsonFile } = await import('../modules/globalFunction.js')
    replaceValueJsonFile('./src/data/infos.json', "login", "")
    replaceValueJsonFile('./src/data/infos.json', "password", "")
    loadPageH("cya")
    changeLoginPassword()
}
// ------------ Retrieve clicks event on all pages --------- //

// Waiting for clicks
document.addEventListener("DOMContentLoaded", async (event) => {

    // Functions
    const { replaceValueJsonFile, readJsonFile, writeJsonFile, log, getYear } = await import('../modules/globalFunction.js');
    const { popup } = await import('../modules/popup.js');


    // Html tags / etc...
    const lightDark = document.getElementById('theme');
    const body = document.getElementsByTagName('body')[0]
    const stillpopup = document.querySelector('#stillpopup > div');
    const popupVar = document.querySelector('#normalpopup > div');
    const buttonEula = document.getElementById('buttonEula')
    const buttonConnection = document.getElementById('buttonConnection')
    const buttonCancelConnection = document.getElementById('buttonCancelConnection')
    

    //---------------- Header events ---------------- //
    lightDark.addEventListener('click', function() {

        if(body.classList == 'light'){
            lightDark.src = "./src/images/black-moon.png"
            replaceValueJsonFile("./config.json", "theme", "dark")
        }
        else{
            lightDark.src = "./src/images/black-sun.png"
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
            loadPageH('dashboard')
        }
        else{
            log("Impossible to reach the infos.json file, creating it")
            data = {
                "login": username.value,
                "password": password.value
            }
            writeJsonFile("./src/data/", "infos.json", data)
            popup("Login et MdP sauvegardé !")
            loadPageH('dashboard')
        }
        //remove the things
        connection.classList.remove('active')

    })

    buttonCancelConnection.addEventListener('click', function() {
        const connection = document.getElementById('connection')
        connection.classList.remove("active")

    })
      



    //------------ document events -----------//
    // Used to close "zooms"/"detailled" elements
    // Use to open / close the new event tab on schedule.html

    document.addEventListener('click', function(e) {
        const lessons = document.querySelectorAll('.lesson');
        const lessonsArray = Array.from(lessons);
        const plusAddEvent = document.getElementById('plusAddEvent')
        const plusAddEventImg = document.getElementById('plusAddEventImg')
        const isClickInsideLesson = lessonsArray.some(lesson => lesson.contains(e.target));

        const validerEvent = document.getElementById('validerEvent')


        // Create an event
        if(e.target.id == validerEvent.id){
            const inputs = document.querySelectorAll('#plusAddEvent input');
            const textDesc = document.getElementsByTagName('textarea')[0];

            let inputDic = {}
            inputs.forEach((input, index) => {
                if (index < inputs.length - 1) {
                  inputDic[input.name] = input.value
                }
              });

            inputDic["description"] = textDesc.value
            
            // Check info format
            if(isNaN(new Date (inputDic.date))){
                popup("Il faut mettre une date valide")
                log("Wrong date format")
                return
            }

            if (new Date (inputDic.date) < new Date().setUTCDate(0,0,0,0)){
                popup('Impossible de créer un évènement avant aujourd\'hui')
                return
            }

            if(isNaN(parseInt(inputDic.hour)) || isNaN(parseInt(inputDic.minutes))){
                popup("Il faut mettre des nombres pour les heures et les minutes")
                log("Wrong hour and/or minutes format")
                return
            }

            // Refactor informations
            let tmp = inputDic.date.split('-')
            inputDic.date = tmp[2]+"/"+tmp[1]+"/"+tmp[0]
            //console.log(date)
            hour = inputDic.hour + ":" + inputDic.minutes + ":00"
            let color = inputDic.color
            let description = inputDic.description
            
            const template = {
                date: {
                    [hour]: {
                        color: color,
                        description: description
                    }
                }
            };

            // Check if already event exist and write informations
            const year = getYear()
            let data = readJsonFile(`./src/data/${year}_reminder.json`)
 
            if(!data){
                data = {}
                data[inputDic.date] = template.date
                writeJsonFile("./src/data/", `${year}_reminder.json`, data)
            }
            else{
                // If the same date already exist
                if(data.hasOwnProperty(inputDic.date)){

                    // If the same hour already exist
                    if(data[inputDic.date].hasOwnProperty(hour)){
                        popup('Vous avez déjà un évènement à cette date et heure')
                        return
                    }
                    
                    data[inputDic.date][hour] = template.date[hour]

                    // Sort by hour
                    let sortedData = {}

                    for (const date in data[inputDic.date]) {
                        const times = Object.keys(data[inputDic.date][date]).sort((a, b) => {
                            const timeA = new Date(`${date} ${a}`);
                            const timeB = new Date(`${date} ${b}`);
                            return timeA.getTime() - timeB.getTime();
                        });
        
                        sortedData[date] = {};
        
                        for (const time of times) {
                            sortedData[date][time] = data[inputDic.date][date][time];
                        }
                    }
        
                    data[inputDic.date] = {}

                    for (const key of Object.keys(sortedData).sort()) {
                        data[inputDic.date][key] = sortedData[key]
                    }
                    
                }
                else{
                    data[inputDic.date] = template.date
                }
                
                writeJsonFile("./src/data/", `${year}_reminder.json`, data)
                popup('Rappel enregistré !')
            }

            popup('Rappel enregistré !')

            // Close the popup to create event
            plusAddEvent.classList.remove('active')
            plusAddEventImg.src = "./src/images/plus_logo_noir.png"

            // Remove informations
            inputs.forEach((input, index) => {
                if (index < inputs.length - 1) {
                  input.value = ""
                }
              });
            textDesc.value = ""

            return

        }
    
        if (!isClickInsideLesson) {
            lessonsArray.forEach(lesson => {
                lesson.classList.remove('bigAgenda');
            });
        }

        try{
            if (e.target.closest('#plusAddEvent')) {
                // L'élément ou l'un de ses parents a l'id "plusAddEvent"
                plusAddEvent.classList.add('active')
                plusAddEventImg.src = "./src/images/GES_logo.png"
            } else {
                plusAddEvent.classList.remove('active')
                plusAddEventImg.src = "./src/images/plus_logo_noir.png"
                // L'élément n'a pas l'id "plusAddEvent" et n'a pas d'ancêtres avec cet id
            }
        }
        catch{
            console.log("No plusAddEvent tag")
        }       

    });
    
})