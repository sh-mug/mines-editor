import { useState } from 'react';
import './App.css';
import { parse } from './core/interpreter';
import type { GameState } from './core/types';

function App() {
  const [boardString, setBoardString] = useState(`.....
..*..
.....
`);
  const [opsString] = useState(`
0,0
`);
  const [gameState, setGameState] = useState({ revealed: [['hidden']], field: [[0]], stack: [], opIndex: 0, isFlagMode: false, operations: [] } as GameState);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoad = () => {
    try {
      setGameState(parse(boardString, opsString));
      setErrorMessage('');
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  };

  return (
    <div className="app-container">
      <div className="left-column">
        {/* Code Editor */}
        <textarea
          className="code-editor"
          value={boardString}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => { setBoardString(e.target.value); }}
        />
        {/* Load Button */}
        <button onClick={handleLoad}>Load</button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {/* Standard Input */}
        <textarea className="standard-input" />
        {/* Standard Output */}
        <textarea className="standard-output" readOnly />
      </div>
      <div className="right-column">
        {/* Interpreter Controls */}
        <div className="interpreter-controls">
          <button>Run</button>
          <button>Step</button>
          <button>Reset</button>
        </div>
        {/* Board Visualizer */}
        <div className="board-visualizer">
          {gameState.field.map((row, i) => (
            <div key={i} className="board-row">
              {row.map((cell, j) => (
                <span key={j} className="board-cell">
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>
        {/* Debug Information */}
        <div className="debug-information">
          {/* TODO: Implement Debug Information */}
        </div>
      </div>
    </div>
  );
}

export default App;
