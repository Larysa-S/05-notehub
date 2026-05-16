export interface NoteTag {
  id: string;
  name: string;
  color?: string;
}

export interface Note {
  id: string;
  title: string;
  text: string;
  tags?: NoteTag[];
  createdAt: string;
  updatedAt: string;
}

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface CreateNoteParams {
  title: string;
  text: string;
  tags?: string[];
}

export interface FetchNotesResponse {
  data: Note[];
  total: number;
  page: number;
  totalPages: number;
}
