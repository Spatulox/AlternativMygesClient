
// Functions called inside the html
async function loadPageH(string, event){
    const { loadPage } = await import('../modules/loadPages.js');
    loadPage(string, event)
}


// Waiting clicks

//window.onload = function() {
document.addEventListener("DOMContentLoaded", (event) => {
    const lightDark = document.getElementById('theme');
    const body = document.getElementsByTagName('body')[0]
    const stillpopup = document.querySelector('#stillpopup > div');
    let popup = document.querySelector('#normalpopup > div');
    
    lightDark.addEventListener('click', function() {

        if(body.classList == 'light'){
            lightDark.src = "./src/images/black-sun.png"
        }
        else{
            lightDark.src = "./src/images/black-moon.png"
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

})