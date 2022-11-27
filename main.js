const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 480;
canvas.height = 360;
const startButton = document.getElementById("start");

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
}

lanchTheGame();

function lanchTheGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball.draw();
  wallCollision();
  ball.x += ball.dx;
  ball.y += ball.dy;
  requestAnimationFrame(lanchTheGame);
}

function wallCollision() {
  if (
    ball.x + ball.dx + ball.radius > canvas.width ||
    ball.x + ball.dx < ball.radius
    ) {
      ball.dx = -ball.dx;
    }
  if (
    ball.y + ball.dy + ball.radius > canvas.height ||
    ball.y + ball.dy < ball.radius
  ) {
    ball.dy = -ball.dy;
  }
}
