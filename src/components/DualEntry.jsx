export default function DualEntry({ cards }) {
  return (
    <section className="section dual-entry" id="services">
      <div className="section-heading">
        <span>双路径合作</span>
        <h2>既能承接代加工，也能展示自有产品气质</h2>
      </div>
      <div className="entry-grid">
        {cards.map((card) => (
          <article className="entry-card" key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.summary}</p>
            <ul>
              {card.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
