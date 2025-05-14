function (Gameboard() {
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
   const board = Gameboard();

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
      board.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`);
   }

   const checkWin = () => {
      let n = board.length;
      let winner;

      // check for diagonal wins
      if ((board[0][0] === activePlayer && board[1][1] === activePlayer && board[2][2] === activePlayer) ||
      (board[0][2] === activePlayer && board[1][1] === activePlayer && board[2][0] === activePlayer)) {
         winner = activePlayer;
         console.log(`Winner is ${activePlayer.name}!`);
         return winner;
      } 

      // check for horizontal and vertical wins
      for (let i = 0; i < n; i++) {
         let horizontal = 0, vertical = 0;
         for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === activePlayer) {
               horizontal ++;
            } else if (board[j][i] === activePlayer) {
               vertical ++;
            }
         }
         if (horizontal === 3 || vertical === 3) {
            winner = activePlayer;
            console.log(`Winner is ${activePlayer.name}!`);
            return winner;
         }
      }
   }

   const playRound = () => {
      while (!winner) {
      }
   }

}

