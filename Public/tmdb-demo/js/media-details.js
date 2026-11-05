import * as TMDB from '../../JavaScript/tmdb_wrapper.js';
const urlParams = new URLSearchParams(window.location.search);
const showID = urlParams.get('show');
const movieID = urlParams.get('movie');
const seasonNumber = urlParams.get('season');
const episodeNumber = urlParams.get('episode');

const seasonLabel = document.getElementById('season-label');
const seasonContainer = document.getElementById('season-scroll-container');
seasonLabel.style.display = "none";
seasonContainer.style.display = 'none';

const episodeLabel = document.getElementById('episode-label');
const episodeContainer = document.getElementById('episode-scroll-container');
episodeLabel.style.display = "none";
episodeContainer.style.display = 'none';

const guestLabel = document.getElementById("guest-label");
const guestContainer = document.getElementById("guest-stars-scroll-container");
guestLabel.style.display = 'none';
guestContainer.style.display = 'none';

const bannerContainer = document.getElementById('details-banner-container');
bannerContainer.style.display = 'initial'

const seasonBannerContainer = document.getElementById('season-details-banner-container');
seasonBannerContainer.style.display = 'none';

const backdropImg = document.getElementById('details-backdrop-banner');

const imageLabel = document.getElementById("images-label");
const imagesContainer = document.getElementById("images-scroll-container");
imageLabel.style.display = 'none';
imagesContainer.style.display = 'none';

const logosLabel = document.getElementById("logos-label");
const logosContainer = document.getElementById("logos-scroll-container");

const backdropsLabel = document.getElementById("backdrops-label");
const backdropsContainer = document.getElementById("backdrops-scroll-container");

const postersLabel = document.getElementById("posters-label");
const postersContainer = document.getElementById("posters-scroll-container");

const backButton = document.getElementById('details-back');
//backButton.href =  `media-details.html?id=${showID}&type=tv&show=${showID}&season=${seasonNumber}`

