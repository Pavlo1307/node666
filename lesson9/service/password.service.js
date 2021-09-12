const bcrypt = require('bcrypt');

const { ErrorHandler, statusErr: { BAD_REQUEST }, messageError: { mailIsWrong } } = require('../errors');

module.exports = {
    hash: (password) => bcrypt.hash(password, 10),
    compare: async (password, hash) => {
        const isPasswordMatched = await bcrypt.compare(password, hash);

        if (!isPasswordMatched) {
            throw new ErrorHandler(BAD_REQUEST, mailIsWrong);
        }
    }
};
