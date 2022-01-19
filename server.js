'use strict';

// in servers we use REQUIRE instead of IMPORT

const express = require('express');
const weatherData = require('./data/weather.json');

const app = express();

// middleware here to be added after app has been instantiated

const PORT = 3002;

// make server listen to requests

app.listen(PORT, () => console.log('server standing by'))

// test route 
app.get('/test', (request, response) => {
  let name = request.query.name
  response.send(`yerrrrrr ${name}`)
  // access query params using request obj
  // request.query.<param-name>
})

app.get('/weather', (request, response) => {
  let city = request.query.city;
  city.toLowerCase();
  let cityObj = weatherData.filter(obj => obj.city_name.toLowerCase() === city)
  //forecasts is an array of objs, datetime is a prop on each obj
  let dayArr = cityObj.data
  let weatherCityData = cityObj.data.map(obj => new Forecast(obj))
  response.send(weatherCityData);
})

class Forecast {
  constructor(obj) {
    this.date = obj.datetime
    this.description = obj.weather.description
  }
}

app.get('*', (request, response) => {
  response.status(404).send(`error: you broke the server.`)
})
