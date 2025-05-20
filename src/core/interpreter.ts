import {
  add,
  divide,
  duplicate,
  modulo,
  multiply,
  not,
  pop,
  positive,
  printChar,
  printInt,
  push,
  readChar,
  readInt,
  reverse,
  roll,
  subtract,
  swap
} from './commands';
import type { CellState, Field, GameState, Operation, Revealed } from './types';

function checkTerminationCondition(state: GameState): boolean {
  // すべての安全なマスが開かれたかチェック
  const allSafeCellsRevealed = state.everRevealed.every((row, rowIndex) =>
    row.every((revealed, colIndex) => {
      const cellValue = state.field[rowIndex][colIndex];
      return cellValue !== 9 ? revealed : true;
    })
  );

  // すべての地雷マスが開かれたかチェック
  const allMineCellsRevealed = state.everRevealed.every((row, rowIndex) =>
    row.every((revealed, colIndex) => {
      const cellValue = state.field[rowIndex][colIndex];
      return cellValue === 9 ? revealed : true;
    })
  );

  return allSafeCellsRevealed || allMineCellsRevealed;
}

function countAdjacentFlags(gameState: GameState, row: number, col: number): number {
  let count = 0;
  for (let ni = row - 1; ni <= row + 1; ni++) {
    for (let nj = col - 1; nj <= col + 1; nj++) {
      if (ni >= 0 && ni < gameState.revealed.length && nj >= 0 && nj < gameState.revealed[0].length) {
        if (gameState.revealed[ni][nj] === 'flagged') {
          count++;
        }
      }
    }
  }
  return count;
}

function revealAdjacentCells(gameState: GameState, row: number, col: number): GameState {
  let newGameState = { ...gameState };
  for (let ni = row - 1; ni <= row + 1; ni++) {
    for (let nj = col - 1; nj <= col + 1; nj++) {
      if (ni >= 0 && ni < newGameState.revealed.length && nj >= 0 && nj < newGameState.revealed[0].length) {
        if (newGameState.revealed[ni][nj] === 'hidden') {
          newGameState = revealCell(newGameState, ni, nj);
        }
      }
    }
  }
  return newGameState;
}

export function revealCell(gameState: GameState, row: number, col: number): GameState {
  let newRevealed = gameState.revealed.map((rowArray, rowIndex) => {
    return rowArray.map((cellState, colIndex) => {
      if (rowIndex === row && colIndex === col) {
        return 'revealed' as CellState;
      }
      return cellState;
    });
  });

  let newGameState = { ...gameState, revealed: newRevealed };

  if (gameState.field[row][col] === 0) {
    newGameState = revealAdjacentCells(newGameState, row, col);
  }

  return newGameState;
}

export function flagCell(gameState: GameState, row: number, col: number): GameState {
  const newRevealed = gameState.revealed.map((rowArray, rowIndex) => {
    return rowArray.map((cellState, colIndex) => {
      if (rowIndex === row && colIndex === col) {
        switch (cellState) {
          case 'hidden':
            return 'flagged' as CellState;
          case 'flagged':
            return 'hidden' as CellState;
          default:
            return cellState;
        }
      }
      return cellState;
    });
  });

  return { ...gameState, revealed: newRevealed };
}

export function handleLeftClick(gameState: GameState, row: number, col: number): GameState {
  if (!gameState.isFlagMode) {  // If not in flag mode (default)
    return revealCell(gameState, row, col);
  } else {  // If in flag mode
    return flagCell(gameState, row, col);
  }
}

export function handleRightClick(gameState: GameState, row: number, col: number): GameState {
  if (!gameState.isFlagMode) {  // If not in flag mode (default)
    return flagCell(gameState, row, col);
  } else {  // If in flag mode
    return revealCell(gameState, row, col);
  }
}

export function toggleFlagMode(gameState: GameState): GameState {
  return { ...gameState, isFlagMode: !gameState.isFlagMode };
}

