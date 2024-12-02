const fs = require('fs');
const path = require('path');

// Function to get the current date formatted as YYYY-MM-DD
function getFormattedDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Define the directory where logs will be stored
const logsDir = path.resolve('logs');

// Generate the log file name based on the current date
const logFileName = `${getFormattedDate()}.log`;
const logFilePath = path.join(logsDir, logFileName);

// Ensure that the logs directory and log file exist
function initializeLogFile() {
  try {
    // Create logs directory if it doesn't exist
    fs.mkdirSync(logsDir, { recursive: true });

    // Create log file if it doesn't exist
    if (!fs.existsSync(logFilePath)) {
      fs.writeFileSync(logFilePath, '', { flag: 'w' });
    }
  } catch (err) {
    console.error('Error initializing log file:', err);
  }
}

// Function to get formatted timestamp
function getFormattedTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `[${year}-${month}-${day}]  [${hours}:${minutes}:${seconds}]`;
}

// Function to write log messages to a file asynchronously
function writeToLogFile(message) {
  try {
    // Initialize log file if not already initialized
    if (!fs.existsSync(logFilePath)) {
      initializeLogFile();
    }

    // Get the formatted timestamp
    const timestamp = getFormattedTimestamp();
    const logMessage = `${timestamp}  ${message}`;

    // Append the message to the log file
    fs.appendFile(logFilePath, logMessage + '\n', (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    });
  } catch (err) {
    console.error('Error writing to log file:', err);
  }
}

// Self-invoking function to delete files older than 30 days
(function deleteOldLogFiles() {
  try {
    const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    // Read the logs directory
    fs.readdir(logsDir, (err, files) => {
      if (err) {
        console.error('Error accessing logs directory to delete old files');
        return;
      }

      files.forEach(file => {
        const filePath = path.join(logsDir, file);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error('Error getting file stats:', err);
            return;
          }

          // Check if the file is older than 30 days
          if (now - stats.mtimeMs > thirtyDaysInMilliseconds) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`Error deleting file ${file}:`, err);
              } else {
                console.log(`Deleted old log file: ${file}`);
              }
            });
          }
        });
      });
    });
  } catch (err) {
    console.error('Error in deleteOldLogFiles function:', err);
  }
})();

module.exports = { writeToLogFile };