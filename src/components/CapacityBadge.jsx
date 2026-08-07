import './CapacityBadge.css'

function CapacityBadge({ current, capacity }) {
  const remaining = capacity - current
  const isFull = remaining <= 0

  return (
    <span className={`capacity-badge ${isFull ? 'capacity-badge--full' : ''}`}>
      실시간 잔여 정원 {isFull ? '마감' : `${remaining}명`}
    </span>
  )
}

export default CapacityBadge
