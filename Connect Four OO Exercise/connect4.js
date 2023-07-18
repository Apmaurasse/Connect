class Player {
  constructor(playerNumber) {
    this.playerNumber = playerNumber;
    this.colorInput = document.getElementById(`player${playerNumber}-color`);
    this.color = this.colorInput.value || 'red';
  }
}

class Game {
  constructor() {
    this.WIDTH = 7;
    this.HEIGHT = 6;
    this.currPlayer = null; // active player object
    this.board = []; // array of rows, each row is array of cells (board[y][x])
    this.boardElement = document.getElementById('board');
    this.columnTopElement = null;
    this.startButton = null;
    this.gameOver = false;
    this.player1 = null;
    this.player2 = null;

    this.handleClick = this.handleClick.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  makeHtmlBoard() {
    this.columnTopElement = document.createElement('tr');
    this.columnTopElement.setAttribute('id', 'column-top');
    this.columnTopElement.addEventListener('click', this.handleClick);

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      this.columnTopElement.append(headCell);
    }

    this.boardElement.append(this.columnTopElement);

    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      this.boardElement.append(row);
    }

    this.startButton = document.createElement('button');
    this.startButton.textContent = 'Start Game';
    this.startButton.addEventListener('click', this.startGame);
    this.boardElement.after(this.startButton);

    const form = document.createElement('form');
    form.innerHTML = `
      <label for="player1-color">Player 1 Color:</label>
      <input type="text" id="player1-color" name="player1-color" value="red">
      <br>
      <label for="player2-color">Player 2 Color:</label>
      <input type="text" id="player2-color" name="player2-color" value="blue">
    `;
    this.startButton.after(form);
  }

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer.playerNumber}`);
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
  }

  handleClick(evt) {
    if (this.gameOver) {
      return;
    }

    const x = +evt.target.id;
    const y = this.findSpotForCol(x);

    if (y === null) {
      return;
    }

    this.board[y][x] = this.currPlayer.playerNumber;
    this.placeInTable(y, x);

    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`Player ${this.currPlayer.playerNumber} won!`);
    }

    if (this.board.every(row => row.every(cell => cell))) {
      this.gameOver = true;
      return this.endGame('Tie!');
    }

    this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
  }

  checkForWin() {
    const _win = cells => {
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer.playerNumber
      );
    };

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }

    return false;
  }

  startGame() {
    // Clear the board and reset the game state
    this.board = [];
    this.gameOver = false;

    // Remove all pieces from the board
    const pieces = document.getElementsByClassName('piece');
    while (pieces.length > 0) {
      pieces[0].parentNode.removeChild(pieces[0]);
    }

    // Create player instances and choose their colors
    this.player1 = new Player(1);
    this.player2 = new Player(2);

    // Set the current player to player 1
    this.currPlayer = this.player1;

    // Create a new board and start the game
    this.makeBoard();
  }

  start() {
    this.makeBoard();
    this.makeHtmlBoard();
  }
}

const game = new Game();
game.start();



