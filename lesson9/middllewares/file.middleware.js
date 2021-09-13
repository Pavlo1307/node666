const { ErrorHandler, statusErr: { BAD_REQUEST }, messageError: { wrongTypeFormat } } = require('../errors');
const { constants: { PHOTO_MAX_SIZE, NIME_TYPES } } = require('../config');

module.exports = {
    cheackAvatar: (req, res, next) => {
        try {
            if (!req.files || !req.files.avatar) {
                next();
                return;
            }
            const { name, size, mimetype } = req.files.avatar;

            if (size > PHOTO_MAX_SIZE) {
                throw new ErrorHandler(BAD_REQUEST, `File ${name} is too big`);
            }

            if (!NIME_TYPES.PHOTO.includes(mimetype)) {
                throw new ErrorHandler(BAD_REQUEST, wrongTypeFormat);
            }

            next();
        } catch (e) {
            next(e);
        }
    }
};
