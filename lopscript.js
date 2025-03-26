let questions = [];
let currentQuestion = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let attempted = 0;
let selectedAnswer = null;
let startTime;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Original Alphabet System

function startTest() {
    let numQuestions = document.getElementById("numQuestions").value.trim();

    if (numQuestions === "") {
        alert("Enter the number of questions!");
        return;
    }

    numQuestions = parseInt(numQuestions);

    if (isNaN(numQuestions) || numQuestions < 1) {
        alert("Enter a valid number of questions!");
        return;
    }

    startTime = new Date(); // Start the hidden clock
    generateQuestions(numQuestions); // Generate questions without maxInt

    document.getElementById("setup").style.display = "none";
    document.getElementById("test").style.display = "block";

    updateClock(); // Start showing the running clock
    setInterval(updateClock, 1000); // Update every second

    loadQuestion();
}

function updateClock() {
    let now = new Date();
    let elapsed = Math.floor((now - startTime) / 1000);
    let minutes = Math.floor(elapsed / 60);
    let seconds = elapsed % 60;
    
    document.getElementById("runningClock").innerText =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function generateQuestions(num) {
    questions = [];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

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
            correctAnswer = Math.floor(Math.random() * 26) + 1; // Random position (1-26)
            questionText = `Which letter is at position ${correctAnswer}?`;

            let correctLetter = alphabet[correctAnswer - 1];
            options.add(correctLetter);
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
    document.getElementById("options").innerHTML = "";
    document.getElementById("feedback").innerText = "";

    let options = [q.answer, ...generateWrongOptions(q.answer)];
    options.sort(() => Math.random() - 0.5);

    options.forEach(option => {
        let btn = document.createElement("button");
        btn.innerText = option;
        btn.onclick = () => selectOption(btn, option);
        document.getElementById("options").appendChild(btn);
    });

    selectedAnswer = null;
    document.getElementById("nextButton").disabled = true;
}

function generateWrongOptions(correct) {
    let options = [];
    while (options.length < 3) {
        let rand = alphabet[Math.floor(Math.random() * 26)];
        if (!options.includes(rand) && rand !== correct) options.push(rand);
    }
    return options;
}

function selectOption(button, answer) {
    document.querySelectorAll("#options button").forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
    selectedAnswer = answer;
}

function saveAnswer() {
    if (selectedAnswer === null) return;

    attempted++;
    let correctAnswer = questions[currentQuestion].answer;
    let feedback = document.getElementById("feedback");

    if (selectedAnswer === correctAnswer || (Array.isArray(correctAnswer) && correctAnswer.includes(selectedAnswer))) {
        correctAnswers++;
        feedback.innerText = "Very Good! Your answer is correct!";
        feedback.style.color = "green";
    } else {
        wrongAnswers++;
        feedback.innerText = `Oops! That was wrong! Correct answer: ${correctAnswer}`;
        feedback.style.color = "red";
    }

    document.querySelectorAll("#options button").forEach(btn => (btn.onclick = null));
    document.getElementById("nextButton").disabled = false;

    if (attempted === questions.length) submitTest();
}
function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;  // Move to the next question
        loadQuestion();  // Load the new question
    } else {
        submitTest();  // If last question, end the test
    }
}

function submitTest() {
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
