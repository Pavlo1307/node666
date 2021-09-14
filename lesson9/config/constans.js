module.exports = {
    PASSWORD_REGEXP: new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,128})/),
    EMAIL_REGEXP: new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$'),
    authorization: 'Authorization',
    AMAZONAWS: 'amazonaws.com/',
    email: 'email',
    body: 'body',
    user_id: 'user_id',
    params: 'params',
    id: '_id',
    access: 'access_token',
    refresh: 'refresh_token',
    PHOTO_MAX_SIZE: 5 * 1024 * 1024,
    NIME_TYPES: {
        PHOTO: [
            'image/jpeg',
            'image/png'
        ],
    }


};
