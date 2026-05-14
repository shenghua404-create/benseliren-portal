export default function Hero({ content }) {
  return (
    <section className="hero-section" id="top">
      <div className="hero-copy">
        <h1>{content.title}</h1>
        <p>{content.description}</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#contact">
            {content.primaryCta}
          </a>
          <a className="button button-secondary" href="#process">
            {content.secondaryCta}
          </a>
        </div>
      </div>
      <div className="hero-visual" aria-label="本色丽人护肤产品视觉">
        <div className="texture-orbit" aria-hidden="true" />
        <div className="product-still-life" aria-hidden="true">
          <div className="product-bottle">
            <span>本色丽人</span>
          </div>
          <div className="product-jar">
            <span>Repair Cream</span>
          </div>
          <div className="product-tube">
            <span>Skin Serum</span>
          </div>
        </div>
      </div>
    </section>
  );
}
