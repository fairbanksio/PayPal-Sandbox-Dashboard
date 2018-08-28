var winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'dashboard.log' })
  ]
});

module.exports = logger;