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
        let letter = alphabet[Math.floor(Math.random() * 26)];
        let num = Math.floor(Math.random() * maxInt) + 1;
        let isAddition = Math.random() < 0.5;

        let answer;
        if (isAddition) {
            answer = alphabet[alphabet.indexOf(letter) + num];
            questions.push({ question: `${letter} + ${num} = ?`, answer });
        } else {
            let letterIndex = alphabet.indexOf(letter);
            let possibleAnswers = [];
            if (letterIndex - num >= 0) possibleAnswers.push(alphabet[letterIndex - num]);
            if (letterIndex >= 26 && letterIndex - num >= 26 - maxInt) possibleAnswers.push(alphabet[letterIndex - num + 26]);

            if (possibleAnswers.length > 0) {
                answer = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
                questions.push({ question: `${letter} - ${num} = ?`, answer });
            } else {
                i--; // Ensure valid question generation
            }
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
        currentQuestion++;
        loadQuestion();
    } else {
        submitTest();
    }
}

function saveAnswerOrg() {
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
function saveAnswer() {
    let inputField = document.getElementById("answerInput");
    let userAnswer = inputField.value.trim().toUpperCase(); // Normalize input
    let feedback = document.getElementById("feedback");

    if (userAnswer === "") {
        alert("Please enter an answer before saving!");
        return;
    }

    attempted++;
    let correctAnswer = questions[currentQuestion].answer;

    let isCorrect = false;

    // Compare appropriately based on the type of correctAnswer
    if (typeof correctAnswer === "number") {
        isCorrect = parseInt(userAnswer) === correctAnswer;
    } else if (typeof correctAnswer === "string") {
        isCorrect = userAnswer === correctAnswer.toUpperCase(); // Case-insensitive
    }

    if (isCorrect) {
        correctAnswers++;
        feedback.innerText = "Very Good! Your answer is correct!";
        feedback.style.color = "green";
    } else {
        wrongAnswers++;
        feedback.innerText = `Oops! That was wrong! Correct answer: ${correctAnswer}`;
        feedback.style.color = "red";
    }

    inputField.disabled = true;
    document.getElementById("nextButton").disabled = false;

    if (attempted === questions.length) {
        submitTest();
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
