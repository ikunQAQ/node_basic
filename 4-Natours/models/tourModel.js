const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"], // 必填
    unique: true //主键
  },
  duration: {
    type: Number,
    required: [true, "A tour must have a duration"]
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a group size"]
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty"]
  },
  ratingsAverage: {
    type: Number,
    default: 4.5 //默认
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"]
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, "A tour must have a description"]
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have a cover image"]
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select:false
  },
  startDates: [Date],
});
module.exports = mongoose.model("Tour", tourSchema);