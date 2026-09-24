export const API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmY5Y2FmYmI5MTUyMzFhOTg2NzNiNTFjMWFiOGNiOSIsIm5iZiI6MTc4OTE1NzExNC40NDcsInN1YiI6IjZhYTQ1ZWZhYTMxMTgwMjQyOTRhNzExNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vTJRr7cGCmpWcjMyzwUioJXnkJxtxyTOyzHO5Q-6R6w'
export const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

/** 
    Utility for creating the url for an image
*/
export function GetImageUrl(InPath, InSize = 'w500') {
    if (InPath) {
        return `${IMAGE_BASE_URL}/${InSize}${InPath}`;
    }

    return '';
}

const OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmY5Y2FmYmI5MTUyMzFhOTg2NzNiNTFjMWFiOGNiOSIsIm5iZiI6MTc4OTE1NzExNC40NDcsInN1YiI6IjZhYTQ1ZWZhYTMxMTgwMjQyOTRhNzExNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vTJRr7cGCmpWcjMyzwUioJXnkJxtxyTOyzHO5Q-6R6w'
  }
};

/** 
    Authenticate API key
*/
export function Authenticate() 
{
     fetch(`${BASE_URL}/authentication`, OPTIONS)
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.error(err));
}

/**
 * Fetches and formats the details of a specific movie from the TMDB API.
 * 
 * @async
 * @function GetMovieDetails
 * @param {number|string} InMovieID - The unique identifier of the movie.
 * @returns {Promise<{
 *   ID: number,
 *   Title: string,
 *   PosterPath: string|null,
 *   BackdropPath: string|null,
 *   Runtime: number,
 *   Tagline: string,
 *   Overview: string,
 *   ReleaseDate: string,
 *   TMBDRating: number
 * }|undefined>} A promise that resolves to the formatted movie details, or undefined if an error occurs.
 */
export async function GetMovieDetails(InMovieID) {
    try {
        const detailsUrl = `${BASE_URL}/movie/${InMovieID}?language=en-US`;
        const response = await fetch(detailsUrl, OPTIONS);

        const item = await response.json();

        return {
           ID: item.id,
           Title: item.title,
           PosterPath: item.poster_path,
           BackdropPath: item.backdrop_path,
           Runtime: item.runtime,
           Tagline: item.tagline,
           Overview: item.overview,
           ReleaseDate: item.release_date,
           TMBDRating: item.vote_average.toFixed(1),
        };
    } catch (error) {
        console.error("Oops! Couldn't load the popular movies:", error);
    }
}

/**
 * Fetches and formats the details of a specific TV show, including its seasons, from the TMDB API.
 * 
 * @async
 * @function GetShowDetails
 * @param {number|string} InTVShowID - The unique identifier of the TV show.
 * @returns {Promise<{
 *   ID: number,
 *   Name: string,
 *   PosterPath: string|null,
 *   BackdropPath: string|null,
 *   NumberOfSeasons: number,
 *   Tagline: string,
 *   Overview: string,
 *   FirstAirDate: string,
 *   TMBDRating: string,
 *   Seasons: Array<{
 *     ID: number,
 *     Name: string,
 *     SeasonNumber: number,
 *     Overview: string,
 *     PosterPath: string|null,
 *     EpisodeCount: number,
 *     AirDate: string,
 *     TMBDRating: number
 *   }>
 * }|undefined>} A promise that resolves to the formatted TV show details, or undefined if an error occurs.
 */
export async function GetShowDetails(InTVShowID) {
    try {
        const detailsUrl = `${BASE_URL}/tv/${InTVShowID}?language=en-US`;
        const response = await fetch(detailsUrl, OPTIONS);

        const item = await response.json();

        return {
           ID: item.id,
           Name: item.name,
           PosterPath: item.poster_path,
           BackdropPath: item.backdrop_path,
           NumberOfSeasons: item.seasons.length,
           Tagline: item.tagline,
           Overview: item.overview,
           FirstAirDate: item.first_air_date,
           TMBDRating: item.vote_average.toFixed(1),
           Seasons: item.seasons.map(seasonItem => ({
                        ID: seasonItem.id,
                        Name: seasonItem.name,
                        SeasonNumber: seasonItem.season_number,
                        Overview: seasonItem.overview,
                        PosterPath: seasonItem.poster_path,
                        EpisodeCount: seasonItem.episode_count,
                        AirDate: seasonItem.air_date,
                        TMBDRating: seasonItem.vote_average.toFixed(1)
                    }))
        };

    } catch (error) {
        console.error("Oops! Couldn't load TV:", error);
    }
}

