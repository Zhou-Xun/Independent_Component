// tmdb api
const api = '42e61f509847e4df4ba19097f47d2745';

// const in html
const movieOutput = document.querySelector('#movie_output');
const titleInput = document.querySelector('#title_input');
const showTitleButtion = document.querySelector("#show_title")
const sortDate = document.querySelector("#sort-date")
const sortRating = document.querySelector("#sort-rating")
const savedMovies = document.querySelector("#saved_movies")


function tmdbRequest(url, callback) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            // This invokes the callback that updates the page.
            movieOutput.innerHTML = "";
            callback(data);
        }, (err) => {
            console.error(err);
        });
}

function searchTitleUrl() {
    return `https://api.themoviedb.org/3/search/movie?${(new URLSearchParams({'api_key': api, 'query':titleInput.value})).toString()}`;
}

const removeChild = (parent) => {
    parent.innerHTML = "";
}

// Stores saved words.
const savedWordsArray = [];

const addToSavedWords = word => {
    // You'll need to finish this...
    savedWordsArray.push(word.trim())
    savedMovies.textContent = savedWordsArray.join(", ");
}

const removeFromSavedWords = word => {
    const index = savedWordsArray.indexOf(word);
    if (index > -1) {
        savedWordsArray.splice(index, 1); // 2nd parameter means remove one item only
    }
    savedMovies.textContent = savedWordsArray.join(", ");
}

const searchTitle = e => {
    removeChild(movieOutput)
    movieOutput.innerHTML += "<p>...loading</p>"
    tmdbRequest(searchTitleUrl(), data => {
        console.log(data);
        if (data.results.length === 0) {
            console.log('yes');
            movieOutput.innerHTML += "<p>no results</p>"
        } else {
            const movie_lyst = data.results;
            if (e.target.id === 'sort-date') {
                movie_lyst.sort(function(a,b){
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return new Date(b['release_date']) - new Date(a['release_date']);
                });
            }
            if (e.target.id === 'sort-rating') {
                movie_lyst.sort(function(a,b){
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return b['vote_average'] - a['vote_average'];
                });
            }

            for (let index in movie_lyst) {
                const {original_title, poster_path, overview, release_date, vote_average, popularity} = data.results[index]
                const movie = document.createElement("div");
                let classToAdd = ['row', 'm-5', 'justify-content-center']
                movie.classList.add(...classToAdd);

                movieOutput.append(movie)
                // title and poster in first column
                const title_poster = document.createElement("div");
                title_poster.classList.add("col");
                movie.append(title_poster)
                // check if there is a poster_path
                const final_poster_path = poster_path ? `https://image.tmdb.org/t/p/original${poster_path}` : "./images/question.png"
                console.log(poster_path);
                console.log(final_poster_path);
                title_poster.innerHTML += `<h4 style="max-width: none; text-align: unset">${original_title}&nbsp<span style="font-size: 18px">(${release_date})</span></h4>`
                title_poster.innerHTML += `<img width="200" height="300" src="${final_poster_path}"  alt=${original_title} />`
                title_poster.innerHTML += `<div style="display:inline-block; position:relative; bottom:120px; left: 16px; font-color:white"><i id="${original_title}" class="fa fa-heart liked" ></i><span>&nbsp Like</span></div>`

                // intro
                const intro = document.createElement("div");
                classToAdd = ['col', 'my-2']
                intro.classList.add(...classToAdd);

                movie.append(intro)
                intro.innerHTML += `<h5>Overview</h5>`
                // calculate rating
                const star_count = parseInt((parseFloat(vote_average)/2).toFixed())

                if (star_count === 5) {
                    intro.innerHTML += `<div><span style="color: darkcyan">TMBD rating</span> &nbsp<span class="fa fa-star checked"></span>
                                        <span class="fa fa-star checked"></span>
                                        <span class="fa fa-star checked"></span>
                                        <span class="fa fa-star checked"></span>
                                        <span class="fa fa-star checked"></span></div>`;
                } else if (star_count === 4) {
                    intro.innerHTML += `<div><span style="color: darkcyan">TMBD rating</span> &nbsp<span class="fa fa-star checked"></span>
                                        <span class="fa fa-star checked"></span>
                                        <span class="fa fa-star checked"></span>
                                        <span class="fa fa-star checked"></span>
                                        <span class="fa fa-star"></span></div>`;
                } else if (star_count === 3) {
                    intro.innerHTML += `<div><span style="color: darkcyan">TMBD rating</span> &nbsp<span class="fa fa-star checked"></span>
                                        <span class="fa fa-star checked"></span>
                                        <span class="fa fa-star checked"></span>
                                        <span class="fa fa-star"></span>
                                        <span class="fa fa-star"></span></div>`;
                } else if (star_count === 2) {
                    intro.innerHTML += `<div><span style="color: darkcyan">TMBD rating</span> &nbsp<span class="fa fa-star checked"></span>
                                        <span class="fa fa-star checked"></span>
                                        <span class="fa fa-star"></span>
                                        <span class="fa fa-star"></span>
                                        <span class="fa fa-star"></span></div>`;
                } else if (star_count === 1) {
                    intro.innerHTML += `<div><span style="color: darkcyan">TMBD rating</span> &nbsp<span class="fa fa-star checked"></span>
                                        <span class="fa fa-star"></span>
                                        <span class="fa fa-star"></span>
                                        <span class="fa fa-star"></span>
                                        <span class="fa fa-star"></span></div>`;
                } else {
                    intro.innerHTML += `<div><span style="color: darkcyan">TMBD rating</span> &nbsp<span class="fa fa-star"></span>
                                        <span class="fa fa-star"></span>
                                        <span class="fa fa-star"></span>
                                        <span class="fa fa-star"></span>
                                        <span class="fa fa-star"></span></div>`;
                }
                intro.innerHTML += `<div style="color: darkcyan">TMBD popularity &nbsp ${popularity}</div>`
                intro.innerHTML += `<p>${overview}</p>`
            }

            // add liked event
            const liked = document.querySelectorAll(".liked")

            for (let i = 0; i < liked.length; i++) {
                liked[i].addEventListener("click", e =>  {
                    if (liked[i].classList.contains("red")) {
                        removeFromSavedWords(e.target.id)
                    } else {
                        addToSavedWords(e.target.id)
                    }
                    liked[i].classList.toggle("red");
                });
            }
        }
    })
}

showTitleButtion.addEventListener('click', searchTitle)

titleInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        searchTitle(e);
    }
})

sortDate.addEventListener('click', searchTitle)

sortRating.addEventListener('click', searchTitle)

