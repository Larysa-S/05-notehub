import type { Note, NoteTag } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  items: Note[];
  onDelete: (id: string) => void;
}

export default function NoteList({ items, onDelete }: NoteListProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <ul className={css.list}>
      {items.map(({ id, title, content, tags }) => {
        let displayTag = "General";

        if (typeof tags === "string") {
          displayTag = tags;
        } else if (Array.isArray(tags) && tags.length > 0) {
          const firstTag = tags[0];
          if (firstTag && typeof firstTag === "object" && "name" in firstTag) {
            displayTag = (firstTag as NoteTag).name;
          } else if (typeof firstTag === "string") {
            displayTag = firstTag;
          }
        }

        return (
          <li key={id} className={css.listItem}>
            <h2 className={css.title}>{title}</h2>
            <p className={css.content}>{content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{displayTag}</span>
              <button
                className={css.button}
                type="button"
                onClick={() => onDelete(id)}
              >
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
