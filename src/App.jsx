import { useEffect, useState } from "react";
import "./App.css";
import Grid from "./components/Grid";
import Controls from "./components/Controls";

function App() {
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

  const [theme, setTheme] = useState(localStorage.getItem("sudoku-theme") || "light");

  useEffect(() => {
    localStorage.setItem("sudoku-theme", theme);
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
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
        />
        <Controls
          handleCheck={handleCheck}
          handleReset={handleReset}
          handleNamePuzzle={handleNamePuzzle}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        {status && <h2 className="status">{status}</h2>}
      </div>
    </>
  );
}

export default App;
