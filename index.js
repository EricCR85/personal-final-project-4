// alert("JS is connected")
let searchMovies = []; // store all movies from last search

const OMDB_URL = "https://www.omdbapi.com/";
const API_KEY = `9db3ff50f370b9420c7cc3fda825960b`;
const OMDB_API_KEY = `5a1fe6ec`;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const ratingFilter = document.getElementById("ratingFilter");
// const movieGrid = document.getElementById("movieGrid");
// const moviesContainer = document.querySelector(".container")
const moviesContainer = document.getElementById("movies");
const searchBtn = document.getElementById("searchBtn");
const searchinput = document.getElementById("searchinput");
// const poster = movie.poster_path ? IMG_URL + movie.poster_path : "https://via.placeholder.com/300x450?text=No+Image";

fetchMovies(
  `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`
);

searchBtn.addEventListener("click", () => {
  const query = searchinput.value.trim();
  
  if (query) {
    search(query);
  }
});

searchinput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

function showStatus(message) {
  moviesContainer.innerHTML = `<p style="padding:12px">${message}</p>`;
}

async function fetchMovies(url) {
  try {
    showStatus("Loading...");
    const res = await fetch(url);
    const data = await res.json();

    if (data.status_code && data.status_message) {
      showStatus(`Error: ${data.status_message}`);
      return;
    }

    const results = Array.isArray(data.results) ? data.results : [];
    if (!results.length) {
      showStatus("no results found.");
      return;
    }

    lastResults = results;
    displayMovies(results);
  } catch (err) {
    console.error(err);
    showStatus("Failed to load movies");
  }
}

async function search(query) {
  try {
    showStatus("Searching...");
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );
    const data = await res.json();

    if (data.status_code && data.status_message) {
      return searchOmdb(query);
    }
    const results = Array.isArray(data.results) ? data.results : [];
    if (!results.length){
      return searchOmdb(query);
    }

    lastResults = results;
    displayMovies(results);
  } catch (err) {
    console.error(err);
    return searchOmdb(query);
  }
}

async function searchOmdb(query) {
  try {
    const res = await fetch(
      `$(OMDB_URL)?apikey=${PMDB_KEY}&s=${encodeURIComponent(query)}`
  );
    const data = await res.json();
    const results = Array.isArray(data.Search) ? data.Search : [];
    if (!results.length){
      showStatus("No results found.");
      return;
    }
    const normalized = results.map(r) => ({
      title: r.Title,
      poster_path: r.Poster && r.Poster "N/A" ? r.Poster : null,
      vote_average:r.imdbRating || "N/A",
      release_date: r.Year ? `${r.Year}-01-01` : "",

    }));
    lastResults = normalized;
    displayMovies(normalized);
  } catch (err) {
    console.error(err);
    showStatus("Search failed.");
  }
}

function displayMovies(movies) {
  moviesContainer.innerHTML = "";

  movies.forEach(movie) => {
    const poster = movie.poster_path
    ? movie.poster_path.startsWith("http")
    ? movie.poster_path
    : IMG_URL + movie.poster_path
    : "https://via.placeholder.com/300x450?text=No+Image";

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
    <img src="${poster}" alt="${movie.title}" />
    <h4>${movie.title}</h4>
    <p>Rating: ${movie.vote_average ?? "N/A"}</p>
    <p>${movie.release_date ? movie.release_date.substring(0, 4) : ""}</p>
    `;
    moviesContainer.appendChild(movieEl);

  });
}

ratingFilter.addEventListener("change", () => {
  const selectedRating = ratingFilter.value;
  const results = lastResults || [];

  if (!selectedRating || !results.length){
    displayMovies(results);
    return;
  }

  const filtered = results.filter(movie) => {
    const rating = parseFloat(movie.vote_average);
    if (isNaN(rating)) return false;

    if (selectedRaing === "5") return rating > 5;
    if (selectedRaing === "6") return rating > 6;
    if (selectedRaing === "7") return rating > 7;
    if (selectedRaing === "8") return rating > 8;
    return false;
  
});

displayMovies(filtered);
});