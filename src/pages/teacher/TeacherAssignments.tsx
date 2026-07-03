import { Plus, BookOpen, Calendar, Users } from 'lucide-react'

const assignments = [
  { title: 'Fractions Worksheet', class: 'Grade 4A', due: '2025-07-10', submissions: 28, total: 32 },
  { title: 'Composition - My School', class: 'Grade 4A', due: '2025-07-12', submissions: 25, total: 32 },
  { title: 'Algebra Practice', class: 'Grade 5A', due: '2025-07-11', submissions: 20, total: 28 },
]

export default function TeacherAssignments() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage assignments</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
          <Plus className="w-4 h-4" />
          New Assignment
        </button>
      </div>
      <div className="space-y-4">
        {assignments.map((a, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{a.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Users className="w-3.5 h-3.5" /> {a.class}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" /> Due: {a.due}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(a.submissions / a.total) * 100}%` }} />
                  </div>
                  <span className="text-xs text-gray-500">{a.submissions}/{a.total}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
