 import * as TMDB from '../../tmdb_wrapper.js';
 
// 1. Grab the Movie ID from the browser's URL bar
const urlParams = new URLSearchParams(window.location.search);
const personID = urlParams.get('id');
const movieID = urlParams.get('movie_id');
const showID = urlParams.get('show_id');
const seasonNumber = urlParams.get('season');
const episodeNumber = urlParams.get('episode');





//const castContainer = document.getElementById("cast-scroll-container");
//const seasonContainer = document.getElementById('person-scroll-container');

const backButton = document.getElementById('person-back-to-page-button');

if(movieID) {
    backButton.href =  `movie-details.html?id=${movieID}&type=movie`;
}
else if(episodeNumber) {
    backButton.href =  `episode-details.html?show=${showID}&season=${seasonNumber}&episode=${episodeNumber}`;
}
else if(seasonNumber) {
    backButton.href =  `season-details.html?show=${showID}&season=${seasonNumber}`;
}
else if(showID) {
    backButton.href =  `tv-details.html?id=${showID}`;
}

try {
    const person = await TMDB.GetPersonDetails(personID);

    // Swap to TV text labels
    document.getElementById('details-date-label').textContent = "Birthday:";
    document.getElementById('details-death-label').textContent = "Deathday:";
    document.getElementById('details-gender-label').textContent = "Gender:";

    document.getElementById('details-death').textContent = person.Deathday ? person.Deathday : "Alive";

    document.getElementById('details-title').textContent = person.Name;
    document.getElementById('details-known-for').textContent = person.KnownForDepartment;

    document.getElementById('details-biography').textContent = person.Biography;
    document.getElementById('details-place-of-birth').textContent = person.PlaceOfBirth;
    document.getElementById('details-date').textContent = person.Birthday;

    document.getElementById('details-gender').textContent = person.Gender;
    
    const backdropImg = document.getElementById('person-details-backdrop-banner');
    backdropImg.src = TMDB.GetImageUrl(person.ProfilePath);
    
    const blurBackdropImg = document.getElementById('person-details-blur-backdrop-banner');
    blurBackdropImg.src = TMDB.GetImageUrl(person.ProfilePath);
    
    let comma = '';
    person.AlsoKnownAs.forEach(alias => {
        document.getElementById('details-aka-container').innerHTML += comma + alias;
        comma = ', ';
    });

        
} catch (error) {
    console.error("Error loading movie details:", error);
    document.getElementById('movie-title').textContent = "Failed to load movie details.";
}

