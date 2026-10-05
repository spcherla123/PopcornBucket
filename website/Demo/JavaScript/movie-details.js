 import * as TMDB from '../../tmdb_wrapper.js';
 
// 1. Grab the Movie ID from the browser's URL bar
const urlParams = new URLSearchParams(window.location.search);
const movieID = urlParams.get('id');

const castContainer = document.getElementById("cast-scroll-container");
const videoContainer = document.getElementById("video-scroll-container");

try {
    const movie = await TMDB.GetMovieDetails(movieID);

    // Revert to Movie text labels (in case of page re-use)
    document.getElementById('details-date-label').textContent = "Release Date:";
    document.getElementById('details-runtime-label').textContent = "Runtime:";
    document.getElementById('details-runtime').textContent = movie.Runtime;

    document.getElementById('details-title').textContent = movie.Title;
    document.getElementById('details-tagline').textContent = movie.Tagline || '';
    document.getElementById('details-overview').textContent = movie.Overview;
    document.getElementById('details-date').textContent = movie.ReleaseDate;
    document.getElementById('details-rating').textContent = movie.TMDBRating;

    const backdropImg = document.getElementById('details-backdrop-banner');
    backdropImg.src = TMDB.GetImageUrl(movie.BackdropPath);

    const credits = await TMDB.GetCreditsByMovie(movieID);
   
    // Cast
    const castContainer = document.getElementById("movie-cast-scroll-container");
    castContainer.innerHTML = "";
               
               // 4. Loop through each actor in your database list
               credits.Cast.forEach(credit => {
                   // Create a brand new div element for the card
                   const card = document.createElement("div");
                   card.classList.add("cast-card");
   
                   // Fill the card with the exact HTML template structure
                   card.innerHTML = `
                   <a href="person-details.html?id=${credit.ID}" class="movie-link">
                       <div class="cast-image-circle">
                           <img src="${TMDB.GetImageUrl(credit.ProfilePath)}" alt="${credit.Name}">
                       </div>
                       <div class="cast-actor-name">${credit.Name}</div>
                       <div class="cast-character-role">${credit.Character}</div>
                    </a>
                   `;
   
                   // Stick the finished card right into the container
                   castContainer.appendChild(card);
               });
   
   // Crew
   const crewContainer = document.getElementById("movie-crew-scroll-container");
   crewContainer.innerHTML = "";
           
               // 4. Loop through each actor in your database list
               credits.Crew.forEach(credit => {
                   // Create a brand new div element for the card
                   const card = document.createElement("div");
                   card.classList.add("cast-card");
   
                   // Fill the card with the exact HTML template structure
                   card.innerHTML = `
                   <a href="person-details.html?id=${credit.ID}" class="movie-link">

                       <div class="cast-image-circle">
                           <img src="${TMDB.GetImageUrl(credit.ProfilePath)}" alt="${credit.Name}">
                       </div>
                       <div class="cast-actor-name">${credit.Name}</div>
                       <div class="cast-character-role">${credit.Job}</div>
                    </a>
                   `;
   
                   // Stick the finished card right into the container
                   crewContainer.appendChild(card);
               });

    // Clear any existing boilerplate HTML inside the container
    const backdropsContainer = document.getElementById("backdrops-scroll-container");
    backdropsContainer.innerHTML = '';

    const images = await TMDB.GetImagesForMovie(movieID)

    // Loop through data and build cards
    images.Backdrops.forEach(imageItem => {
        const card = document.createElement('div');
        card.className = 'image-card';

        card.innerHTML = `
            <div class="image-wrapper">
                <img src="${TMDB.GetImageUrl(imageItem.FilePath)}" alt="Unable to Load" class="image" loading="lazy"  aspect-ratio= ${imageItem.AspectRatio}>
            </div>
        `;

        backdropsContainer.appendChild(card);
    });

    const postersContainer = document.getElementById("posters-scroll-container");
    postersContainer.innerHTML = '';

    images.Posters.forEach(imageItem => {
        const card = document.createElement('div');
        card.className = 'image-card';

        card.innerHTML = `
            <div class="image-wrapper">
                <img src="${TMDB.GetImageUrl(imageItem.FilePath)}" alt="Unable to Load" class="image" loading="lazy"  aspect-ratio= ${imageItem.AspectRatio}>
            </div>
        `;

        postersContainer.appendChild(card);
    });

    const logosContainer = document.getElementById("logos-scroll-container");
    logosContainer.innerHTML = '';

    images.Logos.forEach(imageItem => {
        const card = document.createElement('div');
        card.className = 'image-card';

        card.innerHTML = `
            <div class="image-wrapper">
                <img src="${TMDB.GetImageUrl(imageItem.FilePath)}" alt="Unable to Load" class="image" loading="lazy"  aspect-ratio= ${imageItem.AspectRatio}>
            </div>
        `;

        logosContainer.appendChild(card);
    });


    const videoContainer = document.getElementById("video-scroll-container");
    videoContainer.innerHTML = '';

    const videos = await TMDB.GetVideosByMovie(movieID);

    videos.forEach(videoItem => {   
        if (videoItem.site !== "YouTube") return; // Skip unsupported platforms for now

        const card = document.createElement('div');
        card.className = 'video-card'; 

        // 1. Set up a lightweight thumbnail placeholder using YouTube's image servers
        card.innerHTML = `
            <div class="video-player-container" data-video-key="${videoItem.key}">
                <img class="video-thumbnail" src="https://img.youtube.com/vi/${videoItem.key}/maxresdefault.jpg" alt="${videoItem.name}">
                <div class="play-button-overlay">▶</div>
            </div>
            <div class="video-meta">
                <h3 class="video-title"> ${videoItem.name} </h3>
                <span class="video-type badge">| ${videoItem.type}</span>
            </div>
        `;

        // 2. Add an event listener so the heavy video ONLY loads when someone clicks the card
        card.querySelector('.video-player-container').addEventListener('click', function() {
            const videoKey = this.getAttribute('data-video-key');
            
            // Swap the image out for the live iframe with autoplay safely turned on here
            this.innerHTML = `
                <iframe 
                    src="https://youtube.com/embed/${videoItem.key}?autoplay=1&mute=1&rel=0" 
                    title="Video Player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>`;
        });

        videoContainer.appendChild(card);
    });

} catch (error) {
    console.error("Error loading movie details:", error);
    document.getElementById('movie-title').textContent = "Failed to load movie details.";
}