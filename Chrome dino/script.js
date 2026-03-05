const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

let gravity = 0.6;
let gameSpeed = 6;
let score = 0;
let gameOver = false;

let spawnTimer = 0;
let spawnInterval = 100;

const dino = {
    x: 50,
    y: 150,
    width: 50,
    height: 50,
    yVelocity: 0,
    isJumping: false
};

const obstacles = [];

function drawDino() {
    ctx.fillStyle = 'black';
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
}

function drawObstacles() {
    ctx.fillStyle = 'green';
    for (const obs of obstacles) {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + Math.floor(score), canvas.width - 150, 30);
}

function updateDino() {
    if (dino.isJumping) {
        dino.yVelocity += gravity;
        dino.y += dino.yVelocity;

        if (dino.y >= 150) {
            dino.y = 150;
            dino.isJumping = false;
            dino.yVelocity = 0;
        }
    }
}

function updateObstacles() {
    for (const obs of obstacles) {
        obs.x -= gameSpeed;
    }

    
    if (obstacles.length > 0 && obstacles[0].x + obstacles[0].width < 0) {
        obstacles.shift();
    }
}

function checkCollision() {
    for (const obs of obstacles) {
        if (
            dino.x < obs.x + obs.width &&
            dino.x + dino.width > obs.x &&
            dino.y < obs.y + obs.height &&
            dino.y + dino.height > obs.y
        ) {
            gameOver = true;
        }
    }
}

function spawnObstacle() {
    const height = Math.random() * 30 + 20;

    obstacles.push({
        x: canvas.width,
        y: 200 - height,
        width: 20,
        height: height
    });
}

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    score += 0.1;

    
    gameSpeed = 6 + score * 0.01;


    spawnTimer++;
    if (spawnTimer > spawnInterval) {
        spawnObstacle();
        spawnTimer = 0;
        spawnInterval = Math.random() * 60 + 80;
    }

    updateDino();
    updateObstacles();
    checkCollision();

    drawDino();
    drawObstacles();
    drawScore();

    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && !dino.isJumping && !gameOver) {
        dino.isJumping = true;
        dino.yVelocity = -12;
    }
});

gameLoop();