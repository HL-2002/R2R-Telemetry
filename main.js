// App module controls the app's lifecycle
// BrowserWindow module creates and manages application windows
// OPTIMIZATION: Needs optimization with import instead of require()
const { app, BrowserWindow, ipcMain } = require('electron') 
const path = require('node:path')
const read = require('./functions/reader.js')
const {URL} = require('url')

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

// Function to test messaging between main and renderer processes
async function sendTest() {
    return read()
}

// Disable navigation to external URLs
app.on('web-contents-created', (event, contents) =>{
    contents.on('will-navigate', (event, navigationUrl) => {
        event.preventDefault()
    })
})

// Create new window when the app is ready
app.whenReady().then(() => {
    // Test two-way messaging between main and renderer processes
    ipcMain.handle('test', sendTest)
    // Create window
    createWindow()

    // Open window when none are active on MacOs
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

    // Test read API
    console.log(read())
})

// Quit app when windows are closed on Windows and Linux
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
