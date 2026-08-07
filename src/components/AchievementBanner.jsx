import { useEffect, useRef, useState } from 'react'
import { achievements } from '../data/achievements.js'
import CountUpValue from './CountUpValue.jsx'
import './AchievementBanner.css'

function AchievementBanner() {
  const sectionRef = useRef(null)
  const [active, setActive] = useState(false)

  // 배너가 화면에 처음 들어올 때 한 번만 카운트업 애니메이션을 트리거한다.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="achievement-banner" aria-label="실적 및 수상 내역" ref={sectionRef}>
      <ul className="achievement-banner__list">
        {achievements.map((item) => (
          <li key={item.id} className="achievement-banner__item">
            <strong className="achievement-banner__value">
              {item.icon && (
                <img
                  className="achievement-banner__icon"
                  src={item.icon}
                  alt=""
                  aria-hidden="true"
                />
              )}
              {item.to != null ? (
                <CountUpValue
                  to={item.to}
                  decimals={item.decimals}
                  suffix={item.suffix}
                  active={active}
                />
              ) : (
                item.staticValue
              )}
            </strong>
            <span className="achievement-banner__label">{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default AchievementBanner
