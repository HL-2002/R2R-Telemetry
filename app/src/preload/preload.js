import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getAllSessions: () => ipcRenderer.invoke('getAllsessions'),
  getSession: (id) => ipcRenderer.invoke('getSession', id),
  deleteSession: (id) => ipcRenderer.send('deleteSession', id),
  CreateSession: (sessionInfo) => ipcRenderer.invoke('CreateSession', sessionInfo)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('readAPI', {
      readData: () => ipcRenderer.invoke('read'),
      logData: () => ipcRenderer.invoke('log'),
      initDataLog: () => ipcRenderer.invoke('init')
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
