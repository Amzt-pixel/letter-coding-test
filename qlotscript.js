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
    let setMinutes = document.getElementById("setMinutes").value.trim();
    let setSeconds = document.getElementById("setSeconds").value.trim();

    if (numQuestions === "") {
        alert("Enter the number of questions!");
        return;
    }

    numQuestions = parseInt(numQuestions);

    if (isNaN(numQuestions) || numQuestions < 1) {
        alert("Enter a valid number of questions!");
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
    generateQuestions(numQuestions);

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
            clearInterval(timerInterval);
            timerRunning = false;
            submitTest();
        }
    }, 1000);
}

function generateQuestions(num) {
    questions = [];

    for (let i = 0; i < num; i++) {
        let isLetterToPosition = Math.random() < 0.5; // Randomly select question type
        let correctAnswer, questionText, options = new Set();

        if (isLetterToPosition) {
            // Letter-to-Position question
            let letter = alphabet[Math.floor(Math.random() * 26)];
            correctAnswer = alphabet.indexOf(letter) + 1; // Get position (1-26)
            questionText = `What is the position of '${letter}'?`;

            options.add(correctAnswer);
            while (options.size < 4) {
                options.add(Math.floor(Math.random() * 26) + 1); // Random numbers (1-26)
            }
        } else {
            // Position-to-Letter question
            let position = Math.floor(Math.random() * 26) + 1; // Random position (1-26)
            correctAnswer = alphabet[position - 1]; // Store letter instead of number
            questionText = `Which letter is at position ${position}?`;

            options.add(correctAnswer);
            while (options.size < 4) {
                options.add(alphabet[Math.floor(Math.random() * 26)]); // Random letters (A-Z)
            }
        }

        questions.push({ question: questionText, answer: correctAnswer, options: Array.from(options) });
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
