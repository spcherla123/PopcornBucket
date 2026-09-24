import * as TMDB from '../../tmdb_wrapper.js';

TMDB.Authenticate();

// 1. Find the HTML elements using their IDs
const textBox = document.getElementById("search");
const button = document.getElementById("myButton");
//const resultParagraph = document.getElementById("result");

// 2. Wait for the user to click the button
button.addEventListener("click", function() {
    // 3. Get the text from the box using .value
    const userText = textBox.value;
    
    // 4. Print it on the screen
    DisplaySearchResults(userText);
});

async function DisplaySearchResults(InSearchText) {
        // Search
    try {
        const movies = await TMDB.GetMoviesBySearch(InSearchText);

        const grid = document.getElementById('results-grid');
        grid.innerHTML = ''; // Clear out any old text

        movies.forEach(movie => {
        // 1. Create a container card for the single movie
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';

        // 2. Combine the base image URL with the backdrop path
        // use a fallback image in case the movie doesn't have a backdrop
        const backdropUrl = TMDB.GetImageUrl(movie.PosterPath);
        
        movieCard.innerHTML = `
            <a href="movie-details.html?id=${movie.ID}" class="movie-link">
                <img src="${backdropUrl}" alt="${movie.Title} Backdrop" class="movie-backdrop-img">
                <h3 class="movie-title">${movie.Title}</h3>
            </a>
        `;

        // 4. Throw it onto your webpage grid
        grid.appendChild(movieCard);
        });
    } catch (error) {
        console.error("Oops! Couldn't load the popular movies:", error);
    }

}


// Popular movies
try {       
    const movies = await TMDB.GetPopularMovies();

    const grid = document.getElementById('movie-grid');
    grid.innerHTML = ''; // Clear out any old text

    movies.forEach(movie => {
        // 1. Create a container card for the single movie
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';

        // 2. Combine the base image URL with the backdrop path
        // use a fallback image in case the movie doesn't have a backdrop

        const backdropUrl = TMDB.GetImageUrl(movie.PosterPath);

        // 3. Inject the wide backdrop image and the title underneath
        movieCard.innerHTML = `
            <a href="movie-details.html?id=${movie.ID}" class="movie-link">
              <img src="${backdropUrl}" alt="${movie.Title} Backdrop" class="movie-backdrop-img">
              <h3 class="movie-title">${movie.Title}</h3>
            </a>
        `;

        // 4. Throw it onto your webpage grid
        grid.appendChild(movieCard);
    });
} catch (error) {
    console.error("Oops! Couldn't load the popular movies:", error);
}

// Trending
try {
    const movies = await TMDB.GetTrendingAll();

    const grid = document.getElementById('trending-all-grid');
    grid.innerHTML = ''; // Clear out any old text

    movies.forEach(movie => {
        // 1. Create a container card for the single movie
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';

        // 2. Combine the base image URL with the backdrop path
        // use a fallback image in case the movie doesn't have a backdrop
        const backdropUrl = TMDB.GetImageUrl(movie.PosterPath);

        const htmlPage = movie.MediaType == 'movie' ? 'movie-details' : 'tv-details';

        // 3. Inject the wide backdrop image and the title underneath
        movieCard.innerHTML = `
            <a href="${htmlPage}.html?id=${movie.ID}" class="movie-link">
                <img src="${backdropUrl}" alt="${movie.TitleOrName} Backdrop" class="movie-backdrop-img">
                <h3 class="movie-title">${movie.TitleOrName}</h3>
            </a>
        `;

        // 4. Throw it onto your webpage grid
        grid.appendChild(movieCard);
    });
} catch (error) {
    console.error("Oops! Couldn't load the popular movies:", error);
}

try {
    const movies = await TMDB.GetPopularMovies();

    movies.forEach(movie => {
        
        async function PrintDetails() {
            const details = await TMDB.GetMovieDetails(movie.ID);
            console.info(details.Title);
            console.info(details.Tagline);
            console.info(details.Overview);
            console.info(details.TMDBRating);
            console.info(details.Runtime);
            console.info(details.ReleaseDate);
            console.info(details.PosterPath);
            console.info(details.BackdropPath);
        }

        PrintDetails();

    });
} catch (error) {
    console.error("Oops! Couldn't load the popular movies:", error);
}

