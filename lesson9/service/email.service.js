const nodemailer = require('nodemailer');
const path = require('path');

const EmailTemplates = require('email-templates');
const allTemplates = require('../email-templates');
const { ErrorHandler } = require('../errors');
const { variables: { noReplyEmail, noReplyPassword, FrontendURL } } = require('../config');

const templateParser = new EmailTemplates({
    views: {
        root: path.join(process.cwd(), 'email-templates')
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: noReplyEmail,
        pass: noReplyPassword
    }
});

const sendMail = async (userMail, emailAction, context = {}) => {
    const templateInfo = allTemplates[emailAction];

    if (!templateInfo) {
        throw new ErrorHandler(500, 'Template not found');
    }

    const { templateName, subject } = templateInfo;
    context.frontendURL = FrontendURL;

    const html = await templateParser.render(templateName, context);

    return transporter.sendMail({
        from: 'No reply',
        to: userMail,
        subject,
        html

    });
};

module.exports = {
    sendMail
};
