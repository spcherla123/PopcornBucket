import * as TMDB from '../JavaScript/tmdb_wrapper.js';


// ========================================
// Popcorn Bucket - JavaScript
// ========================================


// [Sai]
// ----------------------------------------
// Movie Search
// ----------------------------------------

function searchMovies(event) {

    // Check if the Enter key was pressed
    if (event.key === "Enter") {

        let searchText = document.getElementById("movieSearch").value;

        if (searchText.trim() === "") {

            alert("Please enter a movie name.");

        } else {

            alert("You searched for: " + searchText);
        }
    }
}

// [Daniel]
// ----------------------------------------
// Display trending
// ----------------------------------------



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

        let htmlPage = "";
        if(movie.MediaType == 'movie') {
            htmlPage =`media-details.html?movie=${movie.ID}`
        }
        else if(movie.MediaType == 'tv') {
            htmlPage =`media-details.html?show=${movie.ID}`
        }
        // 3. Inject the wide backdrop image and the title underneath
        movieCard.innerHTML = `
            <a href="${htmlPage}" class="movie-link">
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
            <a href="media-details.html?movie=${movie.ID}" class="movie-link">
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

document.querySelectorAll(".movie-scroll-container").forEach(container => {
    container.addEventListener("wheel", event => {
        if (event.deltaY !== 0) {
            event.preventDefault();
            container.scrollLeft += event.deltaY;
        }
    }, { passive: false });
});