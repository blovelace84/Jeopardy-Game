// Function to create the Jeopardy table
function createJeopardyTable(categories) {
    // Create a new table element
    const table = document.createElement('table');
    table.classList.add('jeopardy-table');

    // Append header and rows
    table.appendChild(createTableHeader(categories));
    table.appendChild(createTableBody(categories));

    // Append the table to the body or any other container
    document.body.appendChild(table);
}

// Function to create the table header
function createTableHeader(categories) {
    const headerRow = document.createElement('tr');
    categories.forEach(category => {
        const headerCell = document.createElement('th');
        headerCell.textContent = category.title;
        headerRow.appendChild(headerCell);
    });
    return headerRow;
}

// Function to create the table body with rows and cells
function createTableBody(categories) {
    const tbody = document.createElement('tbody');

    // Assume 5 rows for simplicity
    for (let i = 0; i < 5; i++) {
        const row = document.createElement('tr');
        categories.forEach(category => {
            row.appendChild(createQuestionCell(category, (i + 1) * 100));
        });
        tbody.appendChild(row);
    }

    return tbody;
}

// Function to create each cell with a point value and event handler
function createQuestionCell(category, pointValue) {
    const cell = document.createElement('td');
    cell.textContent = `$${pointValue}`;
    cell.dataset.categoryId = category.id;
    cell.dataset.pointValue = pointValue;
    cell.classList.add('jeopardy-cell');
    cell.onclick = fetchQuestion;
    return cell;
}

// Function to fetch and display the question when a cell is clicked
function fetchQuestion(event) {
    const cell = event.target;
    const categoryId = cell.dataset.categoryId;
    const pointValue = cell.dataset.pointValue;

    // Fetch the question from the API
    fetch(`https://jservice.io/api/clues?category=${categoryId}&value=${pointValue}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const question = data[0].question;
                const answer = data[0].answer;

                // Display the question and set up for showing the answer
                displayQuestion(question, answer);
            } else {
                alert('No question found for this point value.');
            }
        });
}

// Function to display the question and set up the answer reveal
function displayQuestion(question, answer) {
    const questionDiv = document.getElementById('question');
    questionDiv.innerHTML = `
        <p>${question}</p>
        <button id="show-answer">Show Answer</button>
    `;

    // Set up event listener to show the answer
    document.getElementById('show-answer').onclick = () => {
        questionDiv.innerHTML += `<p><strong>Answer:</strong> ${answer}</p>`;
    };
}

// Example categories (replace with categories you want to show)
const categories = [
    { id: 1, title: "Category 1" },
    { id: 2, title: "Category 2" },
    { id: 3, title: "Category 3" },
    { id: 4, title: "Category 4" },
    { id: 5, title: "Category 5" }
];

// Initialize the game with specified categories
createJeopardyTable(categories);
