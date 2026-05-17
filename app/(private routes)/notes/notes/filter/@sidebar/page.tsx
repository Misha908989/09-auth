import css from "./sidebar.module.css";
import Link from "next/link";
import { NoteTag } from "@/types/note";

const TAGS: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function Sidebar() {
  return (
    <aside className={css.sidebar}>
      <h3 className={css.heading}>Filter by tag</h3>
      <ul className={css.list}>
        <li>
          <Link href="/notes" className={css.link}>
            All
          </Link>
        </li>
        {TAGS.map((tag) => (
          <li key={tag}>
            <Link href={`/notes/filter/${tag}`} className={css.link}>
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
