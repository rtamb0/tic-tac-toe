// Store the gameboard as an array inside of gameboard object as a module

const gameBoard = (() => {
    const gameArr = [];
    return {gameArr};
})();

// Create a factory function that creates the player

const player = (name) => {
    const name = name;
    return {name};
};

// Create a module that controls the game (click event, etc)