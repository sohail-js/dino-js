const playerElement = document.querySelector('.player');
const scoreElement = document.querySelector('.score-card .score');
const highScoreElement = document.querySelector('.score-card .high-score');

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
            setTimeout(() => {
                jumping = false;
                playerElement.classList.remove('jump');
            }, 1000);

        }
    })
}

const obstacleElements = [
    document.querySelector('.plant')
];

let dangerZone = false;
function isCollision() {
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
        alert('Dead! Click OK to restart');
        checkForHighScore();
        restart();
        // stopGame();
    }
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
    clearInterval(interval);
    // stop moving obstacles
    obstacleElements.forEach(ele => {
        ele.classList.remove('animate');
    })
}

function restart() {
    setScore(0);
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

function main() {
    addJumpListener();
    checkForCollision();
    setHighScore(highscore);
    countScore();
}

main();