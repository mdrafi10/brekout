// select items
const canvas = document.querySelector("#canvas");
const start = document.querySelector(".start");
const ctx = canvas.getContext("2d");
const canvasH = canvas.height;
const canvasW = canvas.width;

let rightPressed = false;
let leftPressed = false;
// variable declare
let x,
  y,
  dx,
  dy,
  interval,
  radius,
  paddleW,
  paddleX,
  paddleY,
  brickW,
  brickH,
  briksOfset;
let bricks = [];
let score = 0;
setVariables();
drawBall();
drawPaddle();
createBrickArray();
drawBricks();
drawScore();
paddleNavigation();
// startGame();

// draw score
function drawScore() {
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.fillText("Score: " + score, 9, 10);
  ctx.closePath();
}

// create bricks function
function createBrickArray() {
  for (let j = 0; j < 6; j++) {
    bricks[j] = [];
    for (let i = 0; i < 12; i++) {
      bricks[j][i] = { x: 0, y: 0, isVisible: true };
    }
  }
}

// draw Bricks function
function drawBricks() {
  for (let j = 0; j < 6; j++) {
    for (let i = 0; i < 12; i++) {
      if (bricks[j][i].isVisible) {
        const brickX = 10 + i * (brickW + briksOfset);
        const brickY = (10 + briksOfset) * (j + 1);
        bricks[j][i].x = brickX;
        bricks[j][i].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickW, brickH);
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// event function
function paddleNavigation() {
  document.addEventListener("keydown", handlekeyDown);
  document.addEventListener("keyup", handlekeyUp);

  function handlekeyDown(e) {
    if (e.key === "ArrowRight") {
      rightPressed = true;
    }
    if (e.key === "ArrowLeft") {
      leftPressed = true;
    }
  }

  function handlekeyUp(e) {
    if (e.key === "ArrowRight") {
      rightPressed = false;
    }
    if (e.key === "ArrowLeft") {
      leftPressed = false;
    }
  }
}

// Event listener
start.addEventListener("click", () => startGame());

// detect collision
function detectCollision() {
  if (x + dx >= canvasW || x + dx < 0) {
    dx = -dx;
  }
  if (y + dy > canvasH - radius) {
    if (x + dx > paddleX && x + dx < paddleX + paddleW) {
      dy = -dy;
      dx = dx + (x + dx - paddleX) / 100;
    }
  }
  if (y + dy < 0) {
    dy = -dy;
  }
  for (let b = 0; b < bricks.length; b++) {
    for (let i = 0; i < bricks[b].length; i++) {
      const brick = bricks[b][i];
      if (brick.isVisible) {
        if (
          x > brick.x &&
          x < brick.x + brickW &&
          y > brick.y &&
          y < brick.y + brickH
        ) {
          bricks[b][i].isVisible = false;
          score += 1;
          dy = -dy;
          cheekYouWon();
        }
      }
    }
  }
}

// Interval function
function startGame() {
  if (!interval) {
    interval = setInterval(() => {
      if (rightPressed) {
        paddleX = paddleX + 5;
      }
      if (leftPressed) {
        paddleX = paddleX - 5;
      }
      detectCollision();
      x = x + dx;
      y = y + dy;
      cheekGameover();
      cheekYouWon();
      ctx.clearRect(0, 0, canvasW, canvasH);
      drawPaddle();
      drawBall();
      drawBricks();
      drawScore();
    }, 20);
  }
}

// game over
function cheekGameover() {
  if (y === canvasH) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Gave Over",
    });
    clearInterval(interval);
    interval = null;
    setVariables();
  }
}

// check won
function cheekYouWon() {
  if (score == 72) {
    Swal.fire({
      title: "You Won !!",
      width: 600,
      padding: "3em",
      background: "#fff url(/images/trees.png)",
      backdrop: `
            rgba(0,0,123,0.4)
            url("/images/nyan-cat.gif")
            left top
            no-repeat
          `,
    });
    clearInterval(interval);
    interval = null;
    setVariables();
  }
}

// function setVariables
function setVariables() {
  x = canvasW / 2;
  y = canvasH - 20;
  dx = 5;
  dy = -5;
  radius = 10;
  paddleW = 50;
  paddleX = canvasW / 2 - paddleW / 2;
  paddleY = canvasH - 10;

  brickW = 40;
  brickH = 10;
  briksOfset = 9;
}

// draw circle function
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = "#C60139";
  ctx.fill();
  ctx.closePath();
}

// draw paddle function
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleW, 10);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.closePath();
}
