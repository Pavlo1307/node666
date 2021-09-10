const { statusErr: { BAD_REQUEST } } = require('../errors');
const { loginValidator } = require('../validators');
const { USER } = require('../dataBase');
const { ErrorHandler } = require('../errors');
const { statusErr: { FORBIDDEN, NOT_FOUND, CONFLICT } } = require('../errors');
const {
    messageError: {
        notFound, alreadyExist, forbidden, idFalse
    }
} = require('../errors');

module.exports = {
    isUserNotPresent: (req, res, next) => {
        try {
            const { user } = req;

            if (!user) {
                throw new ErrorHandler(NOT_FOUND, notFound);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    isUserPresent: (req, res, next) => {
        try {
            const { user } = req;

            if (user) {
                throw new ErrorHandler(CONFLICT, alreadyExist);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    checkUserRoleMiddleware: (roleArr = []) => (req, res, next) => {
        try {
            const { params: { user_id }, loginUser: { _id, role } } = req;

            if (user_id === _id.toString()) {
                req.isUser = true;
                return next();
            }

            if (!roleArr.length) {
                return next();
            }

            if (!roleArr.includes(role)) {
                throw new ErrorHandler(FORBIDDEN, forbidden);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    getUserByDynamicParam: (paramName, searchIn = 'body', dbId = paramName) => async (req, res, next) => {
        try {
            const value = req[searchIn][paramName];
            const user = await USER.findOne({ [dbId]: value });
            req.user = user;
            next();
        } catch (e) {
            next(e);
        }
    },

    CheckUserForUpdate: (req, res, next) => {
        try {
            const { params: { user_id }, loginUser: { _id } } = req;
            if (user_id !== _id.toString()) {
                throw new ErrorHandler(FORBIDDEN, idFalse);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    validateNewPassword: (req, res, next) => {
        try {
            const { error, value } = loginValidator.passwordValidator.validate(req.body);

            req.body = value;

            if (error) {
                throw new ErrorHandler(BAD_REQUEST, error.details[0].message);
            }

            next();
        } catch (e) {
            next(e);
        }
    },
};
