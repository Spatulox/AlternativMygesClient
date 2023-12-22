const gf = require('./globalFunction');

async function loadPage(string, event){
    const mainPart = document.getElementById("mainPart")
    const headerTitle = document.getElementById("headerTitle")

    console.log(gf.myFunction());

    console.log(__dirname);

    console.log(headerTitle)
    console.log(event)

    try {
        const response = await fetch("./src/"+string+".html")
        const data = await response.text()
        mainPart.innerHTML = data
    } catch (error) {
        console.log('ERROR : An error occured in loadPage function :', error);
    }

    try{
        headerTitle.innerHTML = event.target.innerHTML
    }
    catch{
        console.log('ERROR : Impossible to load the title')
    }   
}


module.exports = {
    loadPage
}