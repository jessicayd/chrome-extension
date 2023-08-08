// snake game

let gameOver = false;
let score = 0;
let tailLength = 3;

if (localStorage.getItem('snake-score') != null) {
    document.getElementById("high-score").innerText = localStorage.getItem('snake-score');
}

let tileCount = 20;
let tileSize= 18;
let headX = 5;
let headY = 5;

let xvelocity = 0;
let yvelocity = 0;

let appleX = 15;
let appleY = 15;

moved = false;


document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('snake-game'); 
    canvas.setAttribute("tabindex", 0);
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'middle'; 
    ctx.textAlign = 'center'; 
    let gameOver = false;
    
    let lastFrameTime = 0;

    /// initializing and drawing snake game
    function drawGame(timestamp) {

        const deltaTime = timestamp - lastFrameTime;

        if (deltaTime >= 1000 / 10) { 
            lastFrameTime = timestamp;

            if (!gameOver) {
                changeSnakePosition();
                const result = isGameOver();
                if (result) {
                    gameOver = true;
                    return;
                }

                clearScreen();
                drawSnake();
                checkApple();
                drawApple();
                drawScore();
            } else {
                ctx.fillStyle = "rgb(239, 233, 226)";
                ctx.roundRect(canvas.clientWidth/4.5, canvas.clientHeight/2.8, canvas.clientWidth/1.85, canvas.clientHeight/4.5, 15);
                ctx.fill();
                ctx.fillStyle = "rgb(166, 150, 135)";
                ctx.font = "25px Inter";
                ctx.fillText("game over! ", canvas.clientWidth / 2, canvas.clientHeight / 2.27);
                ctx.fillStyle = "rgb(166, 150, 135)";
                ctx.font = "15px Inter";
                ctx.fillText("press 'enter' to restart ", canvas.clientWidth / 2, canvas.clientHeight / 1.95);

                if (localStorage.getItem('snake-score') == null) {
                    document.getElementById("high-score").innerText = score;
                    localStorage.setItem('snake-score', score);
                }
                else {
                    let newHigh = Math.max(localStorage.getItem('snake-score'), score);
                    document.getElementById("high-score").innerText = newHigh;
                    localStorage.setItem('snake-score', newHigh);
                }
                return;
            }
        }

        requestAnimationFrame(drawGame);
    }

    function startGame() {
        score = 0
        lastFrameTime = performance.now();
        requestAnimationFrame(drawGame);
    }

    const startButton = document.getElementById("start-button");
    startButton.addEventListener("click", function() {
        startButton.style.display = "none"; 
        score = 0;
        reset(false);
        startGame();
        xvelocity = 1;
        canvas.focus();
    });

    function clearScreen() {
        ctx.fillStyle = "#F4F1E7"
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    }

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
        moved = true;
    }

    /// making snake move

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

        if (yvelocity===0 && xvelocity===0){
            return;
        }
        else if ((event.keyCode == 38 || event.key === "w") && moved) {
            moved = false;
            if (yvelocity == 1)
                return;
            xvelocity = 0;
            yvelocity = -1; // up
        }
        else if ((event.keyCode == 40 || event.key === "s") && moved) {
            moved = false;
            if (yvelocity == -1)
                return;
            xvelocity = 0;
            yvelocity = 1; // down
        }
        else if ((event.keyCode == 37 || event.key === "a") && moved) {
            moved = false;
            if (xvelocity == 1)
                return;
            yvelocity = 0;
            xvelocity = -1; // left
        }
        else if ((event.keyCode == 39 || event.key === "d") && moved) {
            moved = false;
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

    function checkApple() {
        if(appleX === headX && appleY === headY){
            appleX = Math.floor(Math.random()*tileCount);
            appleY = Math.floor(Math.random()*tileCount);
            tailLength++;
            score++;
        }
    }

    // score

    function drawScore() {
        document.getElementById("current-score").innerText = score;
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
            tailLength = 3;
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

    startGame();
});
