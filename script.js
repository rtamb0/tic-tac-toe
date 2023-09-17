// Create a module that controls the game (click event, etc)

const displayController = (() => {
    const marker = function(arr, index, player) {
        if (arr[index] !== '') {
            errorMessage();
            return false;
        } else {
            messageDOM.errorMessage.innerHTML = '';
            if (player.getSymbol() === 'O') {
                this.innerHTML = '<img src="assets/circle.svg">';
                arr[index] = 'O';
            } else if (player.getSymbol() === 'X') {
                this.innerHTML = '<img src="assets/cross.svg">';
                arr[index] = 'X';
            };
            playerList.turnPlayer();
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
                messageDOM.message.classList.add('game-over');
                break;
            case 'tie':
                messageDOM.message.innerHTML = `It's a tie!`;
                messageDOM.message.classList.add('game-over');
                break;
            default:
                messageDOM.message.innerHTML = `It's now ${name}'s turn!`;
                messageDOM.message.classList.remove('game-over');
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
    const gameboardHTML = document.querySelector('.gameboard');
    const containerHTML = document.querySelector('.gameboard-container');
    const render = (() => {
        gameArr.forEach((row, i) => {
            const rowHTML = document.createElement('div');
            rowHTML.classList.add('row-game');
            rowHTML.dataset.indexNumber = i;
            row.forEach((cell, i) => {
                const cellHTML = document.createElement('div');
                cellHTML.classList.add('cell-game');
                cellHTML.dataset.indexNumber = i;
                cellHTML.addEventListener('click', function() {
                    const player = playerList.getCurrentPlayer();
                    displayController.marker.call(cellHTML, row, i, player);
                    if (checkEndGame(player) !== true) checkCPU();
                });
                rowHTML.appendChild(cellHTML);
            });
            gameboardHTML.appendChild(rowHTML);
        });
    });
    const randomiser = () => {
        const random = () => Math.floor(Math.random() * gameboardHTML.childElementCount + 1);
        const rowHTML = gameboardHTML.querySelector(`.row-game:nth-child(${random()})`);
        const row = gameArr[rowHTML.dataset.indexNumber];
        const cellHTML = rowHTML.querySelector(`.cell-game:nth-child(${random()})`);
        const cellIndex = cellHTML.dataset.indexNumber;
        return {cellHTML, row, cellIndex}
    };
    const checkCPU = function() {
        const player = playerList.getCurrentPlayer();
        if (player.getName() === "CPU") {
            let random = randomiser();
            let marker = displayController.marker.call(random.cellHTML, random.row, random.cellIndex, player);
            while (marker === false) {
                random = randomiser();
                marker = displayController.marker.call(random.cellHTML, random.row, random.cellIndex, player);
            };
            checkEndGame(player);
        };
    };
    const checkEndGame = function(player) {
        const rowHTMLs = document.querySelectorAll('.row-game');
        if (checkWinner(player) === true) {
            rowHTMLs.forEach((rowHTML) => {
                for (const cellHTML of rowHTML.children) {
                    const noEvent = cellHTML.cloneNode(true);
                    rowHTML.replaceChild(noEvent, cellHTML);
                };
            });
            gameboardHTML.classList.add('game-over');
            restartGame();
            return true;
        };
    };
    const removeBoard = () => {
        gameArr.forEach((row) => {
            row.forEach((cell, i, arr) => arr[i] = '');
        });
        while (gameboardHTML.firstChild) {
            gameboardHTML.removeChild(gameboardHTML.lastChild);
        };
    };
    const restartGame = (() => {
        const restartButton = document.createElement('button');
        restartButton.innerHTML = "Restart";
        gameboardHTML.appendChild(restartButton);
        restartButton.addEventListener('click', () => {
            removeBoard();
            displayController.message(playerList.getCurrentPlayer().getName());
            render();
            checkCPU();
            gameboardHTML.classList.remove('game-over');
            restartButton.remove();
        });
    });
    const changePlayer = (node) => {
        const changeButton = document.createElement('button');
        changeButton.innerHTML = "Change Player";
        containerHTML.appendChild(changeButton);
        changeButton.addEventListener('click', () => {
            removeBoard();
            playerList.pickPlayer();
        });
    };
    return {getGameArr, render, checkCPU, changePlayer};
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
        welcome: document.querySelector('#welcome'),
        startButton: document.querySelector('#start'),
        playerChoice: document.querySelector('#player-choice'),
        twoPlayerButton: document.querySelector('#player'),
        cpuButton: document.querySelector('#cpu'),
        prompt: document.querySelector('#start-prompt'),
        promptHeader: document.querySelector('.dialog-header h2'),
        headerSymbol: document.querySelector('.dialog-header p'),
        input: document.querySelector('dialog input'),
        submitButton: document.querySelector('#submit'),
    };
    const welcomeModal = (() => {
        prompt.welcome.showModal();
        prompt.startButton.blur();
        prompt.startButton.addEventListener('click', () => {
            prompt.welcome.close();
            pickPlayer();
        })
    })();
    const inputListeners = (func) => {
        prompt.submitButton.addEventListener('click', func);
        prompt.input.addEventListener('keypress', (e) => {
            if (e.key === "Enter") func(e);
        });
    };
    const removeListeners = func => {
        prompt.submitButton.removeEventListener('click', func);
        prompt.input.removeEventListener('keypress', (e) => {
            if (e.key === "Enter") func(e);
        });
    };
    const pickPlayer = (() => {
        prompt.playerChoice.showModal();
        prompt.twoPlayerButton.blur();
        prompt.twoPlayerButton.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            prompt.playerChoice.close();
            inputPlayer2();
        });
        prompt.cpuButton.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            prompt.playerChoice.close();
            inputCPU();
        });
    });
    const inputPlayer2 = () => {
        let attempt = 0;
        prompt.prompt.showModal();
        prompt.promptHeader.innerHTML = "Enter Player 1's Name";
        prompt.headerSymbol.innerHTML = "(You will be <img src='assets/circle.svg'>)";
        const submit = (e) => {
            e.stopImmediatePropagation();
            prompt.input.reportValidity();
            if (!prompt.input.checkValidity()) return;
            if (attempt === 1) {
                list[1] = player(prompt.input.value, 'X');
                randomisePlayer();
                gameBoard.render();
                prompt.prompt.close();
                removeListeners(submit);
            } else {
                list[0] = player(prompt.input.value, 'O');
                prompt.promptHeader.innerHTML = "Enter Player 2's Name";
                prompt.headerSymbol.innerHTML = "(You will be <img src='assets/cross.svg'>)";
                attempt++;
            };
            prompt.input.value = "";
        };
        inputListeners(submit);
    };
    const inputCPU = () => {
        prompt.prompt.showModal();
        prompt.promptHeader.innerHTML = "Enter Your Name";
        const submit = (e) => {
            e.stopImmediatePropagation();
            prompt.input.reportValidity();
            if (!prompt.input.checkValidity()) return;
            list[0] = player(prompt.input.value, 'O');
            list[1] = player('CPU', 'X');
            prompt.input.value = "";
            randomisePlayer();
            gameBoard.render();
            gameBoard.checkCPU();
            prompt.prompt.close();
            removeListeners(submit);
        };
        inputListeners(submit);
    };
    let currentPlayer;
    let randomisePlayer = () => {
        const chance = Math.floor(Math.random() * 2) + 1;
        if (chance === 1) {
            currentPlayer = list[0];
        } else {
            currentPlayer = list[1];
        };
        if (currentPlayer.getName() === 'CPU') {
            return;
        } else {
            displayController.message(currentPlayer.getName());
        };
    };
    const getCurrentPlayer = () => currentPlayer;
    const turnPlayer = function() {
        if (currentPlayer === list[0]) {
            currentPlayer = list[1];
        } else {
            currentPlayer = list[0];
        };
        if (currentPlayer.getName() === 'CPU') {
            return;
        } else {
            displayController.message(currentPlayer.getName());
        };
    };
    gameBoard.changePlayer(prompt);
    return {turnPlayer, getCurrentPlayer, pickPlayer};
})();