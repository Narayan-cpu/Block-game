const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
  x: 200,
  y: 350,
  width: 30,
  height: 30,
  color: '#00f',
  speed: 5,
};

const items = [];
const obstacles = [];
const obstacleSpeed = 2;
let score = 0;

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawItem(item) {
  ctx.fillStyle = item.color;
  ctx.fillRect(item.x, item.y, item.width, item.height);
}

function drawObstacle(obstacle) {
  ctx.fillStyle = obstacle.color;
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

function update() {
  // Update player position
  if (keys.ArrowLeft && player.x > 0) {
    player.x -= player.speed;
  }

  if (keys.ArrowRight && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }

  // Update item position
  for (const item of items) {
    item.y += 2;

    // Check for item collection
    if (
      player.x < item.x + item.width &&
      player.x + player.width > item.x &&
      player.y < item.y + item.height &&
      player.y + player.height > item.y
    ) {
      items.splice(items.indexOf(item), 1);
      score++;
    }

    // Remove items that are out of the canvas
    if (item.y > canvas.height) {
      items.splice(items.indexOf(item), 1);
    }
  }

  // Update obstacle position
  for (const obstacle of obstacles) {
    obstacle.y += obstacleSpeed;

    // Check for collision with player
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      endGame();
    }

    // Remove obstacles that are out of the canvas
    if (obstacle.y > canvas.height) {
      obstacles.splice(obstacles.indexOf(obstacle), 1);
    }
  }

  // Add new items and obstacles at regular intervals
  if (Math.random() < 0.02) {
    items.push({
      x: Math.random() * (canvas.width - 30),
      y: 0,
      width: 20,
      height: 20,
      color: '#0f0',
    });
  }

  if (Math.random() < 0.01) {
    obstacles.push({
      x: Math.random() * (canvas.width - 30),
      y: 0,
      width: 30,
      height: 30,
      color: '#f00',
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();

  for (const item of items) {
    drawItem(item);
  }

  for (const obstacle of obstacles) {
    drawObstacle(obstacle);
  }

  ctx.fillStyle = '#000';
  ctx.fillText(`Score: ${score}`, 10, 20);
}

function endGame() {
  alert(`Game Over! Your score is ${score}`);
  resetGame();
}

function resetGame() {
  score = 0;
  items.length = 0;
  obstacles.length = 0;
  player.x = 200;
  player.y = 350;
  requestAnimationFrame(gameLoop);
}

const keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);