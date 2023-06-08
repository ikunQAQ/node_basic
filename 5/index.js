const superagent = require("superagent");
const express = require("express");

class Weather {
  constructor(data) {
    this.date = data.date;
    this.wea = data.wea;
    this.minTemp = data.tem2;
    this.maxTemp = data.tem1;
  }

  calcTemp() {
    return `${this.minTemp}℃-${this.maxTemp}℃`;
  }
}

const getWeather = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await superagent.get("https://v0.yiketianqi.com/api?unescape=1&version=v9&appid=43283834&appsecret=u3QliNeK");
      const { city, update_time, data } = res.body;
      const wea = data.map(el => new Weather(el));
      resolve({
        city,
        update_time,
        data: wea
      });
    } catch (err) {
      console.log(err);
      reject()
    }
  });
};

const app = express();
const server = async () => {
  const weather = await getWeather();

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

  app.get("/weather/api", (req, res) => {
    res.json(weather);
  });

  app.listen(4399, () => {
    console.log("listening on http://localhost:4399/weather/api");
  });
};

server();