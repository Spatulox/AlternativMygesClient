async function loadPageH(string, event){
    const { loadPage } = await import('../modules/loadPages.js');
    loadPage(string, event)
}