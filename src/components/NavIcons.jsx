// 모바일 메뉴 전용 라인 아이콘 세트. 외부 아이콘 라이브러리를 새로 추가하지
// 않고, currentColor를 쓰는 단순한 인라인 SVG로 직접 그린다(CSS로 색・크기 제어).
const commonProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function MenuIcon(props) {
  return (
    <svg {...commonProps} {...props}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  )
}

export function CloseIcon(props) {
  return (
    <svg {...commonProps} {...props}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  )
}

export function UserIcon(props) {
  return (
    <svg {...commonProps} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  )
}

export function BookIcon(props) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M12 6c-2-1.3-5-1.7-8-1v13c3-0.7 6-0.3 8 1c2-1.3 5-1.7 8-1V5c-3-0.7-6-0.3-8 1z" />
      <line x1="12" y1="6" x2="12" y2="19" />
    </svg>
  )
}

export function ChatIcon(props) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
    </svg>
  )
}

export function BuildingIcon(props) {
  return (
    <svg {...commonProps} {...props}>
      <rect x="4" y="3" width="16" height="18" />
      <line x1="8" y1="7" x2="8" y2="7" />
      <line x1="12" y1="7" x2="12" y2="7" />
      <line x1="16" y1="7" x2="16" y2="7" />
      <line x1="8" y1="11" x2="8" y2="11" />
      <line x1="12" y1="11" x2="12" y2="11" />
      <line x1="16" y1="11" x2="16" y2="11" />
      <line x1="8" y1="15" x2="8" y2="15" />
      <line x1="12" y1="15" x2="12" y2="15" />
      <line x1="16" y1="15" x2="16" y2="15" />
      <line x1="10" y1="21" x2="14" y2="21" />
      <line x1="10" y1="21" x2="10" y2="18" />
      <line x1="14" y1="21" x2="14" y2="18" />
    </svg>
  )
}

export function LogOutIcon(props) {
  return (
    <svg {...commonProps} {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}
