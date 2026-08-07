import './PortfolioCard.css'

function PortfolioCard({ portfolio }) {
  return (
    <article className="portfolio-card">
      {portfolio.image ? (
        <img
          className="portfolio-card__thumb portfolio-card__thumb--img"
          src={portfolio.image}
          alt=""
          aria-hidden="true"
        />
      ) : (
        <div className="portfolio-card__thumb" aria-hidden="true">
          {portfolio.name.slice(0, 1)}
        </div>
      )}
      <div className="portfolio-card__body">
        <span className="portfolio-card__cohort">{portfolio.cohort}기 수료</span>
        <h3 className="portfolio-card__name">{portfolio.name}</h3>
        <p className="portfolio-card__role">{portfolio.role}</p>
        <p className="portfolio-card__summary">{portfolio.summary}</p>
      </div>
    </article>
  )
}

export default PortfolioCard
