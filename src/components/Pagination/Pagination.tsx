import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

// Назва інтерфейсу відповідає схемі Ім’яКомпонентаProps за ТЗ
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
  // Умова за ТЗ: рендериться лише якщо кількість сторінок більше 1
  if (totalPages <= 1) {
    return null;
  }

  // Обробник кліку на нову сторінку з типізацією параметра
  const handlePageClick = (selectedItem: { selected: number }): void => {
    onPageChange(selectedItem.selected + 1);
  };

  return (
    <ReactPaginate
      forcePage={currentPage - 1} // Передаємо поточну сторінку (0-indexed)
      pageCount={totalPages}
      onPageChange={handlePageClick}
      previousLabel="←" // Лаконічні стрілочки відповідно до стилів NoteHub
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
