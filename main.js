const { app, BrowserWindow, Menu, screen  } = require('electron')
const path = require('path');


const createWindow = () => {
    const { screenWidth, screenHeight } = screen.getPrimaryDisplay().workAreaSize;

    const win = new BrowserWindow({

      width: 1920*0.7,
      height: 1080*0.7,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true,
        preload: path.join(__dirname, "./src/js/preload.js"),
      },
    })
    
    win.setTitle('Nom de votre application')
    win.loadFile('index.html')
    win.webContents.openDevTools()
    Menu.setApplicationMenu(null)
}


app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0){
            createWindow()
        }
    })
})


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin'){
        app.quit()
    }
})