const datJs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const { emailActionsEnum, databaseTablesEnum: { user } } = require('../config');
const { emailService } = require('../service');

datJs.extend(utc);

const { Login } = require('../dataBase');

module.exports = async () => {
    const tenDays = datJs.utc().subtract(10, 'day');

    const users = await Login.find({ createdAt: { $lte: tenDays } }).populate(user);

    const promiseUsers = users.map(async (item) => {
        await emailService.sendMail('pavloshavel@gmail.com',
            emailActionsEnum.COME_BECK,
            { userName: item.name });
    });
    await Promise.allSettled(promiseUsers);
};
