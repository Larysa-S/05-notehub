import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

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
  // Обробник кліку на нову сторінку
  const handlePageClick = (selectedItem: { selected: number }) => {
    onPageChange(selectedItem.selected + 1);
  };

  return (
    <ReactPaginate
      forcePage={currentPage - 1} // Передаємо поточну сторінку (0-indexed)
      pageCount={totalPages}
      onPageChange={handlePageClick}
      previousLabel="← Назад"
      nextLabel="Вперед →"
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
