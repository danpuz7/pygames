const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Constants
const WIDTH = 1000;
const HEIGHT = 800;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 70;
const PLAYER_VEL = 5;
const STAR_WIDTH = 15;
const STAR_HEIGHT = 20;
const STAR_VEL = 2;
const FONT_SIZE = 30;

// Initialize canvas size
canvas.width = WIDTH;
canvas.height = HEIGHT;

// Load images
const BG = new Image();
BG.src = 'bg.jpeg';  // Replace with your background image path
const PLAYER_IMG = new Image();
PLAYER_IMG.src = 'goji.png';  // Replace with your player image path
const STAR_IMG = new Image();
STAR_IMG.src = 'jade.png';  // Replace with your star image path

// Game Variables
let playerX = 200;
let playerY = HEIGHT - PLAYER_HEIGHT;
let stars = [];
let elapsedTime = 0;
let starCount = 0;
let starAddIncrement = 2000;
let hit = false;
let lastTime = Date.now();

// Game Loop
function gameLoop() {
    const now = Date.now();
    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;
    elapsedTime += deltaTime;

    // Clear the screen
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw background
    ctx.drawImage(BG, 0, 0, WIDTH, HEIGHT);

    // Draw player
    ctx.drawImage(PLAYER_IMG, playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT);

    // Draw time
    ctx.font = `${FONT_SIZE}px Helvetica`;
    ctx.fillStyle = "white";
    ctx.fillText(`Time: ${Math.round(elapsedTime)}s`, 10, 30);

    // Update stars and check for collisions
    if (starCount > starAddIncrement) {
        for (let i = 0; i < 2; i++) {
            const starX = Math.random() * (WIDTH - STAR_WIDTH);
            stars.push({ x: starX, y: -STAR_HEIGHT });
        }
        starAddIncrement = Math.max(200, starAddIncrement - 25);
        starCount = 0;
    }

    stars.forEach((star, index) => {
        star.y += STAR_VEL;
        if (star.y > HEIGHT) {
            stars.splice(index, 1);
        } else if (
            star.y + STAR_HEIGHT >= playerY &&
            star.x + STAR_WIDTH > playerX &&
            star.x < playerX + PLAYER_WIDTH
        ) {
            stars.splice(index, 1);
            hit = true;
        }
        ctx.drawImage(STAR_IMG, star.x, star.y, STAR_WIDTH, STAR_HEIGHT);
    });

    if (hit) {
        ctx.fillText("You lost! I love you, E.V.W! 💌", WIDTH / 2 - 160, HEIGHT / 2);
        setTimeout(() => {
            window.location.reload(); // Restart the game after 4 seconds
        }, 4000);
        return;
    }

    // Move the player based on keyboard input
    if (keys[37] && playerX >= 0) {  // Left Arrow
        playerX -= PLAYER_VEL;
    }
    if (keys[39] && playerX + PLAYER_WIDTH <= WIDTH) {  // Right Arrow
        playerX += PLAYER_VEL;
    }

    // Increment star count
    starCount += deltaTime * 1000;

    // Request the next frame
    requestAnimationFrame(gameLoop);
}

// Key event handling
let keys = [];
window.addEventListener("keydown", (e) => { keys[e.keyCode] = true; });
window.addEventListener("keyup", (e) => { keys[e.keyCode] = false; });

// Start the game
gameLoop();
