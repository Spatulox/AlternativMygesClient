async function loadPage(string){
    const mainPart = document.getElementById("mainPart")

    try {
        const response = await fetch("./src/"+string+".html")
        const data = await response.text()
        mainPart.innerHTML = data
    } catch (error) {
        console.log('Une erreur est survenue :', error);
    }
}


module.exports = {
    loadPage
}