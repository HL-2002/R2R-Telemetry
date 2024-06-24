import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import read from './reader.js'
import sessionModel from './models/session.js'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Disable navigation to external URLs and new windows
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    event.preventDefault()
  })

  contents.setWindowOpenHandler(({ url }) => {
    return { action: 'deny' }
  })
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC handler for reading data
  ipcMain.handle('read', readData)
  ipcMain.handle('log', logData)
  ipcMain.handle('init', initDataLog)

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Only reads and returns the data
async function readData() {
  let entries = await read()

  return entries
}

// Initializes the data log at session creation
async function initDataLog() {
  let entries = await read()
  // TODO: Do things with the data before sending it

  return entries
}

// Reads and logs the data before returning it
async function logData() {
  let entries = await read()
  // TODO: Do things with the data before sending it

  return entries
}

async function getAllsessions() {
  return (await sessionModel.readALL()).rows
}

ipcMain.handle('getAllsessions', getAllsessions)
ipcMain.handle('getSession', async (event, id) => {
  return (await sessionModel.read(id)).rows[0]
})

ipcMain.on('deleteSession', async (event, id) => {
  await sessionModel.remove(id)
})

ipcMain.handle('CreateSession', async (event, sessionInfo) => {
  const date = new Date().toLocaleDateString()
  const currentTime = new Date()
  const hours = currentTime.getHours().toString().padStart(2, '0')
  const minutes = currentTime.getMinutes().toString().padStart(2, '0')
  const formattedTime = `${hours}:${minutes}`

  const name = sessionInfo.name || `Sesión ${minutes}`

  const Session = {
    description: name,
    type: sessionInfo.type,
    date,
    time: formattedTime,
    cedula: sessionInfo.cedula
  }

  const rs = await sessionModel.create(Session)
  return { id: rs.lastInsertRowid, ...Session }
})
