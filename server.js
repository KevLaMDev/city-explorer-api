'use strict';

// in servers we use REQUIRE instead of IMPORT

// import express
const express = require('express');
// import data from json file
const weatherData = require('./data/weather.json');


// how we use express, MUST be invoked and saved to app const
const app = express();

// middleware here to be added after app has been instantiated
require('dotenv').config();
  // use the port we want locally, and make it deployable
const PORT = process.env.PORT || 3002;
  //import cors
const cors = require('cors');
  // invoke cors

// make server listen to requests
app.listen(PORT, () => console.log('server standing by'))

// route handlers
  // test route 
app.get('/test', (request, response) => {
  let name = request.query.name
  response.send(`yerrrrrr ${name}`)
  // access query params using request obj
  // request.query.<param-name>
});

app.get('/weather', (request, response) => {
  let city = request.query.searchQuery;
  city.toLowerCase();
  // get the city arr we want
  let cityArr = weatherData.filter(obj => obj.city_name.toLowerCase() === city)
  // get the arr of day objs
  let daysArr = cityArr[0].data;
  // map over arr of day objs, instantiate new day weather objs
  let weatherCityData = daysArr.map(obj => new Forecast(obj))
  // send out groomed data
  response.send(weatherCityData);
});

class Forecast {
  constructor(obj) {
    this.description = obj.weather.description;
    this.date = obj.datetime;
    this.lowTemp = obj.low_temp;
    this.maxTemp = obj.max_temp;
  };
};

app.get('*', (request, response) => {
  response.status(404).send(`error: you broke the server.`)
});

