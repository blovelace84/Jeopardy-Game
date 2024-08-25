function createTable(){
    const table = document.createElement('table');

    for(let i = 0; i < 8; i++){
        const row = document.createElement('tr');

        const cell = document.createElement('td');
        cell.textContent = `Row ${i + 1}, Cell 1`;

        row.appendChild(cell);

        table.appendChild(row);


        document.body.appendChild(table);
    }
}

createTable();