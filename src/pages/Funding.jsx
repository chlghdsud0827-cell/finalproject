import { Link } from 'react-router-dom'
import { fundingIntro, eligibility, costInfo, steps } from '../data/fundingInfo.js'
import { faqBank } from '../data/faqBank.js'
import FaqAccordion from '../components/FaqAccordion.jsx'
import BottomCta from '../components/BottomCta.jsx'
import './Funding.css'

const fundingFaqs = faqBank.filter((f) => f.category === '국비지원・수강료')

function Funding() {
  return (
    <main className="funding">
      <div className="funding__hero">
        <h1>국비지원 안내</h1>
        <p>{fundingIntro}</p>
        <Link className="btn btn--primary" to="/course">
          과정 지원하기 <span aria-hidden="true">›</span>
        </Link>
      </div>

      <section className="funding__section" aria-label="지원 대상">
        <h2>지원 대상</h2>
        <ul className="funding__checklist">
          {eligibility.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="funding__section" aria-label="수강료 안내">
        <h2>수강료 안내</h2>
        <dl className="funding__cost-list">
          {costInfo.map((c) => (
            <div key={c.label} className="funding__cost-row">
              <dt>{c.label}</dt>
              <dd>{c.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="funding__section" aria-label="신청 절차">
        <h2>신청 절차</h2>
        <ol className="funding__steps">
          {steps.map((s) => (
            <li key={s.id} className="funding__step">
              <span className="funding__step-num">{s.id}</span>
              <div>
                <p className="funding__step-title">{s.title}</p>
                <p className="funding__step-desc">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <FaqAccordion items={fundingFaqs} title="국비지원・수강료 FAQ" />

      <p className="funding__more-desc">
        더 자세한 안내는 <Link to="/faq">전체 FAQ</Link>에서 확인하거나,{' '}
        <Link to="/inquiry">문의 게시판</Link>에 남겨주시면 담당자가 답변해
        드립니다.
      </p>

      <BottomCta />
    </main>
  )
}

export default Funding
