// ========================================
// Popcorn Bucket - JavaScript
// ========================================


// ----------------------------------------
// Movie Search
// ----------------------------------------

function searchMovies(event) {

    // Check if the Enter key was pressed
    if (event.key === "Enter") {

        let searchText = document.getElementById("movieSearch").value;

        if (searchText.trim() === "") {

            alert("Please enter a movie name.");

        } else {

            alert("You searched for: " + searchText);
        }
    }
}