const {contextBridge, ipcRenderer} = require('electron')


contextBridge.exposeInMainWorld('testAPI', {
    test: () => {
        console.log('Test API')
    },
    testRead: () => ipcRenderer.invoke('test'),
})