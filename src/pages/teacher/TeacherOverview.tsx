import { Users, BookOpen, ClipboardCheck, Clock, Bell } from 'lucide-react'
import StatCard from '../../components/portal/StatCard'

export default function TeacherOverview() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, Sr. Mary</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="My Students" value={32} icon={Users} color="primary" />
        <StatCard title="Active Assignments" value={4} icon={BookOpen} color="gold" />
        <StatCard title="Classes Today" value={6} icon={Clock} color="green" />
        <StatCard title="Pending Attendance" value={1} icon={ClipboardCheck} color="lavender" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">My Classes Today</h3>
          <div className="space-y-3">
            {[
              { time: '8:00-9:20', class: 'Grade 4A', subject: 'Mathematics', room: 'Rm 4A' },
              { time: '9:20-10:40', class: 'Grade 4B', subject: 'Mathematics', room: 'Rm 4B' },
              { time: '11:00-12:20', class: 'Grade 5A', subject: 'Mathematics', room: 'Rm 5A' },
              { time: '2:00-3:20', class: 'Grade 6A', subject: 'Mathematics', room: 'Rm 6A' },
            ].map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.class} - {c.subject}</p>
                  <p className="text-xs text-gray-500">{c.time} · {c.room}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'Marked attendance for Grade 4A', time: '1 hour ago' },
              { action: 'Updated grades for Mathematics', time: '3 hours ago' },
              { action: 'Posted new assignment', time: 'Yesterday' },
              { action: 'Grade 4A submitted assignments', time: 'Yesterday' },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-700">{a.action}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
