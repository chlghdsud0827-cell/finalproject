import { Link } from 'react-router-dom'
import './FundingBanner.css'

function FundingBanner() {
  return (
    <section className="funding-banner" aria-label="국비지원 안내">
      <div className="funding-banner__inner">
        <p className="funding-banner__text">
          국민취업지원제도로 수강료 <strong>최대 100%</strong> 지원받고 AI
          UI/UX 디자인 과정을 지금 수강하세요.
        </p>
        <Link className="funding-banner__cta" to="/funding">
          <img
            className="funding-banner__icon"
            src="/icons/funding-badge.png"
            alt=""
            aria-hidden="true"
          />
          국비지원 조회하기 <span aria-hidden="true">›</span>
        </Link>
      </div>
    </section>
  )
}

export default FundingBanner
