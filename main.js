import { app, BrowserWindow, Menu, screen  } from 'electron'
import { dirname } from 'path';
import path from 'path'
import { fileURLToPath } from 'url';
import { log } from './src/modules/globalFunction.cjs';


// ------------------------------------------------------------------

const createWindow = async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    log("Creating Window")
    const { screenWidth, screenHeight } = screen.getPrimaryDisplay().workAreaSize;

    const win = new BrowserWindow({

      width: 1920*0.7,
      height: 1080*0.7,
      icon: './src/images/GES_logo.png',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true,
        preload: path.join(__dirname, "preload.mjs"),
        sandbox: false
      },
    })
    
    win.setTitle('MyGes Alternative Client')
    win.loadFile('index.html')
    win.webContents.openDevTools()
    Menu.setApplicationMenu(null)
}


app.whenReady().then(async () => {
    log("-------------------")
    log("Electron loaded")
    createWindow()
  
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0){
            createWindow()
        }
    })
})


app.on('window-all-closed', async () => {
    if (process.platform !== 'darwin'){
        app.quit()
    }
    log("Window closed")
})