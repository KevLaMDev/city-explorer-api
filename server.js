'use strict';

// in servers we use REQUIRE instead of IMPORT

// import express
const express = require('express');

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

async function getTest(request, response) {
  response.send('hi this is the server')
}

async function getWeather(request, response) {
  let lat = request.query.lat;
  let lon = request.query.lon;
  let weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`
  try {
    let weatherData = await axios.get(weatherUrl);
    weatherData = weatherData.data;
    let groomedWeatherData = weatherData.data.map(obj => new Forecast(obj));
    response.send(groomedWeatherData);
  } catch {
    response.send('Could not retrieve weather data from API')
  }
};

async function getMovies(request, response) {
  let location = request.query.location;
  let movieDbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${location}&include_adult=false`;
  try {
    let movieData = await axios.get(movieDbUrl);
    movieData = movieData.data.results; // movieData is assigned an array of objs
    let groomedMovieData = movieData.map(obj => new Movie(obj));
    response.send(groomedMovieData);
  } catch {
    response.send('Could not retrieve movie data from API')
  }
}

// Data Processing constructor funcs

class Movie {
  constructor(obj) {
    this.title = obj.title
    this.overview = obj.overview
    this.average_votes = obj.vote_average
    this.image_url = `https://image.tmdb.org/t/p/w500${obj.backdrop_path}`
    this.popularity = obj.popularity
    this.released_on = obj.release_date
  };
};

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

