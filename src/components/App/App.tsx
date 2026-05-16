import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

// Сервіси — імпортуємо чисті функції та типи запитів згідно з ТЗ
import {
  fetchNotes,
  deleteNote,
  createNote,
  type CreateNoteParams,
} from "../../services/noteService";

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

  const [localSearch, setLocalSearch] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Відкладений пошук з use-debounce викликається безпосередньо в App за ТЗ
  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1); // Скидаємо пагінацію при пошуку
  }, 500);

  // Оновлений обробник: приймає чистий рядок (string) від SearchBox
  const handleSearchChange = (value: string): void => {
    setLocalSearch(value);
    debouncedSetSearch(value);
  };

  const handleClearSearch = (): void => {
    setLocalSearch("");
    setSearch("");
    setPage(1);
  };

  // HTTP GET запит через TanStack Query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search }),
    placeholderData: (previousData) => previousData,
  });

  // HTTP POST запит (Мутація створення)
  const createMutation = useMutation({
    mutationFn: (newNoteData: CreateNoteParams) => createNote(newNoteData),
    onSuccess: () => {
      setIsModalOpen(false);
      setPage(1);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  // HTTP DELETE запит (Мутація видалення)
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const notes = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {/* Синхронізовано з виправленим SearchBox (приймає рядок) */}
        <SearchBox value={localSearch} onChange={handleSearchChange} />

        {/* Пагінація рендериться лише якщо кількість сторінок більше 1 */}
        {!isLoading && !isError && totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        <button
          className={css.button}
          onClick={() => setIsModalOpen(true)}
          type="button"
        >
          Create note +
        </button>
      </header>

      <main style={{ marginTop: "20px" }}>
        {isLoading && <Loader message="Fetching your notes from NoteHub..." />}

        {isError && (
          <ErrorMessage
            message="Failed to load notes. Check your internet connection or VITE_NOTEHUB_TOKEN."
            onRetry={refetch}
          />
        )}

        {/* Колекція нотаток рендериться лише якщо є елементи */}
        {!isLoading && !isError && notes.length > 0 && (
          <NoteList
            items={notes}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        )}

        {!isLoading && !isError && notes.length === 0 && (
          <EmptyState
            isSearchActive={search.length > 0}
            onClearSearch={handleClearSearch}
          />
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm
          onSubmit={(formData) => {
            createMutation.mutate(formData);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
