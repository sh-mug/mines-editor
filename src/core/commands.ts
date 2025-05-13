import type { GameState } from './types';

function pushInternal(gameState: GameState, value: number): GameState {
  const newStack = [...gameState.stack, value];
  return { ...gameState, stack: newStack };
}

function popInternal(gameState: GameState, numPop: number, addMessage: (message: string) => void): { gameState: GameState, value?: number[] } {
  const newStack = [...gameState.stack];
  if (newStack.length < numPop) {
    addMessage(`⏩ Stack underflow: ${numPop} values needed, but only ${newStack.length} available`);
    return { gameState: gameState };
  }
  const poppedValues: number[] = [];
  for (let i = 0; i < numPop; i++) {
    poppedValues.push(newStack.pop()!);
  }
  const newGameState = { ...gameState, stack: newStack };
  return { gameState: newGameState, value: poppedValues };
}

// スタックに値をプッシュ
// エラー条件：なし
export function push(gameState: GameState, value: number, addMessage: (message: string) => void): GameState {
  addMessage(`☑ Pushed ${value} to stack`);
  return pushInternal({ ...gameState }, value);
}

// スタックから値をポップ
// エラー条件：スタックの値が1個未満
export function pop(gameState: GameState, addMessage: (message: string) => void): GameState {
  const { gameState: newGameState, value } = popInternal(gameState, 1, addMessage);
  if (value !== undefined) {
    addMessage(`☑ Popped ${value} from stack`);
  }
  return newGameState;
}

// p0をプッシュしてp1をプッシュ
// エラー条件：スタックの値が2個未満
export function swap(gameState: GameState, addMessage: (message: string) => void): GameState {
  const poppedValues = popInternal(gameState, 2, addMessage);
  const newStack = [...poppedValues.gameState.stack];
  if (poppedValues.value) {
    newStack.push(poppedValues.value[0], poppedValues.value[1]);
    addMessage(`☑ Swapped ${poppedValues.value[0]} and ${poppedValues.value[1]}`);
    return { ...poppedValues.gameState, stack: newStack };
  }
  return poppedValues.gameState;
}

// スタック全体の要素を逆順に並び替える
// エラー条件：なし
export function reverse(gameState: GameState, addMessage: (message: string) => void): GameState {
  addMessage(`☑ Reversed stack`);
  const newStack = [...gameState.stack].reverse();
  return { ...gameState, stack: newStack };
}

// p0を2回プッシュ
// エラー条件：スタックの値が1個未満
export function duplicate(gameState: GameState, addMessage: (message: string) => void): GameState {
  const { gameState: newGameState, value } = popInternal(gameState, 1, addMessage);
  if (value !== undefined) {
    addMessage(`☑ Duplicated ${value} on stack`);
    return pushInternal(pushInternal({ ...newGameState }, value[0]), value[0]);
  }
  return newGameState;
}

