const playerElement = document.querySelector('.player');
const scoreElement = document.querySelector('.score-card .score');
const highScoreElement = document.querySelector('.score-card .high-score');
const gameContainerElement = document.querySelector('.game-container');

const OBSTACLES = [
    { type: 'obstacle', size: 'xs', width: 30, height: 70 },
    { type: 'obstacle', size: 's', width: 60, height: 80 },
    { type: 'obstacle', size: 'm', width: 90, height: 90 },
    { type: 'obstacle', size: 'l', width: 120, height: 120 },
];

let jumping = false;
let score = 0;
function addJumpListener() {
    document.addEventListener('keydown', event => {
        // console.log(event)
        if((event.key === ' ' || event.key === 'ArrowUp') && !jumping) {
            console.log('jump');
            // if(playerElement.classList.contains('jump')) {
                //     playerElement.classList.remove('jump');
                // }
            jumping = true;
            playerElement.classList.add('jump');
            pausePlayer();
            setTimeout(() => {
                jumping = false;
                playerElement.classList.remove('jump');
                resumePlayer();
            }, 1000);

        }
    })
}

const obstacleElements = [
    // document.querySelector('.obstacle')
];

let dangerZone = false;
function isCollision() {
    if(!obstacleElements.length) {
        return;
    }

    const playerClientRect = playerElement.getBoundingClientRect();
    const playerL = playerClientRect.left;
    const playerR = playerClientRect.right;
    const playerB = playerClientRect.bottom;
    
    
    const obstacleClientRect = obstacleElements[0].getBoundingClientRect();
    const obstacleL = obstacleClientRect.left;
    const obstacleR = obstacleClientRect.right;
    const obstacleT = obstacleClientRect.top;

    dangerZone = (obstacleL < playerR && obstacleR > playerL) || (obstacleR > playerL && obstacleR < playerR);
    const yCollision = playerB > obstacleT;

    if(dangerZone && yCollision) {
        console.log('Dead!!!!!');
        stopGame();
        checkForHighScore();
        // setTimeout(() => {
        //     // alert('Dead! Click OK to restart');
        //     restart();
        // }, 1000);
    }
}

function pausePlayer() {
    playerElement.classList.add('pause');
}

function resumePlayer() {
    playerElement.classList.remove('pause');
}

let interval;
function checkForCollision() {
    interval = setInterval(() => {
        isCollision();
    }, 10);
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

function stopGame() {
    pausePlayer();
    gameContainerElement.classList.add('stop');

    clearInterval(interval);
    clearInterval(scoreInterval);
    clearInterval(generateObstaclesInterval);
    hideObstacleTimeout.forEach(timeout => {
        clearTimeout(timeout);
    })
}

function restart() {
    location.reload();
}

function setScore(newScore) {
    scoreElement.innerText = score = newScore;
}

let scoreInterval;
function countScore() {
    scoreInterval = setInterval(() => {
        setScore(score + 1);
    }, 100);
}

function getRandomObstacle() {
    const index = Math.floor(Math.random() * (OBSTACLES.length - 1));
    console.log(index);
    return OBSTACLES[index];
}

function getRandomObstacleElement() {
    const obstacleElement = document.createElement('div');
    const obstacle = getRandomObstacle();
    obstacleElement.classList.add(obstacle.type);
    obstacleElement.style.height = `${obstacle.height}px`;
    obstacleElement.style.width = `${obstacle.width}px`;
    return obstacleElement;
}

function appendObstacle(obstacleElement) {
    gameContainerElement.append(obstacleElement);
    obstacleElements.push(obstacleElement)
}

function shiftObstacle() {
    const obstacleElement = obstacleElements.shift();
    obstacleElement.parentElement.removeChild(obstacleElement);
}

let generateObstaclesInterval;
let hideObstacleTimeout = [];
function generateObstacles() {
    generateObstaclesInterval = setInterval(() => {
        const obstacleElement = getRandomObstacleElement();
        appendObstacle(obstacleElement);

        hideObstacleTimeout.push(setTimeout(() => {
            hideObstacleTimeout.shift();
            shiftObstacle();
        }, 5000));
        // console.log(hideObstacleTimeout)
    }, 2000);
}

function main() {
    addJumpListener();
    checkForCollision();
    setHighScore(highscore);
    generateObstacles();
    countScore();
}

main();