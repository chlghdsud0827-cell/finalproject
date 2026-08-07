import { contactInfo } from '../data/contactInfo.js'
import './PhoneConsultModal.css'

function PhoneConsultModal({ dialogRef }) {
  function close() {
    dialogRef.current?.close()
  }

  function handleBackdropClick(e) {
    if (e.target === dialogRef.current) close()
  }

  return (
    <dialog ref={dialogRef} className="phone-consult-modal" onClick={handleBackdropClick}>
      <div className="phone-consult-modal__content">
        <button
          type="button"
          className="phone-consult-modal__close"
          onClick={close}
          aria-label="닫기"
        >
          ✕
        </button>
        <img
          className="phone-consult-modal__icon"
          src="/icons/call.png"
          alt=""
          aria-hidden="true"
        />
        <h2>전화 상담</h2>
        <p>담당 분야에 맞는 번호로 바로 연결하세요.</p>

        <ul className="phone-consult-modal__list">
          {contactInfo.phoneContacts.map((c) => (
            <li key={c.id} className="phone-consult-modal__item">
              <div className="phone-consult-modal__item-info">
                <span className="phone-consult-modal__department">{c.department}</span>
                <span className="phone-consult-modal__desc">{c.desc}</span>
              </div>
              <a className="phone-consult-modal__call" href={`tel:${c.phone}`}>
                {c.phone}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  )
}

export default PhoneConsultModal
