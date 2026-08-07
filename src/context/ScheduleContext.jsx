import { createContext, useContext, useState, useCallback } from 'react'
import { scheduleEvents as initialScheduleEvents } from '../data/schedule.js'

const ScheduleContext = createContext(null)

// 학원 일정(모집/수업/행사)을 관리자가 직접 추가・수정・삭제할 수 있도록 Context로 관리한다.
// data/schedule.js의 초기값(과정별 모집・수업 기간 등)을 시드로 시작한다.
export function ScheduleProvider({ children }) {
  const [events, setEvents] = useState(initialScheduleEvents)

  const getAllEvents = useCallback(() => events, [events])

  const addEvent = useCallback((event) => {
    setEvents((prev) => [...prev, { ...event, id: `sch-custom-${Date.now()}` }])
  }, [])

  const updateEvent = useCallback((id, updates) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)))
  }, [])

  const deleteEvent = useCallback((id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const value = { getAllEvents, addEvent, updateEvent, deleteEvent }

  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>
}

export function useSchedule() {
  const ctx = useContext(ScheduleContext)
  if (!ctx) {
    throw new Error('useSchedule는 ScheduleProvider 내부에서만 사용할 수 있습니다.')
  }
  return ctx
}
