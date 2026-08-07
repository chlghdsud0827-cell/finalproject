import { contactInfo } from '../data/contactInfo.js'
import KakaoMap from '../components/KakaoMap.jsx'
import './Location.css'

function Location() {
  return (
    <main className="location">
      <div className="location__inner">
        <h1>오시는 길</h1>
        <p className="location__desc">교육장 위치와 연락처를 안내해 드립니다.</p>

        <div className="location__content">
          <KakaoMap lat={contactInfo.lat} lng={contactInfo.lng} name={contactInfo.name} />

          <div className="location__info">
            <dl className="location__list">
              <div className="location__row">
                <dt>교육장</dt>
                <dd>{contactInfo.name}</dd>
              </div>
              <div className="location__row">
                <dt>주소</dt>
                <dd>{contactInfo.address}</dd>
              </div>
              <div className="location__row">
                <dt>전화</dt>
                <dd>{contactInfo.phone}</dd>
              </div>
              <div className="location__row">
                <dt>이메일</dt>
                <dd>{contactInfo.email}</dd>
              </div>
              <div className="location__row">
                <dt>운영시간</dt>
                <dd>{contactInfo.hours}</dd>
              </div>
            </dl>

            <h2>오시는 방법</h2>
            <ul className="location__directions">
              {contactInfo.directions.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Location
