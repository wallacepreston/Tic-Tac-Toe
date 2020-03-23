let gameState = {};

const resetState = () => {
  gameState.board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  gameState.winner = null;
  gameState.currentPlayer = 'X';
  gameState.turnCount = 0;
};

const checkBoard = () => {
  const combinations = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
  ];
  let winner = null;
  combinations.find(combination => {
    const players = {X: 0, O: 0};
    combination.find(coordinates => {
      const [y, x] = coordinates;
      const mark = gameState.board[y][x];
      if(mark){
        players[mark]++;
      }
    })
    for(const player in players) {
      console.log('player', player);
      console.log('player score',  players[player]);
      if(players[player] === 3) {
        winner = player;
        return true
      }
    }
  })
  return winner;
}

const changeTurn = () => {
  gameState.winner = checkBoard();
  if (!gameState.winner) gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
}

const renderBoard = () => {
  const boardElem = $('#board');
  boardElem.empty();
  for(let y=0; y<gameState.board.length; ++y){
      const row = gameState.board[y];
      // create a jquery row
      for(let x=0; x<row.length; ++x){
          let column = row[x];
          // create a jquery column
          const cellElem = $(`<div class="cell">${gameState.board[y][x]}</div>`)
          cellElem.data('coordinates', [y, x]);
          // append the cell
          boardElem.append(cellElem);
      }
  }
}

const renderPlayer = () => {
  const playerTurnDiv = $('#player-turn');
  let text;
  if (gameState.winner){
    text = `<span class="player"> ${gameState.currentPlayer} has won!</span>`
  } else if(gameState.turnCount >= 9) {
    text = `<span class="player"> It's a draw! </span>`
  } else {
    text = `It's currently <span class="player"> player ${gameState.currentPlayer}</span>'s turn`
  }
  playerTurnDiv.html(text);
  if (gameState.winner || gameState.turnCount >= 9) playerTurnDiv.append(`<button class="restart">Play Again!</button>`)
}

const takeTurn = (coordinates) => {
  const [xCoord, yCoord] = coordinates;
  gameState.board[xCoord][yCoord] = gameState.currentPlayer;
  gameState.turnCount++;
  changeTurn();
  renderPlayer();
}


$('#board').on('click', '.cell', function({target}){
  const targetElem = $(target);
  const [y, x] = targetElem.data('coordinates')
  if (gameState.board[y][x] || gameState.winner) return;
  takeTurn([y, x]);
  renderBoard();
});

$('#player-turn').on('click', '.restart', function(){
  console.log('restarting')
  resetState();
  renderBoard();
  renderPlayer();
})

resetState()
renderBoard();
renderPlayer();
