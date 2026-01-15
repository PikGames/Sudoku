import classNames from 'classnames';
import { Lightbulb, Eraser, RotateCcw, Puzzle } from 'lucide-react'
import React, { useRef } from 'react'

const NumberButton = ({ num, onClick, onLongPress, isActive }) => {
  const timerRef = useRef(null);
  const isLongPress = useRef(false);

  const startPress = () => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
      onLongPress(num);
    }, 500); // 500ms threshold for long press
  };

  const endPress = () => {
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
  };

  return (
    <button
      className={classNames("number-btn", { active: isActive })}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onTouchCancel={cancelPress}
      onContextMenu={(e) => e.preventDefault()}
    >
      {num}
    </button>
  );
};

export default function Controls({ handleReset, handleNewPuzzle, handleNumberClick, handleNumberLongPress, selectedNumber, finishedNumbers, handleErase, handleHint, hintsUsed, difficulty }) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="controls">
      <div className="action-buttons">
        <button className="btn-icon-control" onClick={handleErase}>
          <div className="icon-wrapper">
            <Eraser size={28} />
          </div>
          <span className="label">Erase</span>
        </button>
        <button
          className="btn-icon-control"
          onClick={handleHint}
          disabled={hintsUsed >= ((difficulty === 'easy' || difficulty === 'medium') ? 5 : (difficulty === 'devilMode' ? 1 : 3))}
        >
          <div className="icon-wrapper">
            <Lightbulb size={28} />
            {hintsUsed < ((difficulty === 'easy' || difficulty === 'medium') ? 5 : (difficulty === 'devilMode' ? 1 : 3)) && (
              <div className="badge">
                {((difficulty === 'easy' || difficulty === 'medium') ? 5 : (difficulty === 'devilMode' ? 1 : 3)) - hintsUsed}
              </div>
            )}
          </div>
          <span className="label">Hint</span>
        </button>
        <button className="btn-icon-control" onClick={handleReset}>
          <div className="icon-wrapper">
            <RotateCcw size={28} />
          </div>
          <span className="label">Reset</span>
        </button>
        <button className="btn-icon-control" onClick={handleNewPuzzle}>
          <div className="icon-wrapper">
            <Puzzle size={28} />
          </div>
          <span className="label">New Puzzle</span>
        </button>
      </div>
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
    </div>
  )
}
