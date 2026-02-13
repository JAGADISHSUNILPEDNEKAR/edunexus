// Simple logging utility
// spec: see FullStackProject-Sem3_33099103.pdf

const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, '../debug.log');

const writeLog = (level, message, ...args) => {
  try {
    const timestamp = new Date().toISOString();
    // primitive arg formatting
    const formattedArgs = args.length ? ' ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') : '';
    const logEntry = `[${timestamp}] [${level}] ${message}${formattedArgs}\n`;
    fs.appendFileSync(logFile, logEntry);
  } catch (err) {
    // silently fail
  }
};

const logger = {
  info: (message, ...args) => {
    writeLog('INFO', message, ...args);
    console.log(`ℹ️  [INFO] ${message}`, ...args);
  },

  error: (message, ...args) => {
    writeLog('ERROR', message, ...args);
    console.error(`❌ [ERROR] ${message}`, ...args);
  },

  warn: (message, ...args) => {
    writeLog('WARN', message, ...args);
    console.warn(`⚠️  [WARN] ${message}`, ...args);
  },

  success: (message, ...args) => {
    writeLog('SUCCESS', message, ...args);
    console.log(`✅ [SUCCESS] ${message}`, ...args);
  },

  debug: (message, ...args) => {
    writeLog('DEBUG', message, ...args);
    if (process.env.NODE_ENV === 'development') {
      console.log(`🐛 [DEBUG] ${message}`, ...args);
    }
  }
};

module.exports = logger;