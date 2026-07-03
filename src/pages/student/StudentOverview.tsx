import { BookOpen, ClipboardCheck, Clock, Bell, Award } from 'lucide-react'
import StatCard from '../../components/portal/StatCard'

export default function StudentOverview() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, Alice!</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Pending Assignments" value={3} icon={BookOpen} color="gold" />
        <StatCard title="Completed Tasks" value={12} icon={ClipboardCheck} color="green" />
        <StatCard title="Next Class" value="Math" icon={Clock} color="primary" description="In 30 mins" />
        <StatCard title="New Announcements" value={1} icon={Bell} color="lavender" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {[
              { time: '8:00-8:40', subject: 'Mathematics', room: 'Rm 4A' },
              { time: '8:40-9:20', subject: 'English', room: 'Rm 4A' },
              { time: '9:20-10:00', subject: 'Science', room: 'Lab 1' },
              { time: '10:00-10:40', subject: 'Kiswahili', room: 'Rm 4A' },
            ].map((s) => (
              <div key={s.time} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{s.subject}</p>
                    <p className="text-xs text-gray-500">{s.time}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{s.room}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-gold" /> Recent Performance</h3>
          <div className="space-y-3">
            {[
              { subject: 'Mathematics', score: '85%', grade: 'A' },
              { subject: 'English', score: '78%', grade: 'B+' },
              { subject: 'Science', score: '92%', grade: 'A' },
            ].map((r) => (
              <div key={r.subject} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-700">{r.subject}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{r.score}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">{r.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
