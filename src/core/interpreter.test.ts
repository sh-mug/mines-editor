import { describe, expect, it } from 'vitest';
import { parse } from './interpreter';

describe('parse', () => {
  it('should parse a simple board', () => {
    const boardString = `
.....
.....
.....
`;
    const opsString = ``;
    const result = parse(boardString, opsString);
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
    const boardString = `
.....
..*..
...*.
`;
    const opsString = ``;
    const result = parse(boardString, opsString);
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
    const boardString = `
.....
..*..
.....
....
`;
    const opsString = ``;
    expect(() => parse(boardString, opsString)).toThrowError(
      'Board is not rectangular'
    );
  });

  it('should parse a simple ops', () => {
    const boardString = `
.....
.....
.....
`;
    const opsString = `
0,0
`;
    const result = parse(boardString, opsString);
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
});
