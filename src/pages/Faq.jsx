import { useState } from 'react'
import { Link } from 'react-router-dom'
import { faqBank, FAQ_CATEGORIES } from '../data/faqBank.js'
import FaqAccordion from '../components/FaqAccordion.jsx'
import './Faq.css'

function Faq() {
  const [query, setQuery] = useState('')

  const normalized = query.trim().toLowerCase()
  const filtered = normalized
    ? faqBank.filter(
        (f) =>
          f.question.toLowerCase().includes(normalized) ||
          f.answer.toLowerCase().includes(normalized),
      )
    : faqBank

  const groups = FAQ_CATEGORIES.map((category) => ({
    category,
    items: filtered.filter((f) => f.category === category),
  })).filter((g) => g.items.length > 0)

  return (
    <main className="faq-page">
      <div className="faq-page__head">
        <h1>자주 묻는 질문</h1>
        <p>궁금한 내용을 검색하거나, 카테고리별로 살펴보세요.</p>

        <input
          type="search"
          className="faq-page__search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="궁금한 내용을 검색해 보세요 (예: 수강료, 노트북)"
        />
      </div>

      {groups.length === 0 ? (
        <p className="faq-page__empty">
          검색 결과가 없습니다. 다른 키워드로 검색하거나{' '}
          <Link to="/inquiry">문의 게시판</Link>에 남겨주세요.
        </p>
      ) : (
        groups.map((group) => (
          <FaqAccordion key={group.category} items={group.items} title={group.category} />
        ))
      )}
    </main>
  )
}

export default Faq
