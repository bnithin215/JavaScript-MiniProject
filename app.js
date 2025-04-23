const board = document.getElementById('game-board');
const restartBtn = document.getElementById('restart');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const winMessage = document.getElementById('win-message');
const finalStats = document.getElementById('final-stats');

const cards = [
  '🍎', '🍌', '🍇', '🍓',
  '🍍', '🥝', '🍉', '🍒',
];

let cardArray = [...cards, ...cards]; // duplicate to create pairs
let flippedCards = [];
let lockBoard = false;
let moves = 0;
let time = 0;
let timer;
let matchedPairs = 0;
const totalPairs = cards.length;

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function createBoard() {
  board.innerHTML = '';
  cardArray = shuffle(cardArray);
  matchedPairs = 0;
  moves = 0;
  time = 0;
  flippedCards = [];
  lockBoard = false;

  clearInterval(timer);
  updateMoves();
  updateTimer();
  startTimer();

  winMessage.style.display = 'none';

  cardArray.forEach((emoji) => {
    const card = document.createElement('div');
    card.classList.add('card');

    const inner = document.createElement('div');
    inner.classList.add('inner-card');

    const front = document.createElement('div');
    front.classList.add('front');

    const back = document.createElement('div');
    back.classList.add('back');
    back.textContent = emoji;

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.dataset.emoji = emoji;

    card.addEventListener('click', handleFlip);
    board.appendChild(card);
  });
}

function handleFlip(e) {
  if (lockBoard) return;

  const clicked = e.currentTarget;
  if (clicked.classList.contains('flipped')) return;

  clicked.classList.add('flipped');
  flippedCards.push(clicked);

  if (flippedCards.length === 2) {
    checkForMatch();
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;
  moves++;
  updateMoves();

  const isMatch = card1.dataset.emoji === card2.dataset.emoji;

  if (!isMatch) {
    lockBoard = true;
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      resetTurn();
    }, 800);
  } else {
    card1.removeEventListener('click', handleFlip);
    card2.removeEventListener('click', handleFlip);

    matchedPairs++;
    if (matchedPairs === totalPairs) {
      clearInterval(timer);
      winMessage.style.display = 'block';
      finalStats.textContent = `Completed in ${moves} moves and ${time}s`;
    }

    resetTurn();
  }
}

function resetTurn() {
  flippedCards = [];
  lockBoard = false;
}

function updateMoves() {
  movesDisplay.textContent = `Moves: ${moves}`;
}

function startTimer() {
  timer = setInterval(() => {
    time++;
    updateTimer();
  }, 1000);
}

function updateTimer() {
  timerDisplay.textContent = `Time: ${time}s`;
}

restartBtn.addEventListener('click', createBoard);

createBoard();
