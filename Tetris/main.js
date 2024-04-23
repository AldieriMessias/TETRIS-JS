const gw = (gridWidth = 10);
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const $score = document.querySelector('.score');
const shapeFreezeAudio = new Audio('./audio/tetraminoFreeze.wav');
const completedLineAudio = new Audio('./audio/completedLine.wav');
const gameOverAudio = new Audio('./audio/gameOver.wav');
const $miniGridSquares = document.querySelectorAll('.mini-grid div');
const miniGW = 6;
const nextPosition = 2;
const possibleNextShape = [
  [1, 2, miniGW + 1, miniGW * 2 + 1],
  [miniGW + 1, miniGW + 2, miniGW * 2, miniGW * 2 + 1],
  [1, miniGW, miniGW + 1, miniGW + 2],
  [0, 1, miniGW, miniGW + 1],
  [1, miniGW + 1, miniGW * 2 + 1, miniGW * 3 + 1],
];

//Shapes

const lShape = [
  [1, 2, gw + 1, gw * 2 + 1],
  [gw, gw + 1, gw + 2, gw * 2 + 2],
  [1, gw + 1, gw * 2, gw * 2 + 1],
  [gw, gw * 2, gw * 2 + 1, gw * 2 + 2],
];

const zShape = [
  [gw + 1, gw + 2, gw * 2, gw * 2 + 1],
  [0, gw, gw + 1, gw * 2 + 1],
  [gw + 1, gw + 2, gw * 2, gw * 2 + 1],
  [0, gw, gw + 1, gw * 2 + 1],
];

const tShape = [
  [1, gw, gw + 1, gw + 2],
  [1, gw + 1, gw + 2, gw * 2 + 1],
  [gw, gw + 1, gw + 2, gw * 2 + 1],
  [1, gw, gw + 1, gw * 2 + 1],
];

const oShape = [
  [0, 1, gw, gw + 1],
  [0, 1, gw, gw + 1],
  [0, 1, gw, gw + 1],
  [0, 1, gw, gw + 1],
];

const iShape = [
  [1, gw + 1, gw * 2 + 1, gw * 3 + 1],
  [gw, gw + 1, gw + 2, gw + 3],
  [1, gw + 1, gw * 2 + 1, gw * 3 + 1],
  [gw, gw + 1, gw + 2, gw + 3],
];

const colors = ['blue', 'yellow', 'red', 'orange', 'pink'];
let currentColor = (cC = Math.floor(Math.random() * colors.length));
let nextColor = (nC = colors[currentColor]);

const allShapes = [lShape, zShape, tShape, oShape, iShape];

let rS = (randomShapes = Math.floor(Math.random() * allShapes.length));
let cR = (currentRotation = 0);
let cP = (currentPosition = 3);

let cS = (currentShape = allShapes[rS][cR]);
let $gridSquares = Array.from(document.querySelectorAll('.grid div'));

function draw() {
  cS.forEach((sI) => {
    $gridSquares[sI + cP].classList.add('shapePainted', `${colors[cC]}`);
  });
}

const unDraw = () => {
  cS.forEach((sI) => {
    $gridSquares[sI + cP].classList.remove('shapePainted', `${colors[cC]}`);
  });
};

const moveDown = () => {
  freeze();
  unDraw();
  cP += gw;
  draw();
};
let timeMoveDown = 1000;
let timerId = null;

intervalMove = () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  } else {
    timerId = setInterval(moveDown, timeMoveDown);
  }
};

const freeze = () => {
  if (cS.some((sI) => $gridSquares[sI + cP + gw].classList.contains('filled'))) {
    cS.map((sI) => $gridSquares[sI + cP].classList.add('filled'));
    cP = 3;
    cR = 0;
    rS = nextRandomShape;
    cS = allShapes[rS][cR];
    cC = nextColor;
    draw();

    checkIfRowIsFilled();

    updateScore(5);
    shapeFreezeAudio.play();
    displayNextShape();
    gameOver();
  }
};

const moveLeft = () => {
  cP -= 1;
};

const refreshPage = () => {
  window.location.reload();
};

startBtn.addEventListener('click', intervalMove);
restartBtn.addEventListener('click', refreshPage);

