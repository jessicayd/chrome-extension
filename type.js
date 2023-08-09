const input = document.getElementById('typing-type'),
tryAgain = document.getElementById('type-try-again'),
text = document.getElementById('typing-quote'),
time = document.getElementById('timer-self'),
wpm = document.getElementById('score'),
errors = document.getElementById('errors-self');

let timer = "";
let totalTime = 0;
let quoteChars = [];
let mistakes = 0;

let isTimerStarted = false;
let startTime = 0, intervalId = null;


const loadQuote = async () => {
    const response = await fetch("./quotes.json");
    let data = await response.json();
    quote = data[Math.floor(Math.random() * data.length)].text;
    
    text.innerHTML = "";
    input.value = "";
    isTimerStarted = false;
    mistakes = 0;
    errors.innerText = mistakes;

    quote.split("").forEach(char => {
        let span = `<span>${char}</span>`
        text.innerHTML += span;
    }
    );

    quoteChars = text.querySelectorAll('span');
    quoteChars = Array.from(quoteChars);
  };


input.addEventListener('input', function() {
    if (!isTimerStarted) {
        startTimer();
        isTimerStarted = true;
    }

    let inputChars = input.value.split("");

    let hasFailed = false;
    quoteChars.forEach((char, index) => {
        
        if (char.innerText == inputChars[index]) {
            char.classList.add("success");
        }
        
        // backspace
        else if (inputChars[index] == null) {
            if (char.classList.contains("success")) char.classList.remove("success");
            else {
                char.classList.remove("fail");
                hasFailed = true;
            }
        }
        
        else {
            if (!char.classList.contains("fail") && !hasFailed) {
                mistakes += 1;
                char.classList.add("fail");
                hasFailed = true;
            }
            errors.innerText = mistakes;
        }
        //Returns true if all the characters are entered correctly
        let check = quoteChars.every((element) => {
            return element.classList.contains("success");
        });
        //End test if all characters are correct
        if (check) {
            input.disabled = true;
    
            displayResult();
        }
    });
})

const startTimer = () => {
    startTime = Date.now();
    intervalId = setInterval(updateTimer, 1);
};


const updateTimer = () => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;

    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const deciseconds =  Math.floor((elapsedTime % 1000) / 100);
    totalTime = minutes + seconds/60 + deciseconds / 600;

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${deciseconds}`;
    time.innerText = formattedTime;
};

const stopTimer = () => {
    clearInterval(intervalId);
};


//End Test
const displayResult = () => {
    stopTimer();
  input.disabled = true;
  wpm.innerText = (input.value.length / 5 / totalTime).toFixed(2);
};

//Start Test
tryAgain.addEventListener('click', function () {
    stopTimer();
    input.disabled = false;
    totalTime = 0;
    loadQuote();
})

document.addEventListener('DOMContentLoaded', function() {
    input.disabled = false;
    loadQuote();
})