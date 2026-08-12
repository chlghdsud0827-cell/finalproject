import { Link } from 'react-router-dom'
import { partners } from '../data/partners.js'
import BottomCta from '../components/BottomCta.jsx'
import './Partners.css'

function Partners() {
  return (
    <main className="partners">
      <div className="partners__inner">
        <h1>채용연계 파트너사</h1>
        <p>
          실무 프로젝트로 포트폴리오를 완성한 수료생은 아래 파트너사와의 채용
          연계를 통해 취업까지 지원받습니다. 채용 시기와 분야는 파트너사 사정에
          따라 달라질 수 있습니다. 채용 연계 전까지의 <Link to="/career-support">
            취업지원
          </Link> 과정도 함께 확인해 보세요.
        </p>

        <div className="partners__grid">
          {partners.map((partner) => (
            <article key={partner.id} className="partners__card">
              {partner.logo ? (
                <div className="partners__logo partners__logo--img">
                  <img src={partner.logo} alt="" aria-hidden="true" />
                </div>
              ) : (
                <div className="partners__logo partners__logo--letter" aria-hidden="true">
                  {partner.name.slice(0, 1)}
                </div>
              )}
              <div className="partners__body">
                <span className="partners__industry">{partner.industry}</span>
                <h3 className="partners__name">{partner.name}</h3>
                <p className="partners__meta">
                  설립 {partner.foundedYear}년 · 사원 {partner.employeeCount}명 · 연매출{' '}
                  {partner.annualRevenue} · {partner.location}
                </p>
                <p className="partners__desc">{partner.description}</p>
                <ul className="partners__fields">
                  {partner.hiringFields.map((field) => (
                    <li key={field}>{field}</li>
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

export default Partners
