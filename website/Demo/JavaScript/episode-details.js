import * as TMDB from '../../tmdb_wrapper.js';

const urlParams = new URLSearchParams(window.location.search);
const showID = urlParams.get('show');
const seasonNumber = urlParams.get('season');
const episodeNumber = urlParams.get('episode');

const backButton = document.getElementById('season-details-back');
backButton.href =  `season-details.html?id=${showID}&type=tv&show=${showID}&season=${seasonNumber}`

const episode = await TMDB.GetEpisodeDetails(showID, seasonNumber, episodeNumber);

const backdropImg = document.getElementById('details-backdrop-banner');
backdropImg.src = TMDB.GetImageUrl(episode.StillPath);

document.getElementById('season-details-date-label').textContent = "Air Date:";
document.getElementById('season-details-runtime-label').textContent = "Runtime:";
document.getElementById('season-details-runtime').textContent = `${episode.Runtime} min`;

document.getElementById('season-details-title').textContent = episode.Name;
document.getElementById('season-details-tagline').textContent = episode.Tagline || '';
document.getElementById('season-details-overview').textContent = episode.Overview;
document.getElementById('season-details-date').textContent = episode.AirDate;
document.getElementById('season-details-rating').textContent = episode.TMBDRating;

const credits = await TMDB.GetCreditsByEpisode(showID, seasonNumber, episodeNumber);

// Cast
const castContainer = document.getElementById("episode-cast-scroll-container");
castContainer.innerHTML = "";
        
            // 4. Loop through each actor in your database list
            credits.Cast.forEach(credit => {
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

// Crew
const crewContainer = document.getElementById("episode-crew-scroll-container");
crewContainer.innerHTML = "";
        
            // 4. Loop through each actor in your database list
            credits.Crew.forEach(credit => {
                // Create a brand new div element for the card
                const card = document.createElement("div");
                card.classList.add("cast-card");

                // Fill the card with the exact HTML template structure
                card.innerHTML = `
                    <div class="cast-image-circle">
                        <img src="${TMDB.GetImageUrl(credit.ProfilePath)}" alt="${credit.Name}">
                    </div>
                    <div class="cast-actor-name">${credit.Name}</div>
                    <div class="cast-character-role">${credit.Job}</div>
                `;

                // Stick the finished card right into the container
                crewContainer.appendChild(card);
            });

// Guest Stars
const guestContainer = document.getElementById("episode-guest-stars-scroll-container");
guestContainer.innerHTML = "";
        
            // 4. Loop through each actor in your database list
            credits.GuestStars.forEach(credit => {
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
                guestContainer.appendChild(card);
            });

// Clear any existing boilerplate HTML inside the container
const imagesContainer = document.getElementById("images-scroll-container");
imagesContainer.innerHTML = '';

const images = await TMDB.GetImagesForEpisode(showID, seasonNumber, episodeNumber)

// Loop through data and build cards
images.forEach(imageItem => {
    const card = document.createElement('div');
    card.className = 'image-card';

    card.innerHTML = `
        <div class="image-wrapper">
            <img src="${TMDB.GetImageUrl(imageItem.FilePath)}" alt="Episode ${episodeNumber} Image" class="image" loading="lazy"  aspect-ratio= ${imageItem.AspectRatio}>
        </div>
    `;

    imagesContainer.appendChild(card);
});
