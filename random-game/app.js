const board = document.querySelector('.board');
let squares = [];
let squaresPrev = [];
const width = 4;
let scoreContainer = document.querySelector('.score');
let movesContainer = document.querySelector('.moves');
let score = 0;
let maxNumber = 0;
let moves = 0;
let isWinning = false;
let isFault = false;
const resultContainer = document.querySelector('.result');
const btnPrev = document.querySelector('.before');
const btnRestart = document.querySelector('.restart');
const best = document.querySelector('.best');
const rating = document.querySelector('.last');
let bestGame = {score: 0, moves: 0};
let lastResults = [{score: 0, moves: 0}, {score: 0, moves: 0}, {score: 0, moves: 0}, {score: 0, moves: 0}, {score: 0, moves: 0}, {score: 0, moves: 0}, {score: 0, moves: 0}, {score: 0, moves: 0}, {score: 0, moves: 0}, {score: 0, moves: 0},];
const audio = document.querySelector('audio');

const createClasses = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    arr[i].classList.add(`n-${arr[i].innerHTML}`);
  }
}

const removeClasses = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    arr[i].classList.remove(`n-${parseInt(arr[i].innerHTML)}`)
  }
}

const savePrev = () => {
  squaresPrev = [];
  squares.forEach(item => {
    squaresPrev.push(item.innerHTML);
  })
}

const startNumbers = () => {
  let random = Math.floor(Math.random() * squares.length);
  let count = 0;
  squares.forEach(item => {
    if(item.innerHTML == 0) count++;
  })
  if (count > 0) {
    if (squares[random].innerHTML == 0) {
      if (Math.random() < 0.3) {
        squares[random].innerHTML = 4;
      } else {
        squares[random].innerHTML = 2;
      }
    } else {
      startNumbers()
    }
  }
}

const createBoard = () => {
  score = 0;
  scoreContainer.innerHTML = score;
  moves = 0;
  movesContainer.innerHTML = moves;
  board.innerHTML = '';
  for (let i = 0; i < width * width; i++) {
    const item = `<div class="square n-0">0</div>`;
    board.insertAdjacentHTML('beforeend', item);
  }
  squares = document.querySelectorAll('.square');
  startNumbers();
  startNumbers();
  createClasses(squares);
  savePrev();
}

const createBest = () => {
  best.innerHTML = '';
  const item = `<div class="best"><h4>Best result: </h4><span>score: ${bestGame.score}, moves: ${bestGame.moves}</span></div>`;
  best.insertAdjacentHTML('beforeend', item);
}

const createRating = (lastResults) => {
  const results = lastResults.map(item => `<li>score: ${item.score}, moves: ${item.moves}</li>`);
  const otherResults = `<div class="last"><h4>Last results: </h4><ol class="list">${results.flat(Infinity).join('')}</ol></div>`
  rating.insertAdjacentHTML('beforeend', otherResults);
}

const setLocalStorage = () => {
  localStorage.setItem('lastResults', JSON.stringify(lastResults));
  localStorage.setItem('bestGame', JSON.stringify(bestGame));
}

const getLocalStorage = () => {
  if(localStorage.getItem('lastResults')) {
    const results = JSON.parse(localStorage.getItem('lastResults'));
    rating.innerHTML = '';
    createRating(results);
    lastResults = results;
  }
  if(localStorage.getItem('bestGame')) {
    const result = JSON.parse(localStorage.getItem('bestGame'));
    bestGame = result;
    createBest();
  }
}

createBest();

const updateBestResult = () => {
  if(score >= bestGame.score) {
    if(moves >= bestGame.moves) {
      bestGame.score = score;
      bestGame.moves = moves;
      createBest();
    } 
  } 
}

const saveRatings = () => {
  for(let i = lastResults.length - 1; i > 0; i--) {
    Object.assign(lastResults[i], lastResults[i - 1]);
  }
  lastResults[0].score = score;
  lastResults[0].moves = moves;
  rating.innerHTML = '';
  createRating(lastResults);
  createBest();

}

createBoard();
btnRestart.addEventListener('click',  () => {
  saveRatings();
  updateBestResult();
  resultContainer.innerHTML = '';
  createBoard();
  isWinning = false;
  isFault = false;
  audio.src = `./assets/audio/step.mp3`;
});

const getRow = (arr, start, end) => {
  for (let i = start; i <= end; i ++) {
    if (parseInt(squares[i].innerHTML) > 0) arr.push(parseInt(squares[i].innerHTML));
  }
}

const getColumn = (arr, start) => {
  for (let i = start; i <= 15; i += 4) {
    if (parseInt(squares[i].innerHTML) > 0) arr.push(parseInt(squares[i].innerHTML))
  }
}

const sumRowRight = () => {
  for(let i = 0; i < 15; i++) {
    if(squares[i].innerHTML === squares[i + 1].innerHTML) {
      if(i === 3 || i === 7 || i === 11) {
        continue; 
      }
      let sum = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
      squares[i].innerHTML = sum;
      score += sum;
      scoreContainer.innerHTML = score;
      squares[i + 1].innerHTML = 0;
    }
  }
}

const sumRowLeft = () => {
  for(let i = 15; i > 0; i--) {
    if(squares[i].innerHTML === squares[i - 1].innerHTML) {
      if(i === 12 || i === 8 || i === 4) {
        continue; 
      }
      let sum = parseInt(squares[i].innerHTML) + parseInt(squares[i - 1].innerHTML);
      squares[i].innerHTML = sum;
      score += sum;
      scoreContainer.innerHTML = score;
      squares[i - 1].innerHTML = 0;
    }
  }
}

