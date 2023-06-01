const fs = require("fs");
// const { json } = require("express");
const Tour = require("./../models/tourModel");


const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

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

exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    // 1A) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach(el => {
      delete queryObj[el];
    });

    // 1B) Advanced Filtering  正则表达式替换
    let queryStr = JSON.stringify(queryObj); //转化成字符串 gt gte lt lte
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" "); // 第二个标准 在url中用,分割 传入 mongoose用空格分割
      query = query.sort(req.query.sort);
    } else {
      query = query.sort("-createdAt");
      //默认按照从新到旧创建日期
    }

    // 3) Field limiting
    if (req.query.fields) {
      //带 - 减号是排除
      const fields = req.query.fields.split(",").join("");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    //分页
    //page=2&limit=10 , 1-10 page1 , 11-20 page2
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments(); //文档数量
      if (skip >= numTours) throw new Error('This page does not exist');
    }
    // EXECUTE QUERY
    const tours = await query;

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
    const tour = await Tour.findById(req.params.id);
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
      status: "fail",
      message: err
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
    const tour = await Tour.findByIdAndRemove(req.params.id);
    res.status(200).json({
      status: "success", data: null
    });
  } catch (err) {
    res.status(404).json({
      status: "error", message: err
    });
  }
};
