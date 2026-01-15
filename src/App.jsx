import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Grid from "./components/Grid";
import Controls from "./components/Controls";

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

  //to save the theme
  useEffect(() => {
    localStorage.setItem("sudoku-theme", theme);
    document.body.className = theme;
  }, [theme]);
  
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
  const handleNamePuzzle = () => {
    setGreenCount(0)
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

    // to handle the global Numberpad
    const handleNumberButtonClick = (num) => {
      if (selectedNumber === num) {
        setSelectedNumber(null);
      } else {
        setSelectedNumber(num);
        if (selected && puzzle[selected[0]][selected[1]] === null) {
          handleInput(selected[0], selected[1], num.toString());
        }
      }
    };

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>Sudoku</h1>
        <Grid
          board={board}
          puzzle={puzzle}
          selected={selected}
          setSelected={setSelected}
          handleInput={handleInput}
          greenCount={greenCount}
          selectedNumber={selectedNumber}
        />
        <Controls
          handleCheck={handleCheck}
          handleReset={handleReset}
          handleNamePuzzle={handleNamePuzzle}
          theme={theme}
          toggleTheme={toggleTheme}
          finishedNumbers={finishedNumbers}
          selectedNumber={selectedNumber}
          handleNumberButtonClick={ handleNumberButtonClick}
        />
        {status && <h2 className="status">{status}</h2>}
      </div>
    </>
  );
}

export default App;
