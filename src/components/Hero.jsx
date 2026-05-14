export default function Hero({ content }) {
  const [titleLead, titleRest] = content.title.split('，');

  return (
    <section className="hero-section" id="top">
      <div className="hero-copy">
        <h1 aria-label={content.title}>
          <span>{titleLead}，</span>
          <span>{titleRest}</span>
        </h1>
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
      <div className="hero-visual">
        <img
          alt="本色丽人高端护肤产品静物"
          className="hero-product-image"
          src="./images/hero-product-still-life.png"
        />
      </div>
    </section>
  );
}
