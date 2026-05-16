import axios, { type AxiosResponse } from "axios";
import type { Note } from "../types/note"; // Залишаємо тут тільки сутність Note за ТЗ

// 1. Інтерфейси запитів та відповідей перенесені сюди згідно з ТЗ
export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface CreateNoteParams {
  title: string;
  content: string; // Нагадування: використовуємо content замість text
  tags?: string[];
}

export interface FetchNotesResponse {
  data: Note[];
  total: number;
  page: number;
  totalPages: number;
}

// 2. Створення екземпляру Axios з ВИПРАВЛЕНИМ правильним URL GoIT NoteHub
const notehubApi = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

// 3. Отримання нотаток (з фільтрацією порожнього пошуку)
export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const queryParams: Record<string, any> = {
    page: params.page,
    perPage: params.perPage,
  };

  if (params.search && params.search.trim() !== "") {
    queryParams.search = params.search;
  }

  const response: AxiosResponse<FetchNotesResponse> = await notehubApi.get(
    "/notes",
    { params: queryParams },
  );
  return response.data;
};

// 4. Створення нової нотатки (Рішення проблеми 400 Bad Request)
export const createNote = async (noteData: CreateNoteParams): Promise<Note> => {
  // Адаптуємо дані під сувору Swagger-специфікацію бекенду GoIT NoteHub:
  // 1. Конвертуємо наш внутрішній 'content' у серверне поле 'text'.
  // 2. Зберігаємо оригінальний регістр тегів з великої літери (як обрав користувач у формі).
  const formattedData = {
    title: noteData.title.trim(),
    text: noteData.content.trim(), // ПРАВИЛЬНО: мапимо контент у text для бази даних бекенду
    tags:
      noteData.tags && noteData.tags.length > 0
        ? noteData.tags.map((tag) => tag.trim()) // Прибираємо лише пробіли, залишаючи "Todo", "Work"
        : ["Todo"], // Fallback-тег за замовчуванням
  };

  const response: AxiosResponse<Note> = await notehubApi.post(
    "/notes",
    formattedData,
  );
  return response.data;
};

// 5. Видалення нотатки за її ID
export const deleteNote = async (noteId: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await notehubApi.delete(
    `/notes/${noteId}`,
  );
  return response.data;
};
