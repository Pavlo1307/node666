const { CAR } = require('../dataBase');
const { ErrorHandler, statusErr: { BAD_REQUEST }, messageError: { notFound } } = require('../errors');

module.exports = {
    isCarPresent: async (req, res, next) => {
        try {
            const { car_id } = req.params;
            const car = await CAR.findById(car_id);

            if (!car) {
                throw new ErrorHandler(BAD_REQUEST, notFound);
            }

            req.car = car;
            next();
        } catch (e) {
            next(e);
        }
    },
};
