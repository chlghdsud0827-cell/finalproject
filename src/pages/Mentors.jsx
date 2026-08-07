import { Link } from 'react-router-dom'
import { mentors } from '../data/mentors.js'
import BottomCta from '../components/BottomCta.jsx'
import './Mentors.css'

function Mentors() {
  return (
    <main className="mentors">
      <div className="mentors__inner">
        <h1>멘토 소개</h1>
        <p>
          상담을 신청하면 담당자가 신청 내용을 확인해 분야에 맞는 멘토를 1:1로
          배정하고, 포트폴리오・취업・실무 툴・진로 상담을 도와드립니다.{' '}
          <Link to="/consultation">멘토 상담 신청하기 →</Link>
        </p>

        <div className="mentors__grid">
          {mentors.map((mentor) => (
            <article key={mentor.id} className="mentors__card">
              {mentor.photo ? (
                <img
                  className="mentors__avatar mentors__avatar--img"
                  src={mentor.photo}
                  alt=""
                  aria-hidden="true"
                />
              ) : (
                <div className="mentors__avatar mentors__avatar--letter" aria-hidden="true">
                  {mentor.name.slice(0, 1)}
                </div>
              )}
              <div className="mentors__body">
                <h3 className="mentors__name">
                  {mentor.name} <span className="mentors__title">{mentor.title}</span>
                </h3>
                <ul className="mentors__specialties">
                  {mentor.specialties.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <p className="mentors__bio">{mentor.bio}</p>
                <ul className="mentors__career">
                  {mentor.career.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>

      <BottomCta />
    </main>
  )
}

export default Mentors
