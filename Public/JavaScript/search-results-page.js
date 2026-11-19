import * as TMDB from '../JavaScript/tmdb_wrapper.js';

const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('query');
const page = Number(urlParams.get('page'));

let peopleResultCount = document.getElementById("sidebar-element-People-count");
let tvResultCount = document.getElementById("sidebar-element-TVShow-count");
let movieResultCount = document.getElementById("sidebar-element-Movie-count");

const movies = await TMDB.GetMoviesBySearch(query, page);
movieResultCount.textContent = movies.total_results;

const tvShows = await TMDB.GetShowsBySearch(query);
tvResultCount.textContent = tvShows.total_results;

const people = await TMDB.GetPersonBySearch(query);
peopleResultCount.textContent = people.total_results;

let lastPageButton = document.getElementById("page-button-last");
lastPageButton.textContent = movies.total_pages;


let secondPageButton = document.getElementById("page-button-second");

if(page == 1 || page == 2) {
    secondPageButton.textContent = '2';
}
else {
    secondPageButton.textContent = '...';
}

let thirdPageButton = document.getElementById("page-button-third");

if(page == 1 || page == 2 || page == 3) {
    thirdPageButton.textContent = '3';
}
else if(page == movies.total_pages || page == (movies.total_pages - 1) || page == (movies.total_pages - 2)) {
    thirdPageButton.textContent = movies.total_pages - 2;
}
else {
    thirdPageButton.textContent = page;
}

let fourthPageButton = document.getElementById("page-button-fourth");

if(page == 1 || page == 2 || page == 3) {
    fourthPageButton.textContent = '...';
}
else if(page == movies.total_pages || page == (movies.total_pages - 1) || page == (movies.total_pages - 2)) {
    fourthPageButton.textContent = movies.total_pages - 1;
}
else {
    fourthPageButton.textContent = '...';
}

let firstPageButton = document.getElementById("page-button-first");
firstPageButton.textContent = '1';

firstPageButton.onclick = function() {
    window.location.href = `../HTML/search-results-page.html?query=${query}&page=1`;
};

secondPageButton.onclick = function() {
    if(secondPageButton.textContent != '...')
        window.location.href = `../HTML/search-results-page.html?query=${query}&page=${secondPageButton.textContent}`;
};

thirdPageButton.onclick = function() {
    window.location.href = `../HTML/search-results-page.html?query=${query}&page=${thirdPageButton.textContent}`;
};

fourthPageButton.onclick = function() {
    if(fourthPageButton.textContent != '...')
        window.location.href = `../HTML/search-results-page.html?query=${query}&page=${fourthPageButton.textContent}`;
};

lastPageButton.onclick = function() {
    window.location.href = `../HTML/search-results-page.html?query=${query}&page=${lastPageButton.textContent}`;
};

let nextPageButton = document.getElementById("page-button-forward");
let previousPageButton = document.getElementById("page-button-back");

nextPageButton.onclick = function() {
    if(page != movies.total_pages)
        window.location.href = `../HTML/search-results-page.html?query=${query}&page=${page + 1}`;
};

previousPageButton.onclick = function() {
    if(page != 1)
        window.location.href = `../HTML/search-results-page.html?query=${query}&page=${page - 1}`;
};


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
