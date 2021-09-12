const router = require('express').Router();

const { validatorMiddleware: { validateBody }, carMiddleware } = require('../middllewares');
const { carController } = require('../controlles');
const { carValidator: { createCarValidator, updateCarValidator } } = require('../validators');

router.post('/', validateBody(createCarValidator), carController.createCar);
router.get('/', carController.getAllCars);
router.get('/:car_id', carMiddleware.isCarPresent, carController.getSingleCar);
router.delete('/:car_id', carMiddleware.isCarPresent, carController.deleteCar);
router.put('/:car_id', validateBody(updateCarValidator), carMiddleware.isCarPresent, carController.updateCar);

module.exports = router;
