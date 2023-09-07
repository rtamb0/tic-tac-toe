// Create a module that controls the game (click event, etc)

const displayController = (() => {
    const marker = function(arr, index) {
        if (arr[index] !== '') {
            errorMessage();
        } else {
            messageDOM.errorMessage.innerHTML = '';
            this.innerHTML = 'O';
            arr[index] = 'O';
        };
    };
    const messageDOM = {
        message: document.createElement('p'),
        errorMessage: document.createElement('p'),
        messageContainer: document.querySelector('.game-message'),
    };
    const appendMessage = ((obj) => {
        obj.messageContainer.appendChild(obj.message);
        obj.messageContainer.appendChild(obj.errorMessage);
    })(messageDOM);
    const message = (type) => {
        switch (type) {
            case 'player1':
                messageDOM.message.innerHTML = "It's now Player 1's turn!"
                break;
            case 'player2':
                messageDOM.message.innerHTML = "It's now Player 2's turn!"
                break;
        };
    };
    const errorMessage = () => messageDOM.errorMessage.innerHTML = "That spot is already taken. Please pick another spot.";
    return {marker};
})();

// Store the gameboard as an array inside of gameboard object as a module

const gameBoard = (() => {
    const gameArr = [['', '', ''], ['', '', ''], ['', '', '']];
    const getGameArr = () => gameArr;
    const containerHTML = document.querySelector('.gameboard');
    const render = (() => {
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
    })();
    return {getGameArr};
})();

// Create a factory function that creates the player

const player = (name) => {
    const getName = () => name;
    return {getName};
};