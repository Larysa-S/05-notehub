export interface NoteTag {
  id: string;
  name: string;
  color?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags?: NoteTag[] | string[] | unknown;
  createdAt: string;
  updatedAt: string;
}
