const key = 'b17c44228beb2d9ced34a96df9fccd68';
let type = 'movie'
let url = `https://api.themoviedb.org/3/discover/${type}?sort_by=popularity.desc&api_key=b17c44228beb2d9ced34a96df9fccd68`;
const urlImg = 'https://image.tmdb.org/t/p/w1280'
main = document.querySelector('.main');
const types = document.querySelectorAll('.tab-item')

//Получение данных

const showData = (data) => {
  if (data.results === undefined) {
    console.log('The resource you requested could not be found.')
    const item = `<div>The resource you requested could not be found.</div>`
    main.insertAdjacentHTML('beforeend', item);
  } else {
    data.results.forEach(el => {
      if (type === 'movie') {
        const item = `<div class="item">
        <img src=${urlImg + el.poster_path}>
        <h3 class="item-title">${el.original_title}</h3>
        <div class="item-info">
          <span class="overage">${el.vote_average}</span>
          <span class="date">Release date: <span>${el.release_date}</span></span>
        </div>
        <div class="item-overview">
          <h4>Overview</h4>
          <p>${el.overview}</p>
        </div>
      </div>`;
      main.insertAdjacentHTML('beforeend', item);
      } else if (type === 'tv') {
        const item = `<div class="item">
        <img src=${urlImg + el.poster_path}>
        <h3 class="item-title">${el.name}</h3>
        <div class="item-info">
          <span class="overage">${el.vote_average}</span>
          <span class="date">First air date: <span>${el.first_air_date}</span></span>
        </div>
        <div class="item-overview">
          <h4>Overview</h4>
          <p>${el.overview}</p>
        </div>
      </div>`;
      main.insertAdjacentHTML('beforeend', item);
      }
      })
  }
}

const chooseColorForRate = () => {
  document.querySelectorAll('.overage').forEach(item => {
    if (item.textContent < 4) {
      item.classList.add('red')
    } else if (item.textContent >= 7) {
      item.classList.add('green')
    } else {
      item.classList.add('yellow')
    }
  })
}


async function getData() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    showData(data)
    chooseColorForRate();
  } catch {
    console.log('The resource you requested could not be found.')
    const item = `<div>The resource you requested could not be found.</div>`
    main.insertAdjacentHTML('beforeend', item);
  }
}
getData();

const clearHTML = () => {
  main.innerHTML = ''
}

const clearValue = (e) => {
  search.value = '';
}

types.forEach(item => {
  item.addEventListener('click', (e) => {
    types.forEach(i => {
      i.classList.remove('active')
    })
    item.classList.add('active')
    type = e.target.dataset.type;
    url = `https://api.themoviedb.org/3/discover/${type}?sort_by=popularity.desc&api_key=b17c44228beb2d9ced34a96df9fccd68`;
    clearHTML();
    clearValue();
    getData();
  })
})

//Поиск

const form = document.querySelector('#form');
const search = document.querySelector('#search');
let valueInput = '';



form.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    searchData(search.value)
  }
})

async function searchData(value) {
  valueInput = value
  console.log(`https://api.themoviedb.org/3/search/${type}?query=${value}&api_key=b17c44228beb2d9ced34a96df9fccd68`)
  const res = await fetch(`https://api.themoviedb.org/3/search/${type}?query=${value}&api_key=b17c44228beb2d9ced34a96df9fccd68`)
  const data = await res.json();
  console.log(data);
  clearHTML();
  showData(data);
  chooseColorForRate();
}

//Focus 
function setFocus(){
  search.focus();
}

setFocus()

//Удаление поискового запроса из строки поиска

const btn = document.querySelector('.btn-close');

btn.addEventListener('click', (e) => {
  e.preventDefault();
  clearValue();
}) 