let credits;
let images;
let videos;
if(movieID) {
    const movie = await TMDB.GetMovieDetails(movieID);
    backdropImg.src = TMDB.GetImageUrl(movie.BackdropPath);
    
    document.getElementById('details-date-label').textContent = "Release Date:";
    document.getElementById('details-runtime-label').textContent = "Runtime:";
    document.getElementById('details-runtime').textContent = movie.Runtime;

    document.getElementById('details-title').textContent = movie.Title;
    document.getElementById('details-tagline').textContent = movie.Tagline || '';
    document.getElementById('details-overview').textContent = movie.Overview;
    document.getElementById('details-date').textContent = movie.ReleaseDate;
    document.getElementById('details-rating').textContent = movie.TMDBRating;

    credits = await TMDB.GetCreditsByMovie(movieID);
    images = await TMDB.GetImagesForMovie(movieID);
    videos = await TMDB.GetVideosByMovie(movieID);
}
else if(episodeNumber) 
{
   backButton.href = `media-details.html?show=${showID}&season=${seasonNumber}`;

   const episode = await TMDB.GetEpisodeDetails(showID, seasonNumber, episodeNumber);
   backdropImg.src = TMDB.GetImageUrl(episode.StillPath);
   
   document.getElementById('details-date-label').textContent = "Air Date:";
   document.getElementById('details-runtime-label').textContent = "Runtime:";
   document.getElementById('details-runtime').textContent = `${episode.Runtime} min`;
   
   document.getElementById('details-title').textContent = episode.Name;
   document.getElementById('details-tagline').textContent = episode.Tagline || '';
   document.getElementById('details-overview').textContent = episode.Overview;
   document.getElementById('details-date').textContent = episode.AirDate;
   document.getElementById('details-rating').textContent = episode.TMDBRating;
   
   credits = await TMDB.GetCreditsByEpisode(showID, seasonNumber, episodeNumber);
   images = await TMDB.GetImagesForEpisode(showID, seasonNumber, episodeNumber);
   videos = await TMDB.GetVideosByEpisode(showID, seasonNumber, episodeNumber);
}
else if(seasonNumber) 
{
    backButton.href = `media-details.html?show=${showID}`;

    const season = await TMDB.GetSeasonDetails(showID, seasonNumber);
    
    bannerContainer.style.display = 'none';
    seasonBannerContainer.style.display = 'grid';
    
    const seasonBackdropBanner = document.getElementById("season-details-backdrop-banner");
    const seasonBlurBackdropBanner = document.getElementById("season-details-blur-backdrop-banner");

    seasonBackdropBanner.src = TMDB.GetImageUrl(season.PosterPath);
    seasonBlurBackdropBanner.src = TMDB.GetImageUrl(season.PosterPath);


    
    document.getElementById('details-date-label').textContent = "First Air Date:";
    document.getElementById('details-runtime-label').textContent = "Episodes:";
    document.getElementById('details-runtime').textContent = `${season.EpisodeCount}`;
    
    document.getElementById('details-title').textContent = season.Name;
    document.getElementById('details-tagline').textContent = season.Tagline || '';
    document.getElementById('details-overview').textContent = season.Overview;
    document.getElementById('details-date').textContent = season.AirDate;
    document.getElementById('details-rating').textContent = season.TMDBRating;

    credits = await TMDB.GetCreditsByShow(showID);
    images = await TMDB.GetImagesForSeason(showID, seasonNumber);
    videos = await TMDB.GetVideosBySeason(showID, seasonNumber);

    
    if(season.Episodes.length == 0) {
        episodeLabel.style.display = 'none';
        episodeContainer.style.display = 'none';
    }
    else {
        episodeLabel.style.display = 'initial';
        episodeContainer.style.display = 'flex';
    }

    // Clear any existing boilerplate HTML inside the container
    episodeContainer.innerHTML = '';
    
    // Loop through data and build cards
    season.Episodes.forEach(episodeItem => {
        const episodeCard = document.createElement('div');
        episodeCard.className = 'season-card';
    
        episodeCard.innerHTML = `
            <a href="media-details.html?show=${showID}&season=${episodeItem.SeasonNumber}&episode=${episodeItem.EpisodeNumber}" class="movie-link">
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
}
else if(showID) 
{
    const tvShow = await TMDB.GetShowDetails(showID);
    
    backdropImg.src = TMDB.GetImageUrl(tvShow.BackdropPath);
            
    document.getElementById('details-date-label').textContent = "First Air Date:";
    document.getElementById('details-runtime-label').textContent = "Seasons:";
    document.getElementById('details-runtime').textContent = tvShow.NumberOfSeasons;

    document.getElementById('details-title').textContent = tvShow.Name;
    document.getElementById('details-tagline').textContent = tvShow.Tagline || '';
    document.getElementById('details-overview').textContent = tvShow.Overview;
    document.getElementById('details-date').textContent = tvShow.FirstAirDate;
    document.getElementById('details-rating').textContent = tvShow.TMDBRating;

    credits = await TMDB.GetCreditsByShow(showID);
    images = await TMDB.GetImagesForShow(showID);
    videos = await TMDB.GetVideosByShow(showID);

    // Clear any existing HTML inside the container
   
    seasonContainer.innerHTML = '';
    
    if(tvShow.Seasons.length == 0) {
        seasonLabel.style.display = 'none';
        seasonContainer.style.display = 'none';
    }
    else {
        seasonLabel.style.display = 'initial';
        seasonContainer.style.display = 'flex';
    }
    
    // Loop through data and build cards
    tvShow.Seasons.forEach(seasonItem => {
        const card = document.createElement('div');
        card.className = 'season-card';
    
        card.innerHTML = `
            <a href="media-details.html?show=${tvShow.ID}&season=${seasonItem.SeasonNumber}" class="movie-link">
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
}

let backFromCreditsInfo;
if(movieID) {
    backFromCreditsInfo =  `movie=${movieID}`;
}
else if(episodeNumber) {
    backFromCreditsInfo =  `show=${showID}&season=${seasonNumber}&episode=${episodeNumber}`;
}
else if(seasonNumber) {
    backFromCreditsInfo =  `show=${showID}&season=${seasonNumber}`;
}
else if(showID) {
    backFromCreditsInfo =  `show=${showID}`;
}

// Cast
const castLabel = document.getElementById("cast-label");
const castContainer = document.getElementById("cast-scroll-container");
castContainer.innerHTML = "";
        
    if(credits.Cast.length == 0) {
        castLabel.style.display = 'none';
        castContainer.style.display = 'none';
    }

    // 4. Loop through each actor in your database list
    credits.Cast.forEach(credit => {
        // Create a brand new div element for the card
        const card = document.createElement("div");
        card.classList.add("cast-card");

        // Fill the card with the exact HTML template structure
        card.innerHTML = `
        <a href="person-details.html?id=${credit.ID}&${backFromCreditsInfo}" class="movie-link">
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
const crewLabel = document.getElementById("crew-label");
const crewContainer = document.getElementById("crew-scroll-container");
crewContainer.innerHTML = "";
        
if(credits.Crew.length == 0) {
    crewLabel.style.display = 'none';
    crewContainer.style.display = 'none';
}

// 4. Loop through each actor in your database list
credits.Crew.forEach(credit => {
    // Create a brand new div element for the card
    const card = document.createElement("div");
    card.classList.add("cast-card");

    // Fill the card with the exact HTML template structure
    card.innerHTML = `
    <a href="person-details.html?id=${credit.ID}&${backFromCreditsInfo}" class="movie-link">
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

// Guest Stars only for episodes
if(episodeNumber) {
    guestContainer.innerHTML = "";
                
    if(credits.GuestStars.length == 0) {
        guestLabel.style.display = 'none';
        guestContainer.style.display = 'none';
    }
    else {
        guestLabel.style.display = 'initial';
        guestContainer.style.display = 'flex';
    }
    // 4. Loop through each actor in your database list
    credits.GuestStars.forEach(credit => {
        // Create a brand new div element for the card
        const card = document.createElement("div");
        card.classList.add("cast-card");

        // Fill the card with the exact HTML template structure
        card.innerHTML = `
        <a href="person-details.html?id=${credit.ID}&${backFromCreditsInfo}" class="movie-link">
            <div class="cast-image-circle">
                <img src="${TMDB.GetImageUrl(credit.ProfilePath)}" alt="${credit.Name}">
            </div>
            <div class="cast-actor-name">${credit.Name}</div>
            <div class="cast-character-role">${credit.Character}</div>
        </a>
        `;

        // Stick the finished card right into the container
        guestContainer.appendChild(card);
    });
}

if(episodeNumber || seasonNumber) {
    // Clear any existing boilerplate HTML inside the container
   imagesContainer.innerHTML = '';
   
   imageLabel.style.display = 'initial';
   imagesContainer.style.display = 'flex';

   logosLabel.style.display = 'none';
   logosContainer.style.display = 'none';
   
   postersLabel.style.display = 'none';
   postersContainer.style.display = 'none';

   backdropsLabel.style.display = 'none';
   backdropsContainer.style.display = 'none';

   // Loop through data and build cards
   images.forEach(imageItem => {
       const card = document.createElement('div');
       card.className = 'image-card';
   
       card.innerHTML = `
           <div class="image-wrapper">
               <img src="${TMDB.GetImageUrl(imageItem.FilePath)}" alt="" class="image" loading="lazy"  aspect-ratio= ${imageItem.AspectRatio}>
           </div>
       `;
   
       imagesContainer.appendChild(card);
   });
}
else if(showID || movieID) {
    // Clear any existing boilerplate HTML inside the container
    const backdropsContainer = document.getElementById("backdrops-scroll-container");
    backdropsContainer.innerHTML = '';

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
}


const videoLabel = document.getElementById("video-label");
const videoContainer = document.getElementById("video-scroll-container");
videoContainer.innerHTML = '';
        
if(videos.length == 0) {
      videoLabel.style.display = "none";
      videoContainer.style.display = 'none';
}
    
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
