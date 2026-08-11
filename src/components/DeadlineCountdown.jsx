import { useState, useEffect } from 'react'
import './DeadlineCountdown.css'

function getRemaining(deadline) {
  const diff = new Date(deadline).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDeadlineDate(deadline) {
  const d = new Date(deadline)
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
}

function DeadlineCountdown({ deadline, compact = false }) {
  const [remaining, setRemaining] = useState(() => getRemaining(deadline))

  useEffect(() => {
    const timer = setInterval(() => setRemaining(getRemaining(deadline)), 1000)
    return () => clearInterval(timer)
  }, [deadline])

  if (!remaining) {
    return (
      <span className="deadline-countdown deadline-countdown--closed">
        지원이 마감되었습니다
      </span>
    )
  }

  return (
    <span
      className={`deadline-countdown ${compact ? 'deadline-countdown--compact' : ''}`}
    >
      <img
        className="deadline-countdown__icon"
        src="/icons/clock.png"
        alt=""
        aria-hidden="true"
      />
      {formatDeadlineDate(deadline)} 마감 · D-{remaining.days}{' '}
      <span className="deadline-countdown__clock">
        {pad(remaining.hours)}:{pad(remaining.minutes)}:{pad(remaining.seconds)}
      </span>
    </span>
  )
}

export default DeadlineCountdown