/**
 * Fetches and formats the details of a specific TV show season, including all its episodes.
 * 
 * @async
 * @function GetSeasonDetails
 * @param {number|string} InShowID - The unique identifier of the TV show.
 * @param {number|string} InSeasonNumber - The season number.
 * @returns {Promise<{
 *   ID: number,
 *   Name: string,
 *   SeasonNumber: number,
 *   Overview: string,
 *   PosterPath: string|null,
 *   EpisodeCount: number,
 *   AirDate: string,
 *   TMBDRating: string,
 *   Episodes: Array<{
 *     ID: number,
 *     Name: string,
 *     EpisodeNumber: number,
 *     SeasonNumber: number,
 *     ShowID: number,
 *     Overview: string,
 *     StillPath: string|null,
 *     AirDate: string,
 *     TMBDRating: number
 *   }>
 * }|undefined>} A promise that resolves to the formatted season details, or undefined if an error occurs.
 */
export async function GetSeasonDetails(InShowID, InSeasonNumber) {
    try {
        const detailsUrl = `${BASE_URL}/tv/${InShowID}/season/${InSeasonNumber}`;
        const response = await fetch(detailsUrl, OPTIONS);

        const item = await response.json();

        return {
            ID: item.id,
            Name: item.name,
            SeasonNumber: item.season_number,
            Overview: item.overview,
            PosterPath: item.poster_path,
            EpisodeCount: item.episodes.length,
            AirDate: item.air_date,
            TMBDRating: item.vote_average.toFixed(1),
            Episodes: item.episodes.map(episodeItem => ({
                        ID: episodeItem.id,
                        Name: episodeItem.name,
                        EpisodeNumber: episodeItem.episode_number,
                        SeasonNumber: episodeItem.season_number,
                        ShowID: episodeItem.show_id,
                        Overview: episodeItem.overview,
                        StillPath: episodeItem.still_path,
                        AirDate: episodeItem.air_date,
                        TMBDRating: episodeItem.vote_average.toFixed(1)
                    }))

        };

    } catch (error) {
        console.error("Oops! Couldn't load TV:", error);
    }
}

/**
 * Fetches and formats the details of a single specific TV show episode.
 * 
 * @async
 * @function GetEpisodeDetails
 * @param {number|string} InShowID - The unique identifier of the TV show.
 * @param {number|string} InSeasonNumber - The season number.
 * @param {number|string} InEpisodeNumber - The episode number.
 * @returns {Promise<{
 *   ID: number,
 *   Name: string,
 *   EpisodeNumber: number,
 *   SeasonNumber: number,
 *   ShowID: number,
 *   Overview: string,
 *   StillPath: string|null,
 *   AirDate: string,
 *   TMBDRating: number,
 *   Runtime: number
 * }|undefined>} A promise that resolves to the formatted episode details, or undefined if an error occurs.
 */
export async function GetEpisodeDetails(InShowID, InSeasonNumber, InEpisodeNumber) {
    try {
        const detailsUrl = `${BASE_URL}/tv/${InShowID}/season/${InSeasonNumber}/episode/${InEpisodeNumber}?language=en-US`;
        const response = await fetch(detailsUrl, OPTIONS);

        const item = await response.json();

        return {
            ID: item.id,
            Name: item.name,
            EpisodeNumber: item.episode_number,
            SeasonNumber: item.season_number,
            ShowID: item.show_id,
            Overview: item.overview,
            StillPath: item.still_path,
            AirDate: item.air_date,
            TMBDRating: item.vote_average.toFixed(1),
            Runtime: item.runtime
        };

    } catch (error) {
        console.error("Oops! Couldn't load TV:", error);
    }
}

/** 
 * Returns the movies filtered by a search keyword.
 * 
 * @async
 * @function GetMoviesBySearch
 * @param {string} InSearch - The search query/keyword.
 * @param {boolean} [InAdultIncluded=true] - Whether to include adult/NSFW content in search results.
 * @returns {Promise<Array<{
 *   ID: number,
 *   Title: string,
 *   PosterPath: string|null
 * }>|undefined>} A promise that resolves to an array of matching movies, or undefined if an error occurs.
 */