export function parse(codeString: string, addMessage: (message: string) => void): GameState {
  const lines = codeString
    .trim()
    .split('\n')
    .map(line => line.split('#')[0].trim());

  const boardLines = [];
  const opsLines = [];
  let isOps = false;

  for (const line of lines) {
    if (!isOps && /^[.*]+$/.test(line)) {
      boardLines.push(line);
    } else {
      isOps = true;
      opsLines.push(line);
    }
  }

  const rows = boardLines;

  const width = rows[0].trim().length;
  if (!rows.every(row => row.trim().length === width)) {
    throw new Error('Board is not rectangular');
  }

  const cells = rows.map(row => row.trim().split(''));
  const revealed: Revealed = cells.map(row =>
    row.map(() => 'hidden' as CellState)
  );

  const field: Field = cells.map((row, i) =>
    row.map((cell, j) => {
      if (cell === '*') {
        return 9;
      }
      let count = 0;
      for (let ni = i - 1; ni <= i + 1; ni++) {
        for (let nj = j - 1; nj <= j + 1; nj++) {
          if (
            ni >= 0 &&
            ni < cells.length &&
            nj >= 0 &&
            nj < row.length &&
            cells[ni][nj] === '*'
          ) {
            count++;
          }
        }
      }
      return count;
    })
  );

  const operations: Operation[] = opsLines
    .map(opString => {
      if (opString === '!') {
        return { type: 'toggleFlagMode' };
      } else if (opString.trim().length === 0) {
        return { type: 'noop' };
      } else {
        const separator = opString.includes(',') ? ',' : ';';
        const [col, row] = opString.split(separator).map(Number);
        const type = separator === ',' ? 'leftClick' : 'rightClick';
        return { type, row, col };
      }
    });

  return {
    revealed,
    field,
    stack: [],
    opIndex: 0,
    isFlagMode: false,
    operations: operations,
    inputString: '',
    outputString: '',
    addMessage,
    debugMessages: [],
    clickedRow: null,
    clickedCol: null,
    everRevealed: revealed.map(row => row.map(() => false)),
    safeCellsCount: field.flat().filter(cell => cell !== 9).length,
    mineCellsCount: field.flat().filter(cell => cell === 9).length,
    isFinished: false,
  };
}

// Reset game state (for reset(l))
function resetGame(gameState: GameState): GameState {
  const initialRevealed: Revealed = gameState.field.map(row =>
    row.map(() => 'hidden' as CellState)
  );
  return {
    ...gameState,
    revealed: initialRevealed,
    isFlagMode: false, // Flag mode is NOT reset on game over
    clickedRow: null,
    clickedCol: null,
    // stack and opIndex are NOT reset on game over
  };
}

// Reset game state and stack (for reset(r))
function resetGameAndStack(gameState: GameState): GameState {
  const initialRevealed: Revealed = gameState.field.map(row =>
    row.map(() => 'hidden' as CellState)
  );
  return {
    ...gameState,
    revealed: initialRevealed,
    stack: [], // Stack is reset for reset(r)
    isFlagMode: false, // Flag mode is NOT reset on game over
    clickedRow: null,
    clickedCol: null,
    // opIndex is NOT reset on game over
  };
}

