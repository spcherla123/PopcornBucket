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
    document.getElementById('details-rating').textContent = tvShow.TMDBRating;
        
    const backdropImg = document.getElementById('details-backdrop-banner');
    backdropImg.src = TMDB.GetImageUrl(tvShow.BackdropPath);
            
    const credits = await TMDB.GetCreditsByShow(showID);
      
    // Cast
    const castContainer = document.getElementById("show-cast-scroll-container");
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
      
    castContainer.addEventListener("wheel", (event) => {
            event.preventDefault(); 
            castContainer.scrollLeft += event.deltaY;
        });

      // Crew
      const crewContainer = document.getElementById("show-crew-scroll-container");
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

     crewContainer.addEventListener("wheel", (event) => {
            event.preventDefault(); 
            crewContainer.scrollLeft += event.deltaY;
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
                    <span class="season-rating">⭐ ${seasonItem.TMDBRating}</span>
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




    // Clear any existing boilerplate HTML inside the container
    const backdropsContainer = document.getElementById("backdrops-scroll-container");
    backdropsContainer.innerHTML = '';

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
    
    const videos = await TMDB.GetVideosByShow(showID);
    
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