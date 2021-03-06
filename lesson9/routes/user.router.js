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
    loginMiddleware: { validateToken },
    fileMiddleware: { cheackAvatar }
} = require('../middllewares');
const { userController } = require('../controlles');
const { userValidator: { createUserValidator, updateUser } } = require('../validators');
const {
    constants: {
        email, body, user_id, params, id
    },
    userRoles: { USER, ADMIN }
} = require('../config');

router.post('/',
    validateBody(createUserValidator),
    cheackAvatar,
    getUserByDynamicParam(email, body),
    isUserPresent,
    userController.createUser());

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

router.post('/create/admin',
    validateBody(createUserValidator),
    cheackAvatar,
    isUserPresent,
    validateToken(),
    checkUserRoleMiddleware([ADMIN]),
    userController.createUser(ADMIN));

module.exports = router;
