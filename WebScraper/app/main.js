const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const fs = require('fs');
const path = require('path');

const { runPuppeteer } = require('../src/index');

// Define the directory where logs will be stored
const logsDir = path.resolve('logs');

// Function to get the current date formatted as YYYY-MM-DD
function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Ensure that the logs directory exists, if not, create it
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Generate the log file name based on the current date
const logFileName = `${getFormattedDate()}.log`;
const logFilePath = path.join(logsDir, logFileName);

// Check if the log file exists
const fileExists = fs.existsSync(logFilePath);
// If the file doesn't exist, create it
if (!fileExists) {
    fs.writeFileSync(logFilePath, '', { flag: 'w' });
}

const { writeToLogFile } = require('../src/logs.js');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
        }
    });

    mainWindow.maximize();
    mainWindow.loadFile('./app/login.html');

    mainWindow.on('close', function (e) {
        const choice = dialog.showMessageBoxSync(mainWindow, {
            type: 'question',
            buttons: ['Yes', 'No'],
            title: 'Confirmation',
            message: 'Are you sure you want to quit?'
        })

        if (choice === 1) {
            e.preventDefault()
        }
    })

    mainWindow.on('closed', function () {
        mainWindow = null
    })

}

app.on('ready', () => {
    createWindow();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Function to read and clear the log file
function readAndClearLogFile() {
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading log file:', err);
            return;
        }
        if (data) {
            const lines = data.split('\n');
            lines.forEach(line => {
                if (line.trim() !== '') { // Skip empty lines
                    mainWindow.webContents.send('new-log', line);
                }
            });

            // Truncate the log file after reading
            fs.truncate(logFilePath, 0, (err) => {
                if (err) {
                    console.error('Error truncating log file:', err);
                }
            });
        }
    });
}

let userCredentials = {};

// Handle login form submission
ipcMain.on('login', (event, username, password) => {
   
});

let Flag = { value: false };

ipcMain.on('stop-script', () => {
    Flag.value = true;
    writeToLogFile('Stopping...Please Wait for Massage: Script Stopped Sucessfully')
});

ipcMain.on('start-puppeteer', async (event) => {
    try {
        setInterval(readAndClearLogFile, 5000);
        await runPuppeteer(Flag);

    } catch (error) {
        // Handle error
    } finally {
        Flag.value = false;
        // Emit event when script ends
        mainWindow.webContents.send('puppeteerScriptEnded');
    }
});
