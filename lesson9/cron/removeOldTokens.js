const dataJS = require('dayjs');
const utc = require('dayjs/plugin/utc');

dataJS.extend(utc);

const { ActionTokens, Login } = require('../dataBase');

module.exports = async () => {
    const previousMonth = dataJS.utc().subtract(1, 'month');

    console.log(previousMonth);
    const loginDelete = await Login.deleteMany({ createdAt: { $lte: previousMonth } });
    const actionDelete = await ActionTokens.deleteMany({ createdAt: { $lte: previousMonth } });

    console.log(loginDelete, 'login');
    console.log(actionDelete, 'action');
};
