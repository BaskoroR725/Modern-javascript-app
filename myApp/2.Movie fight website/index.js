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