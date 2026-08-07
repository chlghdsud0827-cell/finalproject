import { Link } from 'react-router-dom'
import './BottomCta.css'

function BottomCta() {
  return (
    <section className="bottom-cta" aria-label="상담 신청 안내">
      <div className="bottom-cta__inner">
        <p className="bottom-cta__text">
          <img
            className="bottom-cta__icon"
            src="/icons/support.png"
            alt=""
            aria-hidden="true"
          />
          아직 고민 중이신가요? 지금 바로 상담 신청하고 궁금한 점을 확인하세요.
        </p>
        <Link className="btn btn--primary" to="/consultation">
          지금 상담 신청하기
        </Link>
      </div>
    </section>
  )
}

export default BottomCta
