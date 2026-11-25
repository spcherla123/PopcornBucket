import * as TMDB from '../JavaScript/tmdb_wrapper.js';

const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get('type');
const query = urlParams.get('query');
const page = Number(urlParams.get('page'));


function searchMovies(event) {

    // Check if the Enter key was pressed
    if (event.key === "Enter") {

        let searchText = document.getElementById("movieSearch").value;

        if (searchText.trim() === "") 
        {
            alert("Please enter a movie name.");

        } else {

            //alert("You searched for: " + searchText);
            window.location.href = `../HTML/search-results-page.html?type=movies&query=${searchText}&page=1`;
        }
    }
}

document.getElementById('movieSearch').addEventListener('keydown', searchMovies);



let peopleResultCount = document.getElementById("sidebar-element-People-count");
let tvResultCount = document.getElementById("sidebar-element-TVShow-count");
let movieResultCount = document.getElementById("sidebar-element-Movie-count");

const movies = await TMDB.GetMoviesBySearch(query, page);
movieResultCount.textContent = movies.total_results;

const tvShows = await TMDB.GetShowsBySearch(query);
tvResultCount.textContent = tvShows.total_results;

const people = await TMDB.GetPersonBySearch(query);
peopleResultCount.textContent = people.total_results;

const grid = document.getElementById('search-results-grid');
grid.innerHTML = ''; // Clear out any old text

let totalPages;
if(type == 'movies') {

    totalPages = movies.total_pages;

    movies.results.forEach(movie => {
        // 1. Create a container card for the single movie
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';

         const fallbackUrl = '../Resources/MissingMedia.png';

        const backdropUrl = movie.poster_path 
            ? TMDB.GetImageUrl(movie.poster_path) 
            : fallbackUrl;

        movieCard.innerHTML = `
            <a href="movie-details.html?movie=${movie.id}" class="movie-link">
                <img src="${backdropUrl}" alt="${movie.title} Backdrop" class="movie-backdrop-img">
                <h3 class="movie-title">${movie.title}</h3>
            </a>
        `;

        // 4. Throw it onto your webpage grid
        grid.appendChild(movieCard);
    });

} else if(type == 'shows') {

    totalPages = tvShows.total_pages;
    
    tvShows.results.forEach(show => {
        // 1. Create a container card for the single movie
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';

        const fallbackUrl = '../Resources/MissingMedia.png';

        const backdropUrl = show.poster_path 
            ? TMDB.GetImageUrl(show.poster_path) 
            : fallbackUrl;
                    
        movieCard.innerHTML = `
            <a href="movie-details.html?movie=${show.id}" class="movie-link">
                <img src="${backdropUrl}" alt="${show.name} Backdrop" class="movie-backdrop-img">
                <h3 class="movie-title">${show.name}</h3>
            </a>
        `;

        // 4. Throw it onto your webpage grid
        grid.appendChild(movieCard);
    });
} else if(type == 'people') {

    totalPages = people.total_pages;
    
    people.results.forEach(person => {
        // 1. Create a container card for the single movie
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';


        const fallbackUrl = '../Resources/MissingProfile.png';

        const backdropUrl = person.profile_path 
            ? TMDB.GetImageUrl(person.profile_path) 
            : fallbackUrl;


                    
        movieCard.innerHTML = `
            <a href="movie-details.html?movie=${person.id}" class="movie-link">
                <img src="${backdropUrl}" alt="${person.name} Backdrop" class="movie-backdrop-img">
                <h3 class="movie-title">${person.name}</h3>
            </a>
        `;

        // 4. Throw it onto your webpage grid
        grid.appendChild(movieCard);
    });
}

let lastPageButton = document.getElementById("page-button-last");
    let secondPageButton = document.getElementById("page-button-second");
    let thirdPageButton = document.getElementById("page-button-third");
    let fourthPageButton = document.getElementById("page-button-fourth");
    let firstPageButton = document.getElementById("page-button-first");

if(totalPages == 1) {
    firstPageButton.textContent = '';
    secondPageButton.textContent = '';
    thirdPageButton.textContent = '1';
    fourthPageButton.textContent = '';
    lastPageButton.textContent = '';
}

else if(totalPages == 2) {
    firstPageButton.textContent = '1';
    secondPageButton.textContent = '';
    thirdPageButton.textContent = '...';
    fourthPageButton.textContent = '';
    lastPageButton.textContent = '2';
}

else if(totalPages == 3) {
    firstPageButton.textContent = '1';
    secondPageButton.textContent = '...';
    thirdPageButton.textContent = '2';
    fourthPageButton.textContent = '...';
    lastPageButton.textContent = '3';
}

else if(totalPages == 5) {
    firstPageButton.textContent = '1';
    secondPageButton.textContent = '2';
    thirdPageButton.textContent = '3';
    fourthPageButton.textContent = '4';
    lastPageButton.textContent = '5';
}

else {
    
    lastPageButton.textContent = totalPages;

    if(page == 1 || page == 2) {
        secondPageButton.textContent = '2';
    }
    else {
        secondPageButton.textContent = '...';
    }


    if(page == 1 || page == 2 || page == 3) {
        thirdPageButton.textContent = '3';
    }
    else if(page == totalPages || page == (totalPages - 1) || page == (totalPages - 2)) {
        thirdPageButton.textContent = totalPages - 2;
    }
    else {
        thirdPageButton.textContent = page;
    }


    if(page == 1 || page == 2 || page == 3) {
        fourthPageButton.textContent = '...';
    }
    else if(page == totalPages || page == (totalPages - 1) || page == (totalPages - 2)) {
        fourthPageButton.textContent = totalPages - 1;
    }
    else {
        fourthPageButton.textContent = '...';
    }

    firstPageButton.textContent = '1';
}

firstPageButton.onclick = function() {
    window.location.href = `../HTML/search-results-page.html?type=${type}&query=${query}&page=1`;
};

secondPageButton.onclick = function() {
    if(secondPageButton.textContent != '...')
        window.location.href = `../HTML/search-results-page.html?type=${type}&query=${query}&page=${secondPageButton.textContent}`;
};

thirdPageButton.onclick = function() {
    window.location.href = `../HTML/search-results-page.html?type=${type}&query=${query}&page=${thirdPageButton.textContent}`;
};

fourthPageButton.onclick = function() {
    if(fourthPageButton.textContent != '...')
        window.location.href = `../HTML/search-results-page.html?type=${type}&query=${query}&page=${fourthPageButton.textContent}`;
};

lastPageButton.onclick = function() {
    window.location.href = `../HTML/search-results-page.html?type=${type}&query=${query}&page=${lastPageButton.textContent}`;
};

let nextPageButton = document.getElementById("page-button-forward");
let previousPageButton = document.getElementById("page-button-back");

nextPageButton.onclick = function() {
    if(page != totalPages)
        window.location.href = `../HTML/search-results-page.html?type=${type}&query=${query}&page=${page + 1}`;
};

previousPageButton.onclick = function() {
    if(page != 1)
        window.location.href = `../HTML/search-results-page.html?type=${type}&query=${query}&page=${page - 1}`;
};


document.getElementById('sidebar-element-TVShow').onclick = function() {
    window.location.href = `../HTML/search-results-page.html?type=shows&query=${query}&page=1`;
};

document.getElementById('sidebar-element-Movie').onclick = function() {
    window.location.href = `../HTML/search-results-page.html?type=movies&query=${query}&page=1`;
};

document.getElementById('sidebar-element-People').onclick = function() {
    window.location.href = `../HTML/search-results-page.html?type=people&query=${query}&page=1`;
};
    
