import axios, { type AxiosResponse } from "axios";
import type { Note, NoteCategory } from "../types/note";

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteCategory;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const notehubApi = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const queryParams: Record<string, unknown> = {
    page: params.page,
    perPage: params.perPage,
  };

  if (params.search && params.search.trim() !== "") {
    queryParams.search = params.search.trim();
  }

  const response: AxiosResponse<FetchNotesResponse> = await notehubApi.get(
    "/notes",
    { params: queryParams },
  );
  return response.data;
};

export const createNote = async (noteData: CreateNoteParams): Promise<Note> => {
  const response: AxiosResponse<Note> = await notehubApi.post(
    "/notes",
    noteData,
  );
  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await notehubApi.delete(
    `/notes/${noteId}`,
  );
  return response.data;
};
