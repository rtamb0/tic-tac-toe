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
            playerList.switchPlayer();
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
    return {marker, message};
})();

// Store the gameboard as an array inside of gameboard object as a module

const gameBoard = (() => {
    const gameArr = [['', '', ''], ['', '', ''], ['', '', '']];
    const getGameArr = () => gameArr;
    const checkWinner = (symbol) => {
        const filter = gameArr.filter((row, i, arr) => {
            // Column check logic
            if (arr[0][i] === symbol) {
                if (arr[1][i] === symbol && arr[2][i] === symbol) return true;
            };
            // Row check logic
            if (row[0] === symbol) {
                if (row[1] === symbol) {
                    if (row[2] === symbol) return true;
                };
            };
            // Diagonal check logic
            if ((!(i === 1) && arr[0][i] === symbol) && arr[1][1] === symbol) {
                if (arr[2][0] === symbol || arr[2][2] === symbol) return true;
            };
        });
        console.log(filter)
    };
    const containerHTML = document.querySelector('.gameboard');
    const render = (() => {
        gameArr.forEach((row) => {
            const rowHTML = document.createElement('div');
            rowHTML.classList.add('row-game');
            row.forEach((cell, i) => {
                const cellHTML = document.createElement('div');
                cellHTML.classList.add('cell-game');
                cellHTML.addEventListener('click', () => {
                    const player = playerList.getCurrentPlayer();
                    displayController.marker.call(cellHTML, row, i, player);
                    checkWinner(player.getSymbol());
                });
                rowHTML.appendChild(cellHTML);
            });
            containerHTML.appendChild(rowHTML);
        })
    })();
    return {getGameArr};
})();

// Factory function that creates the player

const player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol; 
    return {getName, getSymbol};
};

// A module that puts the players in an array and iterates each of them in each turn

const playerList = (() => {
    const player1 = player('test1', 'O');
    const player2 = player('test2', 'X');
    const list = [player1, player2];
    let currentPlayer = (() => {
        let player;
        const chance = Math.floor(Math.random() * 2) + 1;
        if (chance === 1) {
            player = list[0];
        } else {
            player = list[1];
        };
        displayController.message(player.getName());
        return player;
    })();
    const getCurrentPlayer = () => currentPlayer;
    const switchPlayer = function() {
        if (currentPlayer === list[0]) {
            currentPlayer = list[1];
        } else {
            currentPlayer = list[0];
        };
        displayController.message(currentPlayer.getName());
    };
    return {switchPlayer, getCurrentPlayer};
})();