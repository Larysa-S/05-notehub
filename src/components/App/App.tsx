import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

// Імпортую чисту функцію запиту списку
import { fetchNotes } from "../../services/noteService";

import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import EmptyState from "../EmptyState/EmptyState";

import css from "./App.module.css";

const PER_PAGE = 12;

export default function App() {
  const [localSearch, setLocalSearch] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1); // Скидаю пагінацію при пошуку
  }, 500);

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

  // мапінг згідно з структурою відповіді API { notes, totalPages }
  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ? Number(data.totalPages) : 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
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

        {/* Списку передаэться проп notes */}
        {!isLoading && !isError && notes.length > 0 && (
          <NoteList notes={notes} />
        )}

        {!isLoading && !isError && notes.length === 0 && (
          <EmptyState
            isSearchActive={search.length > 0}
            onClearSearch={handleClearSearch}
          />
        )}
      </main>

      {}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
