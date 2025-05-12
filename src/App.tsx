import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import './App.css';
import { parse } from "./core/interpreter";
import type { GameState } from './core/types';

function App() {
  const [codeString, setCodeString] = useState(`*.....*...........*...*...............
*.....*...........*...*...............
*.....*....***....*...*....***........
*******...*...*...*...*...*...*.......
*.....*...****....*...*...*...*.......
*.....*...*.......*...*...*...*...*...
*.....*....***....*...*....***....*...
.................................*....
......................................
......................................
*.....*..................*.......*...*
*.....*..................*.......*...*
*.....*....***....*.**...*....****...*
*..*..*...*...*...**.....*...*...*...*
.**.**....*...*...*......*...*...*...*
.*...*....*...*...*......*...*...*....
.*...*.....***....*......*....****...*
8,0   #push450
7,0   #dup
11,3  #push6
11,3  #div
0,-3  #push3
19,14 #sub
11;3  #out(c)
19,12 #push4
11,3  #div
12,3  #push6
13,3  #push5
7,1   #add
19,14 #sub
7,0   #dup
11;3  #out(c)
28,4  #push9
0,-1  #push2
19,14 #sub
7,1   #add
7,0   #dup
11;3  #out(c)
7,0   #dup
11;3  #out(c)
0,-2  #push3
7,1   #add
7,0   #dup
11;3  #out(c)
2,0   #push15
3,-3  #push3
1,4   #multi
33,8  #push1
19,14 #sub
7,0   #dup
11;3  #out(c)
11,5  #push6
12,5  #push6
7,1   #add
19,14 #sub
7,0   #dup
11;3  #out(c)
2,-4  #push3
19,14 #sub
4,-4  #push3
1,4   #multi
11;3  #out(c)
7,0   #dup
11;3  #out(c)
13,5  #push4
33,9 #push1
19,14 #sub
7,1   #add
7,0   #dup
11;3  #out(c)
3,-1  #push6
19,14 #sub
7,0   #dup
11;3  #out(c)
1,-4  #push4
5,-4  #push4
7,1   #add
19,14 #sub
11;3  #out(c)
12,14 #push9
29,16 #push2
7,1   #add
-7,-2 #push3
1,4   #multi
11;3  #out(c)
-7,-3 #push8
10,-1 #push2
7,1   #add
11;3  #out(c)
14,-1 #push2
-1,-2 #push2, exit`);
  const [messages, setMessages] = useState<string[]>([]);
  const addMessage = useCallback((message: string) => {
    setMessages(prevMessages => [...prevMessages, message]);
  }, [setMessages]);
  const [gameState, setGameState] = useState<GameState>({
    revealed: [['hidden']],
    field: [[0]],
    stack: [],
    opIndex: 0,
    isFlagMode: false,
    operations: [],
    inputString: '',
    outputString: '',
    addMessage: addMessage,
    debugMessages: [],
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleCodeChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCodeString(event.target.value);
  };

  const handleLoad = () => {
    try {
      setGameState(parse(codeString, addMessage));
      setErrorMessage('');
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  };

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <div className="app-wrapper">
      <h1 className="main-title">Mines Web Interpreter</h1>
      <div className="app-container">
        <div className="left-column">
          {/* Code Editor Component */}
          <h2>Code Editor</h2>
          <textarea
            className="code-editor"
            value={codeString}
            onChange={handleCodeChange}
          />
          {/* Load Button */}
          <button onClick={handleLoad}>Load</button>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {/* Standard Input Component */}
          <h2>Standard Input</h2>
          <textarea
            className="standard-input"
            value={gameState.inputString}
            onChange={(e) => setGameState({ ...gameState, inputString: e.target.value })}
          />
          {/* Standard Output Component */}
          <h2>Standard Output</h2>
          <textarea
            className="standard-output"
            value={gameState.outputString}
            readOnly
          />
        </div>
        <div className="right-column">
          {/* Interpreter Controls Component */}
          <h2>Interpreter Controls</h2>
          <div className="interpreter-controls">
            <button>Run</button>
            <button>Step</button>
            <button>Reset</button>
          </div>
          {/* Board Visualizer Component */}
          <h2>Board Visualizer</h2>
          <div className="board-visualizer">
            {gameState.field.map((row, i) => (
              <div key={i} className="board-row">
                {row.map((cell, j) => (
                  <span key={j} className={`board-cell ${cell === 1 ? 'color-1' :
                      cell === 2 ? 'color-2' :
                      cell === 3 ? 'color-3' :
                      cell === 4 ? 'color-4' :
                      cell === 5 ? 'color-5' :
                      cell === 6 ? 'color-6' :
                      cell === 7 ? 'color-7' :
                      cell === 8 ? 'color-8' :
                      ''
                    }`}>
                    {cell === 0 ? '' : cell === 9 ? '💣' : cell}
                  </span>
                ))}
              </div>
            ))}
          </div >
          {/* Debug Information Component */}
          <h2>Debug Information</h2>
          <div className="debug-information">
            {messages.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
