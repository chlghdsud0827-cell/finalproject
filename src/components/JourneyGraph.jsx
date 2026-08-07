import { useMemo, useState } from 'react'
import { journeySteps } from '../data/journeySteps.js'
import './JourneyGraph.css'

// path는 (0,260)에서 시작해 각 스텝 좌표(1000x300 기준 픽셀)를 순서대로 지나는 완만한 S자 곡선.
// 스텝 위치를 바꾸려면 journeySteps.js의 x/y(%)와 이 path 좌표를 함께 맞춰야 한다.
const CURVE_PATH =
  'M 30 260 C 140 260 140 220 250 220 C 360 220 360 150 470 150 C 580 150 580 90 690 90 C 800 90 800 40 950 40'

// 각 스텝까지의 실제 곡선 길이를 구하기 위한 구간별 서브 패스(스텝 개수만큼).
// journeySteps.js와 순서가 어긋나지 않도록 항상 함께 수정해야 한다.
const CURVE_SEGMENTS = [
  'M 30 260 C 140 260 140 220 250 220',
  'M 250 220 C 360 220 360 150 470 150',
  'M 470 150 C 580 150 580 90 690 90',
  'M 690 90 C 800 90 800 40 950 40',
]

// 곡선을 여러 개로 쪼개 각자 transition-delay를 주면, 호버 도중 다른 스텝으로
// 옮길 때 delay가 "그 순간"부터 다시 계산되어 애니메이션이 끊기거나 중간부터
// 시작하는 것처럼 보인다. 대신 실제 곡선 길이(getTotalLength)를 미리 구해
// 하나로 이어진 선 하나의 stroke-dashoffset만 목표값으로 옮기면, 진행 중에
// 목표가 바뀌어도 브라우저가 현재 위치에서 자연스럽게 재조준한다.
function getPathLength(d) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', d)
  return path.getTotalLength()
}

function JourneyGraph() {
  const [hoveredStep, setHoveredStep] = useState(0)

  const { totalLength, cumulativeLengths } = useMemo(() => {
    let sum = 0
    const cumulative = CURVE_SEGMENTS.map((d) => (sum += getPathLength(d)))
    return { totalLength: sum, cumulativeLengths: cumulative }
  }, [])

  const filledLength = hoveredStep > 0 ? cumulativeLengths[hoveredStep - 1] : 0

  return (
    <section className="journey-graph" aria-label="교육 과정 진행 단계">
      <div className="journey-graph__inner">
        <span className="journey-graph__eyebrow">COURSE JOURNEY</span>
        <h2 className="journey-graph__title">지원부터 취업까지, 어떻게 진행될까요?</h2>

        <div className="journey-graph__chart">
          <svg
            className="journey-graph__svg"
            viewBox="0 0 1000 300"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d={CURVE_PATH} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3" />
            <path
              d={CURVE_PATH}
              className="journey-graph__progress"
              style={{
                strokeDasharray: totalLength,
                strokeDashoffset: totalLength - filledLength,
              }}
            />
            {journeySteps.map((step, i) => (
              <circle
                key={step.id}
                cx={(step.x / 100) * 1000}
                cy={(step.y / 100) * 300}
                r={hoveredStep === i + 1 ? '10' : '7'}
                className={`journey-graph__marker ${
                  hoveredStep === i + 1 ? 'journey-graph__marker--active' : ''
                }`}
              />
            ))}
          </svg>

          {journeySteps.map((step, i) => (
            <div
              key={step.id}
              className={`journey-graph__step journey-graph__step--${step.labelPos}`}
              style={{ left: `${step.x}%`, top: `${step.y}%` }}
              onMouseEnter={() => setHoveredStep(i + 1)}
              onMouseLeave={() => setHoveredStep(0)}
            >
              <span
                className={`journey-graph__step-badge ${
                  hoveredStep === i + 1 ? 'journey-graph__step-badge--active' : ''
                }`}
              >
                STEP {String(i + 1).padStart(2, '0')}
              </span>
              <p className="journey-graph__step-title">{step.title}</p>
              <p className="journey-graph__step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default JourneyGraph
