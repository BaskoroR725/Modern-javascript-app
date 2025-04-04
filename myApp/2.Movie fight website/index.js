const autoCompleteConfig = {
  renderOption : (movie) => {
    const imgSrc = movie.Poster === "N/A" ? '' : movie.Poster;
    return `
        <img src = "${imgSrc}"/>
        ${movie.Title} (${movie.Year})
      `;
  },
  inputValue : (movie) =>{
    return movie.Title
  },
  fetchData : async (searchTerm) =>{
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
  }
}

createAutocomplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect : (movie) =>{
    document.querySelector('.tutorial').classList.add('is-hidden') ;
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  }
});

createAutocomplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect : (movie) =>{
    document.querySelector('.tutorial').classList.add('is-hidden') ;
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  },
});

let leftMovie;
let rightMovie;
//helper func if user select movie from dropdown
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
      apikey: '25f89051',
      i : movie.imdbID
      }
    });
    
    summaryElement.innerHTML = movieTemplate(response.data);

    if(side === 'left'){
      leftMovie = response.data;
    } else {
      rightMovie = response.data;
    }

    if (leftMovie && rightMovie){
      runComparison();
    }
};

const runComparison = () =>{
  const leftSideStats = document.querySelectorAll('#left-summary .notification');
  const rightSideStats = document.querySelectorAll('#right-summary .notification');

  leftSideStats.forEach((leftStat, index) =>{
    const rightStat = rightSideStats[index];

    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    if (rightSideValue > leftSideValue){
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    } else {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    }

  });
}

//helper func to show detail movie
const movieTemplate = (movieDetail) => {
  const dollar = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
  const awards = movieDetail.Awards.split(' ').reduce((prev, word) =>{
    const value = parseInt(word);

    if (isNaN(value)){
      return prev;
    } else {
      return prev + value;
    }
  }, 0);

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
    <article data-value=${awards} class= 'notification is-primary' >
      <p class='title'>${movieDetail.Awards}</p>
      <p class='subtitle'>Awards</p>
    </article>
    <article data-value=${dollar} class= 'notification is-primary' >
      <p class='title'>${movieDetail.BoxOffice}</p>
      <p class='subtitle'>Box Office</p>
    </article>
    <article data-value=${metascore} class= 'notification is-primary' >
      <p class='title'>${movieDetail.Metascore}</p>
      <p class='subtitle'>Metascore</p>
    </article>
    <article data-value=${imdbRating} class= 'notification is-primary' >
      <p class='title'>${movieDetail.imdbRating}</p>
      <p class='subtitle'>IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class= 'notification is-primary' >
      <p class='title'>${movieDetail.imdbVotes}</p>
      <p class='subtitle'>IMDB Votes</p>
    </article>
  `;
}
