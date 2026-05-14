export default function PhilosophyContact({ philosophy, contactOptions, submitted, onSubmit }) {
  return (
    <section className="section philosophy-contact" id="contact">
      <div className="philosophy-panel">
        <span>品牌理念</span>
        <h2>东方审美不是装饰，而是产品体验的秩序感</h2>
        {philosophy.map((item) => (
          <p key={item}>{item}</p>
        ))}
        <div className="contact-notes">
          {contactOptions.contactNotes.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </div>
      <form className="consult-form" onSubmit={onSubmit}>
        <div className="form-heading">
          <span>联系咨询</span>
          <h2>告诉我们你的产品阶段</h2>
        </div>
        <label>
          姓名
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label>
          品牌阶段
          <select name="brandStage" defaultValue={contactOptions.brandStages[0]}>
            {contactOptions.brandStages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </label>
        <label>
          需求类型
          <select name="requestType" defaultValue={contactOptions.requestTypes[0]}>
            {contactOptions.requestTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label>
          联系方式
          <input name="contact" type="text" autoComplete="tel" required />
        </label>
        <label>
          留言
          <textarea name="message" rows="4" required />
        </label>
        <button className="button button-primary" type="submit">
          提交咨询
        </button>
        {submitted ? (
          <p className="form-success" role="status">
            咨询信息已记录在当前页面，请通过下方联系方式继续沟通。
          </p>
        ) : null}
      </form>
    </section>
  );
}
