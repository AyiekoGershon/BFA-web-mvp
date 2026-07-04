import { useEffect, useState } from 'react'
import { BookOpen, ClipboardCheck, Clock, Bell } from 'lucide-react'
import StatCard from '../../components/portal/StatCard'
import { db } from '../../lib/supabase/db'
import { useAuth } from '../../lib/api/auth'
import { studentApi } from '../../lib/api/client'

export default function StudentOverview() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ assignments: 0, completed: 0, announcements: 0 })
  const [timetable, setTimetable] = useState<any[]>([])
  const [grades, setGrades] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      db.assignments.list(),
      db.timetable.list(),
      db.grades.list(),
    ]).then(([assignments, timetable, grades]) => {
      setStats({
        assignments: (assignments || []).length,
        completed: 0,
        announcements: 0,
      })
      setTimetable((timetable || []).slice(0, 4))
      setGrades((grades || []).slice(0, 4))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    studentApi.getAnnouncements().then(r => {
      if (r.success) setStats(s => ({ ...s, announcements: (r.data || []).length }))
    }).catch(() => {})
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user?.full_name || 'Student'}!</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="My Assignments" value={stats.assignments} icon={BookOpen} color="gold" />
        <StatCard title="Completed" value={stats.completed} icon={ClipboardCheck} color="green" />
        <StatCard title="Today's Classes" value={timetable.length} icon={Clock} color="primary" />
        <StatCard title="Announcements" value={stats.announcements} icon={Bell} color="lavender" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Today's Schedule</h3>
          {timetable.length > 0 ? (
            <div className="space-y-3">
              {timetable.map((t: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t.subject}</p>
                      <p className="text-xs text-gray-500">{t.start_time} - {t.end_time}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{t.room}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No timetable yet.</p>
          )}
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Results</h3>
          {grades.length > 0 ? (
            <div className="space-y-3">
              {grades.map((g: any) => (
                <div key={g.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-700">{g.subject}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{g.score}%</span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">{g.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No results yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
