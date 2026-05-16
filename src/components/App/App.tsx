import { useState, type ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

// ЗМІНЕНО: Імпортуємо тип (type) із нашого централізованого файлу типів note.ts
import type { CreateNoteParams } from "../../types/note";

// Сервіси — імпортуємо тільки чисті JavaScript функції
import { fetchNotes, deleteNote, createNote } from "../../services/noteService";

// Компоненти інтерфейсу
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

// Додаткові компоненти статусів
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import EmptyState from "../EmptyState/EmptyState";

// Стилі
import css from "./App.module.css";

const PER_PAGE = 12;

export default function App() {
  const queryClient = useQueryClient();

  // Стейт для миттєвого відображення введених букв в інпуті
  const [localSearch, setLocalSearch] = useState<string>("");

  // Стейт для запиту на бекенд (оновлюється із затримкою)
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Відкладений пошук з use-debounce викликається безпосередньо в App
  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1); // Скидаємо пагінацію на першу сторінку при новому пошуку
  }, 500);

  // Обробник зміни тексту в полі пошуку
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setLocalSearch(value);
    debouncedSetSearch(value);
  };

  // Очищення параметрів пошуку
  const handleClearSearch = (): void => {
    setLocalSearch("");
    setSearch("");
    setPage(1);
  };

  // HTTP GET запит через TanStack Query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search }),
    placeholderData: (previousData) => previousData, // Плавний перехід сторінок
  });

  // HTTP POST запит (Мутація створення нотатки)
  const createMutation = useMutation({
    mutationFn: (newNoteData: CreateNoteParams) => createNote(newNoteData),
    onSuccess: () => {
      setIsModalOpen(false);
      setPage(1); // Повертаємо на першу сторінку для відображення запису
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  // HTTP DELETE запит (Мутація видалення нотатки)
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      // Оновлюємо та автоматично пересинхронізовуємо збережені серверні дані
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const notes = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {/* Компонент SearchBox */}
        <SearchBox value={localSearch} onChange={handleSearchChange} />

        {/* Пагінація рендериться лише якщо кількість сторінок більше 1 */}
        {!isLoading && !isError && totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        {/* Кнопка створення нотатки відповідно до структури ТЗ */}
        <button
          className={css.button}
          onClick={() => setIsModalOpen(true)}
          type="button"
        >
          Create note +
        </button>
      </header>

      <main style={{ marginTop: "20px" }}>
        {/* 1. Індикатор завантаження під час HTTP-запитів */}
        {isLoading && <Loader message="Fetching your notes from NoteHub..." />}

        {/* 2. Повідомлення про помилку запиту */}
        {isError && (
          <ErrorMessage
            message="Failed to load notes. Check your internet connection or VITE_NOTEHUB_TOKEN."
            onRetry={refetch}
          />
        )}

        {/* 3. Колекція нотаток (рендериться лише якщо є хоча б один елемент) */}
        {!isLoading && !isError && notes.length > 0 && (
          <NoteList
            items={notes}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        )}

        {/* 4. Інформаційне повідомлення про інші статуси (порожня колекція / нічого не знайдено) */}
        {!isLoading && !isError && notes.length === 0 && (
          <EmptyState
            isSearchActive={search.length > 0}
            onClearSearch={handleClearSearch}
          />
        )}
      </main>

      {/* Універсальне портальне модальне вікно */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm
          onSubmit={async (formData) => {
            createMutation.mutate(formData);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
