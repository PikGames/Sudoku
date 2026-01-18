// Check if a number can be placed in a specific cell
export const isValid = (board, row, col, num) => {
    // Check row
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) return false;
    }
    // Check column
    for (let x = 0; x < 9; x++) {
        if (board[x][col] === num) return false;
    }
    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) return false;
        }
    }
    return true;
};

// Backtracking algorithm to solve the sudoku
export const solveSudoku = (board) => {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === null) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) return true;
                        board[row][col] = null;
                    }
                }
                return false;
            }
        }
    }
    return true;
};

// Robust Fisher-Yates shuffle
const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        const temp = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temp;
    }

    return array;
};

// Generate a full Sudoku board
export const generateSudoku = () => {
    // Initialize 9x9 board with nulls
    const board = new Array(9).fill(null).map(() => new Array(9).fill(null));

    const fillBoard = (board) => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === null) {
                    // Create a fresh array of numbers 1-9 for this cell
                    const candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    shuffle(candidates);

                    for (const num of candidates) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (fillBoard(board)) return true;
                            board[row][col] = null;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    };

    fillBoard(board);
    return board;
};

// Create a puzzle by removing numbers
export const createPuzzle = (board, difficulty = 'easy') => {
    // Deep copy the board to avoid mutating the solution
    const puzzle = board.map(row => [...row]);

    // Define numbers to remove based on difficulty
    const difficulties = {
        'easy': 1,     // Easier: fewer removed
        'medium': 40,
        'hard': 50,
        'expert': 60,
        'devilMode': 70 // Harder: more removed
    };

    // Default to strict bounds if input is weird, but usually keys match
    const cellsToRemove = difficulties[difficulty] || 30;

    let attempts = 0;
    while (attempts < cellsToRemove) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (puzzle[row][col] !== null) {
            puzzle[row][col] = null;
            attempts++;
        }
    }
    return puzzle;
};