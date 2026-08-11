import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { heroSlides } from '../data/heroSlides.js'
import './HeroSlider.css'

const DEFAULT_AUTOPLAY_INTERVAL = 5000

function HeroSlider() {
  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRefs = useRef([])

  const goTo = useCallback((i) => {
    setIndex((i + heroSlides.length) % heroSlides.length)
  }, [])

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index])
  const goNext = useCallback(() => goTo(index + 1), [goTo, index])

  // 슬라이드가 바뀔 때마다(수동 이동 포함) 그 슬라이드의 영상은 처음부터 다시
  // 재생하고, 방금까지 보이던 슬라이드의 영상은 멈춰서 화면 밖에서 계속 재생되지
  // 않게 한다. 정지(❚❚) 버튼을 누른 상태면 영상도 같이 멈춘다.
  useEffect(() => {
    heroSlides.forEach((slide, i) => {
      const video = videoRefs.current[i]
      if (!video) return
      if (i === index) {
        video.currentTime = 0
        if (isPlaying) video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [index, isPlaying])

  // 자동 전환: 영상이 있는 슬라이드는 영상이 끝나는 시점(ended 이벤트)에 다음으로
  // 넘어가고, 영상이 없는 슬라이드는 duration(ms) 타이머로 넘어간다.
  useEffect(() => {
    if (!isPlaying) return
    const goNextSlide = () => setIndex((prev) => (prev + 1) % heroSlides.length)
    const currentSlide = heroSlides[index]

    if (currentSlide.video) {
      const video = videoRefs.current[index]
      if (!video) return undefined
      video.addEventListener('ended', goNextSlide)
      return () => video.removeEventListener('ended', goNextSlide)
    }

    const duration = currentSlide.duration ?? DEFAULT_AUTOPLAY_INTERVAL
    const timer = setTimeout(goNextSlide, duration)
    return () => clearTimeout(timer)
  }, [isPlaying, index])

  return (
    <section className="hero-slider" aria-label="메인 비주얼">
      <div className="hero-slider__viewport">
        <div
          className="hero-slider__track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {heroSlides.map((slide, i) => (
            <div
              key={slide.id}
              className="hero-slider__slide"
              style={
                !slide.video && slide.image
                  ? {
                      backgroundImage: `linear-gradient(rgba(28, 35, 33, 0.45), rgba(28, 35, 33, 0.45)), url(${slide.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : undefined
              }
            >
              {slide.video && (
                <>
                  <video
                    ref={(el) => (videoRefs.current[i] = el)}
                    className="hero-slider__video"
                    src={slide.video}
                    poster={slide.image}
                    muted
                    playsInline
                  />
                  <div className="hero-slider__video-overlay" />
                </>
              )}
              <p className="hero-slider__eyebrow">{slide.eyebrow}</p>
              <h2 className="hero-slider__title">{slide.title}</h2>
              <Link className="hero-slider__cta" to={slide.ctaTo}>
                {slide.ctaLabel}
              </Link>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="hero-slider__arrow hero-slider__arrow--prev"
          onClick={goPrev}
          aria-label="이전 슬라이드"
        >
          ‹
        </button>
        <button
          type="button"
          className="hero-slider__arrow hero-slider__arrow--next"
          onClick={goNext}
          aria-label="다음 슬라이드"
        >
          ›
        </button>

        <div className="hero-slider__controls">
          <div className="hero-slider__dots" role="tablist" aria-label="슬라이드 선택">
            {heroSlides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                className={`hero-slider__dot${i === index ? ' hero-slider__dot--active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`${i + 1}번째 슬라이드로 이동`}
                aria-selected={i === index}
              />
            ))}
          </div>
          <button
            type="button"
            className="hero-slider__play"
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? '슬라이드 정지' : '슬라이드 재생'}
          >
            {isPlaying ? '❚❚' : '▶'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default HeroSlider
