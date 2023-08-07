// updating time
function setTime(){
    const dayArray = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const monthArray = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

    let date = new Date();

    let hours = date.getHours();
    let ampm = "AM";
    if (hours >= 12) {
        hours -= 12;
        ampm = "PM";
    }
    if (hours == 0) hours = 12;
    let second = date.getSeconds();
    let minute = date.getMinutes();
    document.getElementById("time").innerHTML = `${hours}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`;
    document.getElementById("ampm").innerHTML = ` ${ampm}`;
    document.getElementById("date").innerHTML = `${dayArray[date.getDay()]}, ${monthArray[date.getMonth()]} ${date.getDate()}`;
}

// updates ~500 millisec bc i think 1000 ms is laggy sometimes
setInterval(function() {
    setTime();
  }, 500)

/* 
function to create an icon
icons
> icon-wrapper
> > icon-link
> > > icon-image
> > edit-button 
*/
function createIcon(url, containerName, button) {
    let iconContainer = document.getElementById(containerName);

    let iconWrapper = document.createElement('div');
    iconWrapper.className = 'icon-wrapper';

    let link = document.createElement('a');
    link.className = 'icon-link';
    link.href = url;

    let icon = document.createElement('img');
    icon.src = 'images/icon.png';
    icon.className = 'icon-image';
    icon.alt = 'icon'; 

    let edit = document.createElement('button');
    edit.className = 'edit-button';
    edit.textContent = button;

    // edit.addEventListener('click', function (event) {
    //     event.preventDefault();
    //     let newLink = prompt('Edit link: ');
    //     if (isValidUrl(newLink)) {
    //         link.href = newLink;
    //     }
    // });

    iconWrapper.appendChild(link);
    iconWrapper.appendChild(edit);
    link.appendChild(icon);
    iconContainer.appendChild(iconWrapper);
}

function isValidUrl(str) {
    try {
        const newUrl = new URL(str);
        return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (err) {
        return false;
    }
}

// creating icons
createIcon('https://calendar.google.com/calendar/u/1/r/week', 'icons', 'gcal');
createIcon('https://www.google.com/search?q=weather+28226', 'icons', 'weather');
createIcon('https://www.instagram.com/?hl=en', 'icons', 'instagram');

createIcon('https://github.com/jessicayd/chrome-extension', 'icons2', 'this repo');
createIcon('https://docs.google.com/spreadsheets/d/1uPWKV088TNfjcF_GKqTv40gJiJocHrz7PU7pu-o3KWc/edit#gid=0', 'icons2', 'leetcode sheet');
createIcon('https://docs.google.com/spreadsheets/d/1EQUbkiJtCM5tnc8N7ylGiUYoL2723f6fdLcnOQgjtL0/edit#gid=0', 'icons2', 'code life tg');
createIcon('https://neetcode.io/practice', 'icons2', 'neetcode');

// snake game
document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('snake-game'); 
    canvas.setAttribute("tabindex", 0);
    // canvas.focus();

    const ctx = canvas.getContext('2d');

    let gameOver = false;

    /// initializing and drawing snake game
    function drawGame() {
        if (gameOver) {
            // edits the game over screen
            ctx.fillStyle = "rgb(147, 127, 120)";
            ctx.font = "50px Inter";
            ctx.fillText("Game Over! ", canvas.clientWidth / 6.5, canvas.clientHeight / 2.25);
            ctx.fillStyle = "rgb(147, 127, 120)";
            ctx.font = "30px Inter";
            ctx.fillText("Press 'Enter' to restart ", canvas.clientWidth / 9, canvas.clientHeight / 1.75);
            return;
        }

        changeSnakePosition();

        let result=isGameOver();
        if(result) {
            gameOver = true;
            return;
        }

        clearScreen();
        drawSnake();
        checkApple()
        drawApple();
        drawScore();
        setTimeout(drawGame, 1000/5)
    }

    function startGame() {
        drawGame();
    }

    const startButton = document.getElementById("start-button");
    startButton.addEventListener("click", function() {
        startButton.style.display = "none"; 
        reset(false);
        startGame();
        xvelocity = 1;
        canvas.focus();
    });

    function clearScreen() {
        ctx.fillStyle = "rgb(229,219,209)"
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    }

    let tileCount = 20;
    let tileSize= 18;
    let headX = 5;
    let headY = 5;


    function drawSnake(){
        ctx.fillStyle="orange";
        ctx.fillRect(headX*tileCount, headY*tileCount, tileSize, tileSize)

        ctx.fillStyle="green";
        for(let i=0; i<snake.length; i++){
            let part=snake[i]
            ctx.fillRect(part.x*tileCount, part.y*tileCount, tileSize, tileSize)
        }
        snake.push(new snakePart(headX,headY));

        while (snake.length > tailLength) {
            snake.shift();
        }
    }

    /// making snake move
    let xvelocity = 0;
    let yvelocity = 0;

    canvas.addEventListener('keydown', keyDown);
    function keyDown(event) {
        if (event.key.includes('Arrow')) {
            event.preventDefault();
        }

        if (gameOver) {
            if (event.keyCode === 13) {
                reset(true);
                gameOver = false;
                startGame();
            }
            return;
        }

        if (event.keyCode == 38 || event.key === "w") {
            if (yvelocity == 1)
                return;
            yvelocity = -1; // up
            xvelocity = 0;
        }
        
        if (event.keyCode == 40 || event.key === "s") {
            if (yvelocity == -1)
                return;
            yvelocity = 1; // down
            xvelocity = 0;
        }

        if (event.keyCode == 37 || event.key === "a") {
            if (xvelocity == 1)
                return;
            yvelocity = 0;
            xvelocity = -1; // left
        }
        
        if (event.keyCode == 39 || event.key === "d"){
            if (xvelocity == -1)
                return;
            yvelocity = 0;
            xvelocity = 1;//move one tile right
        }
    }

    function changeSnakePosition() {
        
        headX +=  xvelocity;
        headY +=  yvelocity;
    }

    // food
    let appleX = 5;
    let appleY = 5;

    function drawApple(){
        ctx.fillStyle = "red";
        ctx.fillRect(appleX*tileCount, appleY*tileCount, tileSize, tileSize)
    }

    const snake = [];
    class snakePart{
        constructor(x, y){
            this.x=x;
            this.y=y;
        }  
    }
    let tailLength = 2;

    function checkApple(){
        if(appleX == headX && appleY == headY){
            appleX = Math.floor(Math.random()*tileCount);
            appleY = Math.floor(Math.random()*tileCount);
            tailLength++;
            score++;
        }
    }

    // score
    let score = 0;

    function drawScore() {
        ctx.fillStyle="rgb(147, 127, 120)"
        ctx.font="15px Inter"
        ctx.fillText("Score: " + score, canvas.clientWidth-75,25);
    }

    // game over
    function isGameOver() {
        if (yvelocity===0 && xvelocity===0){
            return false;
        }

        if (headX < 0 || headX >= tileCount || headY < 0 || headY >= tileCount) {
            return true;
        }
    
   
        for (let i = 0; i < snake.length; i++) {
            let part = snake[i];
            if (part.x === headX && part.y === headY) {
                return true;
            }
        }

        return gameOver;
    }

    function reset(gameOver) {
        if (gameOver) {
            snake.length = 0; 
            score = 0;
            tailLength = 2;
            headX = 5;
            headY = 5;
            xvelocity = 0;
            yvelocity = 0;
            clearScreen();
            drawSnake();
            drawScore();
            startButton.style.display = "block";
        }
    }

    drawGame();
});
