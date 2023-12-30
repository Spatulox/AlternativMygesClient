export function stillPopup(string){
    let stillpopup = document.querySelector('#stillpopup > div');
    stillpopup.innerHTML = `<img src="./src/images/circle-loading.gif" alt="loading circle">${string}`
    stillpopup.classList.add("active")
}

export function stopStillPopup(){
    let stillpopup = document.querySelector('#stillpopup > div');
    stillpopup.classList.remove("active")
}


export function popup(string){

    let popup = document.querySelector('#normalpopup > div');
    
    popup.classList.remove("active")
    popup.innerHTML = string
    popup.classList.add("active")
    //console.log(string)

    setTimeout(() =>{
        popup.classList.remove("active")
    }, 5000)
}