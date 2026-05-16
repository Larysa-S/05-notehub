import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  items: Note[];
  onDelete: (id: string) => void;
}

export default function NoteList({ items, onDelete }: NoteListProps) {
  return (
    <ul className={css.list}>
      {items.map(({ id, title, text, tags }) => (
        <li key={id} className={css.listItem}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{text}</p>
          <div className={css.footer}>
            {/* Відображення тегів, якщо вони є у нотатки */}
            {tags &&
              tags.map((tag) => (
                <span key={tag.id} className={css.tag}>
                  {tag.name}
                </span>
              ))}
            <button
              className={css.button}
              type="button"
              onClick={() => onDelete(id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
