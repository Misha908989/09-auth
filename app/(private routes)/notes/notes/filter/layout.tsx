import css from "./filterLayout.module.css";

export default function FilterLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className={css.layout}>
      {sidebar}
      <div className={css.content}>{children}</div>
    </div>
  );
}
