const input = document.getElementById('typing-type'),
tryAgain = document.getElementById('type-try-again'),
text = document.getElementById('typing-quote'),
time = document.getElementById('timer'),
wpm = document.getElementById('score'),
acc = document.getElementById('accuracy'),
errors = document.getElementById('errors'),
charCount = input.value.length;

let totalTime = 0,
quoteChars = [],
mistakes = 0,
isTimerStarted = false,
startTime = 0, intervalId = null;

// gets paragraph and sets initializing stuff for reset
const loadQuote = async () => {
    const response = await fetch("./quotes.json");
    let data = await response.json();
    quote = data[Math.floor(Math.random() * data.length)].text; // random quote kinda
    
    // initial
    text.innerHTML = "";
    input.value = "";
    isTimerStarted = false;
    mistakes = 0;
    errors.innerText = mistakes;

    // creating array of spans
    quote.split("").forEach(char => {
        let span = `<span>${char}</span>`
        text.innerHTML += span;
    });
    quoteChars = text.querySelectorAll('span');
    quoteChars = Array.from(quoteChars);
  };

// don't paste into the box D:
// input.addEventListener('paste', (event) => {
//     event.preventDefault(); 
// });

// handles when u type
input.addEventListener('input', function() {
    // start timer
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

// timer stuff
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
    wpm.innerText = (charCount / 5 / totalTime).toFixed(0);
    acc.innerText = (charCount - errors) / charCount * 100;

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${deciseconds}`;
    time.innerText = formattedTime;
};

const stopTimer = () => {
    clearInterval(intervalId);
};


// end
const displayResult = () => {
    stopTimer();
    input.disabled = true;
    wpm.innerText = (input.value.length / 5 / totalTime).toFixed(2);
    acc.innerText = (charCount - errors) / charCount * 100;
};

// try again
tryAgain.addEventListener('click', function () {
    stopTimer();
    input.disabled = false;
    totalTime = 0;
    loadQuote();
})

// onload starting place
document.addEventListener('DOMContentLoaded', function() {
    input.disabled = false;
    loadQuote();
})