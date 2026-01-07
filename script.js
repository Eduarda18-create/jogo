
const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const stars = [];

for (let i = 0; i < 150; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    speed: Math.random() * 0.5 + 0.2
  });
}

function animateBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();

    star.y += star.speed;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });

  requestAnimationFrame(animateBackground);
}
animateBackground();

// ===== JOGO =====
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
    createExplosion(x, y);

    if (isGood) {
      score++;
    } else {
      loseLife();
      gameArea.classList.add("shake");
      setTimeout(() => gameArea.classList.remove("shake"), 300);
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

function createExplosion(x, y) {
  const explosion = document.createElement("div");
  explosion.classList.add("explosion");
  explosion.style.left = `${x}px`;
  explosion.style.top = `${y}px`;
  gameArea.appendChild(explosion);
  setTimeout(() => explosion.remove(), 400);
}

function loseLife() {
  lives--;
  updateHUD();
  if (lives <= 0) endGame();
}

function updateHUD() {
  scoreEl.textContent = score;
  livesEl.textContent = lives;
  scoreEl.classList.add("score-pop");
  setTimeout(() => scoreEl.classList.remove("score-pop"), 200);
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