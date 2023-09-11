// Create a module that controls the game (click event, etc)

const displayController = (() => {
    const marker = function(arr, index, player) {
        if (arr[index] !== '') {
            errorMessage();
        } else {
            messageDOM.errorMessage.innerHTML = '';
            if (player.getSymbol() === 'O') {
                this.innerHTML = '<img src="assets/circle.svg">';
                arr[index] = 'O';
            } else if (player.getSymbol() === 'X') {
                this.innerHTML = '<img src="assets/cross.svg">';
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
    const message = (name, status) => {
        switch (status) {
            case 'win':
                messageDOM.message.innerHTML = `${name} is the winner!`;
                break;
            case 'tie':
                messageDOM.message.innerHTML = `It's a tie!`;
                break;
            case 'restart':
                messageDOM.message.innerHTML = ``;
                break;
            default:
                messageDOM.message.innerHTML = `It's now ${name}'s turn!`;
        };
    };
    const errorMessage = () => messageDOM.errorMessage.innerHTML = "That spot is already taken. Please pick another spot.";
    return {marker, message};
})();

// Store the gameboard as an array inside of gameboard object as a module

const gameBoard = (() => {
    const gameArr = [['', '', ''], ['', '', ''], ['', '', '']];
    const getGameArr = () => gameArr;
    const checkWinner = (player) => {
        const winFilter = gameArr.filter((row, i, arr) => {
            // Column check logic
            if (arr[0][i] === player.getSymbol()) {
                if (arr[1][i] === player.getSymbol() && arr[2][i] === player.getSymbol()) return true;
            };
            // Row check logic
            if (row[0] === player.getSymbol()) {
                if (row[1] === player.getSymbol()) {
                    if (row[2] === player.getSymbol()) return true;
                };
            };
            // Diagonal check logic
            if (arr[1][1] === player.getSymbol()) {
                if (arr[0][0] === player.getSymbol()) {
                    if (arr[2][2] === player.getSymbol()) return true;
                };
                if (arr[0][2] === player.getSymbol()) {
                    if (arr[2][0] === player.getSymbol()) return true;
                };
            };
        });
        const filledRow = (() => {
            let filled = 0;
            gameArr.forEach((row) => {
                const check = row.every((cell) => cell === 'O' || cell === 'X');
                if (check === true) filled += 1;
            });
            return filled;
        })();
        // Current player wins
        if (winFilter.length > 0) {
            displayController.message(player.getName(), 'win');
            return true;
        };
        // The game is tied
        if (winFilter.length === 0 && filledRow === 3) {
            displayController.message(undefined, 'tie');
            return true;
        };
    };
    const containerHTML = document.querySelector('.gameboard');
    const render = (() => {
        gameArr.forEach((row) => {
            const rowHTML = document.createElement('div');
            rowHTML.classList.add('row-game');
            row.forEach((cell, i) => {
                const cellHTML = document.createElement('div');
                cellHTML.classList.add('cell-game');
                cellHTML.addEventListener('click', function() {
                    const player = playerList.getCurrentPlayer();
                    displayController.marker.call(cellHTML, row, i, player);
                    checkEndGame(player);
                });
                rowHTML.appendChild(cellHTML);
            });
            containerHTML.appendChild(rowHTML);
        });
    });
    const checkEndGame = function(player) {
        const rowHTMLs = document.querySelectorAll('.row-game');
        if (checkWinner(player) === true) {
            rowHTMLs.forEach((rowHTML) => {
                for (const cellHTML of rowHTML.children) {
                    const noEvent = cellHTML.cloneNode(true);
                    rowHTML.replaceChild(noEvent, cellHTML);
                };
            });
        };
    };
    const restartGame = (() => {
        const restartButton = document.querySelector('#restart');
        restartButton.addEventListener('click', () => {
            gameArr.forEach((row) => {
                row.forEach((cell, i, arr) => arr[i] = '');
            });
            while (containerHTML.firstChild) {
                containerHTML.removeChild(containerHTML.lastChild);
            };
            displayController.message(undefined, 'restart');
            render();
        });
    })();
    return {getGameArr, render};
})();

// Factory function that creates the player

const player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol; 
    return {getName, getSymbol};
};

// A module that puts the players in an array and iterates each of them in each turn

const playerList = (() => {
    const list = [];
    const prompt = {
        prompt: document.querySelector('#start-prompt'),
        promptHeader: document.querySelector('.dialog-header h2'),
        headerSymbol: document.querySelector('.dialog-header p'),
        input: document.querySelector('dialog input'),
        submitButton: document.querySelector('#submit'),
    };
    const inputPlayer = (function() {
        let attempt = 0;
        prompt.prompt.showModal();
        prompt.submitButton.addEventListener('click', () => {
            prompt.input.reportValidity();
            if (!prompt.input.checkValidity()) return;
            if (attempt === 1) {
                list[1] = player(prompt.input.value, 'X');
                randomisePlayer();
                gameBoard.render();
                prompt.prompt.close();
            } else {
                list[0] = player(prompt.input.value, 'O');
                prompt.input.value = "";
                prompt.promptHeader.innerHTML = "Enter Player 2's Name";
                prompt.headerSymbol.innerHTML = "(You will be <img src='assets/cross.svg'>)";
                attempt++;
            };
        });
    })();
    let currentPlayer;
    let randomisePlayer = () => {
        const chance = Math.floor(Math.random() * 2) + 1;
        if (chance === 1) {
            currentPlayer = list[0];
        } else {
            currentPlayer = list[1];
        };
        displayController.message(currentPlayer.getName());
    };
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