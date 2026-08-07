import { useRef, useState } from 'react'
import { useSchedule } from '../context/ScheduleContext.jsx'
import { courses } from '../data/courses.js'
import { holidays, holidayEvents } from '../data/holidays.js'
import './Schedule.css'

const TYPE_LABEL = { recruiting: '모집', course: '수업', event: '행사', holiday: '공휴일' }
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']
// 과정명이 길어 pill만 봐서는 어떤 과정인지 구분하기 어렵다는 피드백으로,
// 과정별 고유 색상을 지정해 pill 앞에 작은 점으로 표시한다.
const COURSE_COLORS = {
  'course-ui-ux': '#1f6650',
  'course-ux-research': '#2563a8',
  'course-product-design': '#7c4fb0',
  'course-design-system': '#c1662f',
}
// 실제 오늘 날짜와 무관하게, 데이터가 채워진 2026년 8월을 데모 기준일로 고정한다.
const TODAY_KEY = '2026-08-06'

function toDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

// 수업은 월~목(주 4일)만 진행되므로, 수업 기간(startDate~endDate) 안에 있는 날짜라도
// 금・토・일에는 "수업" pill을 표시하지 않는다. 공휴일도 휴강일이라 마찬가지로 제외한다.
// 모집/행사는 요일・공휴일 제한이 없다.
function isClassDay(year, month, day) {
  const dow = new Date(year, month, day).getDay()
  if (dow < 1 || dow > 4) return false
  return !holidays[toDateKey(year, month, day)]
}

function courseTitle(courseId) {
  return courses.find((c) => c.id === courseId)?.title ?? ''
}

