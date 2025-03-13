//fetch data func
const fetchData = async (searchTerm) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '25f89051',
      s : searchTerm
    }
  });

  if (response.data.Error){
    return [];
  }

  return response.data.Search;
};

//inserting html dropdown
const root = document.querySelector('.autocomplete');
root.innerHTML = `
  <label><b>Search For a Movie</b></label>
  <input class='input'/>
  <div class = "dropdown">
    <div class = "dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results')

//helper func to dropdown widget movie
const onInput = async event => {
  const movies = await fetchData(event.target.value);// because this fetch data is an asyncronous

  if (!movies.length){
    dropdown.classList.remove('is-active');
    return;
  }

  resultsWrapper.innerHTML= '';
  dropdown.classList.add('is-active');
  for (let movie of movies){
    const option = document.createElement('a');
    const imgSrc = movie.Poster === "N/A" ? '' : movie.Poster;

    option.classList.add('dropdown-item')
    option.innerHTML = `
      <img src = "${imgSrc}"/>
      ${movie.Title}
    `;

    option.addEventListener('click', () =>{
      dropdown.classList.remove('is-active');
      input.value = movie.Title;
      onMovieSelect(movie);
    })

    resultsWrapper.appendChild(option);// insert to results dropdown
  }
};

input.addEventListener('input', debounce(onInput, 500)) 

//if user click outside from dropdown widget. the widget got close down
document.addEventListener('click', event =>{
  if (!root.contains(event.target)){
    dropdown.classList.remove('is-active');
  }
});

//helper func if user select movie from dropdown
const onMovieSelect = async movie => {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
      apikey: '25f89051',
      i : movie.imdbID
      }
    });
    
    document.querySelector('#summary').innerHTML = movieTemplate(response.data);
};

//helper func to show detail movie
const movieTemplate = (movieDetail) => {
  return `
    <article class='media'>
      <figure class = 'media-left'>
        <p class = 'image'>
          <img src = '${movieDetail.Poster}'/>
        </p>
      </figure>
      <div class = 'media-conteent'>
        <div class = 'content'>
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
  `;
}
