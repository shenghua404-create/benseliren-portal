export default function ProductSeries({ items }) {
  return (
    <section className="section product-section" id="products">
      <div className="section-heading">
        <span>自有产品系列</span>
        <h2>以温和肤感建立本色丽人的产品表达</h2>
      </div>
      <div className="product-grid">
        {items.map((item) => (
          <article className={`series-card series-${item.tone}`} key={item.title}>
            <div className="series-visual" aria-hidden="true" />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
