const categories = [
    { id: 2, title: "baseball" },
    { id: 3, title: "odd jobs" },
    { id: 4, title: "movies" },
    { id: 8, title: "time" },
    { id: 9, title: "dining out" },
    // Add more categories as needed
];

function createJeopardyTable() {
    const table = document.createElement('table');
    table.classList.add('jeopardy-table');

    const categoryPromises = categories.map(category =>
        fetchQuestions(category.id).then(questions => ({ ...category, questions }))
    );

    Promise.all(categoryPromises).then(categoryData => {
        table.appendChild(createTableHeader(categories.map(cat => cat.title)));
        table.appendChild(createTableBody(categoryData));

        document.getElementById('game-board').appendChild(table);
    }).catch(error => console.error('Error fetching categories:', error));
}

function fetchQuestions(categoryId) {
    return fetch(`https://rithm-jeopardy.herokuapp.com/api/category?id=2`)
        .then(response => response.json())
        .then(data => data.clues)
        .catch(error => console.error('Error fetching questions:', error));
}

function createTableHeader(categoryTitles) {
    const headerRow = document.createElement('tr');
    categoryTitles.forEach(title => {
        const headerCell = document.createElement('th');
        headerCell.textContent = title;
        headerRow.appendChild(headerCell);
    });
    return headerRow;
}

function createTableBody(categoryData) {
    const tbody = document.createElement('tbody');

    for (let i = 0; i < 5; i++) {
        const row = document.createElement('tr');
        categoryData.forEach(({ title, questions }) => {
            const question = questions.find(q => q.value === (i + 1) * 100);
            row.appendChild(createQuestionCell(question));
        });
        tbody.appendChild(row);
    }

    return tbody;
}

function createQuestionCell(question) {
    const cell = document.createElement('td');
    if (question) {
        cell.textContent = `$${question.value}`;
        cell.dataset.question = question.question;
        cell.dataset.answer = question.answer;
        cell.classList.add('jeopardy-cell');
        cell.onclick = displayQuestion;
    } else {
        cell.textContent = 'N/A';
        cell.classList.add('jeopardy-cell');
    }
    return cell;
}

function displayQuestion(event) {
    const cell = event.target;
    const question = cell.dataset.question;
    const answer = cell.dataset.answer;

    const questionDiv = document.getElementById('question');
    questionDiv.innerHTML = `
        <p>${question}</p>
        <button id="show-answer">Show Answer</button>
    `;

    document.getElementById('show-answer').onclick = () => {
        questionDiv.innerHTML += `<p><strong>Answer:</strong> ${answer}</p>`;
    };
}

createJeopardyTable(); // Call the function to create the game board
