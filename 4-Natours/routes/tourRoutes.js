const express = require("express");
const {
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour,
  checkID,
  aliasTopTours,
  checkBody
} = require("./../controllers/tourController");

const router = express.Router();

router.param("id", checkID);

router.route("/top-5-cheap")
  .get(aliasTopTours, getAllTours);

router
  .route("/")
  .get(getAllTours)
  .post(checkBody, createTour);

router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

//默认缓存 中间件给 req 赋值
module.exports = router;