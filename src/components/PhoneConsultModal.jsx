import { useState } from 'react'
import { contactInfo } from '../data/contactInfo.js'
import { useCallbackRequests } from '../context/CallbackContext.jsx'
import './PhoneConsultModal.css'

function PhoneConsultModal({ dialogRef }) {
  const { createCallbackRequest } = useCallbackRequests()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [content, setContent] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function close() {
    dialogRef.current?.close()
  }

  function handleBackdropClick(e) {
    if (e.target === dialogRef.current) close()
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    createCallbackRequest(name.trim(), phone.trim(), content.trim())
    setName('')
    setPhone('')
    setContent('')
    setSubmitted(true)
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

        <div className="phone-consult-modal__divider">
          <span>또는</span>
        </div>

        {submitted ? (
          <p className="phone-consult-modal__result">
            신청이 접수됐습니다. 남겨주신 연락처로 담당자가 연락드릴게요.
          </p>
        ) : (
          <form className="phone-consult-modal__form" onSubmit={handleSubmit}>
            <p className="phone-consult-modal__form-desc">
              지금 통화하기 어려우신가요? 번호를 남겨주시면 저희가 먼저 연락드립니다.
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              required
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="연락처 (010-0000-0000)"
              required
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
              placeholder="문의 내용 (선택)"
            />
            <button className="btn btn--secondary" type="submit">
              연락 요청하기
            </button>
          </form>
        )}
      </div>
    </dialog>
  )
}

export default PhoneConsultModal
