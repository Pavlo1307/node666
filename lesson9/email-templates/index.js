const { emailActionsEnum } = require('../config');

module.exports = {
    [emailActionsEnum.WELCOME]: {
        templateName: 'welcome',
        subject: 'WELCOME'
    },

    [emailActionsEnum.CREATE]: {
        templateName: 'create',
        subject: 'CREATE'
    },

    [emailActionsEnum.DELETE]: {
        templateName: 'delete',
        subject: 'DELETE'
    },

    [emailActionsEnum.LOGIN]: {
        templateName: 'login',
        subject: 'LOGIN'
    },

    [emailActionsEnum.UPDATE]: {
        templateName: 'update',
        subject: 'UPDATE'
    },

    [emailActionsEnum.DELETE_ADMIN]: {
        templateName: 'deleteAdmin',
        subject: 'DELETE_ADMIN'
    },

    [emailActionsEnum.FORGOT_PASSWORD]: {
        templateName: 'forgot_password',
        subject: 'Forgot_password'
    },
};
