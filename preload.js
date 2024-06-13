const {contextBridge} = require('electron')
contextBridge.exposeInMainWorld('testAPI', {
    test: () => {
        console.log('Test API')
    },
})