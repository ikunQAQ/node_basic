const express = require('express');
const { createTour, deleteTour, getAllTours, getTour, updateTour ,checkID } = require('./../controllers/tourController');

const router = express.Router();

router.param('id', checkID);

router
  .route('/')
  .get(getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;