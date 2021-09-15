const dataJS = require('dayjs');
const utc = require('dayjs/plugin/utc');

dataJS.extend(utc);

const { ActionTokens, Login } = require('../dataBase');

module.exports = async () => {
    const previousMonth = dataJS.utc().subtract(1, 'month');

    await Login.deleteMany({ createdAt: { $lte: previousMonth } });
    await ActionTokens.deleteMany({ createdAt: { $lte: previousMonth } });
};
