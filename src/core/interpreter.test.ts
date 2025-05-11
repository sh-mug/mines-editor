import { describe, expect, it } from 'vitest';
import { parse } from './interpreter';

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
});
