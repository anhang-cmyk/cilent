/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.js you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('variable', {
  platform: process.platform || os.platform()
});

contextBridge.exposeInMainWorld('renderingOnce', {
  log: (callback) => ipcRenderer.on('setLog', (_, data) => callback(data)),
  notify: (callback) => ipcRenderer.on('setNotify', (_, data) => callback(data)),
  mainGlobal: (callback) => ipcRenderer.on('sendGlobal', (_, data) => callback(data)),
  outPowerGrid: (callback) => ipcRenderer.on('outPowerGrid', (_, data) => callback(data)),
  loginedPowerGrid: (callback) => ipcRenderer.on('loginedPowerGrid', (_, data) => callback(data)),
})

contextBridge.exposeInMainWorld('renderingSend', {
  loginPowerGrid: () => ipcRenderer.send('creatLoginWindow'),
  taskCreatPage: (taskCode) => ipcRenderer.send('creatWindow', taskCode),
})
