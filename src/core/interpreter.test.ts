import { describe, expect, it } from 'vitest';
import { flagCell, handleLeftClick, handleRightClick, parse, revealCell, step, toggleFlagMode } from './interpreter';

describe('parse', () => {
  it('should parse a simple board', () => {
    const codeString = `
.....
.....
.....
`;
    const result = parse(codeString, () => {});
    const revealed = [
      ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
      ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
      ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
    ];
    const field = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
    expect(result).toEqual({
      revealed,
      field,
      stack: [],
      opIndex: 0,
      isFlagMode: false,
      operations: [],
      inputString: '',
      outputString: '',
      addMessage: expect.any(Function),
      debugMessages: [],
      clickedRow: null,
      clickedCol: null,
      everRevealed: revealed.map(row => row.map(() => false)),
      safeCellsCount: field.flat().filter(cell => cell !== 9).length,
      mineCellsCount: field.flat().filter(cell => cell === 9).length,
      isFinished: false,
    });
  });

  it('should reveal a cell when left clicked', () => {
    const codeString = `
.....
.....
.....
0,0
`;
    const result = parse(codeString, () => {});
    const newResult = revealCell(result, 0, 0);
    expect(newResult.revealed[0][0]).toBe('revealed');
  });

  it('should flag a cell when right clicked', () => {
    const codeString = `
.....
.....
.....
0;0
`;
    const result = parse(codeString, () => {});
    const newResult = flagCell(result, 0, 0);
    expect(newResult.revealed[0][0]).toBe('flagged');
  });

  it('should reveal adjacent cells when left clicked on a cell with no adjacent mines', () => {
    const codeString = `
.....
.....
.....
0,0
`;
    const result = parse(codeString, () => {});
    const newResult = revealCell(result, 0, 0);
    expect(newResult.revealed[0][0]).toBe('revealed');
    expect(newResult.revealed[0][1]).toBe('revealed');
    expect(newResult.revealed[0][2]).toBe('revealed');
    expect(newResult.revealed[0][3]).toBe('revealed');
    expect(newResult.revealed[0][4]).toBe('revealed');
    expect(newResult.revealed[1][0]).toBe('revealed');
    expect(newResult.revealed[1][1]).toBe('revealed');
    expect(newResult.revealed[1][2]).toBe('revealed');
    expect(newResult.revealed[1][3]).toBe('revealed');
    expect(newResult.revealed[1][4]).toBe('revealed');
    expect(newResult.revealed[2][0]).toBe('revealed');
    expect(newResult.revealed[2][1]).toBe('revealed');
    expect(newResult.revealed[2][2]).toBe('revealed');
    expect(newResult.revealed[2][3]).toBe('revealed');
    expect(newResult.revealed[2][4]).toBe('revealed');
  });

  it('should parse a board with mines', () => {
    const codeString = `
.....
..*..
...*.
`;
    const result = parse(codeString, () => {});
    const revealed = [
      ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
      ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
      ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
    ];
    const field = [
      [0, 1, 1, 1, 0],
      [0, 1, 9, 2, 1],
      [0, 1, 2, 9, 1],
    ];
    expect(result).toEqual({
      revealed,
      field,
      stack: [],
      opIndex: 0,
      isFlagMode: false,
      operations: [],
      inputString: '',
      outputString: '',
      addMessage: expect.any(Function),
      debugMessages: [],
      clickedRow: null,
      clickedCol: null,
      everRevealed: revealed.map(row => row.map(() => false)),
      safeCellsCount: field.flat().filter(cell => cell !== 9).length,
      mineCellsCount: field.flat().filter(cell => cell === 9).length,
      isFinished: false,
    });
  });

  it('should throw an error if the board is not rectangular', () => {
    const codeString = `
.....
..*..
.....
....
`;
    expect(() => parse(codeString, () => {})).toThrowError(
      'Board is not rectangular'
    );
  });

  it('should parse a simple ops', () => {
    const codeString = `
.....
.....
.....
0,0
`;
    const result = parse(codeString, () => {});
    const revealed = [
      ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
      ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
      ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
    ];
    const field = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
    expect(result).toEqual({
      revealed,
      field,
      stack: [],
      opIndex: 0,
      isFlagMode: false,
      operations: [
        { type: 'leftClick', row: 0, col: 0 },
      ],
      inputString: '',
      outputString: '',
      addMessage: expect.any(Function),
      debugMessages: [],
      clickedRow: null,
      clickedCol: null,
      everRevealed: revealed.map(row => row.map(() => false)),
      safeCellsCount: field.flat().filter(cell => cell !== 9).length,
      mineCellsCount: field.flat().filter(cell => cell === 9).length,
      isFinished: false,
    });
  });

  it('should parse a right click op', () => {
    const codeString = `
.....
.....
.....
0;0
`;
    const result = parse(codeString, () => {});
    expect(result.operations).toEqual([
      { type: 'rightClick', row: 0, col: 0 },
    ]);
  });

  it('should parse a toggle flag mode op', () => {
    const codeString = `
.....
.....
.....
!
`;
    const result = parse(codeString, () => {});
    expect(result.operations).toEqual([
      { type: 'toggleFlagMode' },
    ]);
  });

  it('should parse a noop op', () => {
    const codeString = `
.....
.....
.....

0,0`;
    const result = parse(codeString, () => {});
    expect(result.operations).toEqual([
      { type: 'noop' },
      { type: 'leftClick', row: 0, col: 0 },
    ]);
  });

  it('should toggle a flag on a cell when right clicked again', () => {
    const codeString = `
.....
.....
.....
0;0
0;0
`;
    const result = parse(codeString, () => {});
    const newResult = flagCell(result, 0, 0);
    const newerResult = flagCell(newResult, 0, 0);
    expect(newerResult.revealed[0][0]).toBe('hidden');
  });

  it('should reveal a cell when left clicked and not in flag mode', () => {
    const codeString = `
.....
.....
.....
0,0
`;
    const result = parse(codeString, () => {});
    const newResult = handleLeftClick(result, 0, 0);
    expect(newResult.revealed[0][0]).toBe('revealed');
  });

  it('should flag a cell when left clicked and in flag mode', () => {
    const codeString = `
.....
.....
.....
!
0,0
`;
    const result = parse(codeString, () => {});
    const toggledResult = toggleFlagMode(result);
    const finalResult = handleLeftClick(toggledResult, 0, 0);
    expect(finalResult.revealed[0][0]).toBe('flagged');
  });

  it('should reveal a cell when right clicked and in flag mode', () => {
    const codeString = `
.....
.....
.....
!
0;0
`;
    const result = parse(codeString, () => {});
    const toggledResult = toggleFlagMode(result);
    const finalResult = handleRightClick(toggledResult, 0, 0);
    expect(finalResult.revealed[0][0]).toBe('revealed');
  });

  it('should flag a cell when right clicked and not in flag mode', () => {
    const codeString = `
.....
.....
.....
0;0
`;
    const result = parse(codeString, () => {});
    const newResult = handleRightClick(result, 0, 0);
    expect(newResult.revealed[0][0]).toBe('flagged');
  });

  it('should toggle flag mode', () => {
    const codeString = `
.....
.....
.....
!
`;
    const result = parse(codeString, () => {});
    const newResult = toggleFlagMode(result);
    expect(newResult.isFlagMode).toBe(true);
    const newerResult = toggleFlagMode(newResult);
    expect(newerResult.isFlagMode).toBe(false);
  });
});

