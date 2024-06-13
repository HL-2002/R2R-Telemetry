// App module controls the app's lifecycle
// BrowserWindow module creates and manages application windows
// OPTIMIZATION: Needs optimization with import instead of require()
const { app, BrowserWindow, ipcMain } = require('electron') 
const path = require('node:path')
const read = require('./functions/reader.js')

// Function to create a new window
function createWindow () {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
    }
  })

  window.loadFile('front/index.html')
}

// Create new window when the app is ready
app.whenReady().then(() => {
    createWindow()

    // Open window when none are active on MacOs
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

    // Test log
    console.log("Hello from main.js")

    // Test read API
    console.log(read())
})

// Quit app when windows are closed on Windows and Linux
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// Test messaging between main and renderer processes
// Main to Renderer