class APIFeatures {
  constructor(query, queryString) {
    this.query = query;  // query是数据库查询出所有的data
    this.queryString = queryString; // req.query 传输请求的参数
  }

  filter() {
    // 1A) Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach(el => {
      delete queryObj[el];
    });
      // 1B) Advanced Filtering  正则表达式替换
      let queryStr = JSON.stringify(queryObj); //转化成字符串 gt gte lt lte
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

      this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.query.sort.split(",").join(" "); // 第二个标准 在url中用,分割 传入 mongoose用空格分割
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
      //默认按照从新到旧创建日期
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      //带 - 减号是排除
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    //分页
    //page=2&limit=10 , 1-10 page1 , 11-20 page2
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;