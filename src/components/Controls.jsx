import classNames from 'classnames';
import { Moon, Sun } from 'lucide-react'
import React from 'react'



export default function Controls({ handleCheck, handleReset, handleNamePuzzle, theme, toggleTheme, handleNumberButtonClick, selectedNumber, finishedNumbers, }) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="controls">
      <div className='numbers-section'>
        <div className='numbers-pad'>
          {numbers.map((num, index) => (
            !finishedNumbers[index] && (
              <button
                key={num}
                className={classNames("number-btn", {
                  active: selectedNumber === num,
                })}
                onClick={() => handleNumberButtonClick(num)}
              >
                {num}
              </button>
            )
          ))}
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <button onClick={handleCheck} style={{ marginRight: 8 }}>Check</button>
        <button onClick={handleReset} style={{ marginRight: 8 }}>Reset</button>
        <button onClick={handleNamePuzzle} style={{ marginRight: 8 }}>New Puzzle</button>
        <button onClick={toggleTheme} className='btn-theme'>{theme === "light" ? <Moon size={16} color='#049bffff' /> : <Sun size={16} color='#ffbb00ff' />}</button>
      </div>
    </div>
  )
}
