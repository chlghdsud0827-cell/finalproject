import './ReviewCard.css'

function ReviewCard({ review }) {
  return (
    <article className="review-card">
      <div className="review-card__head">
        <div className="review-card__avatar" aria-hidden="true">
          {review.name.slice(0, 1)}
        </div>
        <div>
          <h3 className="review-card__name">
            {review.name} <span className="review-card__cohort">{review.cohort}기 수료</span>
          </h3>
          <p className="review-card__background">{review.background}</p>
        </div>
      </div>

      <p className="review-card__hired">
        <span className="badge badge--success">취업 성공</span>
        {review.hiredCompany} · {review.hiredRole}
      </p>

      <blockquote className="review-card__quote">“{review.quote}”</blockquote>

      <details className="review-card__interview">
        <summary>인터뷰 더보기</summary>
        <dl className="review-card__qa">
          {review.qa.map((item) => (
            <div key={item.q} className="review-card__qa-item">
              <dt>Q. {item.q}</dt>
              <dd>A. {item.a}</dd>
            </div>
          ))}
        </dl>
      </details>
    </article>
  )
}

export default ReviewCard
