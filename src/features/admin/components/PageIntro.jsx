export default function PageIntro({ eyebrow, title, description, tips = [], stats = [] }) {
  return (
    <section className="page-intro">
      <div className="page-intro-layout">
        <div className="page-intro-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        <div className="page-intro-side">
          {stats.length > 0 ? (
            <div className="intro-stats">
              {stats.map((stat) => (
                <article className="intro-stat" key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </article>
              ))}
            </div>
          ) : null}

          {tips.length > 0 ? (
            <div className="intro-tips">
              {tips.map((tip) => (
                <div className="intro-tip" key={tip}>
                  {tip}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
