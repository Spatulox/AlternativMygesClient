
// Functions called inside the html
async function loadPageH(string, event){
    const { loadPage } = await import('../modules/loadPages.js');
    loadPage(string, event)
}


// Waiting for clicks
document.addEventListener("DOMContentLoaded", async (event) => {

    // Functions
    const { replaceValueJsonFile } = await import('../modules/globalFunction.js');


    // Html tags / etc...
    const lightDark = document.getElementById('theme');
    const body = document.getElementsByTagName('body')[0]
    const stillpopup = document.querySelector('#stillpopup > div');
    const popup = document.querySelector('#normalpopup > div');
    const buttonEula = document.getElementById('buttonEula')
    
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

    stillpopup.addEventListener('click', function() {
        stillpopup.classList.remove("active")
    })

    popup.addEventListener('click', function() {
        popup.classList.remove("active")
    })

    buttonEula.addEventListener('click', function() {
        const eula = document.getElementById('eula')
        replaceValueJsonFile('./config.json', "eula", "true")
        eula.classList.remove('active')
    })

})