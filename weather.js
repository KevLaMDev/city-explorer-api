'use strict';

const axios = require('axios')

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

class Forecast {
  constructor(obj) {
    this.description = obj.weather.description;
    this.date = obj.datetime;
    this.temp = obj.temp;
  };
};

module.exports = getWeather;
