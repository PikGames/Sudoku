import React from 'react'

export default function Controls({handleCheck, handleReset, handleNamePuzzle}) {
  return (
    <div style={{marginTop: 16}}>
      <button onClick={handleCheck} style={{marginRight: 8}}>Check</button>
      <button onClick={handleReset} style={{marginRight: 8}}>Reset</button>
      <button onClick={handleNamePuzzle}>New Puzzle</button>
    </div>
  )
}