export async function GetMoviesBySearch(InSearch, InAdultIncluded = true) {
    try {
        const url = `${BASE_URL}/search/movie?query=${InSearch}&include_adult=${InAdultIncluded}&language=en-US&page=1`; 
        const response = await fetch(url, OPTIONS)
        const data = await response.json();

        const result = data.results.map(item => ({
           ID: item.id,
           Title: item.title,
           PosterPath: item.poster_path
        }));

        return result;
     } catch (error) {
        console.error("Oops! Couldn't load the movies by search:", error);
     }
}

/**
 * Fetches raw TMDB video data tracks (trailers, teasers, featurettes) for a specific movie.
 * 
 * @async
 * @function GetVideosByMovie
 * @param {number|string} InMovieID - The unique identifier of the movie.
 * @returns {Promise<Array<Object>|undefined>} A promise that resolves to the raw list of video objects from TMDB, or undefined if an error occurs.
 */
export async function GetVideosByMovie(InMovieID) {
    try {
        const url = `${BASE_URL}/movie/${InMovieID}/videos`; 
        const response = await fetch(url, OPTIONS)
        const data = await response.json();


        return data.results;
     } catch (error) {
        console.error("Oops! Couldn't load the movies by search:", error);
     }
}

/**
 * Fetches raw TMDB video data tracks (trailers, teasers, featurettes) for a specific TV show.
 * 
 * @async
 * @function GetVideosByShow
 * @param {number|string} InTVShowID - The unique identifier of the TV show.
 * @returns {Promise<Array<Object>|undefined>} A promise that resolves to the raw list of video objects from TMDB, or undefined if an error occurs.
 */
export async function GetVideosByShow(InTVShowID) {
    try {
        const url = `${BASE_URL}/tv/${InTVShowID}/videos`; 
        const response = await fetch(url, OPTIONS)
        const data = await response.json();


        return data.results;
     } catch (error) {
        console.error("Oops! Couldn't load the movies by search:", error);
     }
}

/**
 * Fetches the daily trending movies and TV shows combined.
 * 
 * @async
 * @function GetTrendingAll
 * @returns {Promise<Array<{
 *   MediaType: "movie"|"tv",
 *   ID: number,
 *   TitleOrName: string,
 *   PosterPath: string|null
 * }>|undefined>} A promise that resolves to an array of trending media objects, or undefined if an error occurs.
 */
export async function GetTrendingAll() {
    try {
        const response = await fetch(`${BASE_URL}/trending/all/day?language=en-US`, OPTIONS);
        const data = await response.json();
        
        const result = data.results.map(item => ({
            MediaType: item.media_type,
            ID: item.id,
            TitleOrName: item.title ? item.title : item.name,
            PosterPath: item.poster_path
        }));

        return result;
    } catch (error) {
        console.error("Oops! Couldn't load the popular movies:", error);
    }
}

/**
 * Fetches the current list of popular movies on TMDB.
 * 
 * @async
 * @function GetPopularMovies
 * @returns {Promise<Array<{
 *   ID: number,
 *   Title: string,
 *   PosterPath: string|null
 * }>|undefined>} A promise that resolves to an array of popular movies, or undefined if an error occurs.
 */
