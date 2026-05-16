export type NoteCategory =
  | "Todo"
  | "Work"
  | "Personal"
  | "Meeting"
  | "Shopping";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteCategory; // Тільки одна властивість tag типу рядка/літерала
  createdAt: string;
  updatedAt: string;
}
