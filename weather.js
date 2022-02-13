'use strict';

const { response } = require('express');
const cache = require('./cache.js');
const axios = require('axios');

async function getWeather (request, response) {
  let latitude = request.query.lat;
  let longitude = request.query.lon;
  const key = 'weather-' + latitude + longitude;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHER_API_KEY}&lang=en&lat=${latitude}&lon=${longitude}&days=5`;
  
  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');

  } else {
    console.log('Cache miss');
    cache[key] = {
      timestamp: Date.now(),
      data: await axios.get(url)
    };
  }
  let parsedWeather = parseWeather(cache[key].data);
  response.send(parsedWeather)
}

function parseWeather(weatherData) {
    // console.log(weatherData)
    const weatherSummaries = weatherData.data.data.map(day => {
      return new Weather(day);
    });
    return weatherSummaries;
}

class Weather {
  constructor(day) {
    this.forecast = day.weather.description;
    this.time = day.datetime;
  }
}

module.exports = getWeather;
