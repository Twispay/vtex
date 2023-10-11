const fs = require('fs');
const path = require('path');

class Log {
    /**
     * Constructor for Log.
     * 
     * @param {string} logFilePath - File path to save the log.
     */
    constructor(logFilePath) {
        this.logFilePath = logFilePath;
    }

    /**
     * Write a message to the log file.
     * 
     * @param {string} message - The message to be logged.
     * @param {string} level - The log level (e.g., INFO, ERROR, WARN).
     */
    write(message, level = 'INFO') {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} [${level}] ${message}\n`;

        fs.appendFile(this.logFilePath, logMessage, (err) => {
            if (err) {
                console.error('Failed to write to log file:', err);
            }
        });
    }

    /**
     * Log an INFO level message.
     * 
     * @param {string} message - The message to be logged.
     */
    info(message) {
        this.write(message, 'INFO');
    }

    /**
     * Log an ERROR level message.
     * 
     * @param {string} message - The message to be logged.
     */
    error(message) {
        this.write(message, 'ERROR');
    }

    /**
     * Log a WARN level message.
     * 
     * @param {string} message - The message to be logged.
     */
    warn(message) {
        this.write(message, 'WARN');
    }
}

module.exports = Log;