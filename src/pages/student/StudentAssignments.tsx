import { BookOpen, Calendar, Clock } from 'lucide-react'

const assignments = [
  { subject: 'Mathematics', title: 'Fractions Worksheet', due: '2025-07-10', status: 'Pending' },
  { subject: 'English', title: 'Composition - My School', due: '2025-07-12', status: 'Submitted' },
  { subject: 'Science', title: 'Plant Life Cycle', due: '2025-07-08', status: 'Graded', score: '85%' },
]

export default function StudentAssignments() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
        <p className="text-gray-500 text-sm mt-1">Track and submit your assignments</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {assignments.map((a, i) => (
          <div key={i} className="flex items-center justify-between p-5 hover:bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{a.title}</h3>
                <p className="text-sm text-gray-500">{a.subject}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" /> Due: {a.due}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                a.status === 'Graded' ? 'bg-green-100 text-green-700' :
                a.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>{a.status}</span>
              {a.score && <p className="text-xs text-gray-500 mt-1">Score: {a.score}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
