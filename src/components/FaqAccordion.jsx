import { faqs } from '../data/faqs.js'
import './FaqAccordion.css'

function FaqAccordion({ items = faqs, title = '자주 묻는 질문' }) {
  return (
    <section className="faq-accordion" aria-label={title}>
      <h2 className="faq-accordion__title">{title}</h2>
      <div className="faq-accordion__list">
        {items.map((faq) => (
          <details key={faq.id} className="faq-accordion__item">
            <summary className="faq-accordion__question">{faq.question}</summary>
            <p className="faq-accordion__answer">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export default FaqAccordion
