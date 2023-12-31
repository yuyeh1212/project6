const c = document.getElementById("myCanvas");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSpeed = 20;
let ySpeed = 20;
let ground_x = 100;
let ground_y = 500;
let ground_heught = 5;
let brickArray = [];
let count = 0;

function getRandomArbitrary(min, max) {
  return (min = Math.floor(Math.random() * (max - min)));
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true;
  }

  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY >= this.y - radius &&
      ballY <= this.y + this.height + radius
    );
  }
}

//製作所有brick
for (let i = 0; i < 10; i++) {
  new Brick(getRandomArbitrary(0, 950), getRandomArbitrary(0, 550));
}

c.addEventListener("mousemove", (e) => {
  ground_x = e.clientX;
});

function drawCircle() {
  //確認球是否打到磚塊
  brickArray.forEach((brick) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++;
      console.log(count);
      brick.visible = false;
      //改變 x, y 方向速度，並且將 brick 從 brickArray 中移除
      //從下上方撞擊
      if (circle_y >= brick.y + brick.height || circle_y <= brick.y) {
        ySpeed *= -1;
      }
      //從左右方撞擊
      if (circle_x >= brick.x + brick.width || circle_x <= brick.x) {
        xSpeed *= -1;
      }

      /*brickArray.splice(index, 1);
      if (brickArray.length == 0) {
        alert("遊戲結束");
        clearInterval(game);
      }*/
      if (count == 10) {
        alert("遊戲結束");
        clearInterval(game);
      }
    }
  });

  //確認球是否打到黃色地板
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + 200 + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    if (ySpeed > 0) {
      circle_y -= 40;
    } else {
      circle_y += 40;
    }
    ySpeed *= -1;
  }

  //確認球是否打到邊界
  //確認左右邊界
  if (circle_x >= canvasWidth - radius || circle_x <= radius) {
    xSpeed *= -1;
  }
  //確認上下邊界
  if (circle_y >= canvasHeight - radius || circle_y <= radius) {
    ySpeed *= -1;
  }

  //更動球的座標
  circle_x += xSpeed;
  circle_y += ySpeed;

  //畫出黑色背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  //畫出所有brick
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  //劃出控制的地板
  ctx.fillStyle = "yellow";
  ctx.fillRect(ground_x, ground_y, 200, ground_heught);

  //劃出圓球
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "skyblue";
  ctx.fill();
}

let game = setInterval(drawCircle, 25);
