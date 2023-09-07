// Create a module that controls the game (click event, etc)

const displayController = (() => {
    const marker = function(arr, index, player) {
        if (arr[index] !== '') {
            errorMessage();
        } else {
            messageDOM.errorMessage.innerHTML = '';
            if (player.getSymbol() === 'O') {
                this.innerHTML = 'O';
                arr[index] = 'O';
            } else if (player.getSymbol() === 'X') {
                this.innerHTML = 'X';
                arr[index] = 'X';
            };
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
    const message = (name) => messageDOM.message.innerHTML = `It's now ${name}'s turn!`
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
                cellHTML.addEventListener('click', () => {
                    const player = playerList.currentPlayer;
                    displayController.marker.call(cellHTML, row, i, player);
                    playerList.switchPlayer();
                });
                rowHTML.appendChild(cellHTML);
            });
            containerHTML.appendChild(rowHTML);
        });
    })();
    return {getGameArr};
})();

// Create a factory function that creates the player

const player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol; 
    return {getName, getSymbol};
};

const playerList = (() => {
    const player1 = player('test1', 'O');
    const player2 = player('test2', 'X');
    const list = [player1, player2];
    let currentPlayer = (() => {
        const chance = Math.floor(Math.random() * 2) + 1;
        if (chance === 1) {
            return list[0];
        } else {
            return list[1];
        };
    })();
    const switchPlayer = function() {
        if (this.currentPlayer === list[0]) {
            this.currentPlayer = list[1];
        } else {
            this.currentPlayer = list[0];
        };
    };
    return {switchPlayer, currentPlayer};
})();