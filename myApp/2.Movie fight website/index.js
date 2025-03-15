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

createAutocomplete({
  root: document.querySelector('.autocomplete')
});
createAutocomplete({
  root: document.querySelector('.autocomplete-two')
});
createAutocomplete({
  root: document.querySelector('.autocomplete-three')
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
    <article class= 'notification' >
      <p class='title'>${movieDetail.Awards}</p>
      <p class='subtitle'>Awards</p>
    </article>
    <article class= 'notification' >
      <p class='title'>${movieDetail.BoxOffice}</p>
      <p class='subtitle'>Box Office</p>
    </article>
    <article class= 'notification' >
      <p class='title'>${movieDetail.Metascore}</p>
      <p class='subtitle'>Metascore</p>
    </article>
    <article class= 'notification' >
      <p class='title'>${movieDetail.imdbRating}</p>
      <p class='subtitle'>IMDB Rating</p>
    </article>
    <article class= 'notification' >
      <p class='title'>${movieDetail.imdbVotes}</p>
      <p class='subtitle'>IMDB Votes</p>
    </article>
  `;
}
