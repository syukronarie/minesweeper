const MinesweeperGame = require("./minesweeper"); // Import your MinesweeperGame class

describe("MinesweeperGame", () => {
	let game;
	let rlQuestionMock;
	let rlCloseMock;
	let consoleLogSpy;

	beforeEach(() => {
		rlQuestionMock = jest.fn();
		rlCloseMock = jest.fn();
		consoleLogSpy = jest.spyOn(console, "log");

		game = new MinesweeperGame();

		// Mock readline.createInterface
		game.rl = {
			question: rlQuestionMock,
			close: rlCloseMock,
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("displayBoard", () => {
		it("should display the board correctly", () => {
			game.size = 3;
			game.board = [
				["1", "2", "3"],
				["A", "1", "2"],
				["B", "A", "B"],
			];

			const consoleLogSpy = jest.spyOn(console, "log");

			game.displayBoard();

			expect(consoleLogSpy).toHaveBeenCalledTimes(4);
			expect(consoleLogSpy).toHaveBeenNthCalledWith(1, "  1 2 3");
			expect(consoleLogSpy).toHaveBeenNthCalledWith(2, "A 1 2 3");
			expect(consoleLogSpy).toHaveBeenNthCalledWith(3, "B A 1 2");
			expect(consoleLogSpy).toHaveBeenNthCalledWith(4, "C B A B");
		});
	});

	describe("playGame", () => {
		it("should handle a valid input", () => {
			const validInput = "A1";
			const [x, y] = game.getPositionFromInput(validInput);
			game.mines = new Set();
			game.mines.add(`${x}-${y}`);

			rlQuestionMock.mockImplementationOnce((question, callback) => {
				callback(validInput);
			});

			game.playGame();

			expect(consoleLogSpy).toHaveBeenCalledWith(
				"Oh no, you detonated a mine! Game over."
			);
			expect(rlCloseMock).toHaveBeenCalled();
		});

		it("should handle an invalid input", () => {
			const invalidInput = "X12";

			rlQuestionMock.mockImplementationOnce((question, callback) => {
				callback(invalidInput);
			});

			game.playGame();

			expect(consoleLogSpy).toHaveBeenCalledWith(
				"Incorrect input. Please enter a valid square (e.g., A1)."
			);
			expect(rlQuestionMock).toHaveBeenCalledTimes(2); // Prompted again for valid input
		});
	});

	describe("isValidInput", () => {
		// Validating User Input
		it("should validate input correctly", () => {
			// Test valid input
			expect(game.isValidInput("A1")).toBe(true);
			expect(game.isValidInput("B4")).toBe(true);
			expect(game.isValidInput("C2")).toBe(true);

			// Test invalid input
			expect(game.isValidInput("X5")).toBe(false);
			expect(game.isValidInput("123")).toBe(false);
		});

		// Testing Input Validation
		it("should handle incorrect input format", () => {
			// Test input with incorrect format (e.g., Z9, 1234)
			expect(game.isValidInput("Z9")).toBe(false);
			expect(game.isValidInput("1234")).toBe(false);
		});

		// Invalid input below the minimum allowed (e.g., "0")
		it("should handle invalid input below the minimum allowed", () => {
			// Simulate user input
			const mockQuestion = jest.fn();
			const invalidNumMines = 0;

			game.rl.question = mockQuestion;
			mockQuestion.mockImplementationOnce((question, callback) => {
				callback(invalidNumMines.toString());
			});

			// Call the method
			game.promptNumMines();

			// Check if the method prompts for valid input again
			expect(mockQuestion).toHaveBeenCalledTimes(2); // Prompted again for valid input
		});

		// Invalid input above the maximum allowed (e.g., "100")
		it("should handle invalid input above the maximum allowed", () => {
			// Simulate user input
			const mockQuestion = jest.fn();
			const maxMines = Math.floor(game.size * game.size * 0.35);
			const invalidNumMines = maxMines + 1;

			game.rl.question = mockQuestion;
			mockQuestion.mockImplementationOnce((question, callback) => {
				callback(invalidNumMines.toString());
			});

			// Call the method
			game.promptNumMines();

			// Check if the method prompts for valid input again
			expect(mockQuestion).toHaveBeenCalledTimes(2); // Prompted again for valid input
		});

		it("should handle input outside of grid size", () => {
			// Test input outside of grid size (e.g., A11 for 10x10 grid)
			expect(game.isValidInput("A11")).toBe(false);
		});
	});

	describe("generateMines", () => {
		// Scenario 2: Generating Mines
		it("should generate the correct number of mines", () => {
			// Generate mines for a 4x4 grid with 3 mines
			game.size = 4;
			game.numMines = 3;
			game.generateMines();

			// Ensure the number of mines generated is 3
			expect(game.mines.size).toBe(3);
		});

		// Testing Mines Generation
		it("should generate mines within the grid", () => {
			game.size = 4;
			game.numMines = 5; // Test with more mines than grid cells
			game.generateMines();

			// Check if all generated mines are within the grid
			for (const mine of game.mines) {
				const [x, y] = mine.split("-").map(Number);
				expect(x >= 0 && x < game.size && y >= 0 && y < game.size).toBe(true);
			}
		});
	});

	describe("uncoverSquare", () => {
		// Uncovering Squares
		it("should uncover squares correctly", () => {
			// Set up the board
			game.size = 3;
			game.initBoard();
			game.mines = new Set(["0-0", "1-1"]); // Mines at (0,0) and (1,1)

			// Uncover a square with no adjacent mines (e.g., B3)
			game.uncoverSquare(1, 3);

			// Check that the square was uncovered and contains ' '
			expect(game.board[1][3]).toBe(" ");

			// Uncover a square with adjacent mines (e.g., A2)
			game.uncoverSquare(0, 1);

			// Check that the square was uncovered and contains '2' (adjacent mines)
			expect(game.board[0][1]).toBe("2");
		});
	});

	describe("isGameWon", () => {
		// Game Win
		it("should detect a win when all non-mine squares are uncovered", () => {
			game.size = 2;
			game.initBoard();
			game.numMines = 0; // No mines for simplicity

			// Manually uncover all non-mine squares
			game.uncoverSquare(0, 0);
			game.uncoverSquare(0, 1);
			game.uncoverSquare(1, 0);
			game.uncoverSquare(1, 1);

			// Check if the game is won
			expect(game.isGameWon()).toBe(true);
		});

		// Testing Game Over
		it("should end the game when a mine is uncovered", () => {
			game.size = 3;
			game.initBoard();
			game.mines = new Set(["0-0"]); // Mine at (0,0)

			// Uncover a mine
			game.uncoverSquare(0, 0);

			// Check if the game is over
			expect(game.isGameWon()).toBe(false);
		});
	});

	describe("endGame", () => {
		// Game Over
		it("should detect a game over when a mine is uncovered", () => {
			game.size = 2;
			game.initBoard();
			game.mines = new Set(["0-0"]); // Mine at (0,0)

			// Uncover a mine
			game.uncoverSquare(0, 0);

			// Check if the game is over
			expect(game.isGameWon()).toBe(false);
		});

		// Testing Game Initialization
		it("should initialize game properties correctly", () => {
			// Ensure initial game properties are set correctly
			expect(game.size).toBe(0);
			expect(game.numMines).toBe(0);
			expect(game.mines.size).toBe(0);
			expect(game.uncovered.size).toBe(0);
			expect(game.board.length).toBe(0);
		});

		// Testing Game Restart
		it("should restart the game after it ends", () => {
			// Simulate a game over
			game.endGame(false);

			// Check if the game properties are reset
			expect(game.size).toBe(0);
			expect(game.numMines).toBe(0);
			expect(game.mines.size).toBe(0);
			expect(game.uncovered.size).toBe(0);
			expect(game.board.length).toBe(0);
		});
	});

	describe("promptGridSize", () => {
		// Invalid input (e.g., "11" which is above the maximum size)
		it("should handle invalid input above the maximum size", () => {
			// Simulate user input
			const mockQuestion = jest.fn();
			const invalidSize = 11;

			game.rl.question = mockQuestion;
			mockQuestion.mockImplementationOnce((question, callback) => {
				callback(invalidSize.toString());
			});

			// Call the method
			game.promptGridSize();

			// Check if an error message is printed and the method is called again
			expect(consoleLogSpy).toHaveBeenCalledWith(
				"Incorrect input. Please enter a number between 3 and 10."
			);
			expect(game.rl.question).toHaveBeenCalledTimes(2); // Prompted again for valid input
		});

		// Valid input within the range (e.g., "4" for a 4x4 grid)
		it("should set the size when valid input is provided", () => {
			// Simulate user input
			const mockQuestion = jest.fn();
			const mockSize = 4;

			game.rl.question = mockQuestion;
			mockQuestion.mockImplementationOnce((question, callback) => {
				callback(mockSize.toString());
			});

			// Call the method
			game.promptGridSize();

			// Check if the size property is set correctly
			expect(game.size).toBe(mockSize);
		});
	});

	describe("promptNumMines", () => {
		//  Invalid input (e.g., "2" which is below the minimum size)
		it("should handle invalid input below the minimum size", () => {
			// Simulate user input
			const mockQuestion = jest.fn();
			const invalidSize = 2;

			game.rl.question = mockQuestion;
			mockQuestion.mockImplementationOnce((question, callback) => {
				callback(invalidSize.toString());
			});

			// Call the method
			game.promptGridSize();

			// Check if an error message is printed and the method is called again
			expect(consoleLogSpy).toHaveBeenCalledWith(
				"Incorrect input. Please enter a number between 3 and 10."
			);
			expect(game.rl.question).toHaveBeenCalledTimes(2); // Prompted again for valid input
		});
	});
});
