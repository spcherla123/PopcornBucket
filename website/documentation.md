# TMBD Wrapper

## IMPORTANT
The API might not work if opened in browser because it might reject it for security reasons. It is recommended to use Live Preview extension in VS Code. Additionally you can paste the http:// address it gives you into the browser to view it there which will be necessary for viewing videos/trailers in the future.

### Step 1: Import the module and Authenticate the API Key
```js
import * as TMDB from '../../tmdb_wrapper.js';

TMDB.Authenticate();

```

## Step 2: Get movies or shows 
The easiest way to do this is by a keyword 
```js
const movies = await TMDB.GetMoviesBySearch(InSearchText);

// This returns an array of objects with the following properties:
// ID: useful for getting further details about the movie
// Title
// PosterPath: must be used with an additional function shown below

```

To get an image use this utility function to get the full URL which can then be passed to the HTML image src.
```js
 const backdropUrl = TMDB.GetImageUrl(movie.PosterPath);
 
 movieCard.innerHTML = 
`<img src="${backdropUrl}" alt="${movie.Title} Backdrop" class="movie-backdrop-img">`;
```

Other ways to get movies and shows
```js
    const movies = await TMDB.GetPopularMovies();
    const tvOrMovies = await TMDB.GetTrendingAll();
```

## Refer to Main.js
And other demo files


## Test 
```js
import * as TMDB from '../../tmdb_wrapper.js';
try {

    TMDB.Authenticate();

    const movies = await TMDB.GetPopularMovies();

    movies.forEach(movie => {
            
        async function PrintDetails() {
            const details = await TMDB.GetMovieDetails(movie.ID);
            console.info(details.Title);
            console.info(details.Tagline);
            console.info(details.Overview);
            console.info(details.TMDBRating);
            console.info(details.Runtime);
            console.info(details.ReleaseDate);
            console.info(details.PosterPath);
            console.info(details.BackdropPath);
        }

        PrintDetails();

    });
} catch (error) {
    console.error("Error: ", error);
}
```