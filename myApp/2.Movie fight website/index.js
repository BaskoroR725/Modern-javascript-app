const fetchData = async () => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '25f89051',
      s: 'avenger'
    }
  });

  console.log(response.data)
};

fetchData();