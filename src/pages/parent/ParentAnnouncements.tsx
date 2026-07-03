import { Megaphone, Calendar } from 'lucide-react'

const announcements = [
  { title: 'End of Term Exams Schedule', date: '2025-07-15', content: 'The end of term examinations will begin on July 28th. Please ensure your child is well-prepared.' },
  { title: 'Parent-Teacher Meeting', date: '2025-07-20', content: 'The upcoming parent-teacher meeting will be held on August 5th at 9:00 AM in the school hall.' },
  { title: 'School Sports Day', date: '2025-07-25', content: 'Annual sports day is scheduled for August 15th. Parents are cordially invited to attend.' },
]

export default function ParentAnnouncements() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        <p className="text-gray-500 text-sm mt-1">School announcements for parents</p>
      </div>
      <div className="space-y-4">
        {announcements.map((a, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Megaphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{a.title}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" /> {a.date}
                </p>
                <p className="text-sm text-gray-600 mt-2">{a.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
