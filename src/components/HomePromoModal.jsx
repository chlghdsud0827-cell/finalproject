import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import DeadlineCountdown from './DeadlineCountdown.jsx'
import './HomePromoModal.css'

const STORAGE_KEY = 'home-promo-dismissed-until'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

// 홈 진입 시 뜨는 국비지원 과정 안내 팝업. "오늘 하루 다시 보지 않기"는
// localStorage에 오늘 날짜를 저장해 같은 날 안에는 다시 뜨지 않고, 날짜가
// 바뀌면(자정 지나 재방문) 다시 노출된다. 닫기(✕)는 이번 화면만 닫는다.
function HomePromoModal({ course }) {
  const dialogRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === todayKey()) return
    dialogRef.current?.showModal()
  }, [])

  function close() {
    dialogRef.current?.close()
  }

  function handleBackdropClick(e) {
    if (e.target === dialogRef.current) close()
  }

  function handleViewDetails() {
    close()
    navigate('/course')
  }

  function handleDontShowToday() {
    localStorage.setItem(STORAGE_KEY, todayKey())
    close()
  }

  return (
    <dialog ref={dialogRef} className="home-promo-modal" onClick={handleBackdropClick}>
      <div className="home-promo-modal__content">
        <button
          type="button"
          className="home-promo-modal__close"
          onClick={close}
          aria-label="닫기"
        >
          ✕
        </button>

        <div className="home-promo-modal__media">
          {course.promoImage ? (
            <img src={course.promoImage} alt="" aria-hidden="true" />
          ) : (
            <div className="home-promo-modal__media-fallback" />
          )}
          <span className="home-promo-modal__tag">
            국비지원 · {course.currentCohort}기 모집중
          </span>
        </div>

        <div className="home-promo-modal__body">
          <h2>{course.title}</h2>
          <p>{course.summary}</p>

          <DeadlineCountdown deadline={course.applicationDeadline} compact />

          <button
            type="button"
            className="home-promo-modal__cta"
            onClick={handleViewDetails}
          >
            상세보기
          </button>

          <div className="home-promo-modal__links">
            <button type="button" onClick={handleDontShowToday}>
              오늘 하루 다시 보지 않기
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export default HomePromoModal
