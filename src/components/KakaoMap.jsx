import { useEffect, useRef, useState } from 'react'
import './KakaoMap.css'

const APP_KEY = import.meta.env.VITE_KAKAO_MAP_APP_KEY

function loadKakaoMapsScript(appKey) {
  if (window.kakao?.maps) return Promise.resolve()

  const existing = document.querySelector('script[data-kakao-maps]')
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => window.kakao.maps.load(resolve))
      existing.addEventListener('error', reject)
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`
    script.dataset.kakaoMaps = 'true'
    script.onload = () => window.kakao.maps.load(resolve)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// 카카오맵 연동. 카카오 디벨로퍼스에서 발급받은 JavaScript 키가
// .env.local의 VITE_KAKAO_MAP_APP_KEY에 설정되어 있어야 실제 지도가 표시된다.
// (해당 앱에 사용 중인 도메인이 등록되어 있어야 함 — 카카오 디벨로퍼스 > 플랫폼 > Web)
// 설정 전이거나 로드에 실패하면 기존 placeholder 안내로 대체 표시한다.
function KakaoMap({ lat, lng, name }) {
  const mapRef = useRef(null)
  const [status, setStatus] = useState(APP_KEY ? 'loading' : 'unconfigured')

  useEffect(() => {
    if (!APP_KEY) return

    let cancelled = false

    loadKakaoMapsScript(APP_KEY)
      .then(() => {
        if (cancelled || !mapRef.current) return
        const center = new window.kakao.maps.LatLng(lat, lng)
        const map = new window.kakao.maps.Map(mapRef.current, {
          center,
          level: 4,
        })
        new window.kakao.maps.Marker({ position: center, map, title: name })
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [lat, lng, name])

  return (
    <div className="kakao-map">
      <div className="kakao-map__canvas" ref={mapRef} />
      {status !== 'ready' && (
        <div className="kakao-map__placeholder" aria-label="지도 영역">
          지도 영역
          <span>
            {status === 'unconfigured'
              ? 'VITE_KAKAO_MAP_APP_KEY 설정 후 지도가 표시됩니다'
              : status === 'error'
                ? '지도를 불러오지 못했습니다'
                : '지도를 불러오는 중입니다...'}
          </span>
        </div>
      )}
    </div>
  )
}

export default KakaoMap
