const { statusErr: { CREATED } } = require('../errors');
const { emailService, passwordService, jwtService } = require('../service');
const {
    emailActionsEnum, actionTokensEnum, variables: { FrontendURL }, constants: { authorization }
} = require('../config');
const { userUtil: { userNormalizator } } = require('../utils');
const { Login, ActionTokens, USER } = require('../dataBase');

module.exports = {

    cheakPassword: async (req, res, next) => {
        try {
            const { user } = req;
            const { password, email } = req.body;
            await passwordService.compare(password, user.password);

            const tokenPair = jwtService.generateTokenPair();

            await Login.create({ ...tokenPair, user: user._id });

            // await emailService.sendMail(email, emailActionsEnum.LOGIN);

            res.json({
                ...tokenPair,
                user: userNormalizator(req.user)
            });
        } catch (e) {
            next(e);
        }
    },

    logoutUser: async (req, res, next) => {
        try {
            const access_token = req.get(authorization);
            await Login.deleteOne({ access_token });
            res.json('logout');
        } catch (e) {
            next(e);
        }
    },

    refresh: async (req, res, next) => {
        try {
            const refresh_token = req.get(authorization);
            const user = req.loginUser;

            await Login.deleteOne({ refresh_token });

            const tokenPair = jwtService.generateTokenPair();
            await Login.create({ ...tokenPair, user: user._id });

            res.json({
                ...tokenPair,
                user: userNormalizator(req.user)
            });
        } catch (e) {
            next(e);
        }
    },

    sendEmailForgotPassword: async (req, res, next) => {
        try {
            const { user } = req;
            const actionToken = jwtService.generateActionToken(actionTokensEnum.FORGOT_PASS);

            await ActionTokens.create({ token: actionToken, user: user._id });

            await emailService.sendMail(user.email,
                emailActionsEnum.FORGOT_PASSWORD, {
                    userName: user.name,
                    forgotPasswordURL: `${FrontendURL}/password?token=${actionToken}`
                });

            res.json('Ok');
        } catch (e) {
            next(e);
        }
    },

    resetPassword: (isForgot = true) => async (req, res, next) => {
        try {
            const { loginUser: { _id }, body: { password } } = req;
            const token = req.get(authorization);

            const hashPassword = await passwordService.hash(password);

            if (isForgot) {
                await ActionTokens.deleteOne({ token });
            }

            await USER.findByIdAndUpdate(_id, { password: hashPassword });

            await Login.deleteMany({ user: _id });

            res.json('Ok');
        } catch (e) {
            next(e);
        }
    },

    activationUser: async (req, res, next) => {
        try {
            const { _id } = req.loginUser;
            const token = req.get(authorization);

            await USER.updateOne({ _id }, { isActivate: true });

            await ActionTokens.deleteOne({ token });
            res.json('Ok');
        } catch (e) {
            next(e);
        }
    },

    setPassword: async (req, res, next) => {
        try {
            const { body: { password }, loginUser: { _id } } = req;
            const getToken = req.get(authorization);

            const hashedPassword = await passwordService.hash(password);

            await USER.findByIdAndUpdate({ _id }, { password: hashedPassword, isActivated: true });

            await ActionTokens.deleteOne({ token: getToken });

            res.sendStatus(CREATED);
        } catch (e) {
            next(e);
        }
    }

};
