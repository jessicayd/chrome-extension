// snake game

let gameOver = false;
let score = 0;
let tailLength = 2;

let tileCount = 20;
let tileSize= 18;
let headX = 5;
let headY = 5;

let xvelocity = 0;
let yvelocity = 0;

let appleX = 15;
let appleY = 15;


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
        setTimeout(drawGame, 1000/4)
    }

    function startGame() {
        score = 0
        drawGame();
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
        ctx.fillStyle = "rgb(229,219,209)"
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

        if (event.keyCode == 38 || event.key === "w") {
            if (yvelocity == 1)
                return;
            xvelocity = 0;
            yvelocity = -1; // up
        }
        
        if (event.keyCode == 40 || event.key === "s") {
            if (yvelocity == -1)
                return;
            xvelocity = 0;
            yvelocity = 1; // down
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

    startGame();
});
