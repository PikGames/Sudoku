import { useEffect, useMemo, useState, useRef } from "react";
import "./App.css";
import { Settings, Moon, Sun } from 'lucide-react';
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
  const [hintsUsed, setHintsUsed] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [bestTimes, setBestTimes] = useState(() => {
    const saved = localStorage.getItem("sudoku-best-times");
    return saved ? JSON.parse(saved) : {};
  });
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [winOrigin, setWinOrigin] = useState(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getHintLimit = (diff) => {
    return (diff === 'easy' || diff === 'medium') ? 5 : (diff === 'devilMode' ? 1 : 3);
  };

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


  const handleReset = () => {
    setBoard(puzzle.map((row) => [...row]));
    setStatus("");
    setSelected(null);
    setGreenCount(0);
    setMistakes(0);
    setHintsUsed(0);
    setTimer(0);
    setIsTimerRunning(true);
    setIsPaused(false);
  };
  const handleNewPuzzle = () => {
    generateNewGame();
  };

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && !isPaused && status !== 'Solved' && status !== 'Game Over') {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isPaused, status]);

  const handleInput = (rowIndex, cellIndex, value) => {
    // Strictly accept only numbers 1-9 or an empty string
    if (value !== "" && !/^[1-9]$/.test(value)) return;

    // Determine correctness
    const numVal = parseInt(value);
    const isCorrect = !value || numVal === solution[rowIndex][cellIndex];

    if (value && !isCorrect) {
      const newMistakes = mistakes + 1;
      const limit = (difficulty === 'easy' || difficulty === 'medium') ? 5 : (difficulty === 'devilMode' ? 1 : 3);

      if (newMistakes >= limit) {
        setMistakes(limit);
        setStatus("Game Over");
        setIsTimerRunning(false);
        setTimeout(() => {
          alert("Game Over! You reached the mistake limit.");
          handleReset(); // Or generateNewGame() if preferred, but user said "reset"
        }, 100);
        return;
      }
      setMistakes(newMistakes);
    }

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

  // to handle the global Numberpad (Standard Click / Tap)
  const handleNumberClick = (num) => {
    if (selectedNumber === num) {
      // Deactivate if clicking the same number that is being highlighted
      setSelectedNumber(null);
    } else if (selected && puzzle[selected[0]][selected[1]] === null) {
      // Input into selected cell
      handleInput(selected[0], selected[1], num.toString());
      setSelectedNumber(null);
    }
  };

  // to handle the global Numberpad (Long Press: Highlight occurrences)
  const handleNumberLongPress = (num) => {
    setSelectedNumber(num);
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
        setIsTimerRunning(false);

        // Check Best Time
        const currentBest = bestTimes[difficulty];
        if (currentBest === undefined || timer < currentBest) {
          const newBestTimes = { ...bestTimes, [difficulty]: timer };
          setBestTimes(newBestTimes);
          localStorage.setItem("sudoku-best-times", JSON.stringify(newBestTimes));
        }

        setWinOrigin(selected || [4, 4]); // Use selected or center as fallback
      }
    } else if (status === 'Solved') {
      setStatus("");
      setWinOrigin(null);
    }
  }, [board, solution, timer, bestTimes, difficulty, status, selected]);

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
    setStatus("");
    setSelected(null);
    setGreenCount(0);
    setSelectedNumber(null);
    setHintsUsed(0);
    setMistakes(0);
    setTimer(0);
    setIsTimerRunning(true);
    setWinOrigin(null);
  };

  // FEATURE: Gameplay Action Handlers
  const handleErase = () => {
    if (selected && puzzle[selected[0]][selected[1]] === null) {
      handleInput(selected[0], selected[1], "");
    }
  };

  const handleHint = () => {
    const hintLimit = getHintLimit(difficulty);
    if (hintsUsed >= hintLimit) return;

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

    setHintsUsed(prev => prev + 1);
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

  const handlePause = () => {
    setIsPaused(true);
    setIsTimerRunning(false);
  };

  const handleResume = () => {
    setIsPaused(false);
    setIsTimerRunning(true);
  };
  return (
    <>
      <div style={{ textAlign: "center", position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }} ref={gameContainerRef}>
        <div className="game-header-top">
          <h1>Sudoku</h1>
          <button className="btn-settings" onClick={() => setShowSettings(!showSettings)}>
            <Settings size={28} />
          </button>
          {showSettings && (
            <div className="settings-popup">
              <div className="setting-item">
                <span className="setting-label">Difficulty</span>
                <select
                  value={difficulty}
                  onChange={(e) => {
                    setDifficulty(e.target.value);
                    setShowSettings(false);
                  }}
                  className="difficulty-select"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
                  <option value="devilMode">Devil Mode</option>
                </select>
              </div>
              <div className="setting-item">
                <span className="setting-label">Theme</span>
                <button onClick={toggleTheme} className='btn-theme-toggle'>
                  {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="game-info-bar">
          <div className="info-item left">
            {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <div className="info-item center">
            Mistakes: {mistakes}/{(difficulty === 'easy' || difficulty === 'medium') ? 5 : (difficulty === 'devilMode' ? 1 : 3)}
          </div>
          <div className="info-item right">
            <div className="timer-container">
              <div className="timer">{formatTime(timer)}</div>
              <div className="btn-pause" onClick={handlePause} title="Pause Game">
                ⏸
              </div>
            </div>
            <div className="best-time">Best: {bestTimes[difficulty] ? formatTime(bestTimes[difficulty]) : '--:--'}</div>
          </div>
        </div>
        {isPaused && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Pause</h2>
              <div className="modal-stats">
                <div className="stat-box">
                  <span>Time</span>
                  <strong>{formatTime(timer)}</strong>
                </div>
                <div className="stat-box">
                  <span>Mistakes</span>
                  <strong>{mistakes}/{(difficulty === 'easy' || difficulty === 'medium') ? 5 : (difficulty === 'devilMode' ? 1 : 3)}</strong>
                </div>
                <div className="stat-box">
                  <span>Difficulty</span>
                  <strong style={{ textTransform: 'capitalize' }}>{difficulty}</strong>
                </div>
              </div>
              <button className="btn-resume" onClick={handleResume}>Resume Game</button>
            </div>
          </div>
        )}
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
          winOrigin={winOrigin}
          status={status}
        />
        <Controls
          handleReset={handleReset}
          handleNewPuzzle={handleNewPuzzle}
          handleNumberClick={handleNumberClick}
          handleNumberLongPress={handleNumberLongPress}
          selectedNumber={selectedNumber}
          finishedNumbers={finishedNumbers}
          handleHint={handleHint}
          hintsUsed={hintsUsed}
          difficulty={difficulty}
          handleErase={handleErase}
        />
        {status && <h2 className="status">{status}</h2>}
      </div>
    </>
  );
}

export default App;
