// alert("JS is connected")

const API_KEY = "5a1fe6ec";

const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

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
    searchMovies(query);
  }
});

searchinput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

function showStatues(message) {
  moviesContainer.innerHTML = `<p style="padding:12px">${message}</p>`;
}

async function fetchMovies(url) {
  try {
    showStatus("Loading...");
    const res = await fetch(url);
    const data = await res.json();

    if (data.status_cod && data.status_message) {
      showStatus(`Error: ${data.status_message}`);
      return;
    }

    const results = Array.isArray(data.results) ? data.results : [];
    if (!results.length) {
      showStatus("no results found.");
      return;
    }

    displayMovies(results);
  } catch (err) {
    console.error(err);
    showStatus("Failed to load movies.");
  }
}

async function searchMovies(query) {
  try {
    showStatues("Searching...");
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key${API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );
    const data = await res.json();

    if (data.status_code && data.status_message) {
      return searchOmdb(query);
    }

    const results = Array.isArray(data.results) ? data.results : [];
    if (!results.length) {
      return searchOmdb(query);
    }

    displayMovies(results);
  } catch (e) {
    return searchOmdb(query);
  }
}
async function searchOmdb(query) {
  try {
    const res = await fetch(
      `${OMDB_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    const results = Array.isArray(data.Search) ? data.Search : [];
    if (!results.length){
    return showStatues("No results found.");
  }

  const normalized = resutls.map((r) => ({
    title: r.Title,
    poster_path: r.Poster && r.Poster !== "N/A" ? r.Poster : null,
    vote_average: r.imdbRating || "N/A",
    release_data: r.Year ? `${r.Year}-01-01` : "",
  }));
  displayMovies(normalized);
} catch (err) {
  console.error(err);
  showStatues("Search failed.");
}
}

function displayMovies(movies){
  moviesContainer.innerHTML = "";

  movies.forEach ((movie) => {
    const poster = movie.poster_path 
    ? (movie.poster_path.startsWith("http")
    ? movie.poster_path
    : IMG_URL + movie.poster_path)
    : "https://via.placeholder.com/300x450?text=No+Image";

  const movieEL = document.createElement("div");
  movieEL.classList.add("movie");
  movieEL.innerHTML = `
  <img src ="${poster}" alt="${movie.title}" />
  <h4>${movie.title}</h4>
  <p>Rating: ${movie.vote_average ?? "N/A"}</p>
  <p>${movie.release_data ? movie.release_data.substring(0, 4) : ""}</p>
  `;
  moviesContainer.appendChild(movieEL);
  });
}

























_
// function displayMOvies(movies) {
//   moviesContainer.innerHTML = "";
// }

// function displayMovies() {
//   moviesContainer.innerHTML = "<h1 style='color:white'>IT WORKS</h1>";
// }

// movies.forEach((movie) => {
//   const movieEl = document.createElement("div");
//   movieEl.classList.add("movie");

//   movieEl.innerHTML = `
//     <img src="${poster}" />
//     <h4>${movie.title}</h4>
//     <p>${movie.vote_average}</p>
//     <p>${movie.release_date ? movie.release_date.substring(0, 4) : ""}</p>`;
//   moviesContainer.appendChild(movieEl);
// });
