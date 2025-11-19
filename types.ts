import { Timestamp } from 'firebase/firestore';

export interface QuestionBlock {
  block: number;
  title: string;
  subtitle: string;
  questions: string[];
}

export interface Interpretation {
  min: number;
  max: number;
  level: string;
  colorBg: string;
  colorText: string;
  suggestions: string;
}

export interface Result {
  id: number | string;
  date: string | Timestamp | { seconds: number, nanoseconds: number };
  totalScore: number;
  blockScores: Record<string, number>;
  level: string;
  suggestions: string;
  colorBg: string;
  colorText: string;
}

export interface UserState {
  uid: string;
  isAnonymous?: boolean;
}

export type ViewState = 'test' | 'result' | 'history';

export interface AppState {
  loading: boolean;
  user: UserState | null;
  view: ViewState;
  answers: Record<number, number>;
  result: Result | null;
  history: Result[];
  error: string | null;
  isOffline: boolean;
  showClearModal: boolean;
}
