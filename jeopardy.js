
// Example categories
const categories = [
    { id: 2, title: 'baseball' },
    { id: 3, title: 'odd jobs' },
    { id: 4, title: 'movies' },
    { id: 8, title: 'time' },
    { id: 9, title: 'dining out' }
];

document.addEventListener('DOMContentLoaded', () => {
    createGameBoard(categories);
});

async function createGameBoard(categories) {
    const table = document.getElementById('jeopardy-table');
    const headerRow = document.createElement('tr');

    // Create table headers for each category
    categories.forEach(category => {
        const th = document.createElement('th');
        th.textContent = category.title;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Create rows for questions
    for (let i = 0; i < 5; i++) { // Assuming 5 rows of questions
        const row = document.createElement('tr');
        categories.forEach(category => {
            const cell = document.createElement('td');
            cell.textContent = `$${(i + 1) * 100}`;
            cell.dataset.categoryId = category.id;
            cell.dataset.questionIndex = i;

            // Add click event to fetch and display the question
            cell.addEventListener('click', async () => {
                await fetchAndDisplayQuestion(category.id, i);
            });

            row.appendChild(cell);
        });
        table.appendChild(row);
    }
}

async function fetchAndDisplayQuestion(categoryId, questionIndex) {
    try {
        console.log(`Fetching question category ID: ${categoryId} with index: ${questionIndex}`);
        const response = await fetch(`https://rithm-jeopardy.herokuapp.com/api/category?id=${categoryId}`);
        const data = await response.json();

        console.log('Fetched data:', data);
        if(questionIndex < data.clues.length){
            const question = data.clues[questionIndex].question;
            const answer = data.clues[questionIndex].answer;

            displayQuestion(question, answer);
        }else{
            console.error('Question index out of bounds.');
        }
          
    } catch (error) {
        console.error('Error fetching question:', error);
    }
}

function displayQuestion(question, answer) {
    const questionDisplay = document.getElementById('question-display');
    const answerButton = document.getElementById('show-answer');

    questionDisplay.textContent = question;
    answerButton.style.display = 'block';

    answerButton.onclick = () => {
        questionDisplay.textContent += `\nAnswer: ${answer}`;
        answerButton.style.display = 'none';
    };
}