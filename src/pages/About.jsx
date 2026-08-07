import { Link } from 'react-router-dom'
import { missionValues, history } from '../data/aboutContent.js'
import AchievementBanner from '../components/AchievementBanner.jsx'
import BottomCta from '../components/BottomCta.jsx'
import './About.css'

function About() {
  return (
    <main className="about">
      <div className="about__hero">
        <h1>믿을 수 있는 성장 파트너</h1>
        <p>
          AI UI/UX 디자인 아카데미는 AI 툴을 실무처럼 다루는 커리큘럼과 1:1 멘토
          매칭으로 완성하는 UI/UX 디자이너 양성 과정을 운영합니다. 국민취업지원제도로
          수강료 지원도 받을 수 있습니다.
        </p>
      </div>

      <AchievementBanner />

      <section className="about__section" aria-label="교육 철학">
        <h2>교육 철학</h2>
        <div className="about__value-grid">
          {missionValues.map((v) => (
            <article key={v.id} className="about__value-card">
              <img className="about__value-icon" src={v.icon} alt="" aria-hidden="true" />
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about__section" aria-label="연혁">
        <h2>연혁</h2>
        <ul className="about__history">
          {history
            .filter((h) => h.highlight)
            .map((h) => (
              <li key={h.id}>
                <span className="about__history-year">{h.year}</span>
                <span>{h.desc}</span>
              </li>
            ))}
        </ul>
        <p className="about__history-more">
          <Link to="/history">전체 연혁 보기 →</Link>
        </p>
      </section>

      <section className="about__section" aria-label="오시는 길 안내">
        <h2>더 궁금하신가요?</h2>
        <p className="about__more-desc">
          강사진 소개는 <Link to="/instructors">강사진 소개</Link> 페이지에서, 교육장
          위치와 연락처는 <Link to="/location">오시는 길</Link> 페이지에서, 과정에
          대한 자세한 내용은 <Link to="/course">과정 소개</Link> 페이지에서
          확인하실 수 있습니다.
        </p>
      </section>

      <BottomCta />
    </main>
  )
}

export default About
