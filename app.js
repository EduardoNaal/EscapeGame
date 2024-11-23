const gameArea = document.getElementById('game-area');
const player = document.querySelector('#player');
const beyonce = document.querySelector('#beyonce');
const audio = document.querySelector('audio');
const selectEnemy = document.getElementById('select-enemy');
const selectScenery = document.getElementById('select-scenary');
const selectDifficulty = document.getElementById('select-difficulty');
const scoreValue = document.getElementById('score-value');
const restartButton = document.getElementById('restart');
const startButton = document.getElementById('start');
const title = document.querySelector('h1');

let playerSpeed = 40;
let beyonceSpeed = 1;
let isPlaying = false;
let playerPosition = { x: 0, y: 0 };
let beyoncePosition = { x: 300, y: 300 };
let score = 0;
let backgroundScenery;
let enemy;

// Ajustar velocidad según la dificultad
function adjustSpeed(level) {
    switch (level) {
        case 'low':
            playerSpeed = 20;
            beyonceSpeed = 0.5;
            break;
        case 'medium':
            playerSpeed = 40;
            beyonceSpeed = 1;
            break;
        case 'high':
            playerSpeed = 60;
            beyonceSpeed = 2;
            break;
    }
}

// Bucle principal del juego
function gameLoop() {
    if (isPlaying) {
        moveBeyonce();
        requestAnimationFrame(gameLoop);
    }
}

// Detectar colisión
function detectCollision() {
    const deltaX = Math.abs(playerPosition.x - beyoncePosition.x);
    const deltaY = Math.abs(playerPosition.y - beyoncePosition.y);

    if (deltaX <= 50 && deltaY <= 50) {
        isPlaying = false;
        alert('¡Perdiste! ¿Quieres intentarlo de nuevo?');
        resetPositions();
    }
}

// Mover al enemigo
function moveBeyonce() {
    if (!isPlaying) return;

    if (beyoncePosition.x < playerPosition.x) {
        beyoncePosition.x += beyonceSpeed;
    } else if (beyoncePosition.x > playerPosition.x) {
        beyoncePosition.x -= beyonceSpeed;
    }

    if (beyoncePosition.y < playerPosition.y) {
        beyoncePosition.y += beyonceSpeed;
    } else if (beyoncePosition.y > playerPosition.y) {
        beyoncePosition.y -= beyonceSpeed;
    }

    updatePosition();
    detectCollision();
}

// Mover al jugador
function movePlayer(event) {
    if (!isPlaying) return;

    switch (event.key) {
        case 'w':
            if (playerPosition.y >= 25) playerPosition.y -= playerSpeed;
            break;
        case 's':
            if (playerPosition.y < gameArea.clientHeight - 70) playerPosition.y += playerSpeed;
            break;
        case 'a':
            if (playerPosition.x >= 25) playerPosition.x -= playerSpeed;
            break;
        case 'd':
            if (playerPosition.x < gameArea.clientWidth - 70) playerPosition.x += playerSpeed;
            break;
    }

    updatePosition();
}

// Actualizar posiciones en el DOM
function updatePosition() {
    player.style.transform = `translate(${playerPosition.x}px, ${playerPosition.y}px)`;
    beyonce.style.transform = `translate(${beyoncePosition.x}px, ${beyoncePosition.y}px)`;
    score++;
    scoreValue.textContent = score;
}

// Iniciar o detener el juego
startButton.addEventListener('click', () => {
    if (isPlaying) {
        isPlaying = false;
        startButton.textContent = 'Start';
        startButton.style.backgroundColor = 'green';
        audio.pause();
    } else {
        isPlaying = true;
        startButton.textContent = 'Stop';
        startButton.style.backgroundColor = 'red';
        gameLoop();
        audio.play();
    }
});

// Reiniciar juego
restartButton.addEventListener('click', () => {
    resetPositions();
    score = 0;
    scoreValue.textContent = score;
});

// Restablecer posiciones
function resetPositions() {
    playerPosition = { x: 0, y: 0 };
    beyoncePosition = { x: 300, y: 300 };
    updatePosition();
}

// Cambiar enemigo
selectEnemy.addEventListener('change', (event) => {
    enemy = event.target.value;
    const enemyName = enemy.split('.')[0];

    title.textContent = `ESCAPA DE ${enemyName.toUpperCase()}`;
    beyonce.style.backgroundImage = `url(img/${enemy})`;

    const soundtrack = enemyName;
    audio.pause();
    audio.currentTime = 0;
    audio.src = `music/${soundtrack}.mp3`;
    audio.load();
    if (isPlaying) {
        audio.play();
    }
});

// Cambiar escenario
selectScenery.addEventListener('change', (event) => {
    backgroundScenery = event.target.value;
    gameArea.style.backgroundImage = `url(img/${backgroundScenery})`;
});

// Ajustar velocidad según la dificultad
selectDifficulty.addEventListener('change', (event) => adjustSpeed(event.target.value));

// Control de teclas
window.addEventListener('keydown', movePlayer);
window.addEventListener('load', () => {
    gameLoop();
});
