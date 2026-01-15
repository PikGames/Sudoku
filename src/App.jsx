import { useEffect, useMemo, useState, useRef } from "react";
import "./App.css";
import Grid from "./components/Grid";
import Controls from "./components/Controls";
import { generateSudoku, createPuzzle } from "./utils/sudoku";

function App() {
  //This is the game state Initilazation that we maintain the board, static puzzle and the hidden solution separated
  const [board, setBoard] = useState(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(null))
  );
  const [puzzle, setPuzzle] = useState(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(null))
  );

  const [solution, setSolution] = useState(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(null))
  );

  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");
  const [greenCount, setGreenCount] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem("sudoku-theme") || "light");
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [hintUsed, setHintUsed] = useState(false);

  //to save the theme
  useEffect(() => {
    localStorage.setItem("sudoku-theme", theme);
    document.body.className = theme;
  }, [theme]);

  //for the difficulty
  useEffect(() => {
    generateNewGame();
  }, [difficulty]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const handleCheck = () => {
    const sudokuBoard = board.flat();
    const sudokuSolution = solution.flat();

    if (sudokuBoard.every((cell, i) => cell === sudokuSolution[i])) {
      setStatus('Solved');

      let count = 0;
      const totalCells = 81;
      const interval = setInterval(() => {
        count++;
        setGreenCount(count);
        if (count === totalCells) clearInterval(interval);
      }, 30)
    } else {
      setStatus('Incorrect')
      setGreenCount(0)
    }
  };
  const handleReset = () => {
    setBoard(puzzle.map((row) => [...row]));
    setStatus("");
    setSelected(null);
    setGreenCount(0);
  };
  const handleNewPuzzle = () => {
    generateNewGame();
  };

  const handleInput = (rowIndex, cellIndex, value) => {
    if (value === "" || (value >= 1 && value <= 9)) {
      setBoard((prev) =>
        prev.map((row, r) =>
          row.map((cell, c) => {
            if (r === rowIndex && c === cellIndex) {
              return value ? parseInt(value) : null;
            }

            return cell;
          })
        )
      );
    }
  };

  // to Calculate finished numbers that appear 9 times correctly
  const finishedNumbers = useMemo(() => {
    const counts = Array(10).fill(0);
    board.flat().forEach((cell, i) => {
      if (cell !== null && cell === solution.flat()[i]) {
        counts[cell]++;
      }
    });
    return counts.map((count, num) => count === 9).slice(1);
  }, [board, solution]);

  // to handle the global Numberpad (Short Press: Input)
  const handleNumberClick = (num) => {
    if (selected && puzzle[selected[0]][selected[1]] === null) {
      handleInput(selected[0], selected[1], num.toString());
      setSelectedNumber(null); // Deselect after input as requested
    }
  };

  // to handle the global Numberpad (Long Press: Highlight)
  const handleNumberLongPress = (num) => {
    setSelectedNumber(prev => (prev === num ? null : num));
  };

  // This monitors the board and instantly detects when the game is won.
  useEffect(() => {
    // Check if board is full and correct
    const sudokuBoard = board.flat();
    const sudokuSolution = solution.flat();

    // Check if there are no null values and all cells match the solution
    const isFull = !sudokuBoard.includes(null);
    if (isFull && sudokuBoard.every((cell, i) => cell === sudokuSolution[i])) {
      if (status !== 'Solved') {
        setStatus('Solved');

        // this will triggers a green-fill animation over the grid.
        let count = 0;
        const totalCells = 81;
        const interval = setInterval(() => {
          count++;
          setGreenCount(count);
          if (count === totalCells) clearInterval(interval);
        }, 30);
      }
    } else if (status === 'Solved') {
      // If they were in solved state but changed something (shouldn't happen with prefilled, but for robustness)
      setStatus("");
      setGreenCount(0);
    }
  }, [board, solution]);

  // Handle click outside to deselect
  const gameContainerRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (gameContainerRef.current && !gameContainerRef.current.contains(event.target)) {
        setSelected(null);
        setSelectedNumber(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside); // Support mobile touch too
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  //generating a new game 
  const generateNewGame = () => {
    const fullBoard = generateSudoku();
    const playablePuzzle = createPuzzle(fullBoard, difficulty);

    setSolution(fullBoard);
    setPuzzle(playablePuzzle);
    setBoard(playablePuzzle.map(row => [...row]));
    setStatus("");
    setSelected(null);
    setGreenCount(0);
    setSelectedNumber(null);
    setHintUsed(false);
  };

  // FEATURE: Gameplay Action Handlers
  const handleErase = () => {
    if (selected && puzzle[selected[0]][selected[1]] === null) {
      handleInput(selected[0], selected[1], "");
    }
  };

  const handleHint = () => {
    if (hintUsed) return;

    // Find all empty or incorrect cells
    const emptyCells = [];
    board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === null) {
          emptyCells.push({ rowIndex, cellIndex });
        }
      });
    });

    if (emptyCells.length === 0) return;

    // Pick a random empty cell
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { rowIndex, cellIndex } = emptyCells[randomIndex];

    // Fill it with the correct value
    const correctValue = solution[rowIndex][cellIndex];

    setBoard(prev => prev.map((row, r) =>
      row.map((cell, c) => (r === rowIndex && c === cellIndex ? correctValue : cell))
    ));

    setHintUsed(true);
  };

  const handleCellClick = (rowIndex, cellIndex) => {
    // If a number is selected (Paint Mode) and the cell is editable
    if (selectedNumber !== null && puzzle[rowIndex][cellIndex] === null) {
      handleInput(rowIndex, cellIndex, selectedNumber.toString());
    } else {
      // Otherwise, standard select
      setSelected([rowIndex, cellIndex]);
    }
  };
  return (
    <>
      <div style={{ textAlign: "center" }} ref={gameContainerRef}>
        <h1>Sudoku</h1>
        <Grid
          board={board}
          puzzle={puzzle}
          selected={selected}
          setSelected={setSelected}
          handleInput={handleInput}
          greenCount={greenCount}
          selectedNumber={selectedNumber}
          solution={solution}
          handleCellClick={handleCellClick}
        />
        <Controls
          handleCheck={handleCheck}
          handleReset={handleReset}
          handleNewPuzzle={handleNewPuzzle}
          theme={theme}
          toggleTheme={toggleTheme}
          finishedNumbers={finishedNumbers}
          selectedNumber={selectedNumber}
          handleNumberClick={handleNumberClick}
          handleNumberLongPress={handleNumberLongPress}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          handleHint={handleHint}
          hintUsed={hintUsed}
          handleErase={handleErase}
        />
        {status && <h2 className="status">{status}</h2>}
      </div>
    </>
  );
}

export default App;
