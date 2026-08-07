import { facilities } from '../data/facilities.js'
import BottomCta from '../components/BottomCta.jsx'
import './Facilities.css'

function Facilities() {
  return (
    <main className="facilities">
      <div className="facilities__inner">
        <h1>교육시설 소개</h1>
        <p className="facilities__desc">
          쾌적한 환경에서 이론과 실습, 협업과 상담까지 모두 진행할 수 있도록 공간을
          구성했습니다.
        </p>

        <div className="facilities__grid">
          {facilities.map((f) => (
            <article key={f.id} className="facilities__card">
              <div className="facilities__media">
                {f.image ? (
                  <img src={f.image} alt="" />
                ) : (
                  <div className="facilities__placeholder" aria-label="사진 준비 중">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <span>사진 준비 중</span>
                  </div>
                )}
              </div>
              <div className="facilities__body">
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <BottomCta />
    </main>
  )
}

export default Facilities
