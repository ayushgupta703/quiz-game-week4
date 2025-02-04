document.addEventListener('DOMContentLoaded', () => {
    const questionContainer = document.getElementById('question');
    const optionsContainer = document.getElementById('options');
    const submitButton = document.getElementById('submit-btn');
    const clearButton = document.getElementById('clear-btn');
    const resultDiv = document.getElementById('result');

    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];

    fetch('/questions')
        .then(response => response.json())
        .then(data => {
            questions = data;
            loadQuestion();
        });

    function loadQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        questionContainer.textContent = currentQuestion.question;

        optionsContainer.innerHTML = '';
        currentQuestion.options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.classList.add('option');
            optionDiv.textContent = option;
            optionDiv.addEventListener('click', () => {
                optionsContainer.querySelectorAll('.option').forEach(el => el.classList.remove('selected'));
                optionDiv.classList.add('selected');
            });
            optionsContainer.appendChild(optionDiv);
        });
    }

    submitButton.addEventListener('click', () => {
        const selectedOption = document.querySelector('.option.selected');
        if (!selectedOption) {
            alert('Please select an answer.');
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        if (selectedOption.textContent === currentQuestion.answer) {
            score++;
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResult();
        }
    });

    clearButton.addEventListener('click', () => {
        optionsContainer.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected');
        });
    });

    function showResult() {
        questionContainer.style.display = 'none';
        optionsContainer.style.display = 'none';
        submitButton.style.display = 'none';
        resultDiv.textContent = `Quiz finished! Your score: ${score} out of ${questions.length}`;
    }
});