// Create a module that controls the game (click event, etc)

const displayController = (() => {
    const marker = function(arr, index) {
        if (arr[index] !== '') {
            errorMessage();
        } else {
            messageDOM.messageHTML.innerHTML = '';
            this.innerHTML = 'X';
            arr[index] = 'X';
        };
    };
    const messageDOM = {
        messageHTML: document.createElement('p'),
        messageContainer: document.querySelector('.game-message'),
    };
    const appendMessage = function(obj) {
        obj.messageContainer.appendChild(obj.messageHTML);
    }(messageDOM);
    const errorMessage = function() {
        messageDOM.messageHTML.innerHTML = "That spot is already taken. Please pick another spot.";
    };
    return {marker};
})();

// Store the gameboard as an array inside of gameboard object as a module

const gameBoard = (() => {
    const gameArr = [['', '', ''], ['', '', ''], ['', '', '']];
    const getGameArr = () => gameArr;
    const containerHTML = document.querySelector('.gameboard');
    const render = () => {
        gameArr.forEach((row) => {
            const rowHTML = document.createElement('div');
            rowHTML.classList.add('row-game');
            row.forEach((cell, i) => {
                const cellHTML = document.createElement('div');
                cellHTML.classList.add('cell-game');
                cellHTML.addEventListener('click', displayController.marker.bind(cellHTML, row, i));
                rowHTML.appendChild(cellHTML);
            });
            containerHTML.appendChild(rowHTML);
        });
    };
    return {render, getGameArr};
})();

gameBoard.render()

// Create a factory function that creates the player

const player = (name) => {
    const getName = () => name;
    return {getName};
};