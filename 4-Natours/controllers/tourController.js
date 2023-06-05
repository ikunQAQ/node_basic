const Tour = require("./../models/tourModel");
const APIFeatures = require("../utils/APIFeatures");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingAverage,summary,difficulty";
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY

    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    //SEND RESPONSE
    res.status(200).json({
      status: "success", result: tours.length, data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail", message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).select("-_id");
    // Tour.findOne({ _id : req.params.id })
    res.status(200)
      .json({
        status: "success", data: {
          tour
        }
      });
  } catch (err) {
    res.status(404).json({
      status: "fail", message: err
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res
      .status(201)
      .json({
        status: "success", data: {
          tour: newTour
        }
      });
  } catch (err) {
    res.status(400).json({
      status: "fail", message: err
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    res.status(200)
      .json({
        status: "success", data: {
          tour
        }
      });
  } catch (err) {
    res.status(404).json({
      status: "error", message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndRemove(req.params.id);
    res.status(200).json({
      status: "success", data: null
    });
  } catch (err) {
    res.status(404).json({
      status: "error", message: err
    });
  }
};
exports.checkID = (req, res, next) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail", message: "Invalid ID"
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    //status code 400 : server can't understand
    return res.status(400).json({
      status: "fail", message: "Missing name or price"
    });
  }
  next();
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: "$difficulty",
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
      // {
      //   $match: { _id: { $ne : 'EASY'} }
      // }
    ]);
    res.status(200).json({
      status: "success",
      data: {
        stats
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates"
        //按元素拆开
      },
      {
        $match: {
          //匹配元素
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`)
          }
        }
      },
      {
        $group:{
          _id: {
            $month: '$startDates'
          },
            numTourStart :{
              $sum:1
            },
            tours:{
              $push : '$name'
            }
        }
      },
      {
        $addFields:{
          month: '$_id'
        }
      },
      {
        $project : { _id : 0 }
      },
      {
        $sort:{ numTourStart: -1 }
      },
      {
        $limit: 12
      }
    ]);
    res.status(200).json({
      status: "success",
      data: {
        plan
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};