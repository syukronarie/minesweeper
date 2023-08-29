# Minesweeper App Documentation

**Author:** Arie Syukron, <syukronarie@gamil.com>

## Description

This document provides detailed instructions and information about the Minesweeper app implementation. It covers the design and assumptions of the app, step-by-step instructions for running the application, and compatibility with different environments.

## Design and Assumptions

- **Implementation Language:** JavaScript (Node.js)
- **User Interaction:** Command-line interface (CLI)
- **User Input Handling:** Utilizes the `readline` module for user input and display.
- **Grid Size and Mines:** Users can specify the grid size (3x3 to 10x10) and the number of mines (up to 35% of total cells).
- **Mine Placement:** Mines are randomly placed on the grid.
- **Gameplay:** Users interact by entering coordinates (e.g., A1) to uncover squares.
- **Game Completion:** The game ends when a mine is uncovered or when all non-mine squares are revealed.
- **Testing:** Unit tests are performed using the Jest framework.

## Instructions to Run the Application

**Environment Required:** Node.js (JavaScript runtime)

**Steps:**

1. Make sure you have Node.js installed on your system. If not, you can download it from the official website: [Node.js Download](https://nodejs.org/)

2. Create a directory for your Minesweeper game project.

3. Inside the project directory, create two files: `minesweeper.js` and `minesweeper.spec.js`.

4. Copy the provided code for `minesweeper.js` into the `minesweeper.js` file.

5. Copy the provided code for `minesweeper.spec.js` into the `minesweeper.spec.js` file.

6. Create a `package.json` file in the project directory with the following content:

   ```json
   {
   	"name": "minesweeper",
   	"version": "1.0.0",
   	"description": "a program that simulates a Minesweeper game on a square grid",
   	"main": "minesweeper.js",
   	"scripts": {
   		"test": "jest --detectOpenHandles",
   		"cover": "jest --coverage --detectOpenHandles"
   	},
   	"dependencies": {
   		"jest": "^29.6.4"
   	},
   	"keywords": ["minesweeper", "javascript", "jest"],
   	"author": "Arie Syukron <syukronarie@gmail.com>",
   	"license": "ISC"
   }
   ```

7. Open your terminal or command prompt and navigate to the project directory.

8. **Install Dependencies:** Run the following command to install the required dependencies (Jest):

```bash
npm install
```

9. **Run the Game:** After the dependencies are installed, you can run the Minesweeper game by executing the following command:

```bash
node minesweeper.js
```

10. **Play the Game:** Follow the on-screen instructions to play the game. You will be prompted to enter the size of the grid and the number of mines. Then, you can enter coordinates to uncover squares and play the game.

11. **Run Unit Tests:** To run the unit tests, use the following command:

```bash
npm test
```

### Generate Test Coverage Reports

To generate test coverage reports, use the following command:

```bash
npm run cover
```

After running the above command, the test coverage reports will be generated and saved in a directory named `coverage` within your project folder.

To view the coverage reports, follow these steps:

1. Open a file explorer or terminal and navigate to your Minesweeper project folder.

2. Inside the project folder, you'll find a directory named `coverage`. This directory contains the coverage reports.

3. Open the `index.html` file located in the `coverage` directory using your preferred web browser.

   Example (in the terminal):

   ```bash
   cd /path/to/your/minesweeper/project/coverage
   open index.html  # On macOS
   ```

4. The coverage report will open in your web browser, displaying detailed information about the code coverage of your Minesweeper application. You can explore the coverage statistics and code highlights to assess the quality of your tests.

**Environment Compatibility:** The Minesweeper app can be run on various operating systems, including Windows, Linux, and macOS, as it is a JavaScript (Node.js) application that is platform-independent.

That's it! You can now enjoy playing the Minesweeper app and run tests to ensure the correctness of the code. If you have any questions or encounter any issues, please feel free to reach out me for assistance.

```

```
