import { Link } from 'react-router-dom'
import { contactInfo, businessInfo } from '../data/contactInfo.js'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__logo">
          <img src="/logo-mark.png" alt="" aria-hidden="true" />
          AI UI/UX 디자인 아카데미
        </p>

        <nav className="site-footer__nav" aria-label="푸터 메뉴">
          <Link to="/privacy">개인정보처리방침</Link>
          <Link to="/about">학원소개</Link>
          <Link to="/consultation">고객상담센터</Link>
          <Link to="/location">학원위치안내</Link>
          <span className="site-footer__phone">
            대표문의전화 <strong>{contactInfo.phone}</strong>
          </span>
        </nav>

        <div className="site-footer__business">
          <p>
            사업자(법인)명 : {businessInfo.companyName} &nbsp;&nbsp; 사업자등록번호 :{' '}
            {businessInfo.businessRegistrationNo}
          </p>
          <p>통신판매업번호 : {businessInfo.mailOrderNo}</p>
          <p>
            대표 : {businessInfo.ceo} &nbsp;&nbsp; 주소 : {contactInfo.address}
          </p>
          <p>
            교육담당 : {businessInfo.academyName} &nbsp;&nbsp; 학원명 :{' '}
            {businessInfo.academyName} &nbsp;&nbsp; 학원등록번호 :{' '}
            {businessInfo.academyRegistrationNo}
          </p>
          <p>
            대표전화 : {contactInfo.phone} &nbsp;&nbsp; 대표이메일 :{' '}
            <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
          </p>
          <Link to="/course" className="site-footer__tuition">
            수강료안내
          </Link>
        </div>

        <p className="site-footer__copyright">
          © 2026 AI UI/UX 디자인 아카데미. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