function Schedule() {
  const { getAllEvents } = useSchedule()
  const scheduleEvents = [...getAllEvents(), ...holidayEvents]
  const [cursor, setCursor] = useState(new Date(2026, 7, 1))
  const [selectedDay, setSelectedDay] = useState(null)
  const dayDialogRef = useRef(null)
  const year = cursor.getFullYear()
  const month = cursor.getMonth()

  const startOffset = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leadingAndDays = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // 마지막 주도 7칸을 다 채워야 달력 틀이 매 행 고르게 정렬된다(안 그러면
  // 마지막 줄만 짧게 끊겨 격자 틀이 안 맞아 보인다).
  const trailingOffset = (7 - (leadingAndDays.length % 7)) % 7
  const cells = [...leadingAndDays, ...Array.from({ length: trailingOffset }, () => null)]

  const monthStartKey = toDateKey(year, month, 1)
  const monthEndKey = toDateKey(year, month, daysInMonth)
  const monthEvents = scheduleEvents
    .filter((e) => e.startDate <= monthEndKey && e.endDate >= monthStartKey)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))

  function openDay(dateKey, dayEvents) {
    if (dayEvents.length === 0) return
    setSelectedDay({ dateKey, events: dayEvents })
    dayDialogRef.current?.showModal()
  }

  function closeDayDialog() {
    dayDialogRef.current?.close()
  }

  function handleBackdropClick(e) {
    if (e.target === dayDialogRef.current) closeDayDialog()
  }

  return (
    <main className="schedule">
      <div className="schedule__inner">
        <h1>학원 일정</h1>
        <p>모집 기간, 과정별 수업 일정, 행사를 한 화면에서 확인할 수 있습니다.</p>

        <div className="schedule__legend">
          <span className="schedule__legend-item">
            <i className="schedule__dot schedule__dot--recruiting" aria-hidden="true" />
            모집
          </span>
          <span className="schedule__legend-item">
            <i className="schedule__dot schedule__dot--course" aria-hidden="true" />
            수업
          </span>
          <span className="schedule__legend-item">
            <i className="schedule__dot schedule__dot--event" aria-hidden="true" />
            행사
          </span>
          <span className="schedule__legend-item">
            <i className="schedule__dot schedule__dot--holiday" aria-hidden="true" />
            공휴일
          </span>
        </div>

        <div className="schedule__legend schedule__legend--course">
          {courses.map((c) => (
            <span key={c.id} className="schedule__legend-item">
              <i
                className="schedule__dot"
                style={{ background: COURSE_COLORS[c.id] }}
                aria-hidden="true"
              />
              {c.title}
            </span>
          ))}
        </div>

        <div className="schedule__nav">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
          >
            ← 이전달
          </button>
          <h2>
            {year}년 {month + 1}월
          </h2>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
          >
            다음달 →
          </button>
        </div>

        <div className="schedule__weekdays" aria-hidden="true">
          {WEEKDAYS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>

        <div className="schedule__grid">
          {cells.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="schedule__cell schedule__cell--empty" />
            }
            const dateKey = toDateKey(year, month, day)
            const dayEvents = scheduleEvents.filter(
              (e) =>
                e.startDate <= dateKey &&
                dateKey <= e.endDate &&
                (e.type !== 'course' || isClassDay(year, month, day)),
            )
            return (
              <button
                type="button"
                key={dateKey}
                className={`schedule__cell${dateKey === TODAY_KEY ? ' schedule__cell--today' : ''}${
                  dayEvents.length > 0 ? ' schedule__cell--clickable' : ''
                }`}
                onClick={() => openDay(dateKey, dayEvents)}
                disabled={dayEvents.length === 0}
              >
                <span
                  className={`schedule__date${holidays[dateKey] ? ' schedule__date--holiday' : ''}`}
                >
                  {day}
                </span>
                <div className="schedule__pills">
                  {dayEvents.slice(0, 2).map((e) => (
                    <span key={e.id} className={`schedule__pill schedule__pill--${e.type}`}>
                      {e.courseId && (
                        <i
                          className="schedule__pill-dot"
                          style={{ background: COURSE_COLORS[e.courseId] }}
                          aria-hidden="true"
                        />
                      )}
                      {e.title}
                    </span>
                  ))}
                  {dayEvents.length > 2 && (
                    <span className="schedule__pill schedule__pill--more">
                      +{dayEvents.length - 2}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <dialog
          ref={dayDialogRef}
          className="schedule__day-modal"
          onClick={handleBackdropClick}
        >
          {selectedDay && (
            <div className="schedule__day-modal-content">
              <button
                type="button"
                className="schedule__day-modal-close"
                onClick={closeDayDialog}
                aria-label="닫기"
              >
                ✕
              </button>
              <h2>{selectedDay.dateKey} 일정</h2>
              <ul className="schedule__day-modal-list">
                {selectedDay.events.map((e) => (
                  <li key={e.id}>
                    <span className={`badge schedule__badge--${e.type}`}>
                      {TYPE_LABEL[e.type]}
                    </span>
                    <div>
                      <strong>{e.title}</strong>
                      <span className="schedule__day-modal-meta">
                        {e.courseId && `${courseTitle(e.courseId)} · `}
                        {e.startDate === e.endDate
                          ? e.startDate
                          : `${e.startDate} ~ ${e.endDate}`}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </dialog>

        <section className="schedule__list" aria-label="이번 달 일정 목록">
          <h2>
            {year}년 {month + 1}월 일정
          </h2>
          {monthEvents.length === 0 ? (
            <p className="schedule__empty">이번 달 예정된 일정이 없습니다.</p>
          ) : (
            <ul>
              {monthEvents.map((e) => (
                <li key={e.id}>
                  <span className={`badge schedule__badge--${e.type}`}>
                    {TYPE_LABEL[e.type]}
                  </span>
                  {e.courseId && (
                    <i
                      className="schedule__pill-dot"
                      style={{ background: COURSE_COLORS[e.courseId] }}
                      aria-hidden="true"
                    />
                  )}
                  <strong>{e.title}</strong>
                  <span className="schedule__list-date">
                    {e.startDate === e.endDate ? e.startDate : `${e.startDate} ~ ${e.endDate}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default Schedule
