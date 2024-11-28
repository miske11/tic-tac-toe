const Gameboard = (function () {
  const grid = [];
  const dimension = 3;

  for (let i = 0; i < dimension; i++) {
    grid[i] = [];
    for (let j = 0; j < dimension; j++) {
      grid[i].push(Cell());
    }
  }

  const getGrid = () => grid;

  const playMove = (player, row, col) => {
      grid[row][col].addShape(player);
  };

  const printGameboard = () => {
    const gridWithCellValues = grid.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(gridWithCellValues);
  };

  return {
    getGrid,
    playMove,
    printGameboard,
  };
})();

function Cell() {
  let value = 0;

  const addShape = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addShape,
    getValue,
  };
}

function GameController(
  playerOneName = "Player one",
  playerTwoName = "Player two"
) {
  const players = [
    {
      name: playerOneName,
      token: 1,
    },
    {
      name: playerTwoName,
      token: 2,
    },
  ];
  const dimension = 3;
  let activePlayer = players[0];

  const switchActivePlayer = () => {
    if (activePlayer === players[0]) activePlayer = players[1];
    else activePlayer = players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    Gameboard.printGameboard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    console.log(`${activePlayer.name} marks the [${row}, ${column}]`);
    Gameboard.playMove(activePlayer.token, row, column);

    let over = checkForWinner();

    if (!over) {
      switchActivePlayer();
      printNewRound();  
    } else {
      console.log(`${activePlayer.name} won!!!`);
      Gameboard.printGameboard();
    }
    
  };

  const checkForWinner = () => {
    let xcounter = 0;
    let ycounter = 0;
    let zcounter = 0;
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        if (Gameboard.getGrid()[i][j].getValue() == activePlayer.token) {
          ycounter++;
          if (ycounter == 3) 
            return true;
        }
      }
      ycounter = 0;
    }
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        if (Gameboard.getGrid()[j][i].getValue() == activePlayer.token) {
          xcounter++;
          if (xcounter == 3) 
            return true;
        }
      }
      xcounter = 0;
    }
    for (let i = 0; i < dimension; i++) {
      if (Gameboard.getGrid()[i][i].getValue() == activePlayer.token)
        zcounter++;
    }
    if (zcounter == 3)
      return true
    zcounter = 0;
    for (let i = 0; i < dimension; i++) {
      if (Gameboard.getGrid()[dimension - i - 1][i].getValue() == activePlayer.token)
        zcounter++;
    }
    if (zcounter == 3)
      return true
    zcounter = 0;
  }

  printNewRound();

  return {
    playRound,
    getActivePlayer,
  };
}

const game = new GameController();
