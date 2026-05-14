export default function CapabilitySection({ items }) {
  return (
    <section className="section capabilities" aria-labelledby="capability-title">
      <div className="section-heading compact">
        <span>代加工能力</span>
        <h2 id="capability-title">让创业品牌从想法走到样品确认</h2>
      </div>
      <div className="capability-list">
        {items.map((item) => (
          <article className="capability-item" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
