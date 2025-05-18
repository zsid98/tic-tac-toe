const Gameboard = (function() {
   const rows = 3;
   const columns = 3;
   const board = [];

   for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
         board[i].push(Cell());
      }
   };

   const resetBoard = () => {
      board.forEach(row => {
        row.forEach(cell => cell.addToken(0));
      });
   }

   const getBoard = () => board;

   const dropToken = (row, column, player) => {
      if (board[row][column].getValue() !== 0) {
         return false;
      };

      board[row][column].addToken(player);
      return true;
   };

   return {
      getBoard,
      resetBoard,
      dropToken
   };

})();


function Cell() {
   let value = 0;

   const addToken = (player) => {
      value = player;
   };

   const getValue = () => value;

   return {
      addToken,
      getValue
   };

};


  /*The GameController will be responsible for controlling the 
    flow and state of the game's turns, as well as whether
    anybody has won the game */

function GameController(playerOneName, playerTwoName) {
   const players = [
      {
         name: playerOneName,
         token: 1
      },
      {
         name: playerTwoName,
         token: 2
      }
   ];

   let activePlayer = players[0];

   const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
   };

   const checkWin = () => {
      const boardValues = Gameboard.getBoard().map(row => row.map(cell => cell.getValue()));
      const token = activePlayer.token;

      // Check rows
      for (let i = 0; i < 3; i++) {
         if (boardValues[i].every(cell => cell === token)) {
            return true;
         }
      };

      // Check columns
      for (let i = 0; i < 3; i++){
         if (boardValues[0][i] === token &&
             boardValues[1][i] === token &&
             boardValues[2][i] === token) {
               return true;
         };
      };

      // Check diagonals

      if (
         (boardValues[0][0] === token && boardValues[1][1] === token && boardValues[2][2] === token) ||
         (boardValues[0][2] === token && boardValues[1][1] === token && boardValues[2][0] === token)) {
            return true;
      };

      return false; // No win
   };

   const isDraw = () => {
      return Gameboard.getBoard()
      .flat()
      .every(cell => cell.getValue() !== 0);
   }

   let gameOver = false;

   const playRound = (row, col) => {
      
      if (gameOver) return;
      
      const success = Gameboard.dropToken(row, col, activePlayer.token);
      if (!success) return;

      if (checkWin()) {
         DisplayController.showMessage(`Winner is ${activePlayer.name}!`);
         gameOver = true;
         return;
      };

      if (isDraw()) {
         DisplayController.showMessage("It's a draw!");
         gameOver = true;
         return;
      };

      switchPlayerTurn();
   };

   const isGameOver = () => gameOver;

   return { 
      playRound, 
      isGameOver 
   };
};


/* DisplayController: 
      Rendering the board based on the current state of the game.
      Handling user interaction (e.g., clicks).
      Updating the UI.
*/
const DisplayController = (function() { 
   const renderBoard = () => {
      const boardContainer = document.getElementById('gameboard');
      boardContainer.innerHTML = ''; // Clear old board before re-rendering   
      
      const board = Gameboard.getBoard();

      board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const cellButton = document.createElement('button');
          cellButton.classList.add('cell');
          cellButton.dataset.row = rowIndex;
          cellButton.dataset.col = colIndex;

          const value = cell.getValue();
          cellButton.textContent = value === 1 ? 'X' : value === 2 ? 'O' : '';

          // Add click event for this specific cell
          cellButton.addEventListener('click', () => {
               game.playRound(rowIndex, colIndex);
               renderBoard();  
          });
          
          boardContainer.appendChild(cellButton);
        });
      });
   };

   const showMessage = (msg) => {
      const messageDiv = document.getElementById('message');
      messageDiv.textContent = msg;
   };

   return { 
      renderBoard, 
      showMessage 
   };
})();


let game;

function startGame() {
   let player1 = document.getElementById('player1').value;
   let player2 = document.getElementById('player2').value;

   if (!player1) {
      player1 = 'Player One';
   };
   if (!player2) {
      player2 = 'Player Two';
   };

   game = GameController(player1, player2);
   DisplayController.renderBoard();
}


const startButton = document.getElementById('start-btn');
startButton.addEventListener('click', () => {
   startGame();
});

const restartButton = document.getElementById('restart-btn');
restartButton.addEventListener('click', () => {
   Gameboard.resetBoard();
   let player1 = document.getElementById('player1').value;
   let player2 = document.getElementById('player2').value;
   console.log(`Player 1: ${player1} Player 2: ${player2}`);
   if (!player1) {
      player1 = 'Player One';
   };
   if (!player2) {
      player2 = 'Player Two';
   };
   game = GameController(player1, player2);
   DisplayController.renderBoard();
   DisplayController.showMessage('');
});