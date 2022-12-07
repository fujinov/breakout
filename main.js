const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 480;
canvas.height = 360;
let rightPressed = false;
let leftPressed = false;
let score = 0;
let gameMode = "general";
let difficulty = "easy";
let gameClear = false;
let gameOver = false;

class Ball {
  x = canvas.width / 2;
  y = canvas.height / 2 - 30;
  radius = 10;
  threshold = this.radius / 2;
  color = "blue";

  constructor(difficulty) {
    switch (difficulty) {
      case "easy":
        this.dx = 3;
        this.dy = 4;
        break;
      case "normal":
        this.dx = 4;
        this.dy = 5;
        break;
      case "hard":
        this.dx = 5;
        this.dy = 6;
    }
  }
}

class Paddle {
  height = 10;
  width = 75;
  x = (canvas.width - this.width) / 2;
  dx = 7;
  hp = 2;
  effect = false;
  color = "blue";

  colorCange() {
    this.color = (this.color === "blue") ? "red" : "blue";
  }

  damageEffect() {
    this.effect = true;
    setTimeout(() => {
      this.effect = false;
    }, 100);
    setTimeout(() => {
      this.effect = true;
    }, 200);
    setTimeout(() => {
      this.effect = false;
    }, 300);
  }
}

const brick = {
  rowCount: 3,
  columnCount: 5,
  width: 75,
  height: 20,
  padding: 10,
  offsetTop: 30,
  offsetLeft: 30,

  list(mode) {
    const list = [];
    for (let r = 0; r < this.rowCount; r++) {
      list[r] = [];
      for (let c = 0; c < this.columnCount; c++) {
        const brickX = this.offsetLeft + c * (this.width + this.padding);
        const brickY = this.offsetTop + r * (this.height + this.padding);
        const hitPoint = (mode == "general") ? 1 : 2;
        list[r][c] = { x: brickX, y: brickY, hp: hitPoint };
      }
    }
    return list;
  },
};

let ball = new Ball(difficulty);
let paddle = new Paddle();
let bricks = brick.list(gameMode);

const draw = {
  ball() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = (ball.color === "blue") ? "#0095DD" : "#fc5858";
    ctx.fill();
    ctx.closePath();
  },

  paddle() {
    ctx.beginPath();
    ctx.rect(
      paddle.x,
      canvas.height - paddle.height,
      paddle.width,
      paddle.height,
    );
    if (paddle.effect) {
      ctx.fillStyle = "#f0d0d0";
    } else {
      ctx.fillStyle = (paddle.color === "blue") ? "#0095DD" : "#fc5858";
    }
    ctx.fill();
    ctx.closePath();
  },

  bricks() {
    for (const rows of bricks) {
      for (const br of rows) {
        if (br.hp === 0) continue;
        ctx.beginPath();
        ctx.rect(br.x, br.y, brick.width, brick.height);
        ctx.fillStyle = (br.hp === 1) ? "#0095DD" : "#fc5858";
        ctx.fill();
        ctx.closePath();
      }
    }
  },

  paddleHeart() {
    ctx.font = "22px emoji";
    ctx.fillStyle = "#ff0000";
    let heart;
    switch (paddle.hp) {
      case 0:
        heart = "";
        break;
      case 1:
        heart = "❤";
        break;
      case 2:
        heart = "❤❤";
        break;
    }
    const text = ctx.measureText(heart);
    ctx.fillText(heart, canvas.width - text.width - 5, 22);
  },

  all() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ball();
    this.paddle();
    this.bricks();
    if (gameMode === "color") this.paddleHeart();
  },

  shade() {
    this.all();
    ctx.beginPath();
    ctx.fillStyle = "rgb(238, 238, 238, 0.8)";
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    ctx.closePath();
  },

  count(count) {
    this.shade();
    ctx.font = "50px fantasy";
    ctx.fillStyle = "#000000";
    ctx.fillText(`${count}`, (canvas.width - 25) / 2, (canvas.height + 25) / 2);
  },

  gameClear() {
    this.shade();
    ctx.font = "50px fantasy";
    ctx.fillStyle = "#000000";
    const text = ctx.measureText("Game Clear!");
    ctx.fillText(
      "Game Clear!",
      (canvas.width - text.width) / 2,
      (canvas.height + 20) / 2,
    );
    this._score("#ff0000");
  },

  gameOver() {
    this.shade();
    ctx.font = "40px fantasy";
    ctx.fillStyle = "#ff0000";
    const text = ctx.measureText("Game Over");
    ctx.fillText(
      "Game Over",
      (canvas.width - text.width) / 2,
      (canvas.height + 20) / 2,
    );
    this._score("#000000");
  },

  _score(color) {
    ctx.font = "20px fantasy";
    ctx.fillStyle = color;
    const text = ctx.measureText(`スコア: ${score}`);
    ctx.fillText(
      `スコア: ${score}`,
      (canvas.width - text.width) / 2,
      (canvas.height + 7.5) / 2 + 30,
    );
  },
};

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
  if (gameMode === "color" && e.key === " ") {
    paddle.colorCange();
  }
}
function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

draw.shade();

const startButton = document.getElementById("start-button");
startButton.addEventListener("click", pressedStartButton);
function pressedStartButton() {
  startButton.disabled = true;
  const formElements = document.forms["game-form"].elements;
  difficulty = formElements["difficulty"].value;
  gameMode = formElements["mode"].value;
  ball = new Ball(difficulty);
  paddle = new Paddle(gameMode);
  bricks = brick.list(gameMode);
  score = 0;
  gameClear = false;
  gameOver = false;

  let count = 3;
  draw.count(count);
  const interval = setInterval(countDown, 800);
  function countDown() {
    if (count-- === 1) {
      clearInterval(interval);
      lanchTheGame();
    } else {
      draw.count(count);
    }
  }
}

function lanchTheGame() {
  draw.all();
  wallCollision();
  paddleCollision();
  bricksCollision();

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

  if (gameClear || gameOver) {
    let bonus;
    switch (difficulty) {
      case "easy":
        bonus = 1.0;
        break;
      case "normal":
        bonus = 1.5;
        break;
      case "hard":
        bonus = 2.0;
        break;
    }
    score *= 100 * bonus;
    startButton.disabled = false;
    if (gameClear) {
      draw.gameClear();
    } else {
      draw.gameOver();
    }
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
      paddle.x - ball.threshold <= ball.x &&
      ball.x <= paddle.x + paddle.width + ball.threshold
    ) {
      ball.dy = -ball.dy;
      if (ball.color !== paddle.color) {
        paddle.damageEffect();
        paddle.hp--;
        if (paddle.hp === 0) {
          gameOver = true;
        }
      }
    } else {
      gameOver = true;
    }
  }
}

function bricksCollision() {
  for (const rows of bricks) {
    for (const br of rows) {
      if (br.hp === 0) continue;
      if (
        br.x - ball.threshold <= ball.x &&
        ball.x <= br.x + brick.width + ball.threshold &&
        br.y <= ball.y &&
        ball.y <= br.y + brick.height + ball.threshold
      ) {
        ball.dy = -ball.dy;
        ball.color = (br.hp === 2) ? "red" : "blue";
        br.hp--;
        score++;
        if (gameMode === "general") {
          if (score === brick.rowCount * brick.columnCount) {
            gameClear = true;
          }
        } else {
          if (score === brick.rowCount * brick.columnCount * 2) {
            gameClear = true;
          }
        }
        return;
      }
    }
  }
}
