let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let timerInterval;
let timeElapsed = 0;

function startQuiz() {
    const category = document.getElementById('category').value;
    const numberOfQuestions = document.getElementById('number').value;
    fetch(`https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${category}&type=multiple`)
        .then(response => response.json())
        .then(data => {
            questions = data.results;
            currentQuestionIndex = 0;
            score = 0;
            timeElapsed = 0;
            startTimer();
            displayQuestion();
        })
        .catch(error => console.error('Error fetching quiz questions:', error));
}

function displayQuestion() {
    if (currentQuestionIndex < questions.length) {
        const quizContainer = document.getElementById('quizContainer');
        quizContainer.innerHTML = '';

        const questionElement = document.createElement('div');
        questionElement.classList.add('quiz-question');
        questionElement.innerHTML = questions[currentQuestionIndex].question;

        const options = [...questions[currentQuestionIndex].incorrect_answers];
        options.push(questions[currentQuestionIndex].correct_answer);
        options.sort(() => Math.random() - 0.5);

        quizContainer.appendChild(questionElement);

        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('quiz-option');
            optionElement.innerHTML = option;
            optionElement.onclick = () => checkAnswer(option);
            quizContainer.appendChild(optionElement);
        });
    } else {
        displayResult();
    }
}

function checkAnswer(selectedOption) {
    const correctAnswer = questions[currentQuestionIndex].correct_answer;
    const quizContainer = document.getElementById('quizContainer');

    if (selectedOption === correctAnswer) {
        score++;
    }

    const correctAnswerElement = document.createElement('div');
    correctAnswerElement.classList.add('correct-answer');
    correctAnswerElement.innerHTML = `Correct Answer: ${correctAnswer}`;
    quizContainer.appendChild(correctAnswerElement);

    currentQuestionIndex++;
    setTimeout(displayQuestion, 2000);
}

function displayResult() {
    clearInterval(timerInterval);
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = `<div class="result">You scored ${score} out of ${questions.length} in ${formatTime(timeElapsed)} seconds.</div>`;
}

function startTimer() {
    const timerElement = document.getElementById('timer');
    timerInterval = setInterval(() => {
        timeElapsed++;
        timerElement.innerHTML = `Time: ${formatTime(timeElapsed)}`;
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
