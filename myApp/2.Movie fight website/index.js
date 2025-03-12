const fetchData = async (searchTerm) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '25f89051',
      s : searchTerm
    }
  });

  return response.data.Search;
};

const input = document.querySelector('input');

const onInput = async event => {
  const movies = await fetchData(event.target.value);// because this fetch data is an asyncronous

  for (let movie of movies){
    const div = document.createElement('div');

    div.innerHTML = `
      <img src = "${movie.Poster}"/>
      <h1>${movie.Title}</h1>
    `;

    document.querySelector('#target').appendChild(div);
  }
};

input.addEventListener('input', debounce(onInput, 500)) 