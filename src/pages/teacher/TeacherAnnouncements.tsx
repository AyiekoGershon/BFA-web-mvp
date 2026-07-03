import { Megaphone, Calendar, Plus } from 'lucide-react'

const items = [
  { title: 'Staff Meeting Friday', date: '2025-07-10', target: 'Teachers', content: 'All staff are required to attend the meeting at 2:00 PM in the staff room.' },
  { title: 'End of Term Reports', date: '2025-07-15', target: 'Teachers', content: 'End of term report forms must be submitted by July 20th.' },
  { title: 'Exam Invigilation Schedule', date: '2025-07-18', target: 'Teachers', content: 'The exam invigilation schedule for end of term exams is now available.' },
]

export default function TeacherAnnouncements() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-500 text-sm mt-1">Staff announcements and notices</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>
      <div className="space-y-4">
        {items.map((a, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Megaphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{a.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {a.date}
                  </p>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">{a.target}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{a.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
