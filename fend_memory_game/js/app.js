/*
 * Create a list that holds all of your cards
 */

//Global scopes
const deck = document.querySelector('.deck');
let toggledCards = [];
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;

function shuffleDeck() {
  const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(cardsToShuffle);
  for (card of shuffledCards) {
    deck.appendChild(card);
  }
}
shuffleDeck();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//varibale which holds an empty array/push our click tagets into
//let toggledCards = [];

//Event listener for when clicking on a card (click handler)
deck.addEventListener('click', event => {
  const clickTarget = event.target;
  if (isClickValid(clickTarget)) {
    if (clockOff) {
      beginClock();
      clockOff = false;
    }
  }


  if (clickTarget.classList.contains('card') && toggledCards.length < 2) {
    toggleCard(clickTarget);
    addToggleCard(clickTarget);
    if (toggledCards.length === 2) {
      lookForMatch(clickTarget);
      affixMove();
      studyScore();
    }
  }
});

//Toggle functionality
function toggleCard(clickTarget) {
  clickTarget.classList.toggle('open');
  clickTarget.classList.toggle('show');
}

function addToggleCard(clickTarget) {
  toggledCards.push(clickTarget);
}

function isClickValid(clickTarget) {
  return (
    clickTarget.classList.contains('card') &&
    !clickTarget.classList.contains('match') &&
    toggledCards.length < 2 &&
    !toggledCards.includes(clickTarget)
  );
}

function beginClock() {
  clockId = setInterval(() => {
    time++;
    showTime();
  }, 1000);
}
beginClock();

function showTime() {
  const clock = document.querySelector('.clock');
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  if (seconds < 10) {
    clock.innerHTML = `${minutes}:0${seconds}`;
  } else {
    clock.innerHTML = `${minutes}:${seconds}`;
  }
}

//check for match
function lookForMatch() {
  const TOTAL_PAIRS = 8;

  if (
    toggledCards[0].firstElementChild.className ===
    toggledCards[1].firstElementChild.className
  ) {
    toggledCards[0].classList.toggle('match');
    toggledCards[1].classList.toggle('match');
    toggledCards = [];
    matched++;
    if (matched === TOTAL_PAIRS) {
      gameOver();
    }
  } else {
    setTimeout(() => { //both cards will be shown for 1000ms before turning back over
      console.log('cards didnt match!');
      toggleCard(toggledCards[0]);
      toggleCard(toggledCards[1]);
      toggledCards = [];
    }, 1000);
  }
}

function gameOver() {
  endClock();
  toggleModal();
  obtainModalStats();
}
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function endClock() {
  clearInterval(clockId);
}

function toggleModal() {
  const modal = document.querySelector('.modal__background');
  modal.classList.toggle('hide');
}

toggleModal() //Open modal
toggleModal() //Close modal

function obtainModalStats() {
  const timeStat = document.querySelector('.modal__time');
  const clockTime = document.querySelector('.clock').innerHTML;
  const movesStat = document.querySelector('.modal__moves');
  const starsStat = document.querySelector('.modal__stars');
  const stars = earnStars();

  timeStat.innerHTML = `Time =${clockTime}`;
  movesStat.innerHTML = `Moves =${moves}`;
  starsStat.innerHTML = `Stars =${stars}`;
}

function earnStars() {
  stars = document.querySelectorAll('.stars li');
  starCount = 0;
  for (star of stars) {
    if (star.style.display !== 'none') {
      starCount++;
    }

  }
  console.log(starCount); //2
  return starCount;
}

function affixMove() {
  moves++;
  const movesText = document.querySelector('.moves');
  movesText.innerHTML = moves;
}

function studyScore() {
  if (moves === 16 || moves === 24) {
    maskStar();
  }
}

function maskStar() {
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    if (star.style.display !== 'none') {
      star.style.display = 'none';
      break;
    }

  }

}

document.querySelector('.modal__cancel').addEventListener('click', () => {
  toggleModal();
});

document.querySelector('.modal__replay').addEventListener('click', recurGame);

function recurGame() {
  clearGame();
  toggleModal();
}

document.querySelector('.restart').addEventListener('click', clearGame);

function clearGame() {
  clearClockAndTime();
  clearMoves();
  clearStars();
  shuffleDeck();
}

function clearClockAndTime() {
  endClock();
  clockOff = true;
  time = 0;
  showTime();
}

function clearMoves() {
  moves = 0;
  document.querySelector('.moves').innerHTML = moves;
}

function clearStars() {
  stars = 0;
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    star.style.display = 'inline';
  }
}

function clearCards() {
  const cards = document.querySelectorAll('.deck li');
  for (let card of cards) {
    card.className = 'card';
  }
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */