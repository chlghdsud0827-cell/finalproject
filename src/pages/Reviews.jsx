import { useState } from 'react'
import { Link } from 'react-router-dom'
import { reviews, REVIEW_COHORT_OPTIONS } from '../data/reviews.js'
import ReviewCard from '../components/ReviewCard.jsx'
import BottomCta from '../components/BottomCta.jsx'
import './Reviews.css'

function Reviews() {
  const [cohort, setCohort] = useState('all')

  const filtered = cohort === 'all' ? reviews : reviews.filter((r) => r.cohort === cohort)

  return (
    <main className="reviews-page">
      <div className="reviews-page__inner">
        <h1>수강생 후기 및 취업 성공사례</h1>
        <p className="reviews-page__desc">
          수료생들이 직접 전하는 과정 후기와 취업 인터뷰입니다. 프로젝트
          결과물이 궁금하시다면 <Link to="/portfolio">수료생 포트폴리오</Link>를,
          이런 취업 성공까지 이어지는 지원 과정이 궁금하시다면{' '}
          <Link to="/career-support">취업지원</Link> 페이지를 함께 확인해
          보세요.
        </p>

        <div className="reviews-page__filters" role="tablist">
          <button
            type="button"
            className={`reviews-page__filter ${
              cohort === 'all' ? 'reviews-page__filter--active' : ''
            }`}
            onClick={() => setCohort('all')}
          >
            전체
          </button>
          {REVIEW_COHORT_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              className={`reviews-page__filter ${
                cohort === c ? 'reviews-page__filter--active' : ''
              }`}
              onClick={() => setCohort(c)}
            >
              {c}기
            </button>
          ))}
        </div>

        <div className="reviews-page__grid">
          {filtered.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>

      <BottomCta />
    </main>
  )
}

export default Reviews
