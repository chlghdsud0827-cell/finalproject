import { useRef } from 'react'
import { Link } from 'react-router-dom'
import KakaoConsultModal from './KakaoConsultModal.jsx'
import PhoneConsultModal from './PhoneConsultModal.jsx'
import './FloatingConsult.css'

function FloatingConsult() {
  const detailsRef = useRef(null)
  const kakaoDialogRef = useRef(null)
  const phoneDialogRef = useRef(null)

  function close() {
    if (detailsRef.current) detailsRef.current.open = false
  }

  function openKakaoModal() {
    close()
    kakaoDialogRef.current?.showModal()
  }

  function openPhoneModal() {
    close()
    phoneDialogRef.current?.showModal()
  }

  return (
    <>
      <details className="floating-consult" ref={detailsRef}>
        <summary className="floating-consult__button" aria-label="상담 메뉴 열기">
          <img src="/icons/support.png" alt="" aria-hidden="true" />
          <span className="floating-consult__bubble" aria-hidden="true">
            상담하기
          </span>
        </summary>
        <div className="floating-consult__menu">
          <button
            type="button"
            className="floating-consult__item"
            onClick={openPhoneModal}
          >
            <img src="/icons/call.png" alt="" aria-hidden="true" /> 전화 상담
          </button>
          <Link className="floating-consult__item" to="/inquiry" onClick={close}>
            <img src="/icons/writing.png" alt="" aria-hidden="true" /> 1:1 문의
          </Link>
          <button
            type="button"
            className="floating-consult__item"
            onClick={openKakaoModal}
          >
            <img src="/icons/kakao.png" alt="" aria-hidden="true" /> 카카오톡 상담
          </button>
        </div>
      </details>
      <PhoneConsultModal dialogRef={phoneDialogRef} />
      <KakaoConsultModal dialogRef={kakaoDialogRef} />
    </>
  )
}

export default FloatingConsult
