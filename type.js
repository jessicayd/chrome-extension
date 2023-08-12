const input = document.getElementById('typing-type'),
tryAgain = document.getElementById('type-try-again'),
text = document.getElementById('typing-quote'),
time = document.getElementById('timer'),
wpm = document.getElementById('score'),
acc = document.getElementById('accuracy'),
count = document.getElementById('count'),
errors = document.getElementById('errors'),
scoreTag = document.getElementById('score-tag'),
turtle = document.getElementById('turtle'),
box = document.querySelector('.slide.type-test');

let totalTime = 0,
quoteChars = [],
mistakes = 0,
isTimerStarted = false,
startTime = 0, intervalId = null, quoteLength = 0;
let hasFailed = false;


// gets paragraph and sets initializing stuff for reset
const loadQuote = async () => {
    const response = await fetch("./quotes.json");
    let data = await response.json();
    quote = data[Math.floor(Math.random() * data.length)].text; // random quote kinda

    // creating array of spans
    quote.split("").forEach(char => {
        let span = `<span>${char}</span>`
        text.innerHTML += span;
    });
    quoteChars = text.querySelectorAll('span');
    quoteChars = Array.from(quoteChars);

    quoteLength = quoteChars.length;
    count.innerText = quoteLength;
  };

// don't paste into the box D:
input.addEventListener('paste', (event) => {
    event.preventDefault(); 
});

// handles when u type
input.addEventListener('input', function() {
    // start timer
    if (!isTimerStarted) {
        startTimer();
        isTimerStarted = true;
        scoreTag.innerHTML = "score: ";
    }

    let inputChars = input.value.split("");

    quoteChars.forEach((char, index) => {
        if (char.innerText == inputChars[index]) {
            hasFailed = false;
            char.classList.add("success");
            char.style.color = "#46AB57";
        }
        
        // backspace
        else if (inputChars[index] == null) {
            if (char.classList.contains("success")) {
                char.classList.remove("success");
                char.style.color = "#755F57";
            }
            else if (char.classList.contains("fail")) {
                char.classList.remove("fail");
                char.style.color = "#755F57";
            }
        }

        else {
            if (!char.classList.contains("fail")) {
                hasFailed = true;
                mistakes += 1;
                char.classList.add("fail");
                char.style.color= "#F76A6A";
            }
            errors.innerText = mistakes;
        }
        
        if (input.value.length >= quoteLength) {
            input.disabled = true;
            displayResult();
        }
    });
})

// timer stuff
const startTimer = () => {
    startTime = Date.now();
    intervalId = setInterval(updateTimer, 1);
};

const updateTimer = () => {
    let width = box.offsetWidth - 27;
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;

    if (localStorage.getItem('slideIndex') != 4) {
        stopTimer();
        input.disabled = true;
        return;
    }

    window.addEventListener('blur', function() {
        stopTimer();
        input.disabled = true;
        return;
    });

    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const deciseconds =  Math.floor((elapsedTime % 1000) / 100);
    totalTime = minutes + seconds/60 + deciseconds / 600;
    if (!hasFailed) {
        let charCount = input.value.length;
        wpm.innerText = (charCount / 5 / totalTime).toFixed(0);
        acc.innerText = ((charCount - mistakes) / charCount * 100).toFixed(0);
        count.innerText = quoteLength - charCount;
        let left = Math.min(width, width / quoteLength * charCount);
        turtle.style.left = `${left}px`;

        console.log(width);
        console.log(left);
    }

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${deciseconds}`;
    time.innerText = formattedTime;
};

const stopTimer = () => {
    clearInterval(intervalId);
};


// end
const displayResult = () => {
    let width = box.offsetWidth - 27;
    stopTimer();
    input.disabled = true;
    let charCount = input.value.length;
    const speed = (charCount / 5 / totalTime).toFixed(2);
    wpm.innerText = speed;
    acc.innerText = ((charCount - mistakes) / charCount * 100).toFixed(2);
    count.innerText = quoteLength - charCount;
    let left = Math.min(width, width / quoteLength * charCount);
    turtle.style.left = `${left}px`;

    if (localStorage.getItem('wpm') == null) localStorage.setItem('wpm', wpm.innerText);
    else localStorage.setItem('wpm', Math.max(speed, localStorage.getItem('wpm')));
};

// try again
tryAgain.addEventListener('click', function () {
    stopTimer();
    input.disabled = false;
    totalTime = 0;

    if (localStorage.getItem('wpm') == null) localStorage.setItem('wpm', 0);
    wpm.innerHTML = localStorage.getItem('wpm');
    scoreTag.innerHTML = "highest: ";

    text.innerHTML = "";
    input.value = "";
    isTimerStarted = false;
    mistakes = 0;
    errors.innerText = mistakes;
    acc.innerText = "0";
    time.innerText = "00:00.0";
    turtle.style.left = `0px`;

    loadQuote();
})

// onload starting place
document.addEventListener('DOMContentLoaded', function() {
    input.disabled = false;
    if (localStorage.getItem('wpm') == null) localStorage.setItem('wpm', 0);
    wpm.innerHTML = localStorage.getItem('wpm');
    scoreTag.innerHTML = "highest: ";
    loadQuote();
})