const sumColumnUp = () => {
  for(let i = 0; i < 12; i++) {
    if(squares[i].innerHTML === squares[i + 4].innerHTML) {
      let sum = parseInt(squares[i].innerHTML) + parseInt(squares[i + 4].innerHTML);
      squares[i].innerHTML = sum;
      score += sum;
      scoreContainer.innerHTML = score;
      squares[i + 4].innerHTML = 0;
    }
  }
}

const sumColumnDown = () => {
  for(let i = 15; i > 3; i--) {
    if(squares[i].innerHTML === squares[i - 4].innerHTML) {
      let sum = parseInt(squares[i].innerHTML) + parseInt(squares[i - 4].innerHTML);
      squares[i].innerHTML = sum;
      score += sum;
      scoreContainer.innerHTML = score;
      squares[i - 4].innerHTML = 0;
    }
  }
}

const moveLeft = () => {
  for (let i = 0; i < 16; i += 4) {
    let row = [];
    getRow(row, i, i + 3);
    let missing = 4 - row.length;
    for (let j = 0; j < missing; j++) {
      row.push(0);
    }
    for (let j = 0; j < 4; j++) {
      squares[i + j].innerHTML = row[j];
    }
  }
}

const moveRight = () => {
  for (let i = 0; i < 16; i += 4) {
    let row = [];
    getRow(row, i, i + 3);
    let missing = 4 - row.length;
    for (let j = 0; j < missing; j++) {
      row.unshift(0);
    }
    for (let j = 0; j < 4; j++) {
      squares[i + j].innerHTML = row[j];
    }
  }
}

const moveUp = () => {
  for (let i = 0; i < 4; i += 1) {
    let column = [];
    getColumn(column, i);
    let missing = 4 - column.length;
    for (let j = 0; j < missing; j++) {
      column.push(0);
    }
    let h = 0;
    for (let j = 0; j < 16; j += 4) {
      squares[i + j].innerHTML = column[h];
      h += 1;
    }
  }
}

const moveDown = () => {
  for (let i = 0; i < 4; i += 1) {
    let column = [];
    getColumn(column, i);
    let missing = 4 - column.length;
    for (let j = 0; j < missing; j++) {
      column.unshift(0);
    }
    let h = 0;
    for (let j = 0; j < 16; j += 4) {
      squares[i + j].innerHTML = column[h];
      h += 1;
    }
  }
}

const checkFault = () => {
  if (resultContainer.innerHTML == "Lose!") {
    resultContainer.innerHTML = "";
  }
  count = 0;
  for (let i = 0; i < squares.length - 1; i++) {
    if(i === 3 || i === 7 || i === 11) {
      continue; 
    }
    if (squares[i].innerHTML == squares[i + 1].innerHTML || squares[i].innerHTML == 0 || squares[i + 1].innerHTML == 0) {
      count += 1;
      break;
    }
  }
  for (let i = 0; i < 12 - 1; i++) {
    if (squares[i].innerHTML == squares[i + 4].innerHTML || squares[i].innerHTML == 0 || squares[i + 4].innerHTML == 0) {
      count += 1;
      break;
    }
  }
  return count === 0;
}

const countMaxNumber = () => {
  squares.forEach(item => {
    if (parseInt(item.innerHTML) > maxNumber) maxNumber = item.innerHTML;
  })
}

const checkChanges = () => {
  let count = 0;
  for(let i = 0; i < squares.length; i++) {
    if (squares[i].innerHTML === squaresPrev[i]) {
      count++;
    }
  }
  return count === squares.length;
}

const goTo = (func, funcDirection) => {
  audio.play();
  if(checkFault() === false) {
    savePrev();
  }
  removeClasses(squares);
  func();
  funcDirection();
  func();
  startNumbers();
  createClasses(squares);
  if(checkFault() === true) {
    audio.src = './assets/audio/lose.mp3';
    audio.play();
    resultContainer.innerHTML = `<div><h3>Lose!</h3><span>score: ${score}, moves: ${moves}</span></div>`;
    saveRatings();
    updateBestResult();
    setLocalStorage();
    btnPrev.disabled = true;
    return isFault = true;
  }
  countMaxNumber()
  if (maxNumber >= 2048) {
    audio.src = './assets/audio/win.mp3';
    audio.play();
    isWinning = true;
    resultContainer.innerHTML = `<div><h3>Win!</h3><span>score: ${score}, moves: ${moves}</span></div>`;
    saveRatings();
    updateBestResult();
    setLocalStorage();
  }
  if(checkChanges() === false) {
    moves += 1;
    movesContainer.innerHTML = moves;
  }
  btnPrev.disabled = false;
  updateBestResult();
}

const goBack = () => {
  removeClasses(squares);
  for (let i = 0; i < squares.length; i++) {
    squares[i].innerHTML = squaresPrev[i];
  }
  createClasses(squares);
  checkFault();

  if (moves !== 0) {
    moves += 1;
    movesContainer.innerHTML = moves;
  }
  btnPrev.disabled = true;
}

const getKey = (e) => {
  if (isWinning === false && isFault === false) {
    if(e.code === 'KeyS') goTo(moveDown, sumColumnDown);
    if(e.code === 'KeyW') goTo(moveUp, sumColumnUp);
    if(e.code === 'KeyA') goTo(moveLeft, sumRowLeft);
    if(e.code === 'KeyD') goTo(moveRight, sumRowRight);
  }
}

document.addEventListener('keyup', getKey);
btnPrev.addEventListener('click', goBack);

window.addEventListener('beforeunload', saveRatings);
window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);
