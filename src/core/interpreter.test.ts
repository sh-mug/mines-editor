import { describe, expect, it } from 'vitest';
import { flagCell, handleLeftClick, handleRightClick, parse, revealCell, toggleFlagMode } from './interpreter';

describe('parse', () => {
  it('should parse a simple board', () => {
    const codeString = `
.....
.....
.....
`;
    const result = parse(codeString);
    expect(result).toEqual({
      revealed: [
        ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
        ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
        ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
      ],
      field: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ],
      stack: [],
      opIndex: 0,
      isFlagMode: false,
      operations: [],
    });
  });

  it('should reveal a cell when left clicked', () => {
    const codeString = `
.....
.....
.....
0,0
`;
    const result = parse(codeString);
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
    const result = parse(codeString);
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
    const result = parse(codeString);
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
    const result = parse(codeString);
    expect(result).toEqual({
      revealed: [
        ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
        ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
        ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
      ],
      field: [
        [0, 1, 1, 1, 0],
        [0, 1, 9, 2, 1],
        [0, 1, 2, 9, 1],
      ],
      stack: [],
      opIndex: 0,
      isFlagMode: false,
      operations: [],
    });
  });

  it('should throw an error if the board is not rectangular', () => {
    const codeString = `
.....
..*..
.....
....
`;
    expect(() => parse(codeString)).toThrowError(
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
    const result = parse(codeString);
    expect(result).toEqual({
      revealed: [
        ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
        ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
        ['hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
      ],
      field: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ],
      stack: [],
      opIndex: 0,
      isFlagMode: false,
      operations: [
        { type: 'leftClick', row: 0, col: 0 },
      ]
    });
  });

  it('should parse a right click op', () => {
    const codeString = `
.....
.....
.....
0;0
`;
    const result = parse(codeString);
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
    const result = parse(codeString);
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
    const result = parse(codeString);
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
    const result = parse(codeString);
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
    const result = parse(codeString);
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
    const result = parse(codeString);
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
    const result = parse(codeString);
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
    const result = parse(codeString);
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
    const result = parse(codeString);
    const newResult = toggleFlagMode(result);
    expect(newResult.isFlagMode).toBe(true);
    const newerResult = toggleFlagMode(newResult);
    expect(newerResult.isFlagMode).toBe(false);
  });
});

describe('commands', () => {
  // 開いていないマスを左クリック
  describe('left click on hidden cell', () => {
    it('should do nothing if the cell is flagged', () => {});
    it('should push the number of revealed cells if the cell is 0', () => {});
    it('should push the number of the cell if the cell is 1-8', () => {});
    it('should reset the board if the cell is 9', () => {});
  });

  // 開いていないマスを右クリック
  describe('right click on hidden cell', () => {
    it('should swap the top two values on the stack', () => {});
  });

  // 開いているマスを左クリック
  describe('left click on revealed cell', () => {
    it('should pop the top value if the cell is 0', () => {});
    it('should push 1 if the top value is positive, 0 otherwise if the cell is 1', () => {});
    it('should duplicate the top value if the cell is 2', () => {});
    it('should push the sum of the top two values if the cell is 3', () => {});
    it('should push the difference of the top two values if the cell is 4', () => {});
    it('should push the product of the top two values if the cell is 5', () => {});
    it('should push the quotient of the top two values if the cell is 6', () => {});
    it('should push the remainder of the top two values if the cell is 7', () => {});
    it('should perform the operation at the given coordinates if the cell is 8', () => {});
  });

  // 開いているマスを右クリック
  describe('right click on revealed cell', () => {
    describe('chord', () => {
      it('should push the sum of the numbers on the revealed cells if successful', () => {});
      it('should reset the board and stack if game over', () => {});
    });

    describe('otherwise', () => {
      it('should push 0 if the cell is 0', () => {});
      it('should push 1 if the top value is 0, 1 otherwise if the cell is 1', () => {});
      it('should roll the stack if the cell is 2', () => {});
      it('should push the parsed integer from standard input if the cell is 3', () => {});
      it('should push the unicode value of the character from standard input if the cell is 4', () => {});
      it('should output the top value to standard output if the cell is 5', () => {});
      it('should output the character with the unicode value of the top value to standard output if the cell is 6', () => {});
      it('should skip the next operation by the top value if the cell is 7', () => {});
      it('should perform the operation at the given coordinates if the cell is 8', () => {});
    });
  });
});
