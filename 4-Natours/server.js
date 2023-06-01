const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true
    //配置项
  })
  .then(() => console.log("DB connection successfully!"));


//
// const testTour = new Tour({
//   name: "The Park Camper",
//   price: 997
// });

// const testTour = new Tour({
//   name:'The Forest Hiker',
//   rating: 4.7,
//   price:497
// });


// testTour.save().
// then(content => console.log(content)).
// catch( err => console.log("ERROR:",err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on ${port}...`);
});