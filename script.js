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
    const gameArr = ['', '', '', '', '', '', '', '', ''];
    const getGameArr = () => gameArr;
    // const logic = () => {
    //     const value = 'O';
    //     const filter = gameArr.filter((row) => {
    //         switch (value) {
    //             case row[0]:
    //                 return true;
    //             case row[1]:
    //                 return true;
    //             case row[2]:
    //                 return true;
    //         };
    //     });
    //     if (filter.length === 3) {
    //         console.log('hi');
    //     };
    // };
    const domBoard = {
        containerHTML: document.querySelector('.gameboard'),
        rowHTML: {
            row1: document.createElement('div'),
            row2: document.createElement('div'),
            row3: document.createElement('div'),
        },
    };
    const rowClassAmend = (function(obj) {
        for (const row in obj.rowHTML) {
            obj.rowHTML[row].classList.add('row-game');
            obj.containerHTML.appendChild(obj.rowHTML[row]);
        };
    })(domBoard);
    const render = (() => {
        gameArr.forEach((cell, i) => {
            const cellHTML = document.createElement('div');
            cellHTML.classList.add('cell-game');
            cellHTML.addEventListener('click', () => {
                const player = playerList.getCurrentPlayer();
                displayController.marker.call(cellHTML, gameArr, i, player);
            });
            if (i < 3) {
                domBoard.rowHTML.row1.appendChild(cellHTML);
            } else if (i < 6) {
                domBoard.rowHTML.row2.appendChild(cellHTML);
            } else if (i < 9) {
                domBoard.rowHTML.row3.appendChild(cellHTML);
            };
        });
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