const router = require('express').Router();

const { actionTokensEnum } = require('../config');
const { loginController } = require('../controlles');
const { userMiddleware } = require('../middllewares');
const { loginValidator: { authValidator, changePasswordValidator, passwordValidator } } = require('../validators');
const { validatorMiddleware: { validateBody } } = require('../middllewares');
const { loginMiddleware: { validateToken, validateActionToken, ifPasswordExist } } = require('../middllewares');
const { constants: { refresh } } = require('../config');
const { constants: { email } } = require('../config');

router.post('/', validateBody(authValidator),
    userMiddleware.getUserByDynamicParam(email),
    userMiddleware.isUserNotPresent,
    loginController.cheakPassword);

router.post('/logout', validateToken(),
    loginController.logoutUser);

router.post('/refresh', validateToken(refresh),
    loginController.refresh);

router.post('/password/forgot/send',
    userMiddleware.getUserByDynamicParam(email),
    userMiddleware.isUserNotPresent,
    loginController.sendEmailForgotPassword);

router.post('/password/forgot/set',
    validateBody(passwordValidator),
    validateActionToken(actionTokensEnum.FORGOT_PASS),
    loginController.resetPassword());

router.put('/password/change',
    validateBody(changePasswordValidator),
    validateToken(),
    ifPasswordExist,
    loginController.resetPassword('false'));

router.post('/activation',
    validateActionToken(actionTokensEnum.FORGOT_PASS),
    loginController.activationUser);

module.exports = router;
