import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { heroSlides } from '../data/heroSlides.js'
import './HeroSlider.css'

const AUTOPLAY_INTERVAL = 5000

function HeroSlider() {
  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const goTo = useCallback((i) => {
    setIndex((i + heroSlides.length) % heroSlides.length)
  }, [])

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index])
  const goNext = useCallback(() => goTo(index + 1), [goTo, index])

  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroSlides.length)
    }, AUTOPLAY_INTERVAL)
    return () => clearInterval(timer)
  }, [isPlaying])

  return (
    <section className="hero-slider" aria-label="메인 비주얼">
      <div className="hero-slider__viewport">
        <div
          className="hero-slider__track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {heroSlides.map((slide) => (
            <div
              key={slide.id}
              className="hero-slider__slide"
              style={
                slide.image
                  ? {
                      backgroundImage: `linear-gradient(rgba(28, 35, 33, 0.45), rgba(28, 35, 33, 0.45)), url(${slide.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : undefined
              }
            >
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
          <span className="hero-slider__count">
            {index + 1} / {heroSlides.length}
          </span>
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
