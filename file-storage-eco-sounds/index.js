const audio = document.querySelector('audio');
const playBtn = document.querySelector('.play-btn');
const main = document.querySelector('.main');
const tabs = document.querySelectorAll('.tab');
let isPlay = false;

// Play or Pause

function playAudio() {
  audio.currentTime = 0;
  audio.play();
  isPlay = true;
  playBtn.classList.add('pause-btn')
}

function pauseAudio() {
  audio.pause();
  isPlay = false;
  playBtn.classList.remove('pause-btn')
}

playBtn.addEventListener('click', () => {
  if (isPlay) {
    pauseAudio();
  } else {
    playAudio();
  }
});

//Switcher

const changeImage = (event) => {
  main.style.backgroundImage = `url('./assets/img/${event.target.dataset.bird}.jpg')`
}

const changeAudio = (event) => {
  audio.src = `./assets/audio/${event.target.dataset.bird}.mp3`;
  playAudio();
}

const changeClassActive = (event) => {
  tabs.forEach(tab => {
    tab.classList.remove('active')
  })
  event.target.classList.add('active')
}

tabs.forEach(tab => {
  tab.addEventListener('click', changeImage);
  tab.addEventListener('click', changeAudio);
  tab.addEventListener('click', changeClassActive);
})
