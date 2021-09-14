const { USER } = require('../dataBase');
const { emailActionsEnum } = require('../config');

const { passwordService, emailService } = require('../service');
const { s3Service } = require('../service');
const { statusErr: { NO_CONTENT, CREATED } } = require('../errors');
const { userUtil: { userNormalizator } } = require('../utils');

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

            // await emailService.sendMail(email, emailActionsEnum.CREATE);

            let createdUser = await USER.create({ ...req.body, password: hashedPassword });

            if (req.files && req.files.avatar) {
                const s3Response = await s3Service.uploadFile(req.files.avatar,
                    'users',
                    createdUser._id);
                createdUser = await USER.findByIdAndUpdate(
                    createdUser._id,
                    { avatar: s3Response.Location },
                    { new: true }
                );
            }
            const userToReturn = userNormalizator(createdUser);

            res.status(CREATED).json(userToReturn);
        } catch (e) {
            next(e);
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const { user_id, } = req.params;
            const { isUser, user: { email }, user } = req;

            await USER.deleteOne({ _id: user_id });

            if (!isUser) {
                await emailService.sendMail(email, emailActionsEnum.DELETE_ADMIN);
                res.sendStatus(NO_CONTENT);

                return;
            }

            await emailService.sendMail(email, emailActionsEnum.DELETE);

            if (user.avatar) {
                await s3Service.deleteFile(user.avatar);
            }

            res.sendStatus(NO_CONTENT);
        } catch (e) {
            next(e);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            let { user } = req;
            const { email, name } = req.body;

            if (req.files && req.files.avatar) {
                if (user.avatar) {
                    await s3Service.deleteFile(user.avatar);
                }

                const s3Response = await s3Service.uploadFile(req.files.avatar,
                    'users',
                    user._id);

                user = await USER.findByIdAndUpdate(
                    user._id,
                    { ...req.body, avatar: s3Response.Location },
                    { new: true }
                );
            } else {
                user = await USER.findByIdAndUpdate(user._id, req.body);
            }

            // await emailService.sendMail(email, emailActionsEnum.UPDATE, { userName: name });

            res.status(CREATED).json(user);
        } catch (e) {
            next(e);
        }
    }
};
