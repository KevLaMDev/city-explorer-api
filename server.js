'use strict';

// in servers we use REQUIRE instead of IMPORT

// import express
const express = require('express');
// import data from json file


// how we use express, MUST be invoked and saved to app const
const app = express();

// middleware here to be added after app has been instantiated
require('dotenv').config();
const axios = require('axios')
  // use the port we want locally, and make it deployable
const PORT = process.env.PORT || 3002;
  //import cors
var cors = require('cors');
  // invoke cors
app.use(cors())

// make server listen to requests
app.listen(PORT, () => console.log(`server standing by on ${PORT}`))

// route handlers
  // test route 
app.get('/test', (request, response) => {
  let name = request.query.name
  response.send(`yerrrrrr ${name}`)
  // access query params using request obj
  // request.query.<param-name>
});

app.get('/weather', async (request, response) => {
  let lat = 47.60621
  // request.query.lat;
  let lon = -122.33207
  // request.query.lon;
  let weatherUrl = `https://api.weatherbit.io/v2.0/current?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`
  let weatherData = await axios.get(weatherUrl);
  weatherData = weatherData.data;
  let groomedWeatherData = weatherData.data.map(obj => new Forecast(obj));
  response.send(groomedWeatherData);
});

class Forecast {
  constructor(obj) {
    this.description = obj.weather.description;
    this.date = obj.datetime;
    this.temp = obj.temp;
  };
};

app.get('*', (request, response) => {
  response.status(404).send(`error: you broke the server.`)
});

