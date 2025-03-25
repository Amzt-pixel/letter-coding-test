let questions = [];
let currentQuestion = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let attempted = 0;
let selectedAnswer = null;
let startTime;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLM"; // Custom looping system

function startTest() {
    let numQuestions = document.getElementById("numQuestions").value.trim();
    let maxInt = document.getElementById("maxInt").value.trim();

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

    startTime = new Date(); // Start tracking test duration
    setInterval(updateRunningClock, 1000); // Start running clock update

    generateQuestions(numQuestions, maxInt);

    document.getElementById("setup").style.display = "none";
    document.getElementById("test").style.display = "block";

    loadQuestion();
}

// Function to continuously update the running clock
function updateRunningClock() {
    if (startTime) {
        let elapsedTime = Math.floor((new Date() - startTime) / 1000);
        let minutes = Math.floor(elapsedTime / 60);
        let seconds = elapsedTime % 60;
        document.getElementById("runningClock").innerText =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function generateQuestions(num, maxInt) {
    questions = [];
    for (let i = 0; i < num; i++) {
        let letter = alphabet[Math.floor(Math.random() * 26)];
        let num = Math.floor(Math.random() * maxInt) + 1;
        let answer = alphabet[alphabet.indexOf(letter) - num];

        questions.push({ question: `${letter} - ${num} = ?`, answer });
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
    document.querySelectorAll("#options button").forEach(btn => {
        btn.classList.remove("selected");
    });
    button.classList.add("selected");
    selectedAnswer = answer;
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
    if (selectedAnswer === null) return;

    attempted++;
    let correctAnswer = questions[currentQuestion].answer;
    let feedback = document.getElementById("feedback");

    if (selectedAnswer === correctAnswer) {
        correctAnswers++;
        feedback.innerText = "Very Good! Your answer is correct!";
        feedback.style.color = "green";
    } else {
        wrongAnswers++;
        feedback.innerText = `Oops! That was wrong! Correct answer: ${correctAnswer}`;
        feedback.style.color = "red";
    }

    document.querySelectorAll("#options button").forEach(btn => {
        btn.onclick = null;
    });

    document.getElementById("nextButton").disabled = false;

    if (attempted === questions.length) submitTest();
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
