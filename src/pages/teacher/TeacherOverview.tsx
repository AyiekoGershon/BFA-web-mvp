import { useEffect, useState } from 'react'
import { Users, BookOpen, Clock, Bell } from 'lucide-react'
import StatCard from '../../components/portal/StatCard'
import { db } from '../../lib/supabase/db'
import { useAuth } from '../../lib/api/auth'
import { teacherApi } from '../../lib/api/client'

export default function TeacherOverview() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ students: 0, assignments: 0, classes: 0 })
  const [timetable, setTimetable] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      db.students.list(),
      db.assignments.list(),
      db.classes.list(),
      db.timetable.list(),
    ]).then(([students, assignments, classes, timetable]) => {
      setStats({
        students: students.length,
        assignments: assignments.length,
        classes: classes.length,
      })
      setTimetable((timetable || []).slice(0, 4))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    teacherApi.getAnnouncements().then(r => {
      if (r.success) setAnnouncements((r.data || []).slice(0, 4))
    }).catch(() => {})
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user?.full_name || 'Teacher'}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="My Students" value={stats.students} icon={Users} color="primary" />
        <StatCard title="Active Assignments" value={stats.assignments} icon={BookOpen} color="gold" />
        <StatCard title="Classes" value={stats.classes} icon={Clock} color="green" />
        <StatCard title="Announcements" value={announcements.length} icon={Bell} color="lavender" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">My Timetable</h3>
          {timetable.length > 0 ? (
            <div className="space-y-3">
              {timetable.map((t: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.subject}</p>
                    <p className="text-xs text-gray-500">{t.start_time} - {t.end_time} · {t.room}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No timetable entries yet.</p>
          )}
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Announcements</h3>
          {announcements.length > 0 ? (
            <div className="space-y-3">
              {announcements.map((a: any) => (
                <div key={a.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <Bell className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{a.title}</p>
                    <p className="text-xs text-gray-400">{a.content?.slice(0, 80)}...</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No announcements yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
