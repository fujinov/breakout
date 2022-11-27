const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 480;
canvas.height = 360;
const startButton = document.getElementById("start");
let rightPressed = false;
let leftPressed = false;
let gameOver = false;

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  dx: 3,
  dy: 3,

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  },
};

const paddle = {
  height: 10,
  width: 75,
  x: (canvas.width - 75) / 2,
  dx: 6,

  draw() {
    ctx.beginPath();
    ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  },
};

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}
function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

drawShade();
function drawShade() {
  drawAll();
  ctx.fillStyle = "rgb(238, 238, 238, 0.8)";
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();
}

function drawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  paddle.draw();
  ball.draw();
}

startButton.addEventListener("click", pressedStartButton);
function pressedStartButton() {
  startButton.style.display = "none";

  let count = 3;
  drawCountDown();
  innerInterval = setInterval(drawCountDown, 900);
  function drawCountDown() {
    drawShade();
    ctx.font = "50px fantasy";
    ctx.fillStyle = "#000000";
    ctx.fillText(`${count}`, (canvas.width - 25) / 2 , (canvas.height + 25) / 2);
    if (count-- == 0) {
      clearInterval(innerInterval);
      lanchTheGame();
    }
  }
}

function lanchTheGame() {
  drawAll();
  wallCollision();
  paddleCollision();

  ball.x += ball.dx;
  ball.y += ball.dy;
  if (rightPressed) {
    paddle.x += paddle.dx;
    if (paddle.x + paddle.width > canvas.width) {
      paddle.x = canvas.width - paddle.width;
    }
  }
  if (leftPressed) {
    paddle.x -= paddle.dx;
    if (paddle.x < 0) {
      paddle.x = 0;
    }
  }

  if (gameOver) {
    drawGameEnd();
  } else {
    requestAnimationFrame(lanchTheGame);
  }
}

function wallCollision() {
  if (
    ball.x + ball.dx + ball.radius > canvas.width ||
    ball.x + ball.dx < ball.radius
  ) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  }
}

function paddleCollision() {
  if (ball.y + ball.radius >= canvas.height - paddle.height) {
    if (
      paddle.x - ball.radius <= ball.x &&
      ball.x <= paddle.x + paddle.width + ball.radius
    ) {
      ball.dy = -ball.dy;
    } else {
      gameOver = true;
    }
  }
}

function drawGameEnd() {
  drawShade();
  ctx.font = "40px fantasy";
  ctx.fillStyle = "#000000";
  const text = ctx.measureText("Game Over");
  ctx.fillText("Game Over", (canvas.width - text.width) / 2 , (canvas.height + 20) / 2);
}
