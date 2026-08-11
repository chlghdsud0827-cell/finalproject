import { Link } from 'react-router-dom'
import DeadlineCountdown from './DeadlineCountdown.jsx'
import './FundingBanner.css'

// 예전엔 지원하기 버튼・마감 카운트다운이 이 배너와 별개로 페이지 중간에
// 뜬금없이 떠 있었음(무엇에 대한 지원인지 맥락이 없었음) — 국비지원과 마감
// 임박을 안내하는 이 배너로 옮겨 "이 과정에 지금 지원하라"는 맥락을 명확히 함.
function FundingBanner({ course }) {
  return (
    <section className="funding-banner" aria-label="국비지원 안내">
      <div className="funding-banner__inner">
        <div className="funding-banner__content">
          <img
            className="funding-banner__icon"
            src="/icons/funding-badge.png"
            alt=""
            aria-hidden="true"
          />
          <p className="funding-banner__text">
            국민취업지원제도로 수강료 <strong>최대 100%</strong> 지원받고 AI
            UI/UX 디자인 과정을 지금 수강하세요.
          </p>
        </div>
        <div className="funding-banner__actions">
          <DeadlineCountdown deadline={course.applicationDeadline} compact />
          <Link className="btn btn--accent funding-banner__apply" to="/course">
            지원하기
          </Link>
          <Link className="funding-banner__cta" to="/funding">
            국비지원 조회하기 <span aria-hidden="true">›</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FundingBanner
