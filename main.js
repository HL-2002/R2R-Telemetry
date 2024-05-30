// App module controls the app's lifecycle
// BrowserWindow module creates and manages application windows
const { app, BrowserWindow } = require('electron')

// Function to create a new window
function createWindow () {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
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
})

// Quit app when windows are closed on Windows and Linux
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})