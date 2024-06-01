import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { exec } from 'child_process';
import { exec as sudo_exec } from 'sudo-prompt';
import { join } from 'path';


const MODE = process.env['NODE_ENV'] === undefined || process.env['NODE_ENV'] === 'dev' ? 'development' : 'production';
const OPEN_DEV_TOOLS = MODE === 'development';

function createWindow() {
    const options: Electron.BrowserWindowConstructorOptions = {
      width: 600 + (OPEN_DEV_TOOLS ? 600 : 0),
      height: 800,
      show: false,
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true
      },
      icon: join(__dirname, '/../public/logo-256x256.png')
    };
  
    const mainWindow = new BrowserWindow(options);
  
    if (MODE === 'development') {
      mainWindow.loadURL("http://localhost:4200");
    } else {
      mainWindow.loadFile('dist/browser/index.html');
      mainWindow.removeMenu();
    }
  
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
      if (OPEN_DEV_TOOLS){
        mainWindow.webContents.openDevTools({
          title: 'ISCSI-Manager DevTools',
          mode: 'right',
          activate: true
        });
      } 
    });

    mainWindow.on('closed', () => {
      app.quit();
      process.exit(0);
    });
  }
  
  app.whenReady().then(async () => {
    createWindow();
  });
  
  app.on('web-contents-created', (_, contents) => {
  
    contents.setWindowOpenHandler(({ url }) => {
      setImmediate(() => {
        shell.openExternal(url);
      });
      return { action: 'deny' };
    });
  });

  ipcMain.handle('run-shell', async (_, command) => {
  
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        resolve(stdout ? stdout : stderr);
      });
    });
  });
  

  // run sudo command
    ipcMain.handle('run-sudo', async (_, command) => {
    
        return new Promise((resolve, reject) => {
            sudo_exec(command, {name: 'ISCSI Manager'}, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            resolve(stdout ? stdout : stderr);
            });
        });
    });