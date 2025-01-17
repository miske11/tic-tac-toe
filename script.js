function Gameboard() {
  let grid = [];
  const dimension = 3;

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

  const drawGrid = () => {
    if (grid != []) {
      grid = [];
    } 
    for (let i = 0; i < dimension; i++) {
      grid[i] = [];
      for (let j = 0; j < dimension; j++) {
        grid[i].push(Cell());
      }
    }
  }

  drawGrid();

  return {
    getGrid,
    playMove,
    printGameboard,
    drawGrid,
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
      id: 1,
    },
    {
      name: playerTwoName,
      token: 2,
      score: 0,
      id: 2,
    },
  ];
  const dimension = 3;
  let activePlayer = players[0];
  let board = Gameboard();
  let round = 0;

  const switchFirstPlayer = () => {
    if (round % 2 == 1) {
      activePlayer = players[0];
    }
    else {
      activePlayer = players[1];
    }
    round++;
  };

  const switchActivePlayer = () => {
    if (activePlayer === players[0]) activePlayer = players[1];
    else activePlayer = players[0];
  };

  const switchTokens = () => {
    let temp = players[0].token;
    players[0].token = players[1].token;
    players[1].token = temp;
    console.log(players); 
  }

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printGameboard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    console.log(`${activePlayer.name} marks the [${row}, ${column}]`);
    const validMove = board.playMove(activePlayer.token, row, column);
    if (validMove) {
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
  }
  };

  const getBoard = () => board;

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
    switchActivePlayer,
    switchTokens,
    checkForTie,
    checkForWinner,
    switchFirstPlayer,
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

    if (!game.checkForWinner() && game.checkForTie()) {
      turn.textContent = `It's a tie.`;
    } else {
      turn.textContent = `${activePlayer.name} won!!!`;
    }
    
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
      });
    });
    nextRoundBtn.style.visibility = "visible";
    nextRoundBtn.addEventListener('click', startNewRound);
  };

  const updateScreen = () => {
    grid.textContent = "";
    const activePlayer = game.getActivePlayer();
    const nextRoundBtn = document.querySelector('.new');

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
    nextRoundBtn.style.visibility = "hidden";
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
    scoreDiv.classList.add('score');
    const playerDiv = document.getElementById(`c${player.id}`);
    const previusScore = document.querySelector(`#c${player.id} > .score` );
    
    playerDiv.removeChild(previusScore);
    playerDiv.appendChild(scoreDiv);
  }

  function startNewRound() {
    const brd = game.getBoard();
    game.switchFirstPlayer();
    game.switchTokens();
    brd.drawGrid();
    updateScreen();
  }

  grid.addEventListener("click", clickHandlerGrid);

  updateScreen();
}

ScreenControler();
