'use strict';

const { response } = require('express');
const axios = require('axios')
const cache = require('./cache.js');

async function getMovies(request, response) {
  let location = request.query.location;
  let movieDbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${location}&include_adult=false`;
  let key = `movie${location}`
  if (cache[key] && Date.now() - cache[key].timestamp < 50000) {
    console.log('cache hit');
  } else {
    console.log('cache miss')
    let movieData = await axios.get(movieDbUrl);
    movieData = movieData.data.results; // movieData is assigned an array of objs
    cache[key] = {
      timestamp: Date.now(),
      data: movieData
    };
  };
  let groomedMovieData = cache[key].data.map(obj => new Movie(obj));
  response.send(groomedMovieData);
}

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

  module.exports = getMovies;
