export default function ProcessSection({ steps }) {
  return (
    <section className="section process-section" id="process">
      <div className="section-heading">
        <span>合作流程</span>
        <h2>清晰推进每一次品牌共创</h2>
      </div>
      <div className="process-grid">
        {steps.map((step) => (
          <article className="process-step" key={step.title}>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
