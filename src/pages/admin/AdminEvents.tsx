import { Plus, Calendar, MapPin } from 'lucide-react'

const events = [
  { title: 'End of Term Exams', date: '2025-07-28', location: 'School Grounds', target: 'All' },
  { title: 'Parent-Teacher Meeting', date: '2025-08-05', location: 'School Hall', target: 'Parents' },
  { title: 'Annual Sports Day', date: '2025-08-15', location: 'Playground', target: 'All' },
  { title: 'Graduation Ceremony', date: '2025-08-30', location: 'School Hall', target: 'All' },
]

export default function AdminEvents() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500 text-sm mt-1">Manage school events and calendar</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((e, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{e.title}</h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {e.date}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {e.location}
                </p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{e.target}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
