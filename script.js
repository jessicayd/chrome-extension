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
> > icon-name
> > icon-link
> > > icon-image
> > button-wrapper
> > > edit-button 
> > > remove-button 
*/
function createIcon(url, containerName, id, name) {
    if (containerName == "icons") currIconLeft++;
    else currIconRight++;

    let iconContainer = document.getElementById(containerName);

    let iconWrapper = document.createElement('div');
    iconWrapper.className = 'icon-wrapper';

    // displays title of bookmark at the top
    let iconName = document.createElement('p');
    iconName.className = "icon-name";
    iconName.setAttribute("contenteditable", true);
    if (localStorage.getItem(`${id}_name`) == null || localStorage.getItem(`${id}_name`) == 'null') {
        localStorage.setItem(`${id}_name`, name);
    }
    iconName.innerHTML = localStorage.getItem(`${id}_name`);

    iconName.addEventListener('input', function(){
        localStorage.setItem(`${id}_name`,this.innerHTML);
     })

    // actual icon that links to url
    let link = document.createElement('a');
    link.className = 'icon-link';
    if (localStorage.getItem(`${id}_url`) == null || localStorage.getItem(`${id}_url`) == 'null') {
        link.href = url;
        localStorage.setItem(`${id}_url`, url)
    }
    link.href = localStorage.getItem(`${id}_url`);

    let icon = document.createElement('img');
    icon.src = 'images/icon.png';
    icon.className = 'icon-image';
    icon.alt = 'icon'; 

    // buttons
    let buttonWrap = document.createElement('div');
    buttonWrap.className = 'button-wrapper';

    // edit/displays url of button
    let edit = document.createElement('button');
    edit.className = 'edit-button';
    edit.textContent = 'edit';

    edit.addEventListener('click', function (event) {
        event.preventDefault();
        let newLink = prompt(`${link.href} \nEdit link: `);
        if (isValidUrl(newLink)) {
            link.href = newLink;
        }
        localStorage.setItem(`${id}_url`, newLink);
    });

    // removes button
    let remove = document.createElement('button');
    remove.className = 'remove-button';
    remove.textContent = 'x';

    remove.addEventListener('click', function (event) {
        event.preventDefault();
        localStorage.removeItem(`${id}`);
        localStorage.removeItem(`${id}_name`);
        localStorage.removeItem(`${id}_url`);
        iconWrapper.remove();
        if (containerName=='icons') {
            currIconLeft--;
            for (let i = parseInt(id.substring(1)); i < currIconLeft; i++) {
                localStorage.setItem(`l${i}`,localStorage.getItem(`l${i+1}`));
                localStorage.setItem(`l${i}_url`,localStorage.getItem(`l${i+1}_url`));
                localStorage.setItem(`l${i}_name`,localStorage.getItem(`l${i+1}_name`));
            }
            localStorage.removeItem(`l${currIconLeft}`);
            localStorage.removeItem(`l${currIconLeft}_name`);
            localStorage.removeItem(`l${currIconLeft}_url`);
        }
        else {
            currIconRight--;
            for (let i = parseInt(id.substring(1)); i < currIconRight; i++) {
                localStorage.setItem(`r${i}`,localStorage.getItem(`r${i+1}`));
                localStorage.setItem(`r${i}_url`,localStorage.getItem(`r${i+1}_url`));
                localStorage.setItem(`r${i}_name`,localStorage.getItem(`r${i+1}_name`));
            }
            localStorage.removeItem(`r${currIconRight}`);
            localStorage.removeItem(`r${currIconRight}_name`);
            localStorage.removeItem(`r${currIconRight}_url`);
        }
    });

    // add to html
    buttonWrap.appendChild(edit);
    buttonWrap.appendChild(remove);
    iconWrapper.appendChild(iconName);
    iconWrapper.appendChild(link);
    iconWrapper.appendChild(buttonWrap);
    link.appendChild(icon);
    iconContainer.insertBefore(iconWrapper, iconContainer.lastElementChild);
    localStorage.setItem(`${id}`, "true");
}

// validates a url
function isValidUrl(str) {
    try {
        const newUrl = new URL(str);
        return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (err) {
        return false;
    }
}

// keeping track of # of bookmarks
const maxIcon = 6;
let currIconLeft = 0;
let currIconRight = 0;

// add buttons
let leftAdd = document.getElementById('leftAdd');
let rightAdd = document.getElementById('rightAdd');

leftAdd.addEventListener('click', function() {
    if (currIconLeft >= maxIcon) return;
    createIcon('https://google.com', 'icons', `l${currIconLeft}`, 'link');
});
rightAdd.addEventListener('click',function(){
    if (currIconRight >= maxIcon) return;
    createIcon('https://google.com', 'icons2', `r${currIconRight}`, 'link');
});

// add all stashed bookmarks from local storage
for (let i = 0; i < 6; i++) {
    if (localStorage.getItem(`l${i}`) == "true") {
        createIcon(localStorage.getItem(`l${i}_url`), 'icons', `l${i}`, localStorage.getItem(`l${i}_name`));
    }
    if (localStorage.getItem(`r${i}`) == "true") {
        createIcon(localStorage.getItem(`r${i}_url`), 'icons2', `r${i}`, localStorage.getItem(`r${i}_name`));
    }
}


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
