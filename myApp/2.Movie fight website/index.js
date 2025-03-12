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

let timeoutId;
const onInput = async event => {
  const movie = await fetchData(event.target.value);// because this fetch data is an asyncronous
  console.log(movie);
};

input.addEventListener('input', debounce(onInput, 500)) 