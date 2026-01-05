import { Moon, Sun } from 'lucide-react'
import React from 'react'



export default function Controls({handleCheck, handleReset, handleNamePuzzle, theme, toggleTheme}) {
  return (
    <div style={{marginTop: 16}}>
      <button onClick={handleCheck} style={{marginRight: 8}}>Check</button>
      <button onClick={handleReset} style={{marginRight: 8}}>Reset</button>
      <button onClick={handleNamePuzzle} style={{marginRight: 8}}>New Puzzle</button>
      <button onClick={toggleTheme} className='btn-theme'>{theme === "light" ? <Moon size={16} color='#049bffff'/> : <Sun size={16} color='#ffbb00ff'/>}</button>
    </div>
  )
}
