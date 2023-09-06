// Create a module that controls the game (click event, etc)

const displayController = (() => {
    const changeValue = function(arr, index) {
        this.innerHTML = 'X';
        arr[index] = 'X';
    };
    return {changeValue};
})();

// Store the gameboard as an array inside of gameboard object as a module

const gameBoard = (() => {
    const gameArr = [['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']];
    const containerHTML = document.querySelector('.gameboard');
    const render = () => {
        gameArr.forEach((row) => {
            const rowHTML = document.createElement('div');
            rowHTML.classList.add('row-game');
            row.forEach((cell, i) => {
                const cellHTML = document.createElement('span');
                cellHTML.classList.add('cell-game');
                cellHTML.innerHTML = cell;
                cellHTML.addEventListener('click', displayController.changeValue.bind(cellHTML, row, i));
                rowHTML.appendChild(cellHTML);
            });
            containerHTML.appendChild(rowHTML);
        });
    };
    return {render, gameArr};
})();

gameBoard.render()

// Create a factory function that creates the player

const player = (name) => {
    const getName = () => name;
    return {getName};
};