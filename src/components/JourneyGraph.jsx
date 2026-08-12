import { useEffect, useMemo, useRef, useState } from 'react'
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
  // 모바일(세로 타임라인)에서는 마우스 호버가 없으니, PC의 "호버한 단계까지
  // 선이 채워지는" 진행 표시를 대신할 자동 재생 타이머를 쓴다 — 화면에 그래프가
  // 보이는 동안 1→2→3→4단계를 순서대로 자동으로 색칠하고, 끝까지 채워지면
  // 잠시 멈췄다가 처음부터 다시 반복한다(화면 밖으로 나가면 정지 후 초기화).
  const [mobileReachedStep, setMobileReachedStep] = useState(0)
  const chartRef = useRef(null)
  // 각 STEP 박스(점의 실제 세로 위치를 계산하기 위한 기준)와, 실측한 좌표로
  // top・height를 직접 그리는 배경선/채움선 DOM 요소 참조.
  const stepRefs = useRef([])
  const trackBaseRef = useRef(null)
  const trackFillRef = useRef(null)

  const { totalLength, cumulativeLengths } = useMemo(() => {
    let sum = 0
    const cumulative = CURVE_SEGMENTS.map((d) => (sum += getPathLength(d)))
    return { totalLength: sum, cumulativeLengths: cumulative }
  }, [])

  const filledLength = hoveredStep > 0 ? cumulativeLengths[hoveredStep - 1] : 0

  useEffect(() => {
    const el = chartRef.current
    if (!el) return

    // 점 사이 간격이 STEP마다(줄바꿈 수에 따라) 다르므로, 각 STEP 박스의 실제
    // 화면 좌표를 getBoundingClientRect로 직접 재서 배경선・채움선의 top/height를
    // 그린다 — 예전처럼 매 구간을 padding/margin 수치로 근사하지 않으므로,
    // 세그먼트끼리 이음매가 어긋나거나 끊겨 보이는 문제가 구조적으로 생기지
    // 않는다(선이 하나의 실제 DOM 요소라 처음부터 끝까지 완전히 이어져 있다).
    const PX_PER_MS = 0.22
    const MIN_TOTAL_MS = 1800
    const HOLD_DELAY = 1500
    let timers = []
    let rafId = null

    const clearAll = () => {
      timers.forEach(clearTimeout)
      timers = []
      if (rafId) cancelAnimationFrame(rafId)
      rafId = null
    }

    // 점(::before)은 각 STEP 박스 top에서 0.3rem 내려온 위치에 중심이 있도록
    // CSS(top: 0.3rem, height: 0.85rem)에 고정돼 있다 — 그 좌표를 그대로 계산.
    const dotCenterOffsetPx = () =>
      (0.3 + 0.85 / 2) * parseFloat(getComputedStyle(document.documentElement).fontSize)

    const measureDotYs = () => {
      const chartTop = el.getBoundingClientRect().top
      const offset = dotCenterOffsetPx()
      return stepRefs.current
        .filter(Boolean)
        .map((stepEl) => stepEl.getBoundingClientRect().top - chartTop + offset)
    }

    const resetVisual = () => {
      setMobileReachedStep(0)
      if (trackFillRef.current) {
        trackFillRef.current.style.transition = 'none'
        trackFillRef.current.style.height = '0px'
      }
    }

    const playCycle = () => {
      clearAll()
      const dotYs = measureDotYs()
      if (dotYs.length < 2) return

      // 도입선(첫 점 위 구간) 길이를 STEP01→02 간격과 동일하게 맞춰서, "다른
      // 구간보다 눈에 띄게 짧은 도입선"이 되지 않도록 한다(실측값이라 항상 실제
      // 구간 길이와 정확히 같음).
      const leadIn = dotYs[1] - dotYs[0]
      const startY = Math.max(dotYs[0] - leadIn, 0)
      const totalY = dotYs[dotYs.length - 1] - startY

      if (trackBaseRef.current) {
        trackBaseRef.current.style.top = `${startY}px`
        trackBaseRef.current.style.height = `${totalY}px`
      }
      if (trackFillRef.current) {
        trackFillRef.current.style.top = `${startY}px`
      }

      resetVisual()

      // 리셋 직후 같은 프레임에서 바로 늘리면 0px 상태가 그려질 틈이 없어
      // transition이 생략될 수 있어, 한 프레임 쉬었다 시작한다.
      rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(() => {
          if (!trackFillRef.current) return
          // 실제 거리에 비례한 고정 속도로 채워서, 구간이 길든 짧든 "흐르는
          // 속도"가 일정하게 느껴지도록 한다(전부 같은 시간을 쓰면 짧은
          // 구간은 굼뜨고 긴 구간은 급하게 보임).
          const duration = Math.max(totalY / PX_PER_MS, MIN_TOTAL_MS)
          trackFillRef.current.style.transition = `height ${duration}ms linear`
          trackFillRef.current.style.height = `${totalY}px`

          dotYs.forEach((y, i) => {
            const t = ((y - startY) / totalY) * duration
            timers.push(setTimeout(() => setMobileReachedStep(i + 1), t))
          })

          timers.push(setTimeout(playCycle, duration + HOLD_DELAY))
        })
      })
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          playCycle()
        } else {
          clearAll()
          resetVisual()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      clearAll()
    }
  }, [])

  return (
    <section className="journey-graph" aria-label="교육 과정 진행 단계">
      <div className="journey-graph__inner">
        <span className="journey-graph__eyebrow">COURSE JOURNEY</span>
        <h2 className="journey-graph__title">지원부터 취업까지, 어떻게 진행될까요?</h2>

        <div className="journey-graph__chart" ref={chartRef}>
          <span className="journey-graph__mobile-track-base" ref={trackBaseRef} aria-hidden="true" />
          <span className="journey-graph__mobile-track-fill" ref={trackFillRef} aria-hidden="true" />
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
              ref={(el) => (stepRefs.current[i] = el)}
              className={`journey-graph__step journey-graph__step--${step.labelPos}${
                mobileReachedStep >= i + 1 ? ' journey-graph__step--reached' : ''
              }`}
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
