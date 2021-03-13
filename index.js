const schedule = require('node-schedule');
const bot = require('./bot');

// bot login at 22:30 (10:30 PM) everyday
schedule.scheduleJob('30 22 * * *', bot.login);

// bot logout at 00:40 (12:40 AM) everyday
schedule.scheduleJob('40 00 * * *', bot.logout);
