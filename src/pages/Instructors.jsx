import { Link } from 'react-router-dom'
import { instructors } from '../data/instructors.js'
import BottomCta from '../components/BottomCta.jsx'
import './Instructors.css'

function Instructors() {
  return (
    <main className="instructors">
      <div className="instructors__inner">
        <h1>강사진 소개</h1>
        <p>
          현업 실무 경험을 가진 강사진이 커리큘럼 단계별로 직접 수업을 진행하고,
          프로젝트 기간 동안 1:1로 피드백을 드립니다. 커리큘럼 이후 진로・포트폴리오
          상담은 <Link to="/mentors">멘토 소개</Link>에서 담당 멘토를 확인해 주세요.
        </p>

        <div className="instructors__grid">
          {instructors.map((instructor) => (
            <article key={instructor.id} className="instructors__card">
              {instructor.photo ? (
                <img
                  className="instructors__avatar instructors__avatar--img"
                  src={instructor.photo}
                  alt=""
                  aria-hidden="true"
                />
              ) : (
                <div className="instructors__avatar instructors__avatar--letter" aria-hidden="true">
                  {instructor.name.slice(0, 1)}
                </div>
              )}
              <div className="instructors__body">
                <span className="instructors__curriculum">{instructor.curriculum}</span>
                <h3 className="instructors__name">
                  {instructor.name} <span className="instructors__title">{instructor.title}</span>
                </h3>
                <p className="instructors__specialty">{instructor.specialty}</p>
                <p className="instructors__bio">{instructor.bio}</p>
                <ul className="instructors__career">
                  {instructor.career.map((item) => (
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

export default Instructors
