import { Plus, Megaphone, Calendar, Users } from 'lucide-react'

const announcements = [
  { title: 'End of Term Exams Schedule', date: '2025-07-15', target: 'All', status: 'Published' },
  { title: 'Parent-Teacher Meeting', date: '2025-07-20', target: 'Parents', status: 'Draft' },
  { title: 'School Sports Day', date: '2025-07-25', target: 'All', status: 'Published' },
  { title: 'Staff Meeting Notice', date: '2025-07-10', target: 'Teachers', status: 'Published' },
]

export default function AdminAnnouncements() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage school announcements</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>
      <div className="space-y-4">
        {announcements.map((a, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Megaphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{a.title}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{a.date}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{a.target}</span>
                </div>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              a.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>{a.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
