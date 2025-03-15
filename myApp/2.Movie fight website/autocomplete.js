const createAutocomplete = ({ 
  root, 
  renderOption, 
  onOptionSelect, 
  inputValue, 
  fetchData
 }) =>{
  //inserting html dropdown
  root.innerHTML = `
    <label><b>Search</b></label>
    <input class='input'/>
    <div class = "dropdown">
      <div class = "dropdown-menu">
        <div class="dropdown-content results"></div>
      </div>
    </div>
  `;

  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown');
  const resultsWrapper = root.querySelector('.results')

  //helper func to dropdown widget movie
  const onInput = async event => {
    const items = await fetchData(event.target.value);// because this fetch data is an asyncronous

    if (!items.length){
      dropdown.classList.remove('is-active');
      return;
    }

    resultsWrapper.innerHTML= '';
    dropdown.classList.add('is-active');
    for (let item of items){
      const option = document.createElement('a');
      

      option.classList.add('dropdown-item')
      option.innerHTML = renderOption(item);

      option.addEventListener('click', () =>{
        dropdown.classList.remove('is-active');
        input.value = inputValue(item);
        onOptionSelect(item);
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

};