// スタックの深さp1までの値をp0回回転させる
// p1の絶対値がスタックの長さを超える
export function roll(gameState: GameState, addMessage: (message: string) => void): GameState {
  // roll可能かの判定
  if (gameState.stack.length >= 2) {
    const depth = Math.abs(gameState.stack[gameState.stack.length - 2]);
    if (depth > gameState.stack.length - 2) {
      addMessage(`⏩ Roll depth ${depth} exceeds stack size ${gameState.stack.length - 2}`);
      return { ...gameState };
    }
  }
  const { gameState: newGameState, value } = popInternal(gameState, 2, addMessage);
  if (value) {
    const depth = value[1];
    const offset = value[0] % Math.abs(depth);
    // depth が正の場合
    if (depth > 0) {
      // 例: [depth=3, offset=1]: [1, 2, 3, 4] => [1, 4, 2, 3]
      // スタックの先頭から depth 個の要素をスライスし、offset に基づいて回転させる
      const Slice = newGameState.stack.slice(-depth);
      const rotatedSlice = [
        ...Slice.slice(-offset),
        ...Slice.slice(0, -offset),
      ];
      // 回転させたスライスと、残りのスタックを結合して新しいスタックを作成
      const newStack = [
        ...newGameState.stack.slice(0, -depth),
        ...rotatedSlice,
      ];
      addMessage(`☑ Rolled stack with depth ${depth} and offset ${offset}`);
      return { ...newGameState, stack: newStack };
    // depth が負の場合
    } else if (depth < 0) {
      // 例: [depth=-3, offset=1]: [1, 2, 3, 4] => [2, 3, 1, 4]
      // スタックの底から depth 個の要素をスライスし、offset に基づいて回転させる
      const Slice = newGameState.stack.slice(0, -depth);
      const rotatedSlice = [
        ...Slice.slice(offset),
        ...Slice.slice(0, offset),
      ];
      // 回転させたスライスと、残りのスタックを結合して新しいスタックを作成
      const newStack = [
        ...rotatedSlice,
        ...newGameState.stack.slice(-depth),
      ];
      addMessage(`☑ Rolled stack with depth ${depth} and offset ${offset}`);
      return { ...newGameState, stack: newStack };
    // depth がゼロの場合
    } else {
      addMessage(`⏩ Roll depth is zero`);
      return { ...newGameState };
    }
  }
  return newGameState;
}

// (p1 + p0)をプッシュ
// エラー条件：スタックの値が2個未満
export function add(gameState: GameState, addMessage: (message: string) => void): GameState {
  const { gameState: newGameState, value } = popInternal(gameState, 2, addMessage);
  if (value) {
    const sum = value[1] + value[0];
    addMessage(`☑ Added ${value[1]} and ${value[0]} to get ${sum}`);
    return pushInternal({ ...newGameState }, sum);
  }
  return newGameState;
}

// (p1 - p0)をプッシュ
// エラー条件：スタックの値が2個未満
export function subtract(gameState: GameState, addMessage: (message: string) => void): GameState {
  const { gameState: newGameState, value } = popInternal(gameState, 2, addMessage);
  if (value) {
    const diff = value[1] - value[0];
    addMessage(`☑ Subtracted ${value[0]} from ${value[1]} to get ${diff}`);
    return pushInternal({ ...newGameState }, diff);
  }
  return newGameState;
}

// (p1 * p0)をプッシュ
// エラー条件：スタックの値が2個未満
export function multiply(gameState: GameState, addMessage: (message: string) => void): GameState {
  const { gameState: newGameState, value } = popInternal(gameState, 2, addMessage);
  if (value) {
    const product = value[1] * value[0];
    addMessage(`☑ Multiplied ${value[1]} and ${value[0]} to get ${product}`);
    return pushInternal({ ...newGameState }, product);
  }
  return newGameState;
}

// (p1 / p0)をプッシュ
// エラー条件：スタックの値が2個未満, 0除算
export function divide(gameState: GameState, addMessage: (message: string) => void): GameState {
  if (gameState.stack.length >= 2 && gameState.stack[gameState.stack.length - 1] === 0) {
    addMessage(`⏩ Division by zero`);
    return { ...gameState };
  }
  const { gameState: newGameState, value } = popInternal(gameState, 2, addMessage);
  if (value) {
    const quotient = Math.floor(value[1] / value[0]);
    addMessage(`☑ Divided ${value[1]} by ${value[0]} to get ${quotient}`);
    return pushInternal({ ...newGameState }, quotient);
  }
  return newGameState;
}

// (p1 % p0)をプッシュ
// エラー条件：スタックの値が2個未満, 0除算
export function modulo(gameState: GameState, addMessage: (message: string) => void): GameState {
  if (gameState.stack.length >= 2 && gameState.stack[gameState.stack.length - 1] === 0) {
    addMessage(`⏩ Division by zero`);
    return { ...gameState };
  }
  const { gameState: newGameState, value } = popInternal(gameState, 2, addMessage);
  if (value) {
    const mod = value[1] % value[0];
    addMessage(`☑ Modulo ${value[1]} by ${value[0]} to get ${mod}`);
    return pushInternal({ ...newGameState }, mod);
  }
  return newGameState;
}

