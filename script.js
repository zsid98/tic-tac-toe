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

   const getBoard = () => board;

   const dropToken = (row, column, player) => {
      if (board[row][column].getValue() !== 0) {
         console.log("Cell is already taken!");
         return false;
      }

      board[row][column].addToken(player);
      return true;
   }

   // This method will be used to print our board to the console.
   // It is helpful to see what the board looks like after each turn as we play,
   // but we won't need it after we build our UI
   const printBoard = () => {
      const boardWithCellValues = board.map(row => row.map(cell => cell.getValue()));
      console.log(boardWithCellValues);
   };

   return { getBoard, dropToken, printBoard };

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

  /* 
  ** The GameController will be responsible for controlling the 
  ** flow and state of the game's turns, as well as whether
  ** anybody has won the game
  */

function GameController(
   playerOneName = "Player One",
   playerTwoName = "Player Two"
) {

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
   }
   const getActivePlayer = () => activePlayer;

   const printNewRound = () => {
      Gameboard.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`);
   }

   const checkWin = () => {
      const boardValues = Gameboard.getBoard().map(row => row.map(cell => cell.getValue()));
      const token = activePlayer.token;

      // Check rows
      for (let i = 0; i < 3; i++) {
         if (boardValues[i].every(cell => cell === token)) {
            console.log(`Winner is ${activePlayer.name}!`);
            return true;
         }
      }

      // Check columns
      for (let i = 0; i < 3; i++){
         if (boardValues[0][i] === token &&
             boardValues[1][i] === token &&
             boardValues[2][i] === token) {
               return true;
             }
         }

      // Check diagonals

      if (
         (boardValues[0][0] === token && boardValues[1][1] === token && boardValues[2][2] === token) ||
         (boardValues[0][2] === token && boardValues[1][1] === token && boardValues[2][0] === token)) {
         return true;
      } 

      return false; // No win
   };

   const isDraw = () => {
      return Gameboard.getBoard()
      .flat()
      .every(cell => cell.getValue() !== 0);
   }

   const playRound = (row, col) => {
      const tokenPlaced = Gameboard.dropToken(row, col, activePlayer.token);
      if (!tokenPlaced) return;

      if (checkWin()) {
         console.log(`Winner is ${activePlayer.name}!`);
         return;
      }

      if (isDraw()) {
         console.log("It's a draw!");
         return;
      }

      switchPlayerTurn();
      printNewRound();
   };

   return { playRound };

}

