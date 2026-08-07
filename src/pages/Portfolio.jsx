import { useState } from 'react'
import { portfolios, COHORT_OPTIONS } from '../data/portfolios.js'
import PortfolioCard from '../components/PortfolioCard.jsx'
import './Portfolio.css'

function Portfolio() {
  const [cohort, setCohort] = useState('all')

  const filtered =
    cohort === 'all' ? portfolios : portfolios.filter((p) => p.cohort === cohort)

  return (
    <main className="portfolio-page">
      <div className="portfolio-page__inner">
        <h1>수료생 포트폴리오</h1>
        <p className="portfolio-page__desc">
          기수별 수료생들이 과정을 통해 완성한 프로젝트를 소개합니다.
        </p>

        <div className="portfolio-page__filters" role="tablist">
          <button
            type="button"
            className={`portfolio-page__filter ${
              cohort === 'all' ? 'portfolio-page__filter--active' : ''
            }`}
            onClick={() => setCohort('all')}
          >
            전체
          </button>
          {COHORT_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              className={`portfolio-page__filter ${
                cohort === c ? 'portfolio-page__filter--active' : ''
              }`}
              onClick={() => setCohort(c)}
            >
              {c}기
            </button>
          ))}
        </div>

        <div className="portfolio-page__grid">
          {filtered.map((p) => (
            <PortfolioCard key={p.id} portfolio={p} />
          ))}
        </div>
      </div>
    </main>
  )
}

export default Portfolio
