'use strict';

// in servers we use REQUIRE instead of IMPORT

// import express
const express = require('express');

// how we use express, MUST be invoked and saved to app const
const app = express();

// middleware here to be added after app has been instantiated
require('dotenv').config();

// use the port we want locally, and make it deployable
const PORT = process.env.PORT || 3002;

//import cors
var cors = require('cors');

// invoke cors
app.use(cors())

// modules
const getWeather = require('./weather');
const getMovies = require('./movies');

// make server listen to requests
app.listen(PORT, () => console.log(`server standing by on ${PORT}`))

// route handlers
app.get('/weather', getWeather);
app.get('/test', getTest);
app.get('/movies', getMovies);

async function getTest(request, response) {
  response.send('hi this is the server')
}

app.get('*', (request, response) => {
  response.status(404).send('Server standing by')
});

