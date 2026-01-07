const gameArea = document.getElementById("gameArea");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

let score = 0;
let lives = 3;
let gameInterval;
let spawnSpeed = 1200;

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

function startGame() {
  startScreen.classList.add("hidden");
  score = 0;
  lives = 3;
  spawnSpeed = 1200;
  updateHUD();

  gameInterval = setInterval(createTarget, spawnSpeed);
}

function restartGame() {
  gameOverScreen.classList.add("hidden");
  startGame();
}

function createTarget() {
  const target = document.createElement("div");
  target.classList.add("target");

  const isGood = Math.random() > 0.4;
  target.classList.add(isGood ? "good" : "bad");

  const x = Math.random() * (gameArea.clientWidth - 60);
  const y = Math.random() * (gameArea.clientHeight - 60);

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  gameArea.appendChild(target);

  target.addEventListener("click", () => {
    if (isGood) {
      score++;
    } else {
      loseLife();
    }
    updateHUD();
    target.remove();
  });

  setTimeout(() => {
    if (gameArea.contains(target) && isGood) {
      loseLife();
      target.remove();
    }
  }, 1500);

  increaseDifficulty();
}

function loseLife() {
  lives--;
  updateHUD();

  if (lives <= 0) {
    endGame();
  }
}

function updateHUD() {
  scoreEl.textContent = score;
  livesEl.textContent = lives;
}

function increaseDifficulty() {
  if (score % 5 === 0 && spawnSpeed > 400) {
    clearInterval(gameInterval);
    spawnSpeed -= 100;
    gameInterval = setInterval(createTarget, spawnSpeed);
  }
}

function endGame() {
  clearInterval(gameInterval);
  document.querySelectorAll(".target").forEach(t => t.remove());
  finalScore.textContent = score;
  gameOverScreen.classList.remove("hidden");
}