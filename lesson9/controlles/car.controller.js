const { CAR } = require('../dataBase');
const { statusErr: { CREATED, NO_CONTENT } } = require('../errors');

module.exports = {
    getSingleCar: (req, res, next) => {
        try {
            res.json(req.car);
        } catch (e) {
            next(e);
        }
    },

    getAllCars: async (req, res, next) => {
        try {
            const allCar = await CAR.find({});
            res.json(allCar);
        } catch (e) {
            next(e);
        }
    },

    createCar: async (req, res, next) => {
        try {
            const createdCar = await CAR.create(req.body);
            res.status(CREATED).json(createdCar);
        } catch (e) {
            next(e);
        }
    },

    deleteCar: async (req, res, next) => {
        try {
            const { car_id } = req.params;
            const car = await CAR.deleteOne({ _id: car_id });

            res.status(NO_CONTENT).json(car);
        } catch (e) {
            next(e);
        }
    },

    updateCar: async (req, res, next) => {
        try {
            const { car_id } = req.params;
            const car = await CAR.updateOne({ _id: car_id }, req.body);
            res.status(CREATED).json(car);
        } catch (e) {
            next(e);
        }
    }
};
