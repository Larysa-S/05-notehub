import { type ReactNode, type MouseEvent, useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

// Назва інтерфейсу пропсів за схемою Ім’яКомпонентаProps
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    // Всі події в колбеках компонентів мають бути типізовані
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Безпечна функція для кліку по бекдропу
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>): void => {
    // Закриваємо модалку тільки якщо клікнули безпосередньо на Backdrop, а не на його вміст
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalRoot = document.getElementById("modal-root");

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick} // Використовуємо безпечний обробник
    >
      <div className={css.modal}>{children}</div>
    </div>,
    modalRoot || document.body,
  );
}
