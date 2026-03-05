const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const bgMusic = new Audio("./music/hitslab-gaming-game-video-game-music-474671.mp3");
bgMusic.volume = 0.5;
bgMusic.loop = true;

canvas.width = 1300;
canvas.height = 693;

const player = {
  x: 100,
  y: 300,
  width: 40,
  height: 50,
  vx: 0,
  vy: 0,
  speed: 5,
  jumpPower: 20,
  grounded: false,
};

let gravity = 0.6;
let cameraX = 0;
let gameOver = false;
let score = 0;

const platforms = [
  { x: 0, y: 450, width: 2000, height: 50 },
  { x: 300, y: 350, width: 150, height: 20 },
  { x: 600, y: 300, width: 150, height: 20 },
  { x: 900, y: 380, width: 150, height: 20 },
  { x: 1200, y: 320, width: 150, height: 20 },
  { x: 1500, y: 300, width: 150, height: 20 },
  { x: 1800, y: 350, width: 150, height: 20 },
];

const enemies = [
  { x: 500, y: 420, width: 40, height: 30, vx: 2, platform:platforms[0] },
  { x: 1100, y: 420, width: 40, height: 30, vx: 2, platform:platforms[0] },
];

function createNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function spawnEnemy(platform) {
  enemies.push({
    x: createNumber(platform.x + 20, platform.x + platform.width - 40),
    y: platform.y - 30,
    width: 40,
    height: 30,
    vx: Math.random() > 0.5 ? 2 : -2,
    platform: platform,
  });
}

function spawnPlatform() {
  const lastPlatform = platforms[platforms.length - 1].x;
  const groundPlatform = Number.isInteger(platforms.length / 7);

  const newPlatform = groundPlatform
    ? { x: lastPlatform + 500, y: 450, width: 2000, height: 50 }
    : {
        x: createNumber(lastPlatform + 300, lastPlatform + 400),
        y: createNumber(200, 350),
        width: 150,
        height: 20,
      };

  platforms.push(newPlatform);

  if (platforms.length % 3 === 0) {
    spawnEnemy(newPlatform);
  }
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

const keys = {};

function update() {

  if (player.y > canvas.height) {
    gameOver = true;
    bgMusic.currentTime = 0
    bgMusic.pause();
    return; 
  }

  if(gameOver) return

  if (
    player.x >
    platforms[platforms.length - 1].x +
      platforms[platforms.length - 1].width -
      500
  ) {
    for(let i =0;i< 6; i++){
      spawnPlatform()
    }
  }

  player.vx = 0;
  if (keys["arrowleft"] || keys["a"]) {
    player.vx = -player.speed;
  }

  if (keys["arrowright"] || keys["d"]) {
    player.vx = player.speed;
  }

  player.x += player.vx;
  player.vy += gravity;
  player.y += player.vy;
  player.grounded = false;

  platforms.forEach((platform) => {
    if (
      player.x + player.width > platform.x &&
      player.x < platform.x + platform.width &&
      player.y + player.height > platform.y &&
      player.y + player.height < platform.y + platform.height + player.vy
    ) {
      player.y = platform.y - player.height;
      player.vy = 0;
      player.grounded = true;
    }
  });

  enemies.forEach((enemy) => {
    enemy.x += enemy.vx;

    if (enemy.platform) {
      if (enemy.x < enemy.platform.x || enemy.x + enemy.width > enemy.platform.x + enemy.platform.width) {
        enemy.vx *= -1;
      }
    }


    if (isColliding(player, enemy)) {
      if (player.vy > 0 && player.y + player.height - enemy.y < 20) {
        enemy.x = -1000;
        player.vy = -10;
        score += 1;
      } else {
        gameOver = true;
        bgMusic.pause()
      }
    }
  });

  cameraX = player.x + player.width / 2 - canvas.width / 2;

  if (player.y > canvas.height) {
    gameOver = true;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(-cameraX, 0);

  ctx.fillStyle = "green";
  platforms.forEach((p) => {
    ctx.fillRect(p.x, p.y, p.width, p.height);
  });

  ctx.fillStyle = "red";
  enemies.forEach((enemy) => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });

  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.restore();

  ctx.fillStyle = "black";
  ctx.font = "40px Arial";
  ctx.fillText("Score: " + score, 20, 50);

  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER: ", canvas.width / 2 - 120, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText(
      "Press R to restart",
      canvas.width / 2 - 90,
      canvas.height / 2 + 40,
    );
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}



function playJumpSound() {
  const jumpSound = new Audio("./music/dragon-studio-cartoon-jump-463196.mp3");
  jumpSound.volume = 0.4;
  jumpSound.play();
}

document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;

  if (
    (e.key === " " || e.key === "ArrowUp" || e.key.toLowerCase() === "w") &&
    player.grounded
  ) {
    player.vy = -player.jumpPower;
    player.grounded = false;

    playJumpSound()
  }

  if (e.key.toLowerCase() === "r" && gameOver) {
    location.reload();
  }
});

document.addEventListener("keydown", () => {
  if (bgMusic.paused && !gameOver) {
    bgMusic.play();
  }
}, { once: true });

document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

gameLoop();
