import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useConsultations } from '../context/ConsultationContext.jsx'
import { CONSULTATION_CATEGORIES } from '../data/mentors.js'
import './ConsultationRequest.css'

function ConsultationRequest() {
  const { requestConsultation } = useConsultations()
  const [category, setCategory] = useState(CONSULTATION_CATEGORIES[0])
  const [content, setContent] = useState('')
  const [result, setResult] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim()) return

    requestConsultation(category, content.trim())
    setResult(true)
    setContent('')
  }

  return (
    <main className="consultation-request">
      <div className="consultation-request__inner">
        <h1>멘토 상담 신청</h1>
        <p>
          분야를 선택하고 내용을 남기면, 담당자가 신청 내용을 확인한 뒤 가장 적합한
          멘토를 직접 배정해드립니다. <Link to="/mentors">멘토 소개 보기 →</Link>
        </p>

        <form className="consultation-request__form" onSubmit={handleSubmit}>
          <label>
            상담 분야
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CONSULTATION_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label>
            상담 내용
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="상담받고 싶은 내용을 적어주세요."
              required
            />
          </label>

          <button className="btn btn--primary" type="submit">
            신청하기
          </button>
        </form>

        {result && (
          <p className="consultation-request__result">
            상담 신청이 접수되었습니다. 담당자가 신청 내용을 확인한 후 멘토를
            배정해드립니다.
          </p>
        )}

        <Link className="consultation-request__link" to="/mypage">
          내 상담 현황 보기
        </Link>
      </div>
    </main>
  )
}

export default ConsultationRequest
