import { Link } from 'react-router-dom'
import { partners } from '../data/partners.js'
import './PartnerMarquee.css'

function PartnerMarquee() {
  // 끊김 없는 무한 루프를 위해 목록을 2배로 복제한다.
  const items = [...partners, ...partners]

  return (
    <section className="partner-marquee" aria-label="취업 연계 파트너사">
      <p className="partner-marquee__label">
        <Link to="/partners">취업 연계 파트너사 →</Link>
      </p>
      <div className="partner-marquee__viewport">
        <div className="partner-marquee__track">
          {items.map((partner, i) => (
            <span key={`${partner.id}-${i}`} className="partner-marquee__item">
              {partner.logo && (
                <img
                  className="partner-marquee__logo"
                  src={partner.logo}
                  alt=""
                  aria-hidden="true"
                />
              )}
              {partner.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PartnerMarquee
