'use strict';

const axios = require('axios')

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
};

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
