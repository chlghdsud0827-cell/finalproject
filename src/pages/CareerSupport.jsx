import { Link } from 'react-router-dom'
import { careerSupportIntro, supportProcess, supportPrograms } from '../data/careerSupport.js'
import AchievementBanner from '../components/AchievementBanner.jsx'
import BottomCta from '../components/BottomCta.jsx'
import './CareerSupport.css'

function CareerSupport() {
  return (
    <main className="career-support">
      <div className="career-support__hero">
        <h1>취업지원</h1>
        <p>{careerSupportIntro}</p>
      </div>

      <AchievementBanner />

      <section className="career-support__section" aria-label="취업지원 프로세스">
        <h2>취업지원 프로세스</h2>
        <ol className="career-support__steps">
          {supportProcess.map((s) => (
            <li key={s.id} className="career-support__step">
              <span className="career-support__step-num">{s.id}</span>
              <div>
                <p className="career-support__step-title">{s.title}</p>
                <p className="career-support__step-desc">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="career-support__section" aria-label="지원 프로그램">
        <h2>지원 프로그램</h2>
        <div className="career-support__grid">
          {supportPrograms.map((p) => (
            <article key={p.id} className="career-support__card">
              {p.iconImg ? (
                <img
                  className="career-support__card-icon career-support__card-icon--img"
                  src={p.iconImg}
                  alt=""
                  aria-hidden="true"
                />
              ) : (
                <span className="career-support__card-icon" aria-hidden="true">
                  {p.icon}
                </span>
              )}
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <p className="career-support__more-desc">
        실제 취업 성공 사례가 궁금하다면 <Link to="/reviews">수강생 후기</Link>에서,
        연계 기업 목록은 <Link to="/partners">채용연계 파트너사</Link>에서 확인하실 수
        있습니다.
      </p>

      <BottomCta />
    </main>
  )
}

export default CareerSupport
