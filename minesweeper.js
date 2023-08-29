const readline = require("readline");

class MinesweeperGame {
	constructor() {
		this.rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		this.rl.setMaxListeners(20);
		this.board = [];
		this.size = 0;
		this.numMines = 0;
		this.mines = new Set();
		this.uncovered = new Set();
	}

	start() {
		console.log("Welcome to Minesweeper!");
		this.promptGridSize();
	}

	promptGridSize() {
		this.rl.question(
			"Enter the size of the grid (e.g., 4 for a 4x4 grid): ",
			(size) => {
				size = parseInt(size);
				if (isNaN(size) || size < 3 || size > 10) {
					console.log(
						"Incorrect input. Please enter a number between 3 and 10."
					);
					this.promptGridSize();
				} else {
					this.size = size;
					this.promptNumMines();
				}
			}
		);
	}

	promptNumMines() {
		const maxMines = Math.floor(this.size * this.size * 0.35);
		this.rl.question(
			`Enter the number of mines to place on the grid (maximum is ${maxMines}): `,
			(numMines) => {
				numMines = parseInt(numMines);
				if (isNaN(numMines) || numMines < 1 || numMines > maxMines) {
					console.log(
						`Incorrect input. Please enter a number between 1 and ${maxMines}.`
					);
					this.promptNumMines();
				} else {
					this.numMines = numMines;
					this.initBoard();
					this.generateMines();
					this.displayBoard();
					this.playGame();
				}
			}
		);
	}

	initBoard() {
		for (let i = 0; i < this.size; i++) {
			this.board.push(Array(this.size).fill(" "));
		}
	}

	generateMines() {
		while (this.mines.size < this.numMines) {
			const x = Math.floor(Math.random() * this.size);
			const y = Math.floor(Math.random() * this.size);
			this.mines.add(`${x}-${y}`);
		}
	}

	displayBoard() {
		console.log(
			"  " + [...Array(this.size).keys()].map((i) => i + 1).join(" ")
		);
		for (let i = 0; i < this.size; i++) {
			console.log(String.fromCharCode(65 + i) + " " + this.board[i].join(" "));
		}
	}

	playGame() {
		this.rl.question("Select a square to reveal (e.g., A1): ", (input) => {
			if (this.isValidInput(input)) {
				const [x, y] = this.getPositionFromInput(input);
				if (this.mines.has(`${x}-${y}`)) {
					this.endGame(false);
				} else {
					this.uncoverSquare(x, y);
					this.displayBoard();
					if (this.isGameWon()) {
						this.endGame(true);
					} else {
						this.playGame();
					}
				}
			} else {
				console.log("Incorrect input. Please enter a valid square (e.g., A1).");
				this.playGame();
			}
		});
	}

	isValidInput(input) {
		return /^[A-Ja-j]([1-9]|10)$/.test(input);
	}

	getPositionFromInput(input) {
		const col = input.slice(1) - 1;
		const row = input[0].toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
		return [row, col];
	}

	uncoverSquare(row, col) {
		if (this.uncovered.has(`${row}-${col}`)) {
			return;
		}

		this.uncovered.add(`${row}-${col}`);
		const adjacentMines = this.countAdjacentMines(row, col);
		this.board[row][col] = adjacentMines === 0 ? " " : adjacentMines.toString();

		if (adjacentMines === 0) {
			for (let dr = -1; dr <= 1; dr++) {
				for (let dc = -1; dc <= 1; dc++) {
					const newRow = row + dr;
					const newCol = col + dc;
					if (this.isValidPosition(newRow, newCol)) {
						this.uncoverSquare(newRow, newCol);
					}
				}
			}
		}
	}

	countAdjacentMines(row, col) {
		let count = 0;
		for (let dr = -1; dr <= 1; dr++) {
			for (let dc = -1; dc <= 1; dc++) {
				const newRow = row + dr;
				const newCol = col + dc;
				if (
					this.isValidPosition(newRow, newCol) &&
					this.mines.has(`${newRow}-${newCol}`)
				) {
					count++;
				}
			}
		}
		return count;
	}

	isValidPosition(row, col) {
		return row >= 0 && row < this.size && col >= 0 && col < this.size;
	}

	isGameWon() {
		const totalCells = this.size * this.size;
		const uncoveredCells = this.uncovered.size;
		return uncoveredCells + this.numMines === totalCells;
	}

	endGame(isWinner) {
		if (isWinner) {
			console.log("Congratulations, you have won the game!");
		} else {
			console.log("Oh no, you detonated a mine! Game over.");
		}
		this.rl.close();
	}
}

const game = new MinesweeperGame();
game.start();

module.exports = MinesweeperGame;
