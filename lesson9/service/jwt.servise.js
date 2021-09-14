const jwt = require('jsonwebtoken');
const util = require('util');
const {
    messageError: { InvalidToken, wrongTokenType },
    ErrorHandler, statusErr: { Unauthorized, SERVER_ERROR }
} = require('../errors');
const {
    variables:
    {
        ACCESS_SECRET_KEY,
        REFRESH_SECRET_KEY,
        FORGOT_PASSWORD_SECRET_KEY,
        ACTIVE_SECRET_KEY,
        CHANGE_ADMIN_PASSWORD_SECRET_KEY
    },
    actionTokensEnum,
    constants: { access }
} = require('../config');

const verifyPromise = util.promisify(jwt.verify);

module.exports = {
    generateTokenPair: () => {
        const access_token = jwt.sign({}, ACCESS_SECRET_KEY, { expiresIn: '15m' });
        const refresh_token = jwt.sign({}, REFRESH_SECRET_KEY, { expiresIn: '31d' });

        return {
            access_token,
            refresh_token
        };
    },

    varifyToken: async (token, tokenType = access) => {
        try {
            const secret = tokenType === access ? ACCESS_SECRET_KEY : REFRESH_SECRET_KEY;

            await verifyPromise(token, secret);
        } catch (e) {
            throw new ErrorHandler(Unauthorized, InvalidToken);
        }
    },

    generateActionToken: (actionType) => {
        const secretWord = _getSecretWordForActionToken(actionType);

        return jwt.sign({}, secretWord, { expiresIn: '7d' });
    },

    verifyActionToken: (token, actionType) => {
        const secretWord = _getSecretWordForActionToken(actionType);

        return jwt.verify(token, secretWord);
    }
};

function _getSecretWordForActionToken(actionType) {
    let secretWord = '';

    switch (actionType) {
        case actionTokensEnum.FORGOT_PASS:
            secretWord = FORGOT_PASSWORD_SECRET_KEY;
            break;
        case actionTokensEnum.ACTIVE_USER:
            secretWord = ACTIVE_SECRET_KEY;
            break;
        case actionTokensEnum.CHANGE_ADMIN_PASSWORD:
            secretWord = CHANGE_ADMIN_PASSWORD_SECRET_KEY;
            break;
        default:
            throw new ErrorHandler(SERVER_ERROR, wrongTokenType);
    }

    return secretWord;
}
