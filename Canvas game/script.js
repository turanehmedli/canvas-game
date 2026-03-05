const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

canvas.width = 1000
canvas.height = 1000

const player = {
  x: 100,
  y: 300,
  width: 40,
  height: 50,
  vx: 0,
  vy: 0,
  speed: 5,
  jumpPower: 20,
  grounded: false
}

let gravity = 0.6
let cameraX = 0
let gameOver = false

const platforms = [
  { x: 0, y: 450, width: 2000, height: 50 },
  { x: 300, y: 350, width: 150, height: 20 },
  { x: 600, y: 300, width: 150, height: 20 },
  { x: 900, y: 380, width: 150, height: 20 },
  { x: 1200, y: 320, width: 150, height: 20 },
  { x: 1500, y: 300, width: 150, height: 20 },
  { x: 1800, y: 350, width: 150, height: 20 },
]

const enemies = [
  { x: 500, y: 420, width: 40, height: 30, vx: 2 },
  { x: 1100, y: 420, width: 40, height: 30, vx: 2 }
]

function createNumber(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)

    return Math.floor(Math.random()*(max-min))+min;
}

function spawnPlatform(){
    const lastPlatform = platforms[platforms.length - 1].x;
    const groundPlatform = Number.isInteger(platforms.length / 7)

    platforms.push(
        groundPlatform ?
        {x:lastPlatform +500,
            y:450, width:2000, height:50
        }:{
            x:createNumber(lastPlatform +300, lastPlatform+400),
            y:createNumber(200,350), width:150, height:20
        }
    )
}


function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

const keys = {}

function update() {
  if (gameOver) return

  if(player.x > platforms[platforms.length - 1].x + platforms[platforms.length - 1].width - 500){
    spawnPlatform()
    spawnPlatform()
    spawnPlatform()
    spawnPlatform()
    spawnPlatform()
    spawnPlatform()
    }


  player.vx = 0
  if (keys["arrowleft"] || keys["a"]) {
    player.vx = -player.speed
  }

  if (keys["arrowright"] || keys["d"]) {
    player.vx = player.speed
  }

  player.x += player.vx
  player.vy += gravity
  player.y += player.vy

  player.grounded = false

  platforms.forEach(platform => {
    if (
      player.x + player.width > platform.x &&
      player.x < platform.x + platform.width &&
      player.y + player.height > platform.y &&
      player.y + player.height < platform.y + platform.height + player.vy
    ) {
      player.y = platform.y - player.height
      player.vy = 0
      player.grounded = true
    }
  })

  enemies.forEach(enemy => {
    enemy.x += enemy.vx

    if (enemy.x < 400 || enemy.x > 1500) {
      enemy.vx *= -1
    }

    if (isColliding(player, enemy)) {
      if (player.vy > 0 && player.y + player.height - enemy.y < 20) {
        enemy.x = -1000
        player.vy = -10
      } else {
        gameOver = true
      }
    }
  })

  cameraX = player.x - 200

  if (player.y > canvas.height) {
    gameOver = true
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.save()
  ctx.translate(-cameraX, 0)

  ctx.fillStyle = "green"
  platforms.forEach(p => {
    ctx.fillRect(p.x, p.y, p.width, p.height)
  })

  ctx.fillStyle = "red"
  enemies.forEach(enemy => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)
  })

  ctx.fillStyle = "blue"
  ctx.fillRect(player.x, player.y, player.width, player.height)

  ctx.restore()

  if (gameOver) {
    ctx.fillStyle = "black"
    ctx.font = "40px Arial"
    ctx.fillText("GAME OVER: ", canvas.width / 2 - 120, canvas.height / 2)
    ctx.font = "20px Arial"
    ctx.fillText("Press R to restart", canvas.width / 2 - 90, canvas.height / 2 + 40)
  }
}

function gameLoop() {
  update()
  draw()
  requestAnimationFrame(gameLoop)
}

document.addEventListener("keydown", e => {
  keys[e.key.toLowerCase()] = true

  if (
    (e.key === " " || e.key === "ArrowUp" || e.key.toLowerCase() === "w")
    && player.grounded
  ) {
    player.vy = -player.jumpPower
    player.grounded = false
  }

  if (e.key.toLowerCase() === "r" && gameOver) {
    location.reload()
  }
})

document.addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false
})

gameLoop()
 