import { contactInfo } from '../data/contactInfo.js'
import './KakaoConsultModal.css'

function KakaoConsultModal({ dialogRef }) {
  function close() {
    dialogRef.current?.close()
  }

  function handleBackdropClick(e) {
    if (e.target === dialogRef.current) close()
  }

  return (
    <dialog ref={dialogRef} className="kakao-consult-modal" onClick={handleBackdropClick}>
      <div className="kakao-consult-modal__content">
        <button
          type="button"
          className="kakao-consult-modal__close"
          onClick={close}
          aria-label="닫기"
        >
          ✕
        </button>
        <img
          className="kakao-consult-modal__icon"
          src="/icons/kakao.png"
          alt=""
          aria-hidden="true"
        />
        <h2>카카오톡 상담</h2>
        <p>
          카카오톡 채널을 추가하시면 채팅으로 편하게 1:1 상담을 받으실 수
          있습니다.
        </p>
        {contactInfo.kakaoChannelId ? (
          <a
            className="btn btn--primary"
            href={`https://pf.kakao.com/${contactInfo.kakaoChannelId}/friend`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
          >
            채널 추가하기
          </a>
        ) : (
          <p className="kakao-consult-modal__soon">
            채널을 준비 중입니다. 오픈되면 이 안내로 바로 연결해 드릴게요.
          </p>
        )}
      </div>
    </dialog>
  )
}

export default KakaoConsultModal
