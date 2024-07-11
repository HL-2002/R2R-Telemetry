import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'

import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import read from './reader.js'
import { fs } from 'node:fs/promises'

// imports models of db
import sessionModel from './models/session.js'
import runModel from './models/run.js'
import entryModel from './models/entry.js'

// Min size
const winWidth = 900
const winHeight = 750

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false
    }
  })

  mainWindow.setMinimumSize(winWidth, winHeight)

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
  contents.on('will-navigate', (event) => {
    event.preventDefault()
  })

  contents.setWindowOpenHandler(() => {
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
  ipcMain.handle('selectPath', async () => {
    return dialog.showOpenDialog({ properties: ['openDirectory'] })
  })

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
async function readData(event, args) {
  let entries = await read()
  addEntries(entries, args)

  return entries
}

// Reads and logs the data before returning it
async function logData(event, args) {
  let entries = await read()
  addEntries(entries, args)

  try {
    if (args.run_id) {
      //  the args time, distance and acceleration, will be change make this henry xdd
      await entryModel.create({
        ...entries,
        run_id: args.run_id
      })
    }
    return entries
  } catch (e) {
    console.log(e)
    return { error: 'RunNotFound' }
  }
}

function addEntries(entries, args) {
  // Add time and distance to entries
  entries.time = (Date.now() - args.now) / 1000 // ms to seconds

  let speed = (entries.velocity * 1e3) / 3600 // km/h to m/s
  let dt = args.frequency / 1000 // ms to seconds

  // Distance as the Riemman sum of the speed times the interval of given speed
  entries.distance = speed * dt + args.prev_distance
}

async function getAllsessions() {
  return (await sessionModel.readALL()).rows
}


// HANDLE EVENTS FROM RENDERER
ipcMain.handle('export', async (event, {entries, path, name}) => {
  // Get headers
  console.log(path)
})

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
    time: formattedTime
  }
  try {
    const rs = await sessionModel.create(Session)
    return { id: rs.lastInsertRowid, ...Session }
  } catch (e) {
    return { error: 'CedulaNotFound' }
  }
})

ipcMain.handle('CreateRun', async (event, runInfo) => {
  // hour format: 'HH:MM'
  const currentTime = new Date()
  const hours = currentTime.getHours().toString().padStart(2, '0')
  const minutes = currentTime.getMinutes().toString().padStart(2, '0')
  const hour = `${hours}:${minutes}`

  const Run = {
    duration: 0,
    hour,
    session_id: runInfo.session_id
  }

  try {
    const rs = await runModel.create(Run)
    return { id: rs.lastInsertRowid, ...Run }
  } catch (e) {
    return { error: 'SessionNotFound' }
  }
})

ipcMain.handle('UpdateRun', async (event, runInfo) => {
  const Run = {
    id: runInfo.id,
    duration: runInfo.duration,
    hour: runInfo.hour
  }

  try {
    await runModel.updateRunDuration(Run.id, Run.duration)
    return Run
  } catch (e) {
    console.log(e)
    return { error: 'RunNotFound' }
  }
})

ipcMain.handle('getRunBySession', async (event, session_id) => {
  return (await runModel.getRunBySession(session_id)).rows
})

ipcMain.handle('getEntryByRun', async (event, run_id) => {
  return (await entryModel.getEntryByRunId(run_id)).rows
})
