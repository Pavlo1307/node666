module.exports = {
    PORT: process.env.PORT || 5000,
    dataBasePost: process.env.dataBasePost || 'mongodb://localhost:27017/first',
    CURRENT_YEAR: new Date().getFullYear(),

    ACCESS_SECRET_KEY: 'Secret',
    REFRESH_SECRET_KEY: 'SecretWord2',
    FORGOT_PASSWORD_SECRET_KEY: 'secretForgot',
    ACTIVE_SECRET_KEY: 'secretActive',
    CHANGE_ADMIN_PASSWORD_SECRET_KEY: 'secretChangeAdminPassword',
    FrontendURL: 'https://google.com',

    noReplyEmail: process.env.noReplyEmail || 'pavloshavel@gmail.com',
    noReplyPassword: process.env.noReplyPassword || '0000',

    AWS_S3_NAME: process.env.AWS_S3_NAME || '',
    AWS_S3_REGION: process.env.AWS_S3_REGION || '',
    AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY || '',
    AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY || '',
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',

};
