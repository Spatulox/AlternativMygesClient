import { app, BrowserWindow, Menu, screen  } from 'electron'
import { dirname } from 'path';
import path from 'path'
import { fileURLToPath } from 'url';
import { log } from './src/modules/globalFunction.cjs';
import { Client } from 'discord-rpc';
import config from './config.json' assert { type: 'json' };


// ------------------------------------------------------------------

const createWindow = async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    log("Creating Window")
    const { screenWidth, screenHeight } = screen.getPrimaryDisplay().workAreaSize;

    const win = new BrowserWindow({

      width: 1920*0.7,
      height: 1080*0.7,
      minWidth: 710,
      minHeight: 430,
      icon: './src/images/GES_logo.png',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true,
        preload: path.join(__dirname, "preload.mjs"),
        sandbox: false,
        allowRunningInsecureContent: true,/*,
        enableRemoteModule: true,*/
        webSecurity: false
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


// ------------------------------------------------------------------
// --- Rich Discord Presence part --- //

const rpc = new Client({ transport: 'ipc' })
const clientId = config.clientId
rpc.login({ clientId }).catch(console.error)

rpc.on('ready', () => {
    rpc.setActivity({
        details: 'Non official MyGes client',
        largeImageKey: 'ges_logo',
        largeImageText: 'GES_logo',
        //smallImageKey: 'nom_de_votre_image_petite',
        //smallImageText: 'Texte de survol de l\'image petite',
        buttons: [
            { label: 'Obtenez le logiciel', url: 'https://github.com/Spatulox/AlternativMygesClient/releases' }
          ],
        instance: false,
    });
});

rpc.on('error', (error) => {
    log(`ERROR : Impossible to connect the app to the discord RPC : ${error}`)
});
