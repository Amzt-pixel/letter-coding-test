let questions = [];
let currentQuestion = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let attempted = 0;
let selectedAnswer = null;
let timeLeft;
let timerRunning = false;
let startTime;
let timerInterval; // Global variable for timer control

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLM"; // Custom looping system

function startTest() {
    let numQuestions = document.getElementById("numQuestions").value.trim();
    let maxInt = document.getElementById("maxInt").value.trim();
    let setMinutes = document.getElementById("setMinutes").value.trim();
    let setSeconds = document.getElementById("setSeconds").value.trim();

    if (numQuestions === "" || maxInt === "") {
        alert("Enter both the number of questions and maximum number!");
        return;
    }

    numQuestions = parseInt(numQuestions);
    maxInt = parseInt(maxInt);

    if (isNaN(numQuestions) || numQuestions < 1 || isNaN(maxInt) || maxInt < 1 || maxInt > 13) {
        alert("Enter valid values for number of questions and max number limit!");
        return;
    }

    if (setMinutes === "" && setSeconds === "") {
        alert("Enter at least Minutes or Seconds for the timer!");
        return;
    }

    let minutes = setMinutes === "" ? 0 : parseInt(setMinutes);
    let seconds = setSeconds === "" ? 0 : parseInt(setSeconds);

    if (isNaN(minutes) || minutes < 0 || minutes > 30 || isNaN(seconds) || seconds < 0 || seconds > 59) {
        alert("Enter valid values for time!");
        return;
    }
    if (minutes === 0 && seconds === 0) {
            alert("Minutes and Seconds cannot both be zero!");
            return;
    }

    timeLeft = minutes * 60 + seconds;
    startTime = new Date(); // Start hidden clock
    generateQuestions(numQuestions, maxInt);

    document.getElementById("setup").style.display = "none";
    document.getElementById("test").style.display = "block";

    startTimer();
    loadQuestion();
}
function startTimer() {
    timerRunning = true;
    timerInterval = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        document.getElementById("timer").innerText = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft > 0) {
            timeLeft--;
        } else {
            clearInterval(timerInterval); // ✅ Stop the timer first
            timerRunning = false;
            submitTest(); // ✅ Now submit the test
        }
    }, 1000);
}
function generateQuestions(num, maxInt) {
    questions = [];
    for (let i = 0; i < num; i++) {
        let letter1, letter2, pos1, pos2, answer1, answer2;

        do {
            letter1 = alphabet[Math.floor(Math.random() * 39)];
            letter2 = alphabet[Math.floor(Math.random() * 39)];

            pos1 = alphabet.indexOf(letter1) + 1;
            pos2 = alphabet.indexOf(letter2) + 1;

            answer1 = pos1 - pos2;

            if (pos1 > 26) pos1 -= 26;
            if (pos2 > 26) pos2 -= 26;

            let altAnswer = pos1 - pos2;
            answer2 = altAnswer !== answer1 ? altAnswer : null;
            
        } while (answer1 === 0 || (answer2 !== null && answer2 === 0)); // Ensure subtraction is never 0

        let finalAnswer = answer1;

        if (answer2 !== null) {
            if (Math.abs(answer2) < Math.abs(answer1)) {
                finalAnswer = answer2;
            } else if (Math.abs(answer2) === Math.abs(answer1)) {
                finalAnswer = [answer1, answer2]; // Both are correct
            }
        }

        if (Math.abs(finalAnswer) <= maxInt) {
            questions.push({ question: `${letter2} ➞ ${letter1} = ?`, answer: finalAnswer });
        } else {
            i--; // Ensure only valid questions are generated
        }
    }
}

function loadQuestion() {
    let q = questions[currentQuestion];
    document.getElementById("questionNumber").innerText = `Question ${currentQuestion + 1} of ${questions.length}`;
    document.getElementById("question").innerText = q.question;
    document.getElementById("feedback").innerText = "";

    // Reset input field for new question
    let inputField = document.getElementById("answerInput");
    inputField.value = "";
    inputField.disabled = false; // Ensure input is enabled for new question

    document.getElementById("nextButton").disabled = true; // Prevent skipping question
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;  // Move to the next question
        loadQuestion();  // Load the next question
    } else {
        submitTest();  // End test when all questions are completed
    }
}

function saveAnswer() {
    let inputField = document.getElementById("answerInput");
    let userAnswer = inputField.value.trim(); // Get user input
    let feedback = document.getElementById("feedback");

    if (userAnswer === "") {
        alert("Please enter an answer before saving!");
        return;
    }

    attempted++;
    let correctAnswer = questions[currentQuestion].answer;

    if (parseInt(userAnswer) === correctAnswer || 
       (Array.isArray(correctAnswer) && correctAnswer.includes(parseInt(userAnswer)))) {
        correctAnswers++;
        feedback.innerText = "Very Good! Your answer is correct!";
        feedback.style.color = "green";
    } else {
        wrongAnswers++;
        feedback.innerText = `Oops! That was wrong! Correct answer: ${correctAnswer}`;
        feedback.style.color = "red";
    }

    inputField.disabled = true; // Prevent further editing after saving
    document.getElementById("nextButton").disabled = false; // Enable Next button

    if (attempted === questions.length) {
        submitTest(); // Auto-submit if all questions are done
    }
}

function submitTest() {
    console.log("Test submitted"); // Debugging log
    clearInterval(timerInterval); // Stop timer to avoid further execution

    document.getElementById("test").style.display = "none";
    document.getElementById("result").style.display = "block";

    let endTime = new Date();
    let totalTime = Math.floor((endTime - startTime) / 1000);
    let minutesTaken = Math.floor(totalTime / 60);
    let secondsTaken = totalTime % 60;

    document.getElementById("score").innerText = `Correct: ${correctAnswers}`;
    document.getElementById("wrong").innerText = `Wrong: ${wrongAnswers}`;
    document.getElementById("unattempted").innerText = `Unattempted: ${questions.length - attempted}`;
    document.getElementById("timeTaken").innerText = `Time Taken: ${minutesTaken}m ${secondsTaken}s`;
}
