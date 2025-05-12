import { describe, expect, test } from 'vitest';
import * as Commands from './commands';
import type { GameState } from './types';

const initialGameState: GameState = {
  revealed: [[]],
  field: [[]],
  stack: [],
  inputString: '',
  outputString: '',
  isFlagMode: false,
  operations: [],
  opIndex: 0,
  addMessage: () => {},
  debugMessages: [],
};

describe('Commands', () => {
  const addMessage = () => {};

  describe('push', () => {
    test('スタックに値をプッシュできること', () => {
      const gameState = { ...initialGameState };
      const newGameState = Commands.push(gameState, 10, addMessage);
      expect(newGameState.stack).toEqual([10]);
    });
  });

  describe('pop', () => {
    test('スタックから値をポップできること', () => {
      const gameState = { ...initialGameState, stack: [10] };
      const newGameState = Commands.pop(gameState, addMessage);
      expect(newGameState.stack).toEqual([]);
    });

    test('スタックが空の場合、ポップしてもスタックは空のまま', () => {
      const gameState = { ...initialGameState, stack: [] };
      const newGameState = Commands.pop(gameState, addMessage);
      expect(newGameState.stack).toEqual([]);
    });
  });

  describe('swap', () => {
    test('スタックの先頭2つの値を交換できること', () => {
      const gameState = { ...initialGameState, stack: [10, 20] };
      const newGameState = Commands.swap(gameState, addMessage);
      expect(newGameState.stack).toEqual([20, 10]);
    });

    test('スタックの値が1個未満の場合、swapしてもスタックは変わらないこと', () => {
      const gameState = { ...initialGameState, stack: [10] };
      const newGameState = Commands.swap(gameState, addMessage);
      expect(newGameState.stack).toEqual([10]);
    });

    test('スタックが空の場合、swapしてもスタックは空のまま', () => {
      const gameState = { ...initialGameState, stack: [] };
      const newGameState = Commands.swap(gameState, addMessage);
      expect(newGameState.stack).toEqual([]);
    });
  });

  describe('reverse', () => {
    test('スタック全体の要素を逆順に並び替えられること', () => {
      const gameState = { ...initialGameState, stack: [10, 20, 30] };
      const newGameState = Commands.reverse(gameState, addMessage);
      expect(newGameState.stack).toEqual([30, 20, 10]);
    });

    test('スタックが空の場合、reverseしてもスタックは空のまま', () => {
      const gameState = { ...initialGameState, stack: [] };
      const newGameState = Commands.reverse(gameState, addMessage);
      expect(newGameState.stack).toEqual([]);
    });
  });

  describe('duplicate', () => {
    test('スタックの先頭の値を複製できること', () => {
      const gameState = { ...initialGameState, stack: [10] };
      const newGameState = Commands.duplicate(gameState, addMessage);
      expect(newGameState.stack).toEqual([10, 10]);
    });

    test('スタックが空の場合、duplicateしてもスタックは空のまま', () => {
      const gameState = { ...initialGameState, stack: [] };
      const newGameState = Commands.duplicate(gameState, addMessage);
      expect(newGameState.stack).toEqual([]);
    });
  });

  describe('roll', () => {
    test('スタックの深さp1までの値をp0回回転させられること', () => {
      const gameState = { ...initialGameState, stack: [40, 30, 20, 10, 3, 1] };
      const newGameState = Commands.roll(gameState, addMessage);
      expect(newGameState.stack).toEqual([40, 10, 30, 20]);
    });

    test('スタックの値が2個未満の場合、rollしてもスタックは変わらないこと', () => {
      const gameState = { ...initialGameState, stack: [10] };
      const newGameState = Commands.roll(gameState, addMessage);
      expect(newGameState.stack).toEqual([10]);
    });

    test('スタックが空の場合、rollしてもスタックは空のまま', () => {
      const gameState = { ...initialGameState, stack: [] };
      const newGameState = Commands.roll(gameState, addMessage);
      expect(newGameState.stack).toEqual([]);
    });

    test('depthがスタックサイズを超える場合、スタックは変わらないこと', () => {
      const gameState = { ...initialGameState, stack: [3, 2, 5, 1] };
      const newGameState = Commands.roll(gameState, addMessage);
      expect(newGameState.stack).toEqual([3, 2, 5, 1]);
    });

    test('offsetが正の場合、正しく回転できること', () => {
      const gameState = { ...initialGameState, stack: [40, 30, 20, 10, 3, 1] };
      const newGameState = Commands.roll(gameState, addMessage);
      expect(newGameState.stack).toEqual([40, 10, 30, 20]);
    });

    test('offsetが負の場合、正しく回転できること', () => {
      const gameState = { ...initialGameState, stack: [40, 30, 20, 10, 3, -1] };
      const newGameState = Commands.roll(gameState, addMessage);
      expect(newGameState.stack).toEqual([40, 20, 10, 30]);
    });

    test('depthが0の場合、正しく回転できること', () => {
      const gameState = { ...initialGameState, stack: [3, 2, 0, 1] };
      const newGameState = Commands.roll(gameState, addMessage);
      expect(newGameState.stack).toEqual([3, 2]);
    });

    test('depthが負の場合、正しく回転できること', () => {
      const gameState = { ...initialGameState, stack: [40, 30, 20, 10, -3, 1] };
      const newGameState = Commands.roll(gameState, addMessage);
      expect(newGameState.stack).toEqual([30, 20, 40, 10]);
    });
  });

  describe('add', () => {
    test('スタックの先頭2つの値を加算できること', () => {
      const gameState = { ...initialGameState, stack: [10, 20] };
      const newGameState = Commands.add(gameState, addMessage);
      expect(newGameState.stack).toEqual([30]);
    });

    test('スタックの値が1個未満の場合、addしてもスタックは変わらないこと', () => {
      const gameState = { ...initialGameState, stack: [10] };
      const newGameState = Commands.add(gameState, addMessage);
      expect(newGameState.stack).toEqual([10]);
    });

    test('スタックが空の場合、addしてもスタックは空のまま', () => {
      const gameState = { ...initialGameState, stack: [] };
      const newGameState = Commands.add(gameState, addMessage);
      expect(newGameState.stack).toEqual([]);
    });
  });

  describe('subtract', () => {
    test('スタックの先頭2つの値を減算できること', () => {
      const gameState = { ...initialGameState, stack: [10, 20] };
      const newGameState = Commands.subtract(gameState, addMessage);
      expect(newGameState.stack).toEqual([-10]);
    });

    test('スタックの値が1個未満の場合、subtractしてもスタックは変わらないこと', () => {
      const gameState = { ...initialGameState, stack: [10] };
      const newGameState = Commands.subtract(gameState, addMessage);
      expect(newGameState.stack).toEqual([10]);
    });

    test('スタックが空の場合、subtractしてもスタックは空のまま', () => {
      const gameState = { ...initialGameState, stack: [] };
      const newGameState = Commands.subtract(gameState, addMessage);
      expect(newGameState.stack).toEqual([]);
    });
  });

  describe('multiply', () => {
    test('スタックの先頭2つの値を乗算できること', () => {
      const gameState = { ...initialGameState, stack: [10, 20] };
      const newGameState = Commands.multiply(gameState, addMessage);
      expect(newGameState.stack).toEqual([200]);
    });

    test('スタックの値が1個未満の場合、multiplyしてもスタックは変わらないこと', () => {
      const gameState = { ...initialGameState, stack: [10] };
      const newGameState = Commands.multiply(gameState, addMessage);
      expect(newGameState.stack).toEqual([10]);
    });

    test('スタックが空の場合、multiplyしてもスタックは空のまま', () => {
      const gameState = { ...initialGameState, stack: [] };
      const newGameState = Commands.multiply(gameState, addMessage);
      expect(newGameState.stack).toEqual([]);
    });
  });

  describe('divide', () => {
    test('スタックの先頭2つの値を割算できること', () => {
      const gameState = { ...initialGameState, stack: [20, 10] };
      const newGameState = Commands.divide(gameState, addMessage);
      expect(newGameState.stack).toEqual([2]);
    });

    test('スタックの値が1個未満の場合、divideしてもスタックは変わらないこと', () => {
      const gameState = { ...initialGameState, stack: [10] };
      const newGameState = Commands.divide(gameState, addMessage);
      expect(newGameState.stack).toEqual([10]);
    });

    test('スタックが空の場合、divideしてもスタックは空のまま', () => {
      const gameState = { ...initialGameState, stack: [] };
      const newGameState = Commands.divide(gameState, addMessage);
      expect(newGameState.stack).toEqual([]);
    });

    test('0で割る場合、スタックは変わらないこと', () => {
      const gameState = { ...initialGameState, stack: [20, 0] };
      const newGameState = Commands.divide(gameState, addMessage);
      expect(newGameState.stack).toEqual([20, 0]);
    });
  });

  describe('modulo', () => {
    test('スタックの先頭2つの値を剰余算できること', () => {
      const gameState = { ...initialGameState, stack: [30, 20] };
      const newGameState = Commands.modulo(gameState, addMessage);
      expect(newGameState.stack).toEqual([10]);
    });

    test('スタックの値が1個未満の場合、moduloしてもスタックは変わらないこと', () => {
      const gameState = { ...initialGameState, stack: [10] };
      const newGameState = Commands.modulo(gameState, addMessage);
      expect(newGameState.stack).toEqual([10]);
    });

    test('スタックが空の場合、moduloしてもスタックは空のまま', () => {
      const gameState = { ...initialGameState, stack: [] };
      const newGameState = Commands.modulo(gameState, addMessage);
      expect(newGameState.stack).toEqual([]);
    });

    test('0で割る場合、スタックは変わらないこと', () => {
      const gameState = { ...initialGameState, stack: [20, 0] };
      const newGameState = Commands.modulo(gameState, addMessage);
      expect(newGameState.stack).toEqual([20, 0]);
    });
  });

  describe('positive', () => {
    test('スタックの先頭の値が正の場合、1をプッシュできること', () => {
      const gameState = { ...initialGameState, stack: [10] };
      const newGameState = Commands.positive(gameState, addMessage);
      expect(newGameState.stack).toEqual([1]);
    });

    test('スタックの先頭の値が0の場合、0をプッシュできること', () => {
      const gameState = { ...initialGameState, stack: [0] };
      const newGameState = Commands.positive(gameState, addMessage);
      expect(newGameState.stack).toEqual([0]);
    });

    test('スタックの先頭の値が負の場合、0をプッシュできること', () => {
      const gameState = { ...initialGameState, stack: [-10] };
      const newGameState = Commands.positive(gameState, addMessage);
      expect(newGameState.stack).toEqual([0]);
    });

    test('スタックが空の場合、positiveしてもスタックは空のまま', () => {
      const gameState = { ...initialGameState, stack: [] };
      const newGameState = Commands.positive(gameState, addMessage);
      expect(newGameState.stack).toEqual([]);
    });
  });

  describe('not', () => {
    test('スタックの先頭の値が0の場合、1をプッシュできること', () => {
      const gameState = { ...initialGameState, stack: [0] };
      const newGameState = Commands.not(gameState, addMessage);
      expect(newGameState.stack).toEqual([1]);
    });

    test('スタックの先頭の値が0でない場合、0をプッシュできること', () => {
      const gameState = { ...initialGameState, stack: [10] };
      const newGameState = Commands.not(gameState, addMessage);
      expect(newGameState.stack).toEqual([0]);
    });

    test('スタックが空の場合、notしてもスタックは空のまま', () => {
      const gameState = { ...initialGameState, stack: [] };
      const newGameState = Commands.not(gameState, addMessage);
      expect(newGameState.stack).toEqual([]);
    });
  });

  describe('readInt', () => {
    test('textarea の先頭から整数としてパースした値を1つ取りプッシュできること', () => {
      const gameState = { ...initialGameState, inputString: '123 abc' };
      const newGameState = Commands.readInt(gameState, addMessage);
      expect(newGameState.stack).toEqual([123]);
      expect(newGameState.inputString).toEqual(' abc');
    });

    test('textarea の先頭が整数でない場合、スタックは変わらないこと', () => {
      const gameState = { ...initialGameState, inputString: 'abc 123' };
      const newGameState = Commands.readInt(gameState, addMessage);
      expect(newGameState.stack).toEqual([]);
      expect(newGameState.inputString).toEqual('abc 123');
    });
  });

  describe('readChar', () => {
    test('textarea から文字を1つ取りそのUnicode値をプッシュできること', () => {
      const gameState = { ...initialGameState, inputString: 'abc' };
      const newGameState = Commands.readChar(gameState, addMessage);
      expect(newGameState.stack).toEqual([97]);
      expect(newGameState.inputString).toEqual('bc');
    });

    test('textarea が空の場合、スタックは変わらないこと', () => {
      const gameState = { ...initialGameState, inputString: '' };
      const newGameState = Commands.readChar(gameState, addMessage);
      expect(newGameState.stack).toEqual([]);
      expect(newGameState.inputString).toEqual('');
    });
  });

  describe('printInt', () => {
    test('スタックの先頭の値を標準出力に出力できること', () => {
      const gameState = { ...initialGameState, stack: [123] };
      const newGameState = Commands.printInt(gameState, addMessage);
      expect(newGameState.stack).toEqual([]);
      expect(newGameState.outputString).toEqual('123\n');
    });

    test('スタックが空の場合、printIntしてもスタックは変わらないこと', () => {
      const gameState = { ...initialGameState, stack: [] };
      const newGameState = Commands.printInt(gameState, addMessage);
      expect(newGameState.stack).toEqual([]);
      expect(newGameState.outputString).toEqual('');
    });
  });

  describe('printChar', () => {
    test('Unicode値がp0である文字を標準出力に出力できること', () => {
      const gameState = { ...initialGameState, stack: [97] };
      const newGameState = Commands.printChar(gameState, addMessage);
      expect(newGameState.stack).toEqual([]);
      expect(newGameState.outputString).toEqual('a');
    });

    test('スタックが空の場合、printCharしてもスタックは変わらないこと', () => {
      const gameState = { ...initialGameState, stack: [] };
      const newGameState = Commands.printChar(gameState, addMessage);
      expect(newGameState.stack).toEqual([]);
      expect(newGameState.outputString).toEqual('');
    });

    test('p0が有効なUnicode値でない場合、スタックは変わらないこと', () => {
      const gameState = { ...initialGameState, stack: [-1] };
      const newGameState = Commands.printChar(gameState, addMessage);
      expect(newGameState.stack).toEqual([-1]);
      expect(newGameState.outputString).toEqual('');
    });
  });
});
