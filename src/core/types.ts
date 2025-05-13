export type CellState = 'hidden' | 'revealed' | 'flagged';
export type MineValue = '.' | '*';

export type Revealed = CellState[][];
export type Field = number[][];

export type Operation =
  | { type: 'leftClick'; row: number; col: number }
  | { type: 'rightClick'; row: number; col: number }
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
}
