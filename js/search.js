// tmdb api
const api = '42e61f509847e4df4ba19097f47d2745';

// const in html
const movieOutput = document.querySelector('#movie_output');
const titleInput = document.querySelector('#title_input');
const showTitleButtion = document.querySelector("#show_title")

function tmdbRequest(url, callback) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            // This invokes the callback that updates the page.
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

const searchTitle = e => {
    removeChild(movieOutput)
    tmdbRequest(searchTitleUrl(), data => {
        if (data.length === 0) {
            movieOutput.innerHTML += "<ul><li>(no results)</li></ul>"
        } else {
            // console.log(data.results);
            for (let index in data.results) {
                const movieInfo = data.results.index;
                const movie = document.createElement("div");
                let classToAdd = ['row', 'my-5']
                movie.classList.add(...classToAdd);

                movieOutput.append(movie)
                // title and poster in first column
                const title_poster = document.createElement("div");
                title_poster.classList.add("col-lg-4");
                movie.append(title_poster)
                // console.log(data.results[index]['original_title']);
                const {original_title, poster_path, overview} = data.results[index]
                // console.log(data.results[index]);
                title_poster.innerHTML += `<h4 style="max-width: none; text-align: unset">${original_title}</h4>`
                title_poster.innerHTML += `<img width="200" height="300" src="https://image.tmdb.org/t/p/original${poster_path}"  />`
                // intro
                const intro = document.createElement("div");
                intro.classList.add("col");
                movie.append(intro)
                intro.innerHTML += `<p>${overview}</p>`
            }

        }
    })
}

showTitleButtion.addEventListener('click', searchTitle)