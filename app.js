var API_KEY = "1c1b618cde3c7ffdbd756b49491ea702";
var BASE_URL = "https://api.themoviedb.org/3";
var IMG_URL = "https://image.tmdb.org/t/p/w500";

var movieContainer = document.getElementById("movieContainer");
var searchBtn = document.getElementById("searchBtn");
var searchInput = document.getElementById("searchInput");
var homeTab = document.getElementById("homeTab");
var watchlistTab = document.getElementById("watchlistTab");
var prevBtn = document.getElementById("prevBtn");
var nextBtn = document.getElementById("nextBtn");

var currentPage = 1;
var currentMovies = [];
var allMovies = [];
var currentView = "home";

// --- Utility Functions (Basic Watchlist Logic using var and loops) ---

function getWatchlist() {
    var list = localStorage.getItem("watchlist");
    if (list) {
        return JSON.parse(list);
    } else {
        return [];
    }
}

function saveWatchlist(list) {
    localStorage.setItem("watchlist", JSON.stringify(list));
}

// Check if movie is in watchlist (uses a basic for loop instead of .some())
function isInWatchlist(id) {
    var list = getWatchlist();
    var isFound = false;
    for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            isFound = true;
            break;
        }
    }
    return isFound;
}

// Function to toggle watchlist status (uses basic for loops instead of .find() and .filter())
function toggleWatchlist(id) {
    var list = getWatchlist();
    var movie = null;
    
    // Find the movie using a for loop
    for (var i = 0; i < allMovies.length; i++) {
        if (allMovies[i].id === id) {
            movie = allMovies[i];
            break;
        }
    }

    if (!movie) return;

    if (isInWatchlist(id)) {
        // Filter out the movie using a for loop
        var newList = [];
        for (var j = 0; j < list.length; j++) {
            if (list[j].id !== id) {
                newList.push(list[j]);
            }
        }
        list = newList;
    } else {
        list.push(movie);
    }
    
    saveWatchlist(list);
    
    // Re-display movies to update the button text
    // If we are on the watchlist view, we need to refresh the movie list first
    if (currentView === "watchlist") {
        allMovies = getWatchlist();
    }
    displayMovies();
}


// --- Data Fetching (Using XMLHttpRequest only) ---

function fetchMovies() {
    var url = BASE_URL + "/movie/popular?api_key=" + API_KEY;
    var xhr = new XMLHttpRequest();
    
    // Open the request
    xhr.open("GET", url, true); // true means asynchronous
    
    // Define the callback function for state changes
    xhr.onreadystatechange = function() {
        // Check if request is complete (readyState 4) and successful (status 200)
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            allMovies = data.results;
            displayMovies();
        }
    };
    
    // Send the request
    xhr.send();
}

function searchMovies() {
    var query = searchInput.value; // .trim() is slightly modern, omit for basic
    if (query === "") {
        fetchMovies();
        return;
    }

    var url = BASE_URL + "/search/movie?api_key=" + API_KEY + "&query=" + encodeURIComponent(query);
    var xhr = new XMLHttpRequest();
    
    xhr.open("GET", url, true);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            allMovies = data.results;
            currentPage = 1;
            displayMovies();
        }
    };
    
    xhr.send();
}

// --- Display Logic (Using Basic for loop and String Concatenation) ---

function displayMovies() {
    movieContainer.innerHTML = "";
    var start = (currentPage - 1) * 6;
    var end = start + 6;
    
    // Manual slicing using a for loop
    currentMovies = [];
    for (var i = start; i < end && i < allMovies.length; i++) {
        currentMovies.push(allMovies[i]);
    }

    if (currentMovies.length === 0) {
        movieContainer.innerHTML = "<p style='text-align:center;'>No movies found!</p>";
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
    }

    // Using a basic for loop to iterate (instead of .forEach())
    for (var k = 0; k < currentMovies.length; k++) {
        var movie = currentMovies[k];
        var div = document.createElement("div");
        div.className = "movie-card"; // Using .className
        
        var imgSource = movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/200x300';
        var buttonText = isInWatchlist(movie.id) ? "Remove" : "Add";
        
        // Using string concatenation for all HTML
        div.innerHTML = 
            "<img src=\"" + imgSource + "\" alt=\"" + movie.title + "\" />" +
            "<h3>" + movie.title + "</h3>" +
            // Inline onclick handler to call the function
            "<button onclick=\"toggleWatchlist(" + movie.id + ")\">" + buttonText + " Watchlist</button>";
            
        movieContainer.appendChild(div);
    }

    // Update pagination button state
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = end >= allMovies.length;
}


// --- Pagination and Event Handlers (Using basic function assignments) ---

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayMovies();
    }
}

function nextPage() {
    if (currentPage * 6 < allMovies.length) {
        currentPage++;
        displayMovies();
    }
}

// Function assignments instead of addEventListener
prevBtn.onclick = prevPage;
nextBtn.onclick = nextPage;
searchBtn.onclick = searchMovies; 


// --- Tab Switching Functions ---

// Home tab click handler
homeTab.onclick = function(e) {
    // Basic event prevention
    if (e && e.preventDefault) {
        e.preventDefault();
    }
    
    currentView = "home";
    homeTab.className = "active";
    watchlistTab.className = "";
    fetchMovies();
};

// Watchlist tab click handler
watchlistTab.onclick = function(e) {
    // Basic event prevention
    if (e && e.preventDefault) {
        e.preventDefault();
    }
    
    currentView = "watchlist";
    homeTab.className = "";
    watchlistTab.className = "active";
    allMovies = getWatchlist();
    currentPage = 1;
    displayMovies();
};

// Initial call on window load
window.onload = fetchMovies;