describe('step', () => {
  it('should increment opIndex', () => {
    const codeString = `
.....
.*...
.....
0,0
1,0
2,0
`;
    const gameState = parse(codeString, () => {});
    expect(gameState.opIndex).toBe(0);
    const nextGameState = step(gameState);
    expect(nextGameState.opIndex).toBe(1);
    const finalGameState = step(nextGameState);
    expect(finalGameState.opIndex).toBe(2);
  });

  it('should reveal a cell when left clicked', () => {
    const codeString = `
....*
.....
.....
0,0
`;
    const gameState = parse(codeString, () => {});
    const nextGameState = step(gameState);
    expect(nextGameState.revealed[0][0]).toBe('revealed');
  });

  it('should reset the game when a mine is clicked', () => {
    const codeString = `
*....
.....
.....
0,0
`;
    const gameState = parse(codeString, () => {});
    const nextGameState = step(gameState);
    expect(nextGameState.revealed).toEqual([
      ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
      ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
      ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
    ]);
  });

  it('should toggle flag mode when toggleFlagMode command is executed', () => {
    const codeString = `
....*
.....
.....
!
`;
    const gameState = parse(codeString, () => {});
    expect(gameState.isFlagMode).toBe(false);
    const nextGameState = step(gameState);
    expect(nextGameState.isFlagMode).toBe(true);
  });

  it('should flag a cell when rightClick command is executed', () => {
    const codeString = `
....*
.....
.....
0;0
`;
    const gameState = parse(codeString, () => {});
    const nextGameState = step(gameState);
    expect(nextGameState.revealed[0][0]).toBe('flagged');
  });

  it('should do nothing when noop command is executed', () => {
    const codeString = `
....*
.....
.....

0,0
`;
    const gameState = parse(codeString, () => {});
    const nextGameState = step(gameState);
    expect(nextGameState).toEqual({ ...gameState, opIndex: 1 });
  });

  it('should call handleLeftClick when leftClick command is executed', () => {
    const codeString = `
....*
.....
.....
0,0
`;
    const gameState = parse(codeString, () => {});
    const nextGameState = step(gameState);
    expect(nextGameState.revealed[0][0]).toBe('revealed');
  });

  it('should call handleRightClick when rightClick command is executed', () => {
    const codeString = `
....*
.....
.....
0;0
`;
    const gameState = parse(codeString, () => {});
    const nextGameState = step(gameState);
    expect(nextGameState.revealed[0][0]).toBe('flagged');
  });

  it('should call revealCell when handleLeftClick is called and isFlagMode is false', () => {
    const codeString = `
....*
.....
.....
0,0
`;
    const gameState = parse(codeString, () => {});
    gameState.isFlagMode = false;
    const nextGameState = step(gameState);
    expect(nextGameState.revealed[0][0]).toBe('revealed');
  });

  it('should call flagCell when handleLeftClick is called and isFlagMode is true', () => {
    const codeString = `
....*
.....
.....
!
0,0
`;
    const gameState = parse(codeString, () => {});
    const nextGameState = step(gameState);
    const finalGameState = step(nextGameState);
    expect(finalGameState.revealed[0][0]).toBe('flagged');
  });

  it('should call flagCell when handleRightClick is called and isFlagMode is false', () => {
    const codeString = `
....*
.....
.....
0;0
`;
    const gameState = parse(codeString, () => {});
    gameState.isFlagMode = false;
    const nextGameState = step(gameState);
    expect(nextGameState.revealed[0][0]).toBe('flagged');
  });

  it('should call revealCell when handleRightClick is called and isFlagMode is true', () => {
    const codeString = `
....*
.....
.....
!
0;0
`;
    const gameState = parse(codeString, () => {});
    const nextGameState = step(gameState);
    const finalGameState = step(nextGameState);
    expect(finalGameState.revealed[0][0]).toBe('revealed');
  });

 it('should not call "chord" command when no adjacent cells are revealed', () => {
    const codeString = `
...
*..
0,0
0;1
0;0 # reveal 2 cells and push 2
0;0 # should be "not"
2,0
`;
    var gameState = parse(codeString, () => {});
    while (!gameState.isFinished) {
      gameState = step(gameState);
    }
    expect(gameState.stack).toEqual([1, 0, 2]);
  });

  it('should perform p1;p0 when perform(r) is called', () => {
    const codeString = `
..***
..*.*
..***
3,1 # push 8
1,0 # push 2
3;1 # perform(r): 8;2 is performed and (3,2) is flagged
0,1
`;
    var gameState = parse(codeString, () => {});
    while (!gameState.isFinished) {
      gameState = step(gameState);
    }
    expect(gameState.revealed[2][3]).toBe('flagged');
  });

  it('should reveal a cell when step is called with a designated leftClick operation', () => {
    const codeString = `
....*
.....
.....
-1;0
`;
    const gameState = parse(codeString, () => {});
    const specificOperation = { type: 'leftClick' as 'leftClick', row: 0, col: 0 };
    const nextGameState = step(gameState, specificOperation);
    expect(nextGameState.revealed[0][0]).toBe('revealed');
  });

  it('should flag a cell when step is called with a designated rightClick operation', () => {
    const codeString = `
....*
.....
.....
-1;0
`;
    const gameState = parse(codeString, () => {});
    const specificOperation = { type: 'rightClick' as 'rightClick', row: 0, col: 0 };
    const nextGameState = step(gameState, specificOperation);
    expect(nextGameState.revealed[0][0]).toBe('flagged');
  });

  it('should skip to an appropriate operation when skip is called by perform(r)', () => {
    const codeString = `
*****
*.*.*
.****
*....
***..
1,3
3,4
2,3 # push 5
3,3
0,2
3,3 # push 1
3,1
1,1
3,3 # push 1
3;1 # perform(r): (1,1) is right-clicked and skip to OP=4
-1,-1
`;
    var gameState = parse(codeString, () => {});
    for (let i = 0; i < 10; i++) {
      gameState = step(gameState);
    }
    expect(gameState.opIndex).toBe(4); // Should skip to the operation after the perform(r)
  });
});
