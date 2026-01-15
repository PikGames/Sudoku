import { generateSudoku, solveSudoku, isValid, createPuzzle } from './sudoku.js';

function test() {
    console.log("Testing Sudoku utilities...");

    // Test generation
    const fullBoard = generateSudoku();
    console.log("Generated Board:");
    console.table(fullBoard);

    // Verify full board validity
    let isFullBoardValid = true;
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const val = fullBoard[r][c];
            fullBoard[r][c] = null;
            if (!isValid(fullBoard, r, c, val)) {
                isFullBoardValid = false;
            }
            fullBoard[r][c] = val;
        }
    }
    console.log("Is full board valid?", isFullBoardValid);

    // Test puzzle creation
    const puzzle = createPuzzle(fullBoard, 'medium');
    console.log("Puzzle (Medium):");
    console.table(puzzle);

    const emptyCells = puzzle.flat().filter(c => c === null).length;
    console.log(`Empty cells: ${emptyCells}`);

    // Test solver
    const solved = solveSudoku(puzzle);
    console.log("Solved Puzzle:");
    console.table(puzzle);
    console.log("Solver succeeded?", solved);
}

test();