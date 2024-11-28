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

    switchActivePlayer();
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
  };
}

const game = new GameController();
