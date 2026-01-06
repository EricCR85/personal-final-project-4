// alert("JS is connected")
const TMDB_API_KEY = `9db3ff50f370b9420c7cc3fda825960b`;
const OMDB_API_KEY = "5a1fe6ec";

const BASE_URL = "https://api.themoviedb.org/3";
const OMDB_URL = "https://www.omdbapi.com";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const moviesContainer = document.getElementById("movies");
const searchBtn = document.getElementById("searchBtn");
const searchinput = document.getElementById("searchinput");
const ratingFilter = document.getElementById("ratingFilter"); // 1. Select the filter

// 2. Create a global variable to store the fetched movies
let currentMovies = []; 

fetchMovies(
  `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${TMDB_API_KEY}`
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

// 3. Add the Filter Event Listener
ratingFilter.addEventListener("change", () => {
  const selectedValue = ratingFilter.value;
  
  // If "Any" is selected or no movies loaded, show original list
  if (!selectedValue || !currentMovies.length) {
    displayMovies(currentMovies);
    return;
  }

  const minRating = parseFloat(selectedValue);

  const filteredMovies = currentMovies.filter((movie) => {
    // Handle "N/A" or missing ratings
    const rating = parseFloat(movie.vote_average);
    if (isNaN(rating)) return false;

    // Check if rating is greater than or equal to selection
    return rating >= minRating;
  });

  displayMovies(filteredMovies);
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
      showStatus("No results found.");
      return;
    }

    // 4. Update the global variable
    currentMovies = results;
    displayMovies(results);
  } catch (err) {
    console.error(err);
    showStatus("Failed to load movies.");
  }
}

async function searchMovies(query) {
  try {
    showStatus("Searching...");
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    const data = await res.json();

    if (data.status_code && data.status_message) {
      return searchOmdb(query);
    }

    const results = Array.isArray(data.results) ? data.results : [];
    if (!results.length) {
      return searchOmdb(query);
    }

    // 4. Update the global variable
    currentMovies = results;
    displayMovies(results);
  } catch (e) {
    return searchOmdb(query);
  }
}

async function searchOmdb(query) {
  try {
    const res = await fetch(
      `${OMDB_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    const results = Array.isArray(data.Search) ? data.Search : [];
    if (!results.length) {
      return showStatus("No results found.");
    }

    const normalized = results.map((r) => ({
      title: r.Title,
      poster_path: r.Poster && r.Poster !== "N/A" ? r.Poster : null,
      vote_average: r.imdbRating || "N/A",
      release_date: r.Year ? `${r.Year}-01-01` : "",
    }));

    // 4. Update the global variable
    currentMovies = normalized;
    displayMovies(normalized);
  } catch (err) {
    console.error(err);
    showStatus("Search failed.");
  }
}

function displayMovies(movies) {
  moviesContainer.innerHTML = "";
  
  // Handle empty filtered results
  if (movies.length === 0) {
      moviesContainer.innerHTML = `<p style="padding:12px">No movies match this rating.</p>`;
      return;
  }

  movies.forEach((movie) => {
    const poster = movie.poster_path
      ? (movie.poster_path.startsWith("http")
          ? movie.poster_path
          : IMG_URL + movie.poster_path)
      : "https://placehold.co/300x450?text=No+Image";

    const movieEL = document.createElement("div");
    movieEL.classList.add("movie");
    movieEL.innerHTML = `
      <img src="${poster}" alt="${movie.title}" />
      <h4>${movie.title}</h4>
      <p>Rating: ${movie.vote_average ?? "N/A"}</p>
      <p>${movie.release_date ? movie.release_date.substring(0, 4) : ""}</p>
    `;
    moviesContainer.appendChild(movieEL);
  });
}









