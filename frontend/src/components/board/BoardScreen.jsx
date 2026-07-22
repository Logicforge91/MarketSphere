export default function BoardScreen({ number, title, children, wide = false }) {
  return (
    <section className={`board-screen ${wide ? "wide-screen" : ""}`}>
      <header>{number}. {title}</header>
      <div className="screen-body">{children}</div>
    </section>
  );
}