// p0が正であれば1、正でなければ0をプッシュ
// エラー条件：スタックの値が1個未満
export function positive(gameState: GameState, addMessage: (message: string) => void): GameState {
  const { gameState: newGameState, value } = popInternal(gameState, 1, addMessage);
  if (value) {
    const pos = value[0] > 0 ? 1 : 0;
    addMessage(`☑ Positive check: ${value[0]} is ${pos ? 'positive' : 'not positive'}`);
    return pushInternal({ ...newGameState }, pos);
  }
  return newGameState;
}

// p0が0であれば1、0でなければ0をプッシュ
// エラー条件：スタックの値が1個未満
export function not(gameState: GameState, addMessage: (message: string) => void): GameState {
  const { gameState: newGameState, value } = popInternal(gameState, 1, addMessage);
  if (value) {
    const neg = value[0] === 0 ? 1 : 0;
    addMessage(`☑ Not check: ${value[0]} is ${neg ? 'zero' : 'non-zero'}`);
    return pushInternal({ ...newGameState }, neg);
  }
  return newGameState;
}

// textarea の先頭から整数としてパースした値を1つ取りプッシュ
// エラー条件：パースできない
export function readInt(gameState: GameState, addMessage: (message: string) => void): GameState {
  const match = gameState.inputString.match(/^\s*([-+]?\d+)/);
  if (!match) {
    addMessage(`⏩ No integer available`);
    return { ...gameState };
  }
  const intValue = parseInt(match[1], 10);
  const newInputString = gameState.inputString.slice(match[0].length);
  addMessage(`☑ Read integer: ${intValue}`);
  return {
    ...gameState,
    inputString: newInputString,
    stack: [...gameState.stack, intValue],
  };
}

// textarea から文字を1つ取りそのUnicode値をプッシュ
// エラー条件：入力が空
export function readChar(gameState: GameState, addMessage: (message: string) => void): GameState {
  if (gameState.inputString.length === 0) {
    addMessage(`⏩ No input available`);
    return { ...gameState };
  }
  const char = gameState.inputString.charCodeAt(0);
  const newInputString = gameState.inputString.slice(1);
  addMessage(`☑ Read character: ${String.fromCharCode(char)} (${char})`);
  return {
    ...gameState,
    inputString: newInputString,
    stack: [...gameState.stack, char],
  };
}

// p0を標準出力に出力
// エラー条件：スタックの値が1個未満
export function printInt(gameState: GameState, addMessage: (message: string) => void): GameState {
  const { gameState: newGameState, value } = popInternal(gameState, 1, addMessage);
  if (value) {
    let newOutputString = gameState.outputString;
    addMessage(`☑ Printed integer: ${value[0]}`);
    newOutputString += `${value[0]}`;
    return { ...newGameState, outputString: newOutputString };
  }
  return newGameState;
}

// Unicode値がp0である文字を標準出力に出力
// エラー条件：スタックの値が1個未満, p0が有効なUnicode値でない
export function printChar(gameState: GameState, addMessage: (message: string) => void): GameState {
  if (gameState.stack.length >= 1 && gameState.stack[gameState.stack.length - 1] < 0 || gameState.stack[gameState.stack.length - 1] > 0x10FFFF) {
    addMessage(`⏩ Invalid Unicode value: ${gameState.stack[gameState.stack.length - 1]}`);
    return { ...gameState };
  }
  const { gameState: newGameState, value } = popInternal(gameState, 1, addMessage);
  if (value) {
    let newOutputString = gameState.outputString;
    const char = String.fromCodePoint(value[0]);
    addMessage(`☑ Printed character: ${char} (${value[0]})`);
    newOutputString += char;
    return { ...newGameState, outputString: newOutputString };
  }
  return newGameState;
}
