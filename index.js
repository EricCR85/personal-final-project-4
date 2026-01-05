// alert("JS is connected")
// let searchMovies = []; // store all movies from last search 

const OMDB_URL = "https://www.omdbapi.com/";
const API_KEY = `9db3ff50f370b9420c7cc3fda825960b`;
const OMDB_API_KEY = `5a1fe6ec`;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// const ratingFilter = document.getElementById("ratingFilter");
const movieGrid = document.getElementById("movieGrid")

const moviesContainer = document.getElementById("movies");
const searchBtn = document.getElementById("searchBtn");
const searchinput = document.getElementById("searchinput");
// const poster = movie.poster_path ? IMG_URL + movie.poster_path : "https://via.placeholder.com/300x450?text=No+Image";

fetchMovies(
  `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`
);

searchBtn.addEventListener("click", () => {
  const query = searchinput.value.trim();
  const rating = ratingFilter.value;
  if (query) {
    searchMovies(query, rating);
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

    displayMovies(results);
  } catch (err) {
    console.error(err);
    showStatus("Failed to load movies.");
  }
}

async function searchMovies(query) {
  showStatus("Searching...");
  const url = `${searchURL}${encodeURLComponent(query)}`;
  const res = await res.json();
  const results = Array.isArray(data.results) ? data.results : [];

  if (!results.length){
    showStatus("NO results found.");
    return;
  }

  searchMovies = results;
  displayMovies(results);

}

function filterByRatingThreshold(threshold, direction = "higher"){
  if (!searchMovies.length){
    showStatus("No moviews to filter.");
  }

  const filtered = searchedMovies.filter((movie) => {
    const rating = parseFloat(movie.vote-average);
    if (isNaN(rating)) return false;
    return direction === "higher" ? rating >= threshold : rating < threshold;
  }); 

  if (!filtered.length) {
    showStatus("No movies match the rating filter.");
    return;
  }

  displayMovies(filtered);
}

filterByRatingThreshold(7.0, "higher");
filterByRatingThreshold(5.0, "lower");


//   const filtered = rating
//   ? results.filter(movie => mapRating(movies.vote_average) === rating)
//   : results;

//   displayMovies(filtered)
// }

// function mapRating(score){
//   if (score >= 7.5) return "PG-13";
//   if (score >= 6) return "PG";
//   if (score >= 4.5) return "G";
//   return "R";
// }



async function searchMovies(query) {
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
    displayMovies(normalized);
  } catch (err) {
    console.error(err);
    showStatus("Search failed.");
  }
}

function filterByRating(movies, minRating) {
  if (minRating === "all") return movies;
  return movies.filter((movie) => movie.rating >= parseFloat(minRating));
}

const ratingFilter = document.getElementById("ratingFilter").value;
const filtered = filterByRating(movies, ratingFilter);

const container = document.querySelector(".searchResults");
container.innerHTML = "";

filtered.forEach((movie) => {
  const card = document.createElement("div");
  card.className = "movie-card";
  card.innerHTML = `<img src="${movie.poster}" alt="${movie.title}" />
  <h3>${movie.title}</h3>
  <p>Rating: ${movie.rating}</p>
  `;
  container.appendChild(card);
});

// function displayMovies(movies) {
//   movieGrid.innerHTML = "";
//   movies.forEach((movie) => {
//     const poster = movie.poster_path
//     ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
//     : "https://via.placeholder.com/300x450?text=NO+Image";

//     const card = document.createElement("div");
//     card.className = "movie-card";
//     card.innerHTML = `
//     <img src="${poster}" alt+"${movie.title}" />
//     <h3>${movie.title}</h3>
//     <p>Rating: ${movie.vote_adverage || "N/A"}</p>
//     <p>${movie.release_date || "Unknnow"}</p>
//     `;
//     movieGrid.appendChild(card)
//   })
// }







function displayMovies(movies) {
  moviesContainer.innerHTML = "";

  movies.forEach((movie) => {
    const poster = movie.poster_path
      ? movie.poster_path.startsWith("http")
        ? movie.poster_path
        : IMG_URL + movie.poster_path
      : "https://via.placeholder.com/300x450?text=No+Image";

    const movieEL = document.createElement("div");
    movieEL.classList.add("movie");
    movieEL.innerHTML = `
  <img src ="${poster}" alt="${movie.title}" />
  <h4>${movie.title}</h4>
  <p>Rating: ${movie.vote_average ?? "N/A"}</p>
  <p>${movie.release_date ? movie.release_date.substring(0, 4) : ""}</p>
  `;
    moviesContainer.appendChild(movieEL);
  });
}

document.getElementById('ratingFilter').addEventListener('change', () => {
  if (window.lastResults) {
    displayMovies(window.lastResults);
  }
});