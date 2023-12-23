import { app, BrowserWindow, Menu, screen  } from 'electron'
import { dirname } from 'path';
import path from 'path'
import { fileURLToPath } from 'url';

// ------------------------------------------------------------------

const createWindow = () => {
    const { screenWidth, screenHeight } = screen.getPrimaryDisplay().workAreaSize;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const win = new BrowserWindow({

      width: 1920*0.7,
      height: 1080*0.7,
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