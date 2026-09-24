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
    document.getElementById('details-rating').textContent = movie.TMBDRating;

    const backdropImg = document.getElementById('details-backdrop-banner');
    backdropImg.src = TMDB.GetImageUrl(movie.BackdropPath);

    castContainer.innerHTML = "";
    const credits = await TMDB.GetCreditsByMovie(movie.ID, 'w1000');
        
    // 4. Loop through each actor in your database list
    credits.forEach(credit => {
        // Create a brand new div element for the card
        const card = document.createElement("div");
        card.classList.add("cast-card");
        // Fill the card with the exact HTML template structure
        card.innerHTML = `
            <div class="cast-image-circle">
                <img src="${TMDB.GetImageUrl(credit.ProfilePath)}" alt="${credit.Name}">
            </div>
            <div class="cast-actor-name">${credit.Name}</div>
            <div class="cast-character-role">${credit.Character}</div>
        `;

        // Stick the finished card right into the container
        castContainer.appendChild(card);
    });        



    castContainer.addEventListener("wheel", (event) => {
                event.preventDefault(); 
                castContainer.scrollLeft += event.deltaY;
            });


    // Clear any existing boilerplate HTML inside the container
    const imagesContainer = document.getElementById("images-scroll-container");
    imagesContainer.innerHTML = '';

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

        imagesContainer.appendChild(card);
    });

    images.Posters.forEach(imageItem => {
        const card = document.createElement('div');
        card.className = 'image-card';

        card.innerHTML = `
            <div class="image-wrapper">
                <img src="${TMDB.GetImageUrl(imageItem.FilePath)}" alt="Unable to Load" class="image" loading="lazy"  aspect-ratio= ${imageItem.AspectRatio}>
            </div>
        `;

        imagesContainer.appendChild(card);
    });


    images.Logos.forEach(imageItem => {
        const card = document.createElement('div');
        card.className = 'image-card';

        card.innerHTML = `
            <div class="image-wrapper">
                <img src="${TMDB.GetImageUrl(imageItem.FilePath)}" alt="Unable to Load" class="image" loading="lazy"  aspect-ratio= ${imageItem.AspectRatio}>
            </div>
        `;

        imagesContainer.appendChild(card);
    });


/*const videoContainer = document.getElementById("video-scroll-container");
videoContainer.innerHTML = '';

const videos = await TMDB.GetVideosByMovieID(movieID);

videos[0]

videos.forEach(videoItem => {   

    const card = document.createElement('div');

    card.className = 'video-card';


    let playerHTML;
    if (videoItem.site === "YouTube")
    {
        // Construct standard YouTube embed with autoplay enabled & muted to comply with modern browser rules
       playerHTML = `
        <iframe 
            src="https://youtube.com/embed/${videoItem.key}?autoplay=1&mute=1&rel=0" 
            title="${videoItem.name}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" 
            allowfullscreen>
            
        iframe>
        `;
    } else {
        playerHTML = `<p style="padding:20px;">Unsupported streaming platform: ${data.site}</p>`;
    }

    card.innerHTML = `
          <div id="video-player-container" class="video-player-container"></div>
          <div class="video-meta">
            <h2 id="video-title">Loading}</h2>
            <span id="video-type" class="badge">uh</span>
          </div>
    `;

    videoContainer.appendChild(card);
});*/

} catch (error) {
    console.error("Error loading movie details:", error);
    document.getElementById('movie-title').textContent = "Failed to load movie details.";
}