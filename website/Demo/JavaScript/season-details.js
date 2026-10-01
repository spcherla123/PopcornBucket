 import * as TMDB from '../../tmdb_wrapper.js';

const urlParams = new URLSearchParams(window.location.search);
const showID = urlParams.get('show');
const seasonNumber = urlParams.get('season');

const backButton = document.getElementById('season-details-back');
backButton.href =  `tv-details.html?id=${showID}&type=tv`

const season = await TMDB.GetSeasonDetails(showID, seasonNumber);

const backdropImg = document.getElementById('season-details-backdrop-banner');
backdropImg.src = TMDB.GetImageUrl(season.PosterPath);

const blurBackdropImg = document.getElementById('season-details-blur-backdrop-banner');
blurBackdropImg.src = TMDB.GetImageUrl(season.PosterPath);

document.getElementById('season-details-date-label').textContent = "First Air Date:";
document.getElementById('season-details-runtime-label').textContent = "Episodes:";
document.getElementById('season-details-runtime').textContent = `${season.EpisodeCount}`;

document.getElementById('season-details-title').textContent = season.Name;
document.getElementById('season-details-tagline').textContent = season.Tagline || '';
document.getElementById('season-details-overview').textContent = season.Overview;
document.getElementById('season-details-date').textContent = season.AirDate;
document.getElementById('season-details-rating').textContent = season.TMDBRating;

const credits = await TMDB.GetCreditsByShow(showID);
      
// Cast
const castContainer = document.getElementById("season-cast-scroll-container");
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
  const crewContainer = document.getElementById("season-crew-scroll-container");
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

 const episodeContainer = document.getElementById('episode-scroll-container');
  
    // Clear any existing boilerplate HTML inside the container
    episodeContainer.innerHTML = '';

    // Loop through data and build cards
    season.Episodes.forEach(episodeItem => {
        const episodeCard = document.createElement('div');
        episodeCard.className = 'season-card';

        episodeCard.innerHTML = `
            <a href="episode-details.html?show=${showID}&season=${episodeItem.SeasonNumber}&episode=${episodeItem.EpisodeNumber}" class="movie-link">
            <div class="episode-poster-wrapper">
                <img src="${TMDB.GetImageUrl(episodeItem.StillPath)}" alt="Episode ${-1} Poster" class="episode-poster-img" loading="lazy">
            </div>
            <div class="episode-meta-container">
                <div class="episode-number-row">
                    ${episodeItem.EpisodeNumber}: ${episodeItem.Name}
                </div>
                <div class="episode-details-row">
                    <span class="episode-rating">⭐ ${episodeItem.TMDBRating}</span>
                    <span class="episode-separator">•</span>
                    <span class="episode-release-date">${episodeItem.AirDate} </span>
                </div>
            </div>
        `;

        episodeContainer.appendChild(episodeCard);
    });

// Clear any existing boilerplate HTML inside the container
const imagesContainer = document.getElementById("images-scroll-container");
imagesContainer.innerHTML = '';

const images = await TMDB.GetImagesForSeason(showID, seasonNumber)

// Loop through data and build cards
images.forEach(imageItem => {
    const card = document.createElement('div');
    card.className = 'image-card';
    
    card.innerHTML = `
        <div class="image-wrapper">
            <img src="${TMDB.GetImageUrl(imageItem.FilePath)}" alt="Unable to Load Image" class="image" loading="lazy"  aspect-ratio= ${imageItem.AspectRatio}>
        </div>
    `;

    imagesContainer.appendChild(card);
});

const videoContainer = document.getElementById("video-scroll-container");
    videoContainer.innerHTML = '';
    
    const videos = await TMDB.GetVideosBySeason(showID, seasonNumber);
    
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