const cron = require('node-cron');
const removeOltToken = require('./removeOldTokens');

module.exports = () => {
    cron.schedule(' 0 0 1 * *', async () => {
        console.log(`cron started at ${new Date().toISOString()} `);
        await removeOltToken();
        console.log(`cron finished at ${new Date().toISOString()} `);
    });
};
