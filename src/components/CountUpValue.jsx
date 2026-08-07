import { useEffect, useRef, useState } from 'react'

const DURATION = 1400

function CountUpValue({ to, decimals = 0, suffix = '', active }) {
  const [value, setValue] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!active) return

    const start = performance.now()

    function tick(now) {
      const progress = Math.min((now - start) / DURATION, 1)
      setValue(to * progress)
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [active, to])

  return (
    <>
      {value.toLocaleString('ko-KR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </>
  )
}

export default CountUpValue
