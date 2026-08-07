import { Link } from 'react-router-dom'
import { history } from '../data/aboutContent.js'
import BottomCta from '../components/BottomCta.jsx'
import './History.css'

function History() {
  return (
    <main className="history">
      <div className="history__inner">
        <h1>학원 연혁</h1>
        <p className="history__desc">
          2025년 설립 이후 지금까지의 발자취입니다. 학원소개 페이지에서{' '}
          <Link to="/about">주요 연혁 요약</Link>도 확인하실 수 있습니다.
        </p>

        <ol className="history__timeline">
          {history.map((h) => (
            <li key={h.id} className="history__item">
              <span className="history__dot" aria-hidden="true" />
              <span className="history__year">{h.year}</span>
              <span className="history__desc-text">{h.desc}</span>
            </li>
          ))}
        </ol>
      </div>

      <BottomCta />
    </main>
  )
}

export default History
