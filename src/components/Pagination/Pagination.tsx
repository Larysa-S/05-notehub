import type { ComponentType } from "react";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import css from "./Pagination.module.css";

// Універсальний boilerplate, який підтримує і Vite 8.x.x, і поточну збірку
type ModuleWithDefault<T> = { default: T };

const getReactPaginate = (): ComponentType<ReactPaginateProps> => {
  // Використовуємо подвійне приведення типів через unknown, як просить компілятор
  const moduleObj = ReactPaginateModule as unknown as Record<string, unknown>;

  if (moduleObj && typeof moduleObj === "object" && "default" in moduleObj) {
    return (
      ReactPaginateModule as unknown as ModuleWithDefault<
        ComponentType<ReactPaginateProps>
      >
    ).default;
  }
  return ReactPaginateModule as unknown as ComponentType<ReactPaginateProps>;
};

const ReactPaginate = getReactPaginate();

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // захист від невалідних даних (NaN, undefined, 0, null):
  if (!totalPages || Number.isNaN(totalPages) || totalPages <= 1) {
    return null;
  }

  const handlePageClick = (selectedItem: { selected: number }): void => {
    onPageChange(selectedItem.selected + 1);
  };

  return (
    <ReactPaginate
      forcePage={currentPage - 1}
      pageCount={totalPages}
      onPageChange={handlePageClick}
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
      containerClassName={css.pagination}
      activeClassName={css.active}
      pageClassName={css.pageItem}
      previousClassName={css.prevItem}
      nextClassName={css.nextItem}
      disabledClassName={css.disabled}
    />
  );
}
