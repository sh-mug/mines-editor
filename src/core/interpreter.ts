import type { CellState, Field, GameState, Operation, Revealed } from './types';

export function parse(codeString: string): GameState {
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
        const [row, col] = opString.split(separator).map(Number);
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
  };
}