export async function GetPopularMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?language=en-US&page=1`, OPTIONS);
        const data = await response.json();

        const result = data.results.map(item => ({
           ID: item.id,
           Title: item.title,
           PosterPath: item.poster_path
        }));

        return result;
       
    } catch (error) {
        console.error("Oops! Couldn't load the popular movies:", error);
    }
}


/**
 * Fetches the cast credits for a specific movie.
 * 
 * @async
 * @function GetCreditsByMovie
 * @param {number|string} InMovieID - The unique identifier of the movie.
 * @returns {Promise<Array<{
 *   Name: string,
 *   Character: string,
 *   ProfilePath: string|null
 * }>|undefined>} A promise that resolves to an array of cast members, or undefined if an error occurs.
 */
export async function GetCreditsByMovie(InMovieID) 
{
    try {
        const url = `${BASE_URL}/movie/${InMovieID}/credits?language=en-US`; 
        const response = await fetch(url, OPTIONS);
        const data = await response.json();

        const result = data.cast.map(item => ({
           Name: item.name,
           Character: item.character,
           ProfilePath: item.profile_path
        }));

        return result;
       
    } catch (error) {
        console.error("Oops! Couldn't load the popular movies:", error);
    }
}

/**
 * Fetches the main cast credits for a specific TV show.
 * 
 * @async
 * @function GetCreditsByShow
 * @param {number|string} InTVShowID - The unique identifier of the TV show.
 * @returns {Promise<Array<{
 *   Name: string,
 *   Character: string,
 *   ProfilePath: string|null
 * }>|undefined>} A promise that resolves to an array of cast members, or undefined if an error occurs.
 */
export async function GetCreditsByShow(InTVShowID) 
{
    try {
        const url = `${BASE_URL}/tv/${InTVShowID}/credits`; 
        const response = await fetch(url, OPTIONS);
        const data = await response.json();

        const result = data.cast.map(item => ({
           Name: item.name,
           Character: item.character,
           ProfilePath: item.profile_path
        }));

        return result;
       
    } catch (error) {
        console.error("Oops! Couldn't load the popular movies:", error);
    }
}

/** 
 * Public API: Fetches the cast credits for a specific TV show season.
 * @param {string} InTVShowID 
 * @param {number} InSeasonNumber 
 * 
 * @returns {Promise<{ Name: string, Character: string, ProfilePath: string }[]>}
 */
export async function GetCreditsBySeason(InTVShowID, InSeasonNumber) 
{
    try {
        const url = `${BASE_URL}/tv/${InTVShowID}/season/${InSeasonNumber}/credits?language=en-US`; 
        const response = await fetch(url, OPTIONS);
        const data = await response.json();

        const result = data.cast.map(item => ({
           Name: item.name,
           Character: item.character,
           ProfilePath: item.profile_path
        }));

        return result;
       
    } catch (error) {
        console.error("Oops! Couldn't load the popular movies:", error);
    }
}

/**
 * Fetches the categorized production crew, main cast, and guest stars for an episode.
 * 
 * @async
 * @function GetCreditsByEpisode
 * @param {number|string} InTVShowID - The unique identifier of the TV show.
 * @param {number|string} InSeasonNumber - The season number.
 * @param {number|string} InEpisodeNumber - The episode number.
 * @returns {Promise<{
 *   Crew: Array<{
 *     Name: string,
 *     Job: string,
 *     KnownForDepartment: string,
 *     ProfilePath: string|null
 *   }>,
 *   Cast: Array<{
 *     IsAdult: boolean,
 *     Gender: number,
 *     ID: number,
 *     Name: string,
 *     Character: string,
 *     ProfilePath: string|null
 *   }>,
 *   GuestStars: Array<{
 *     IsAdult: boolean,
 *     Gender: number,
 *     ID: number,
 *     Name: string,
 *     Character: string,
 *     ProfilePath: string|null
 *   }>
 * }|undefined>} A promise that resolves to the categorized credit lists, or undefined if an error occurs.
 */
export async function GetCreditsByEpisode(InTVShowID, InSeasonNumber, InEpisodeNumber) 
{
    try {
        const url = `${BASE_URL}/tv/${InTVShowID}/season/${InSeasonNumber}/episode/${InEpisodeNumber}/credits?language=en-US`; 
        const response = await fetch(url, OPTIONS);
        const data = await response.json();

        const result = {
            
            Crew: data.crew.map(item => ({
                Name: item.name,
                Job: item.job,
                KnownForDepartment: item.known_for_department,
                ProfilePath: item.profile_path
            })),

            Cast: data.cast.map(item => ({
                IsAdult: item.adult,
                Gender: item.gender,
                ID: item.id,
                Name: item.name,
                Character: item.character,
                ProfilePath: item.profile_path
            })),

            GuestStars: data.guest_stars.map(item => ({
                IsAdult: item.adult,
                Gender: item.gender,
                ID: item.id,
                Name: item.name,
                Character: item.character,
                ProfilePath: item.profile_path
            }))
        };

        return result;
       
    } catch (error) {
        console.error("Oops! Couldn't load the popular movies:", error);
    }
}

/**
 * Fetches and formats image stills associated with a specific TV show episode.
 * 
 * @async
 * @function GetImagesForEpisode
 * @param {number|string} InTVShowID - The unique identifier of the TV show.
 * @param {number|string} InSeasonNumber - The season number.
 * @param {number|string} InEpisodeNumber - The episode number.
 * @returns {Promise<Array<{
 *   AspectRatio: number,
 *   Height: number,
 *   Width: number,
 *   FilePath: string
 * }>|undefined>} A promise that resolves to an array of episode image artifacts, or undefined if an error occurs.
 */
export async function GetImagesForEpisode(InTVShowID, InSeasonNumber, InEpisodeNumber) 
{
    try {

        const url = `${BASE_URL}/tv/${InTVShowID}/season/${InSeasonNumber}/episode/${InEpisodeNumber}/images`; 
        const response = await fetch(url, OPTIONS);
        const data = await response.json();

        const result = data.stills.map(item => ({
                AspectRatio: item.aspect_ratio,
                Height: item.height,
                Width: item.width,
                FilePath: item.file_path
            }));


        return result;
       
    } catch (error) {
        console.error("Oops! Couldn't load the popular movies:", error);
    }
}

/**
 * Fetches and formats poster imagery associated with a specific TV show season.
 * 
 * @async
 * @function GetImagesForSeason
 * @param {number|string} InTVShowID - The unique identifier of the TV show.
 * @param {number|string} InSeasonNumber - The season number.
 * @returns {Promise<Array<{
 *   AspectRatio: number,
 *   Height: number,
 *   Width: number,
 *   FilePath: string
 * }>|undefined>} A promise that resolves to an array of season poster image assets, or undefined if an error occurs.
 */
export async function GetImagesForSeason(InTVShowID, InSeasonNumber) 
{
    try {

        const url = `${BASE_URL}/tv/${InTVShowID}/season/${InSeasonNumber}/images`; 
        const response = await fetch(url, OPTIONS);
        const data = await response.json();

        const result = data.posters.map(item => ({
                AspectRatio: item.aspect_ratio,
                Height: item.height,
                Width: item.width,
                FilePath: item.file_path
            }));


        return result;
       
    } catch (error) {
        console.error("Oops! Couldn't load the popular movies:", error);
    }
}

/**
 * Fetches and categorizes all backdrops, posters, and logos available for a TV show.
 * 
 * @async
 * @function GetImagesForShow
 * @param {number|string} InTVShowID - The unique identifier of the TV show.
 * @returns {Promise<{
 *   Backdrops: Array<{ AspectRatio: number, Height: number, Width: number, FilePath: string }>,
 *   Posters: Array<{ AspectRatio: number, Height: number, Width: number, FilePath: string }>,
 *   Logos: Array<{ AspectRatio: number, Height: number, Width: number, FilePath: string }>
 * }|undefined>} A promise that resolves to an object containing grouped TV image assets, or undefined if an error occurs.
 */
export async function GetImagesForShow(InTVShowID) 
{
    try {

        const url = `${BASE_URL}/tv/${InTVShowID}/images`; 
        const response = await fetch(url, OPTIONS);
        const data = await response.json();

        const result = { 
            Backdrops: data.backdrops.map(item => ({
                AspectRatio: item.aspect_ratio,
                Height: item.height,
                Width: item.width,
                FilePath: item.file_path
            })),

            Posters: data.posters.map(item => ({
                AspectRatio: item.aspect_ratio,
                Height: item.height,
                Width: item.width,
                FilePath: item.file_path
            })),

            Logos: data.logos.map(item => ({
                AspectRatio: item.aspect_ratio,
                Height: item.height,
                Width: item.width,
                FilePath: item.file_path
            }))
        }


        return result;
       
    } catch (error) {
        console.error("Oops! Couldn't load the popular movies:", error);
    }
}

/**
 * Fetches and categorizes all backdrops, posters, and logos available for a movie.
 * 
 * @async
 * @function GetImagesForMovie
 * @param {number|string} InMovieID - The unique identifier of the movie.
 * @returns {Promise<{
 *   Backdrops: Array<{ AspectRatio: number, Height: number, Width: number, FilePath: string }>,
 *   Posters: Array<{ AspectRatio: number, Height: number, Width: number, FilePath: string }>,
 *   Logos: Array<{ AspectRatio: number, Height: number, Width: number, FilePath: string }>
 * }|undefined>} A promise that resolves to an object containing grouped movie image assets, or undefined if an error occurs.
 */
export async function GetImagesForMovie(InMovieID) 
{
    try {

        const url = `${BASE_URL}/movie/${InMovieID}/images`; 
        const response = await fetch(url, OPTIONS);
        const data = await response.json();

        const result = { 
            Backdrops: data.backdrops.map(item => ({
                AspectRatio: item.aspect_ratio,
                Height: item.height,
                Width: item.width,
                FilePath: item.file_path
            })),

            Posters: data.posters.map(item => ({
                AspectRatio: item.aspect_ratio,
                Height: item.height,
                Width: item.width,
                FilePath: item.file_path
            })),

            Logos: data.logos.map(item => ({
                AspectRatio: item.aspect_ratio,
                Height: item.height,
                Width: item.width,
                FilePath: item.file_path
            }))
        }


        return result;
       
    } catch (error) {
        console.error("Oops! Couldn't load the popular movies:", error);
    }
}