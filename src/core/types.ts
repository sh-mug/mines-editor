export type CellState = 'hidden' | 'revealed' | 'flagged';
export type MineValue = '.' | '*';

export type Revealed = CellState[][];
export type Field = number[][];

export type Operation =
  | { type: 'leftClick'; col: number; row: number }
  | { type: 'rightClick'; col: number; row: number }
  | { type: 'toggleFlagMode' }
  | { type: 'noop' };

export interface GameState {
  revealed: Revealed;
  field: Field;
  stack: number[];
  opIndex: number;
  isFlagMode: boolean;
  operations: Operation[];
  inputString: string;
  outputString: string;
  addMessage: (message: string) => void;
  debugMessages: string[];
  clickedRow: number | null;
  clickedCol: number | null;
  everRevealed: boolean[][]; // 各マスが一度でも開かれたかどうか
  safeCellsCount: number; // 安全なマスの総数
  mineCellsCount: number; // 地雷マスの総数
  isFinished: boolean; // ゲームが終了したかどうか
}
