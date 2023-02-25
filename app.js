const playerElement = document.querySelector('.player');
const obstacleElement = document.querySelector('.obstacle');
const scoreElement = document.querySelector('.score-card .score');
const highScoreElement = document.querySelector('.score-card .high-score');
const gameContainerElement = document.querySelector('.game-container');
const restartGameElement = document.querySelector('.restart-game');

const OBSTACLES_SIZES = ['xs','s','m','l'];

let jumping = false;
function addJumpListener() {
    document.addEventListener('keydown', event => {
        // console.log(event)
        if((event.key === ' ' || event.key === 'ArrowUp') && !jumping) {
            jump();
        }
    })
}

function jump() {
    console.log('jump');
    jumping = true;
    playerElement.classList.add('jump');
    pausePlayer();
    setTimeout(() => {
        jumping = false;
        playerElement.classList.remove('jump');
        resumePlayer();
    }, 1200);
}

let interval;
function monitorCollision() {
    interval = setInterval(() => {
        isCollision();
    }, 10);
}

const BUFFER = 50;
function isCollision() {
    const playerClientRect = playerElement.getBoundingClientRect();
    const playerL = playerClientRect.left;
    const playerR = playerClientRect.right;
    const playerB = playerClientRect.bottom;
    
    
    const obstacleClientRect = obstacleElement.getBoundingClientRect();
    const obstacleL = obstacleClientRect.left;
    const obstacleR = obstacleClientRect.right;
    const obstacleT = obstacleClientRect.top;

    const dangerZone = (obstacleR - BUFFER) > playerL && (obstacleL < playerR);
    const yCollision = playerB > obstacleT;

    if(dangerZone && yCollision) {
        console.log('Dead!!!!!');
        // console.table({obstacleL, obstacleR, playerL, playerR})
        stopGame();
        checkForHighScore();
    }
}
let score = 0;
function setScore(newScore) {
    scoreElement.innerText = score = newScore;
}

let scoreInterval;
function countScore() {
    scoreInterval = setInterval(() => {
        setScore(score + 1);
    }, 100);
}

let highscore = localStorage.getItem('highscore');
function setHighScore(newScore) {
    highscore = newScore;
    highScoreElement.innerText = newScore;
    localStorage.setItem('highscore', newScore);
}

function checkForHighScore() {
    if(score > highscore) {
        setHighScore(score);
    }
}

function pausePlayer() {
    playerElement.classList.add('pause');
}

function resumePlayer() {
    playerElement.classList.remove('pause');
}

function stopGame() {
    pausePlayer();
    gameContainerElement.classList.add('stop');

    clearInterval(interval);
    clearInterval(scoreInterval);
    clearInterval(changeObstacleInterval);
    restartGameElement.classList.add('show');
}

function restart() {
    location.reload();
}

function getRandomObstacleSize() {
    const index = Math.floor(Math.random() * (OBSTACLES_SIZES.length - 1));
    console.log(index);
    return OBSTACLES_SIZES[index];
}

let changeObstacleInterval;
function randomiseObstacle() {
    changeObstacleInterval = setInterval(() => {
        const obstacleSize = getRandomObstacleSize();
        obstacleElement.className = `obstacle obstacle-${obstacleSize}`;
    }, 3000);
}

function main() {
    addJumpListener();
    monitorCollision();
    setHighScore(highscore);
    randomiseObstacle();
    countScore();
}

main();