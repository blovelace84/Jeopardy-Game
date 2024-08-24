document.addEventListener('DOMContentLoaded', () => {
    const jeopardyBoard = document.getElementById('jeopardy-board');

    // Fetch 10 random questions
    async function fetchJeopardyData() {
        try {
            const response = await fetch('https://rithm-jeopardy.herokuapp.com/api/categories?count=100');
            const data = await response.json();
            console.log(data); // You can see the structure of the data in the console
            populateBoard(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function populateBoard(data) {
        data.forEach((item) => {
            const questionBox = document.createElement('div');
            questionBox.className = 'question';
            questionBox.innerText = `$${item.value}`; // Display the value of the question

            // Store the question and answer as data attributes
            questionBox.dataset.question = item.question;
            questionBox.dataset.answer = item.answer;

            questionBox.addEventListener('click', () => {
                displayQuestion(item);
            });

            jeopardyBoard.appendChild(questionBox);
        });
    }

    function displayQuestion(item) {
        const questionElement = document.getElementById('question');
        questionElement.innerText = item.question;

        // Handle user input and check the answer
        const submitAnswerButton = document.getElementById('submit-answer');
        const answerInput = document.getElementById('answer');

        submitAnswerButton.addEventListener('click', () => {
            const userAnswer = answerInput.value.toLowerCase().trim();
            if (userAnswer === item.answer.toLowerCase()) {
                alert('Correct!');
            } else {
                alert(`Wrong! The correct answer was: ${item.answer}`);
            }
            answerInput.value = '';
        });
    }

    // Initialize the game by fetching questions
    fetchJeopardyData();
});
