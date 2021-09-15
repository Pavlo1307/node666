const cron = require('node-cron');
const removeOltToken = require('./removeOldTokens');
const sendMail = require('./sendMail');

module.exports = () => {
    cron.schedule(' 0 0 1 * *', async () => {
        await removeOltToken();
    });

    cron.schedule('*/2 * * * *', async () => {
        await sendMail();
    });
};
