 import * as TMDB from '../../tmdb_wrapper.js';
 
// 1. Grab the Movie ID from the browser's URL bar
const urlParams = new URLSearchParams(window.location.search);
const showID = urlParams.get('id');

const castContainer = document.getElementById("cast-scroll-container");
const seasonContainer = document.getElementById('season-scroll-container');

try {
    const tvShow = await TMDB.GetShowDetails(showID);

    // Swap to TV text labels
    document.getElementById('details-date-label').textContent = "First Air Date:";
    document.getElementById('details-runtime-label').textContent = "Seasons:";
    document.getElementById('details-runtime').textContent = tvShow.NumberOfSeasons;

    document.getElementById('details-title').textContent = tvShow.Name;
    document.getElementById('details-tagline').textContent = tvShow.Tagline || '';
    document.getElementById('details-overview').textContent = tvShow.Overview;
    document.getElementById('details-date').textContent = tvShow.FirstAirDate;
    document.getElementById('details-rating').textContent = tvShow.TMBDRating;
        
    const backdropImg = document.getElementById('details-backdrop-banner');
    backdropImg.src = TMDB.GetImageUrl(tvShow.BackdropPath);
            
    castContainer.innerHTML = "";
    const credits = await TMDB.GetCreditsByShow(tvShow.ID);
        
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

        
  
    // Clear any existing boilerplate HTML inside the container
    seasonContainer.innerHTML = '';

    // Loop through data and build cards
    tvShow.Seasons.forEach(seasonItem => {
        const card = document.createElement('div');
        card.className = 'season-card';

        card.innerHTML = `
            <a href="season-details.html?show=${tvShow.ID}&season=${seasonItem.SeasonNumber}" class="movie-link">
            <div class="season-poster-wrapper">
                <img src="${TMDB.GetImageUrl(seasonItem.PosterPath)}" alt="Season ${seasonItem.SeasonNumber} Poster" class="season-poster-img" loading="lazy">
            </div>
            <div class="season-meta-container">
                <div class="season-number-row">
                    Season ${seasonItem.SeasonNumber}
                </div>
                <div class="season-details-row">
                    <span class="season-rating">⭐ ${seasonItem.TMBDRating}</span>
                    <span class="season-separator">•</span>
                    <span class="season-release-date">${seasonItem.AirDate} </span>
                </div>
            </div>
        `;

        seasonContainer.appendChild(card);
    });

        
} catch (error) {
    console.error("Error loading movie details:", error);
    document.getElementById('movie-title').textContent = "Failed to load movie details.";
}


castContainer.addEventListener("wheel", (event) => {
            event.preventDefault(); 
            castContainer.scrollLeft += event.deltaY;
        });

    // Clear any existing boilerplate HTML inside the container
    const imagesContainer = document.getElementById("images-scroll-container");
    imagesContainer.innerHTML = '';

    const images = await TMDB.GetImagesForShow(showID)

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