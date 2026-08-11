import { useEffect, useRef, useState } from 'react'
import { achievements } from '../data/achievements.js'
import CountUpValue from './CountUpValue.jsx'
import './AchievementBanner.css'

const REPLAY_INTERVAL = 6000

function AchievementBanner() {
  const sectionRef = useRef(null)
  const [active, setActive] = useState(false)
  const [cycle, setCycle] = useState(0)

  // 배너가 화면에 보이는 동안 카운트업 애니메이션을 재생한다(한 번만 재생하고
  // 끝내면, 홈 진입 시 뜨는 팝업에 가려서 애니메이션을 아예 못 보는 경우가
  // 생겨서, 화면에 보이는 동안은 몇 초마다 반복 재생되게 한다).
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!active) return
    const timer = setInterval(() => setCycle((c) => c + 1), REPLAY_INTERVAL)
    return () => clearInterval(timer)
  }, [active])

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
                  key={cycle}
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
