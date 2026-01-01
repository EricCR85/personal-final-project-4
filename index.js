// alert("JS is connected")

const API_KEY = "5a1fe6ec"

const BASE_URL = "https://api.themoviedb.org/3"
const IMG_URL = "https://image.tmdb.org/t/p/w500"

const moviesContainer = document.getElementById("movies");
const searchBtn = document.getElementById("searchBtn");
const searchinput = document.getElementById("searchinput");
// const poster = movie.poster_path ? IMG_URL + movie.poster_path : "https://via.placeholder.com/300x450?text=No+Image"; 

fetchMovies(
    `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`
);

searchBtn.addEventListener("click",() => {
    const query = searchinput.value.trim();
    if (query){
        fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}
            &query=${query}`
        );
    }
})

function fetchMovies(url) {
    fetch(url)
    .then(res => res.json())
    .then(data => displayMOvies(data.results))
    .catch(err => console.error(err));
}

function displayMOvies(movies){
    moviesContainer.innerHTML = "";


function displayMovies() {
    moviesContainer.innerHTML = "<h1 style='color:white'>IT WORKS</h1>"
}

movies.forEach(movie => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    movieEl.innerHTML =`
    <img src="${poster}" />
    <h4>${movie.title}</h4>
    <p>${movie.vote_average}</p>
    <p>${movie.release_date ? movie.release_date.substring(0,4) :""}</p>`
    ;
    moviesContainer.appendChild(movieEl);
});
}

    