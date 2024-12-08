function Gameboard() {
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
    if (grid[row][col].getValue() != 0) return false;

    grid[row][col].addValue(player);
    return true;
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
}

function Cell() {
  let value = 0;

  const addValue = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addValue,
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
      score: 0,
    },
    {
      name: playerTwoName,
      token: 2,
      score: 0,
    },
  ];
  const dimension = 3;
  let activePlayer = players[0];
  let board = Gameboard();

  const switchActivePlayer = () => {
    if (activePlayer === players[0]) activePlayer = players[1];
    else activePlayer = players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printGameboard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    console.log(`${activePlayer.name} marks the [${row}, ${column}]`);
    board.playMove(activePlayer.token, row, column);
    let over = checkForWinner();
    if (!over) {
      const tie = checkForTie();
      if (!tie) {
        switchActivePlayer();
        printNewRound();
        return tie;
      } else {
        console.log(`It's a tie.`);
        return tie;
      }
    } else {
      console.log(`${activePlayer.name} won!!!`);
      activePlayer.score++;
      return over;
    }
  };

  const getBoard = () => board;

  const isOver = () => over;

  const checkForWinner = () => {
    let xcounter = 0;
    let ycounter = 0;
    let zcounter = 0;
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        if (board.getGrid()[i][j].getValue() == activePlayer.token) {
          ycounter++;
          if (ycounter == 3) return true;
        }
      }
      ycounter = 0;
    }
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        if (board.getGrid()[j][i].getValue() == activePlayer.token) {
          xcounter++;
          if (xcounter == 3) return true;
        }
      }
      xcounter = 0;
    }
    for (let i = 0; i < dimension; i++) {
      if (board.getGrid()[i][i].getValue() == activePlayer.token) zcounter++;
    }
    if (zcounter == 3) return true;
    zcounter = 0;
    for (let i = 0; i < dimension; i++) {
      if (
        board.getGrid()[dimension - i - 1][i].getValue() == activePlayer.token
      )
        zcounter++;
    }
    if (zcounter == 3) return true;
    zcounter = 0;
  };

  const checkForTie = () => {
    let tie = true;
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        if (board.getGrid()[i][j].getValue() == 0) {
          tie = false;
        }
      }
    }
    return tie;
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard,
    isOver,
  };
}

function ScreenControler() {
  const game = GameController();
  const grid = document.querySelector(".grid");
  const turn = document.querySelector(".turn");
  const board = game.getBoard();

  const getSign = (value) => {
    switch (value) {
      case 0:
        return "";
      case 1:
        return "x";
      case 2:
        return "o";
    }
  };

  const disableScreen = () => {
    grid.textContent = "";
    const activePlayer = game.getActivePlayer();
    const nextRoundBtn = document.querySelector('.new');

    turn.textContent = `${activePlayer.name} won!!!`;
    updatePlayerDisplay(activePlayer);

    board.getGrid().forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("field");
        cellButton.dataset.column = colIndex;
        cellButton.dataset.row = rowIndex;
        cellButton.textContent = getSign(cell.getValue());
        grid.appendChild(cellButton);
        cellButton.disabled = true;
        nextRoundBtn.style.visibility = "visible";
      });
    });
  };

  const updateScreen = () => {
    grid.textContent = "";
    const activePlayer = game.getActivePlayer();

    turn.textContent = `${activePlayer.name}'s turn...`;

    board.getGrid().forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("field");
        cellButton.dataset.column = colIndex;
        cellButton.dataset.row = rowIndex;
        cellButton.textContent = getSign(cell.getValue());
        grid.appendChild(cellButton);
      });
    });
  };

  function clickHandlerGrid(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;

    if (!selectedColumn || !selectedRow) return;

    const over = game.playRound(selectedRow, selectedColumn);
    if (!over)
      updateScreen();
    else 
      disableScreen();
  }

  const updatePlayerDisplay = (player) => {
    const scoreDiv = document.createElement('p');
    scoreDiv.classList.add('container');
    scoreDiv.textContent = player.score;
    const playerDiv = document.getElementById(`c${player.token}`)
    const previusScore = document.querySelector(`#c${player.token} > .score` );
    playerDiv.removeChild(previusScore);
    playerDiv.appendChild(scoreDiv);
  }

  grid.addEventListener("click", clickHandlerGrid);

  updateScreen();
}

ScreenControler();
