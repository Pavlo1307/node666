const router = require('express').Router();

const { actionTokensEnum, constants: { refresh, email } } = require('../config');
const { loginController } = require('../controlles');
const {
    userMiddleware,
    validatorMiddleware: { validateBody },
    loginMiddleware: { validateToken, validateActionToken, ifPasswordExist }
} = require('../middllewares');
const {
    loginValidator: {
        authValidator, changePasswordValidator, passwordValidator, emailValidator
    }
} = require('../validators');

router.post('/', validateBody(authValidator),
    userMiddleware.getUserByDynamicParam(email),
    userMiddleware.isUserNotPresent,
    loginController.cheakPassword);

router.post('/logout', validateToken(),
    loginController.logoutUser);

router.post('/refresh', validateToken(refresh),
    loginController.refresh);

router.post('/password/forgot/send',
    validateBody(emailValidator),
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
    loginController.resetPassword(false));

router.post('/activation',
    validateActionToken(actionTokensEnum.ACTIVE_USER),
    loginController.activationUser);

module.exports = router;