let $grid = document.querySelector('.grid');
function checkIfRowIsFilled() {
  for (var row = 0; row < $gridSquares.length; row += gw) {
    let currentRow = [];
    for (var square = row; square < row + gw; square++) {
      currentRow.push(square);
    }
    const isRowPainted = currentRow.every((square) => $gridSquares[square].classList.contains('shapePainted'));
    if (isRowPainted) {
      const squaresRemoved = $gridSquares.splice(row, gw);
      squaresRemoved.forEach((square) => square.removeAttribute('class'));
      $gridSquares = squaresRemoved.concat($gridSquares);
      $gridSquares.forEach((square) => $grid.appendChild(square));

      updateScore(100);

      completedLineAudio.play();
    }
  }
}
let score = 0;

function updateScore(updateValue) {
  score += updateValue;
  $score.textContent = score;

  clearInterval(timerId);
  if (score <= 200) {
    timeMoveDown = 800;
  } else if (200 < score && score <= 400) {
    timeMoveDown = 600;
  } else if (400 < score && score <= 600) {
    timeMoveDown = 500;
  } else if (600 < score && score <= 800) {
    timeMoveDown = 400;
  } else {
    timeMoveDown = 200;
  }
  timerId = setInterval(moveDown, timeMoveDown);
}

let nextRandomShape = Math.floor(Math.random() * possibleNextShape.length);

const displayNextShape = () => {
  $miniGridSquares.forEach((square) => square.classList.remove('shapePainted', `${colors[nextColor]}`));
  nextRandomShape = Math.floor(Math.random() * possibleNextShape.length);
  nextColor = Math.floor(Math.random() * colors.length);
  const nextShape = possibleNextShape[nextRandomShape];
  nextShape.forEach((squareIndex) => $miniGridSquares[squareIndex + nextPosition + miniGW].classList.add('shapePainted', `${colors[nextColor]}`));
};
displayNextShape();

function gameOver() {
  if (cS.some((squareIndex) => $gridSquares[squareIndex + cP].classList.contains('filled'))) {
    updateScore(-5);
    clearInterval(timerId);
    timerId = null;
    startBtn.ariaDisabled = true;
    gameOverAudio.play();
    $score.innerHTML += '<br/>' + 'GAME OVER';
  }
}

function allMoves() {
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' && timerId != null) {
      const leftLimit = cS.some((sI) => (sI + cP) % gw === 0);
      if (leftLimit) return;

      const isFilled = cS.some((sI) => $gridSquares[sI + cP - 1].classList.contains('filled'));
      if (isFilled) return;
      unDraw();
      cP--;
      draw();
    } else if (e.key === 'ArrowRight' && timerId != null) {
      const rightLimit = cS.some((sI) => (sI + cP) % gw === 9);
      if (rightLimit) return;

      const isFilled = cS.some((sI) => $gridSquares[sI + cP + 1].classList.contains('filled'));
      if (isFilled) return;
      unDraw();
      cP++;
      draw();
    } else if (e.key === 'ArrowDown' && timerId != null) {
      const isFilled = cS.some((sI) => $gridSquares[sI + cP + gw].classList.contains('filled'));
      if (isFilled) return;
      unDraw();
      cP += gw;
      draw();
    } else if (e.key === 'ArrowUp' && timerId != null) {
      const leftLimit = cS.some((sI) => (sI + cP) % gw === 0);
      if (leftLimit) return;

      const rightLimit = cS.some((sI) => (sI + cP) % gw === 9);
      if (rightLimit) return;

      const isFilled = cS.some((sI) => $gridSquares[sI + cP + 1].classList.contains('filled'));
      if (isFilled) return;

      const isFilled2 = cS.some((sI) => $gridSquares[sI + cP - 1].classList.contains('filled'));
      if (isFilled2) return;

      unDraw();
      if (cR < 3) {
        cR++;
      } else {
        cR = 0;
      }
      cS = allShapes[rS][cR];
      draw();
    } else if (e.code === 'Space') {
      intervalMove();
    } else if (e.key === 'r') {
      refreshPage();
    }
  });
}

allMoves();
