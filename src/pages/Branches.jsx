import { useState } from 'react'
import { Link } from 'react-router-dom'
import { branches } from '../data/branches.js'
import KakaoMap from '../components/KakaoMap.jsx'
import '../pages/Location.css'
import './Branches.css'

function Branches() {
  const [selectedId, setSelectedId] = useState(branches[0].id)
  const selected = branches.find((b) => b.id === selectedId)

  return (
    <main className="branches">
      <div className="branches__inner">
        <h1>다른 지점 안내</h1>
        <p className="branches__desc">
          본원 외에 아래 지점에서도 동일한 커리큘럼으로 수강하실 수 있습니다.
          본원(강남) 안내는 <Link to="/location">오시는 길</Link> 페이지를
          참고해 주세요.
        </p>

        <div className="branches__tabs" role="tablist">
          {branches.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`branches__tab ${
                b.id === selectedId ? 'branches__tab--active' : ''
              }`}
              onClick={() => setSelectedId(b.id)}
            >
              {b.name}
            </button>
          ))}
        </div>

        <div className="location__content">
          <KakaoMap lat={selected.lat} lng={selected.lng} name={selected.name} />

          <div className="location__info">
            <dl className="location__list">
              <div className="location__row">
                <dt>지점</dt>
                <dd>{selected.name}</dd>
              </div>
              <div className="location__row">
                <dt>주소</dt>
                <dd>{selected.address}</dd>
              </div>
              <div className="location__row">
                <dt>전화</dt>
                <dd>{selected.phone}</dd>
              </div>
              <div className="location__row">
                <dt>운영시간</dt>
                <dd>{selected.hours}</dd>
              </div>
            </dl>

            <h2>오시는 방법</h2>
            <ul className="location__directions">
              {selected.directions.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Branches
