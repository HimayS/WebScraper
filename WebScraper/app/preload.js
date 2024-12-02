const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    startPuppeteer: () => {
       
    },
    stopPuppeteer: () => ipcRenderer.send('stop-script'),
    onPuppeteerScriptEnded: (callback) => ipcRenderer.on('puppeteerScriptEnded', callback),

    stop: () => ipcRenderer.send('stop'),
    onScriptEnded: (callback) => ipcRenderer.on('ScriptEnded', callback),

});

contextBridge.exposeInMainWorld('databaseAPI', {
    updateStatus: () => ipcRenderer.send('update-Status'),
});

contextBridge.exposeInMainWorld('loginAPI', {
    login: async (username, password) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('login', username, password);
            ipcRenderer.once('login-reply', (event, data) => {
                if (data.success) {
                    resolve();
                } else {
                    reject(data.error);
                }
            });
        });
    }
});

contextBridge.exposeInMainWorld('logAPI', {
    onNewLog: (callback) => ipcRenderer.on('new-log', (event, log) => callback(log)),
});