export function step(gameState: GameState): GameState {
  const everRevealed = gameState.everRevealed.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      return gameState.revealed[rowIndex][colIndex] === 'revealed' ? true : cell;
    })
  );
  const isFinished = checkTerminationCondition({ ...gameState, everRevealed });
  gameState = { ...gameState, everRevealed, isFinished };

  if (gameState.isFinished) {
    const addMessage = gameState.addMessage;
    addMessage('Game is already finished. No operation performed.');
    return gameState; // No operation if the game is already finished
  }

  const height = gameState.field.length;
  const width = gameState.field[0].length;

  if (gameState.operations.length <= gameState.opIndex) {
    gameState.opIndex = 0; // Reset opIndex if it exceeds the length of operations
    return gameState;
  }

  let currentGameState = { 
    ...gameState, 
    clickedRow: null as number | null, 
    clickedCol: null as number | null, 
  };
  const operation = currentGameState.operations[currentGameState.opIndex];

  // Increment opIndex before executing the operation
  currentGameState.opIndex = (currentGameState.opIndex + 1) % currentGameState.operations.length;

  if (operation.type === 'leftClick' || operation.type === 'rightClick') {
    currentGameState = { ...currentGameState, clickedRow: operation.row, clickedCol: operation.col };
  }

  const addMessage = currentGameState.addMessage; // Get addMessage from gameState

  switch (true) {
    case (operation.type == 'leftClick' && !currentGameState.isFlagMode) || (operation.type == 'rightClick' && currentGameState.isFlagMode): {
      addMessage(`Executing leftClick at (${operation.row}, ${operation.col})`);
      const wrappedRow = (operation.row % height + height) % height;
      const wrappedCol = (operation.col % width + width) % width;
      const cellState = currentGameState.revealed[wrappedRow][wrappedCol];
      const cellValue = currentGameState.field[wrappedRow][wrappedCol];

      if (cellState === 'hidden') {
        if (cellValue === 9) { // Mine
          addMessage(`💥 Game Over at (${wrappedRow}, ${wrappedCol})`);
          return resetGame(currentGameState); // reset(l)
        } else { // Safe cell
          const revealedBefore = currentGameState.revealed.flat().filter(s => s === 'revealed').length;
          const nextGameState = revealCell(currentGameState, wrappedRow, wrappedCol);
          const revealedAfter = nextGameState.revealed.flat().filter(s => s === 'revealed').length;
          const revealedCount = revealedAfter - revealedBefore;

          if (cellValue === 0) { // Blank cell
            addMessage(`⬜ Revealed blank cell at (${wrappedRow}, ${wrappedCol}). Revealed ${revealedCount} cells.`);
            return push(nextGameState, revealedCount, addMessage); // push(count)
          } else { // Numbered cell
            addMessage(`🔢 Revealed numbered cell ${cellValue} at (${wrappedRow}, ${wrappedCol})`);
            return push(nextGameState, cellValue, addMessage); // push(n)
          }
        }
      } else if (cellState === 'flagged') { // Left click on flagged cell
          addMessage(`🚩 Left clicked on flagged cell at (${wrappedRow}, ${wrappedCol}). No operation.`);
          return currentGameState; // noop
      } else { // Left click on revealed cell
        addMessage(`🖱️ Left clicked on revealed cell at (${wrappedRow}, ${wrappedCol}).`);
        switch (cellValue) {
          case 0: return pop(currentGameState, addMessage);
          case 1: return positive(currentGameState, addMessage);
          case 2: return duplicate(currentGameState, addMessage);
          case 3: return add(currentGameState, addMessage);
          case 4: return subtract(currentGameState, addMessage);
          case 5: return multiply(currentGameState, addMessage);
          case 6: return divide(currentGameState, addMessage);
          case 7: return modulo(currentGameState, addMessage);
          case 8: {
            // perform(l)
            addMessage(`▶️ Performing operation from stack (left click)`);
            if (currentGameState.stack.length >= 2) {
              const p0 = currentGameState.stack[currentGameState.stack.length - 1];
              const p1 = currentGameState.stack[currentGameState.stack.length - 2];
              const newStack = currentGameState.stack.slice(0, -2);
              const nextGameState = { ...currentGameState, stack: newStack };
              const performOperation: Operation = { type: 'leftClick', row: p1, col: p0 };
              // Recursively call step with the new operation
              return step({ ...nextGameState, operations: [performOperation, ...nextGameState.operations.slice(nextGameState.opIndex)], opIndex: 0 });
            } else {
                addMessage(`⏩ Stack underflow for perform(l)`);
                return currentGameState; // Command error
            }
          }
          default: return currentGameState; // Should not happen for 0-8
        }
      }
    }
    case (operation.type == 'rightClick' && !currentGameState.isFlagMode) || (operation.type == 'leftClick' && currentGameState.isFlagMode): {
      addMessage(`Executing rightClick at (${operation.row}, ${operation.col})`);
      const wrappedRow = (operation.row % height + height) % height;
      const wrappedCol = (operation.col % width + width) % width;
      const cellState = currentGameState.revealed[wrappedRow][wrappedCol];
      const cellValue = currentGameState.field[wrappedRow][wrappedCol];

      if (cellState === 'hidden' || cellState == 'flagged') { // Right click on hidden cell
        addMessage(`🚩 Flagging/unflagging cell at (${wrappedRow}, ${wrappedCol})`);
        return swap(flagCell(currentGameState, wrappedRow, wrappedCol), addMessage); // swap
      } else if (cellState === 'revealed') { // Right click on revealed cell (Chord)
        addMessage(`🖱️ Right clicked on revealed cell at (${wrappedRow}, ${wrappedCol}). Attempting Chord.`);
        const adjacentFlags = countAdjacentFlags(currentGameState, wrappedRow, wrappedCol);
        let nextGameState = { ...currentGameState };
        let newlyRevealedCount = 0;
        let sumOfRevealedValues = 0;
        let gameOver = false;

        if (adjacentFlags === cellValue) { // Number matches adjacent flags
          // Attempt to reveal adjacent hidden cells
          for (let ni = wrappedRow - 1; ni <= wrappedRow + 1; ni++) {
            for (let nj = wrappedCol - 1; nj <= wrappedCol + 1; nj++) {
                if (ni >= 0 && ni < nextGameState.revealed.length && nj >= 0 && nj < nextGameState.revealed[0].length) {
                  if (nextGameState.revealed[ni][nj] === 'hidden') {
                      const adjacentCellValue = nextGameState.field[ni][nj];
                      if (adjacentCellValue === 9) { // Hit a mine during Chord
                        addMessage(`💥 Game Over during Chord at (${ni}, ${nj})`);
                        gameOver = true;
                        break; // Exit inner loop
                      } else {
                        const revealedBefore = nextGameState.revealed.flat().filter(s => s === 'revealed').length;
                        nextGameState = revealCell(nextGameState, ni, nj);
                        const revealedAfter = nextGameState.revealed.flat().filter(s => s === 'revealed').length;
                        newlyRevealedCount += (revealedAfter - revealedBefore);
                        sumOfRevealedValues += adjacentCellValue;
                      }
                  }
                }
            }
            if (gameOver) break; // Exit outer loop
          }
        }

        if (newlyRevealedCount > 0) {
          if (gameOver) {
              addMessage(`🔄 Resetting game and stack due to Chord game over.`);
              return resetGameAndStack(currentGameState); // reset(r)
          } else  { // Successfully revealed new cells
              addMessage(`✅ Chord successful. Revealed ${newlyRevealedCount} new cells. Sum of values: ${sumOfRevealedValues}`);
              return push(nextGameState, sumOfRevealedValues, addMessage); // push(sum)
          }
        } else { // Number does not match adjacent flags
          addMessage(`🤷 Chord attempted but no new cells revealed.`);
          switch (cellValue) {
            case 0: return push(currentGameState, 0, addMessage); // push(0)
            case 1: return not(currentGameState, addMessage);
            case 2: return roll(currentGameState, addMessage);
            case 3: return readInt(currentGameState, addMessage); // in(n)
            case 4: return readChar(currentGameState, addMessage); // in(c)
            case 5: return printInt(currentGameState, addMessage); // out(n)
            case 6: return printChar(currentGameState, addMessage); // out(c)
            case 7: {
              // skip
              addMessage(`⏭️ Skipping operations based on stack value`);
              if (currentGameState.stack.length >= 1) {
                const p0 = currentGameState.stack[currentGameState.stack.length - 1];
                const newStack = currentGameState.stack.slice(0, -1);
                let nextOpIndex = (currentGameState.opIndex + p0) % currentGameState.operations.length;
                  // Handle negative skip values
                  if (nextOpIndex < 0) {
                      nextOpIndex += currentGameState.operations.length;
                  }
                addMessage(`⏭️ Skipping ${p0} operations. New OP index: ${nextOpIndex}`);
                return { ...currentGameState, stack: newStack, opIndex: nextOpIndex };
              } else {
                  addMessage(`⏩ Stack underflow for skip`);
                  return currentGameState; // Command error
              }
            }
            case 8: {
              // perform(r)
              addMessage(`▶️ Performing operation from stack (right click)`);
              if (currentGameState.stack.length >= 2) {
                const p0 = currentGameState.stack[currentGameState.stack.length - 1];
                const p1 = currentGameState.stack[currentGameState.stack.length - 2];
                const newStack = currentGameState.stack.slice(0, -2);
                const nextGameState = { ...currentGameState, stack: newStack };
                const performOperation: Operation = { type: 'rightClick', row: p1, col: p0 };
                // Recursively call step with the new operation
                return step({ ...nextGameState, operations: [performOperation, ...nextGameState.operations.slice(nextGameState.opIndex)], opIndex: 0 });
              } else {
                  addMessage(`⏩ Stack underflow for perform(r)`);
                  return currentGameState; // Command error
              }
            }
            default: return currentGameState; // Should not happen for 0-8
          }
        }
      }
      return currentGameState; // Should not happen
    }
    case operation.type == 'toggleFlagMode':
      addMessage('Executing toggleFlagMode');
      return reverse(toggleFlagMode(currentGameState), addMessage); // reverse
    case operation.type == 'noop':
      addMessage('Executing noop');
      return currentGameState; // noop
    default:
      addMessage(`Unknown operation type: ${(operation as Operation).type}`);
      return currentGameState;
  }
}
