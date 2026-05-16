import axios, { type AxiosResponse } from "axios";
import type {
  Note,
  FetchNotesParams,
  FetchNotesResponse,
  CreateNoteParams,
} from "../types/note";

// 1. Створення екземпляру Axios з базовим URL GoIT NoteHub
const notehubApi = axios.create({
  baseURL: "https://notehub-api.goit.study/",
  headers: {
    common: { Authorisation: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}` },
  },
});

// // // 2. ІНТЕРЦЕПТОР ДЛЯ АВТОМАТИЧНОГО ДОДАВАННЯ BEARER ТОКЕНА

// //   const token = import.meta.env.VITE_NOTEHUB_TOKEN;

// //   // Виводимо значення у консоль, щоб ви точно побачили, чи зчитує його Vite
// //   console.log("Зчитаний токен з .env:", token);

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   } else {
//     console.error(
//       "Помилка: Vite не зміг прочитати VITE_NOTEHUB_TOKEN з файлу .env!",
//     );
//   }
//   return config;
// });

// 3. Отримання нотаток (з фільтрацією порожнього пошуку)
export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const queryParams: Record<string, any> = {
    page: params.page,
    perPage: params.perPage,
  };

  // Додаємо параметр search тільки якщо користувач реально щось ввів, щоб уникнути помилки 400
  if (params.search && params.search.trim() !== "") {
    queryParams.search = params.search;
  }

  const response: AxiosResponse<FetchNotesResponse> = await notehubApi.get(
    "/notes",
    { params: queryParams },
  );
  return response.data;
};

// 4. Створення нової нотатки
export const createNote = async (noteData: CreateNoteParams): Promise<Note> => {
  const response: AxiosResponse<Note> = await notehubApi.post(
    "/notes",
    noteData,
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
