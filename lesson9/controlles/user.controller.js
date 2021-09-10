const { USER } = require('../dataBase');
const { emailActionsEnum } = require('../config');

const { ErrorHandler } = require('../errors');
const { passwordService, emailService } = require('../service');
const { statusErr: { NO_CONTENT, CREATED, NOT_FOUND } } = require('../errors');
const { userUtil: { userNormalizator } } = require('../utils');
const { messageError: { notFound, deleted } } = require('../errors');

module.exports = {
    getSingleUser: async (req, res, next) => {
        try {
            const userToReturn = userNormalizator(req.user);

            await emailService.sendMail('pavloshavel@gmail.com', emailActionsEnum.WELCOME);

            res.json(userToReturn);
        } catch (e) {
            next(e);
        }
    },

    getAllUsers: async (req, res, next) => {
        try {
            const allUser = await USER.find({});
            const allUserToReturn = allUser.map((value) => userNormalizator(value));
            res.json(allUserToReturn);
        } catch (e) {
            next(e);
        }
    },

    createUser: async (req, res, next) => {
        try {
            const { password, email } = req.body;
            const hashedPassword = await passwordService.hash(password);
            const createdUser = await USER.create({ ...req.body, password: hashedPassword });
            const userToReturn = userNormalizator(createdUser);

            await emailService.sendMail(email, emailActionsEnum.CREATE);

            res.status(CREATED).json(userToReturn);
        } catch (e) {
            next(e);
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const { user_id, } = req.params;
            const { isUser, user: { email } } = req;

            await USER.deleteOne({ _id: user_id });

            if (!isUser) {
                await emailService.sendMail(email, emailActionsEnum.DELETE_ADMIN);
                res.sendStatus(NO_CONTENT);

                return;
            }

            await emailService.sendMail(email, emailActionsEnum.DELETE);

            res.sendStatus(NO_CONTENT);
        } catch (e) {
            next(e);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const { user_id } = req.params;
            const { email, name } = req.body;
            const user = await USER.updateOne({ _id: user_id }, req.body);

            await emailService.sendMail(email, emailActionsEnum.UPDATE, { userName: name });

            res.status(CREATED).json(user);
        } catch (e) {
            next(e);
        }
    }
};
