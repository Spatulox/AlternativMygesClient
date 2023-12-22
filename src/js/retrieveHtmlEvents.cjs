async function loadPageH(string, event){
    console.log(string, event)
    const { loadPage } = await import('../modules/loadPages.js');
    loadPage(string, event)
}