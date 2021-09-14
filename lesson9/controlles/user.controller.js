const { ActionTokens } = require('../dataBase');
const { USER } = require('../dataBase');
const { emailActionsEnum, actionTokensEnum } = require('../config');

const { passwordService, emailService, jwtService } = require('../service');
const { s3Service } = require('../service');
const { statusErr: { NO_CONTENT, CREATED } } = require('../errors');
const { userUtil: { userNormalizator } } = require('../utils');

module.exports = {
    getSingleUser: async (req, res, next) => {
        try {
            const userToReturn = userNormalizator(req.user);

            await emailService.sendMail(req.user.email, emailActionsEnum.WELCOME);

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

    createUser: (roleUser = 'user') => async (req, res, next) => {
        try {
            const { password, email } = req.body;
            const hashedPassword = await passwordService.hash(password);

            const actionToken = roleUser === 'admin'
                ? jwtService.generateActionToken(actionTokensEnum.CHANGE_ADMIN_PASSWORD)
                : jwtService.generateActionToken(actionTokensEnum.ACTIVE_USER);

            let createdUser = await USER.create({ ...req.body, password: hashedPassword, role: roleUser });

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

            await ActionTokens.create({ token: actionToken, user: createdUser._id });

            res.status(CREATED).json({ ...userToReturn, action_token: actionToken });
        } catch (e) {
            next(e);
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const { user_id, } = req.params;
            const { isUser, user: { email, avatar } } = req;

            await USER.deleteOne({ _id: user_id });

            if (!isUser) {
                await emailService.sendMail(email, emailActionsEnum.DELETE_ADMIN);
                res.sendStatus(NO_CONTENT);

                return;
            }

            await emailService.sendMail(email, emailActionsEnum.DELETE);

            if (avatar) {
                await s3Service.deleteFile(avatar);
            }

            res.sendStatus(NO_CONTENT);
        } catch (e) {
            next(e);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            let { user } = req;
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

            // await emailService.sendMail(user.email, emailActionsEnum.UPDATE, { userName: user.name });

            res.status(CREATED).json(user);
        } catch (e) {
            next(e);
        }
    }
};
