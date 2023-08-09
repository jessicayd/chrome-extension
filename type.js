const input = document.getElementById('typing-type'),
tryAgain = document.getElementById('type-try-again'),
text = document.getElementById('typing-quote'),
time = document.getElementById('timer'),
wpm = document.getElementById('score'),
acc = document.getElementById('accuracy'),
count = document.getElementById('count'),
errors = document.getElementById('errors');

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

    quoteLength = quoteChars.length;
    count.innerText = quoteLength;
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

    quoteChars.forEach((char, index) => {
        console.log(char);
        if (char.innerText == inputChars[index]) {
            char.classList.add("success");
            char.style.color = "rgb(70, 171, 87)";
        }
        
        // backspace
        else if (inputChars[index] == null) {
            if (char.classList.contains("success")) {
                char.classList.remove("success");
                char.style.color = "rgb(117, 95, 87)";
            }
            else if (char.classList.contains("fail")) {
                char.classList.remove("fail");
                hasFailed = false; 
                input.style.color = "rgb(133, 114, 107)";
            }
        }
        
        else {
            if (!char.classList.contains("fail")) {
                if (!hasFailed) {
                    hasFailed = true;
                    mistakes += 1;
                    char.classList.add("fail");
                    input.style.color = "rgb(247, 106, 106)";
                }
            }
            errors.innerText = mistakes;
        }
        
        let check = quoteChars.every((element) => {
            return element.classList.contains("success");
        });
        
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
    if (!hasFailed) {
        let charCount = input.value.length;
        wpm.innerText = (charCount / 5 / totalTime).toFixed(0);
        acc.innerText = ((charCount - mistakes) / charCount * 100).toFixed(0);
        count.innerText = quoteLength - charCount;
    }

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
    let charCount = input.value.length;
    wpm.innerText = (charCount / 5 / totalTime).toFixed(2);
    acc.innerText = ((charCount - mistakes) / charCount * 100).toFixed(2);
    count.innerText = quoteLength - charCount;
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