const router = require('express').Router();

const {
    userMiddleware: {
        getUserByDynamicParam,
        checkUserRoleMiddleware,
        isUserNotPresent,
        isUserPresent,
        CheckUserForUpdate
    },
    validatorMiddleware: { validateBody },
    loginMiddleware: { validateToken }
} = require('../middllewares');
const { userController } = require('../controlles');
const { userValidator: { createUserValidator, updateUser } } = require('../validators');
const {
    constants: {
        email, body, user_id, params, id
    },
    userRoles: { USER }
} = require('../config');

router.post('/',
    validateBody(createUserValidator),
    getUserByDynamicParam(email, body),
    isUserPresent,
    userController.createUser);

router.get('/', userController.getAllUsers);

router.get('/:user_id',
    getUserByDynamicParam(user_id, params, id),
    isUserNotPresent,
    userController.getSingleUser);

router.delete('/:user_id',
    validateToken(),
    getUserByDynamicParam(user_id, params, id),
    isUserNotPresent,
    checkUserRoleMiddleware([USER]),
    userController.deleteUser);

router.put('/:user_id',
    validateBody(updateUser),
    validateToken(),
    getUserByDynamicParam(user_id),
    CheckUserForUpdate,
    userController.updateUser);

module.exports = router;
