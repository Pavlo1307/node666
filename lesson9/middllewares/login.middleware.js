const { ActionTokens, Login, USER } = require('../dataBase');
const { jwtService: { varifyToken, verifyActionToken }, passwordService } = require('../service');
const { statusErr: { Unauthorized }, messageError: { noToken, InvalidToken }, ErrorHandler } = require('../errors');
const { constants: { access, authorization } } = require('../config');

module.exports = {
    validateToken: (typeToken = access) => async (req, res, next) => {
        try {
            const token = req.get(authorization);

            if (!token) {
                throw new ErrorHandler(Unauthorized, noToken);
            }
            await varifyToken(token, typeToken);

            const tokenFromDB = await Login.findOne({ [typeToken]: token }).populate('user');

            if (!tokenFromDB) {
                throw new ErrorHandler(Unauthorized, InvalidToken);
            }

            req.loginUser = tokenFromDB.user;

            next();
        } catch (e) {
            next(e);
        }
    },

    validateActionToken: (tokenType) => async (req, res, next) => {
        try {
            const actionToken = req.get(authorization);
            if (!actionToken) {
                throw new ErrorHandler(Unauthorized, noToken);
            }

            await verifyActionToken(actionToken, tokenType);

            const tokenFromDB = await ActionTokens.findOne({ token: actionToken }).populate('user');

            if (!tokenFromDB) {
                throw new ErrorHandler(Unauthorized, InvalidToken);
            }

            req.loginUser = tokenFromDB.user;

            next();
        } catch (e) {
            next(e);
        }
    },

    ifPasswordExist: async (req, res, next) => {
        try {
            const { loginUser, body: { oldPassword } } = req;

            await passwordService.compare(oldPassword, loginUser.password);

            next();
        } catch (e) {
            next(e);
        }
    }

};
