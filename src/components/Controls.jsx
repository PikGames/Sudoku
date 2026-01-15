import classNames from 'classnames';
import { Moon, Sun } from 'lucide-react'
import React, { useRef } from 'react'

const NumberButton = ({ num, onClick, onLongPress, isActive }) => {
  const timerRef = useRef(null);
  const isLongPress = useRef(false);

  const startPress = (e) => {
    // Prevent default context menu on touch
    if (e.type === 'touchstart') {
      // e.preventDefault(); // Don't prevent default indiscriminately, might block scrolling
    }
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
      onLongPress(num);
    }, 600); // 600ms threshold for long press
  };

  const endPress = (e) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!isLongPress.current) {
      onClick(num);
    }
    isLongPress.current = false;
  };

  const cancelPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    isLongPress.current = false;
  }

  return (
    <button
      className={classNames("number-btn", { active: isActive })}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={(e) => {
        // e.preventDefault(); // Prevent ghost clicks
        endPress(e);
      }}
      onTouchCancel={cancelPress}
      // Disable default context menu to allow long-press on mobile
      onContextMenu={(e) => e.preventDefault()}
    >
      {num}
    </button>
  );
};

export default function Controls({ handleCheck, handleReset, handleNewPuzzle, theme, toggleTheme, handleNumberClick, handleNumberLongPress, selectedNumber, finishedNumbers, difficulty, setDifficulty, handleErase, handleHint, hintUsed, }) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="controls">
      <div className='numbers-section'>
        <div className='numbers-pad'>
          {numbers.map((num, index) => (
            !finishedNumbers[index] && (
              <NumberButton
                key={num}
                num={num}
                isActive={selectedNumber === num}
                onClick={handleNumberClick}
                onLongPress={handleNumberLongPress}
              />
            )
          ))}
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <button onClick={handleErase} style={{ marginRight: 8 }}>Erase</button>
        <button onClick={handleCheck} style={{ marginRight: 8 }}>Check</button>
        <button onClick={handleReset} style={{ marginRight: 8 }}>Reset</button>
        <button onClick={handleNewPuzzle} style={{ marginRight: 8 }}>New Puzzle</button>
        <button
          className="btn-hint"
          onClick={handleHint}
          disabled={hintUsed}
        >
          {hintUsed ? "Hint Used" : "Get Hint"}
        </button>
        <button onClick={toggleTheme} className='btn-theme'>{theme === "light" ? <Moon size={16} color='#049bffff' /> : <Sun size={16} color='#ffbb00ff' />}</button>
      </div>
      <div className="difficulty-selector">
        <label htmlFor="difficulty">Difficulty: </label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="expert">Expert</option>
          <option value="devilMode">Devil Mode</option>
        </select>
      </div>
    </div>
  )
}
