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
app.get('/weather', getWeather);
app.get('/test', getTest);
app.get('/movies', getMovies);

getTest = async (request, response) => {
  response.send('hi this is the server')
}

getWeather = async (request, response) => {
  let lat = request.query.lat;
  let lon = request.query.lon;
  let weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`
  let weatherData = await axios.get(weatherUrl);
  weatherData = weatherData.data;
  let groomedWeatherData = weatherData.data.map(obj => new Forecast(obj));
  response.send(groomedWeatherData);
};

getMovies = async (request, response) => {
  let movieSearch = response.query.movieSearch;
  let movieDbUrl = `https://api.themoviedb.org/3/movie/550?api_key=${process.env.MOVIE_API_KEY}`
}


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

