import * as TMDB from '../JavaScript/tmdb_wrapper.js';

const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('query');

let peopleResultCount = document.getElementById("sidebar-element-People-count");
let tvResultCount = document.getElementById("sidebar-element-TVShow-count");
let movieResultCount = document.getElementById("sidebar-element-Movie-count");


const movies = await TMDB.GetMoviesBySearch(query);
movieResultCount.textContent = movies.total_results;

const tvShows = await TMDB.GetShowsBySearch(query);
tvResultCount.textContent = tvShows.total_results;

const people = await TMDB.GetPersonBySearch(query);
peopleResultCount.textContent = people.total_results;

document.getElementById('sidebar-element-TVShow').onclick = function() {
    alert('Button clicked!');
};

document.getElementById('sidebar-element-Movie').onclick = function() {
    alert('Button clicked!');
};

document.getElementById('sidebar-element-People').onclick = function() {
    alert('Button clicked!');
};
    
const grid = document.getElementById('search-results-grid');
grid.innerHTML = ''; // Clear out any old text

movies.results.forEach(movie => {
    // 1. Create a container card for the single movie
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';

    // 2. Combine the base image URL with the backdrop path
    // use a fallback image in case the movie doesn't have a backdrop
    const backdropUrl = TMDB.GetImageUrl(movie.poster_path);
                
    movieCard.innerHTML = `
        <a href="movie-details.html?movie=${movie.id}" class="movie-link">
            <img src="${backdropUrl}" alt="${movie.title} Backdrop" class="movie-backdrop-img">
            <h3 class="movie-title">${movie.title}</h3>
        </a>
    `;

    // 4. Throw it onto your webpage grid
    grid.appendChild(movieCard);
});
