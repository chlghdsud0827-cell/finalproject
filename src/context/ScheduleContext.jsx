import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext.jsx'
import { supabase } from '../lib/supabaseClient.js'

const ScheduleContext = createContext(null)

function toEvent(row) {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    courseId: row.course_id,
    startDate: row.start_date,
    endDate: row.end_date,
  }
}

// 학원 일정(모집/수업/행사)을 관리자가 직접 추가・수정・삭제할 수 있도록 Context로 관리한다.
// 초기값은 courses.js 기반으로 계산해둔 값을 supabase/migrations/0014로 시드해뒀다.
export function ScheduleProvider({ children }) {
  const { currentUser } = useAuth()
  const [events, setEvents] = useState([])

  // ApplicationContext와 동일한 패턴.
  const refetch = useCallback(async () => {
    const { data, error } = await supabase.from('schedule_events').select('*')
    if (!error && data) {
      setEvents(data.map(toEvent))
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch, currentUser])

  const getAllEvents = useCallback(() => events, [events])

  const addEvent = useCallback(
    async (event) => {
      const { error } = await supabase.from('schedule_events').insert({
        title: event.title,
        type: event.type,
        course_id: event.courseId,
        start_date: event.startDate,
        end_date: event.endDate,
      })
      if (!error) await refetch()
    },
    [refetch],
  )

  const updateEvent = useCallback(
    async (id, updates) => {
      const patch = {}
      if (updates.title !== undefined) patch.title = updates.title
      if (updates.type !== undefined) patch.type = updates.type
      if (updates.courseId !== undefined) patch.course_id = updates.courseId
      if (updates.startDate !== undefined) patch.start_date = updates.startDate
      if (updates.endDate !== undefined) patch.end_date = updates.endDate

      const { error } = await supabase.from('schedule_events').update(patch).eq('id', id)
      if (!error) await refetch()
    },
    [refetch],
  )

  const deleteEvent = useCallback(
    async (id) => {
      const { error } = await supabase.from('schedule_events').delete().eq('id', id)
      if (!error) await refetch()
    },
    [refetch],
  )

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
