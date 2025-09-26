const API_KEY = "1c1b618cde3c7ffdbd756b49491ea702";
const IMG_PATH = "https://image.tmdb.org/t/p/w500";
const moviesContainer = document.getElementById("movies");
const searchInput = document.getElementById("search");

// Fetch Popular Movies
async function fetchMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  displayMovies(data.results);
}

// Display Movies
function displayMovies(movies) {
  moviesContainer.innerHTML = "";
  movies.forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
      <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <button onclick="addToWatchlist(${movie.id}, '${movie.title}', '${movie.poster_path}')">➕ Add</button>
    `;

    moviesContainer.appendChild(card);
  });
}

// Add to Watchlist
function addToWatchlist(id, title, poster) {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  if (!watchlist.some(movie => movie.id === id)) {
    watchlist.push({ id, title, poster });
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    alert("Added to Watchlist!");
  } else {
    alert("Already in Watchlist!");
  }
}

// Search Movies
searchInput.addEventListener("keyup", (e) => {
  const query = e.target.value.trim();
  if (query) {
    fetchMovies(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`);
  } else {
    getPopularMovies();
  }
});

// Load Popular Movies on Start
function getPopularMovies() {
  fetchMovies(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=1`);
}

getPopularMovies();
