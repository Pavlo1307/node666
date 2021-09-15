const datJs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const { emailActionsEnum, databaseTablesEnum: { user } } = require('../config');
const { emailService } = require('../service');

datJs.extend(utc);

const { Login } = require('../dataBase');

module.exports = async () => {
    const tenDays = datJs.utc().subtract(10, 'day');

    const users = await Login.find({ createdAt: { $lt: tenDays } }).populate(user);
    console.log(users);
    await Promise.allSettled(users.map(async (item) => {
        await emailService.sendMail('pavloshavel@gmail.com',
            emailActionsEnum.COME_BECK,
            { userName: item.user.name });
    }));
    console.log('ddddd');
};
