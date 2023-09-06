// Store the gameboard as an array inside of gameboard object as a module

const gameBoard = (() => {
    const gameArr = [['X', 'O', 'X'], ['X', 'O', 'O'], ['X', 'O', 'O']];
    const containerHTML = document.querySelector('.gameboard');
    const render = () => {
        gameArr.forEach((row) => {
            const rowHTML = document.createElement('div');
            rowHTML.classList.add('row-game');
            row.forEach((cell) => {
                const cellHTML = document.createElement('span');
                cellHTML.classList.add('cell-game');
                cellHTML.innerHTML = cell;
                rowHTML.appendChild(cellHTML);
            });
            containerHTML.appendChild(rowHTML);
        });
    };
    return {render};
})();

gameBoard.render()

// Create a factory function that creates the player

const player = (name) => {
    const getName = () => name;
    return {getName};
};

// Create a module that controls the game (click event, etc)