document.addEventListener('DOMContentLoaded', () => {
    const startGameBtn = document.getElementById('start-game-btn');
    const mainMenuBtn = document.getElementById('main-menu-btn');
    const mainMenu = document.getElementById('main-menu');
    const gameBoard = document.getElementById('game-board');
    const questionSection = document.getElementById('question-section');

    // Start Game Button Click Event
    startGameBtn.addEventListener('click', () => {
        mainMenu.style.display = 'none'; // Hide main menu
        gameBoard.style.display = 'block'; // Show game board
        createJeopardyTable(); // Initialize the game board
    });

    // Main Menu Button Click Event
    mainMenuBtn.addEventListener('click', () => {
        gameBoard.style.display = 'none'; // Hide game board
        questionSection.style.display = 'none'; // Hide question section
        mainMenu.style.display = 'block'; // Show main menu
    });

    // Function to create the Jeopardy table
    function createJeopardyTable() {
        // Clear the game board before creating a new one
        gameBoard.innerHTML = '';

        const categories = [
            { id: 2, title: "baseball" },
            { id: 3, title: "odd jobs" },
            { id: 4, title: "movies" },
            { id: 8, title: "time" },
            { id: 9, title: "dining out" }
            // Add more categories as needed
        ];

        const table = document.createElement('table');
        table.classList.add('jeopardy-table');

        const categoryPromises = categories.map(category =>
            fetchQuestions(category.id).then(questions => ({ ...category, questions }))
        );

        Promise.all(categoryPromises).then(categoryData => {
            table.appendChild(createTableHeader(categories.map(cat => cat.title)));
            table.appendChild(createTableBody(categoryData));
            gameBoard.appendChild(table);
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

        gameBoard.style.display = 'none'; // Hide the game board
        questionSection.style.display = 'block'; // Show question section
    }
});

