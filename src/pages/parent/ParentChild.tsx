import { User, BookOpen, Award, Calendar } from 'lucide-react'

export default function ParentChild() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Child</h1>
        <p className="text-gray-500 text-sm mt-1">View your child's details and progress</p>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">A</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Alice Wanjiku</h2>
            <p className="text-gray-500">Grade 4A · Admission: BFA-2025-001</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Date of Birth', value: '12 May 2015' },
            { label: 'Gender', value: 'Female' },
            { label: 'Class Teacher', value: 'Sr. Mary John' },
            { label: 'Academic Year', value: '2025' },
          ].map((d) => (
            <div key={d.label} className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500">{d.label}</p>
              <p className="font-medium text-gray-900 mt-0.5">{d.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> Recent Assignments</h3>
          <div className="space-y-3">
            {['Mathematics - Fractions', 'English - Composition', 'Science - Plants'].map((a) => (
              <div key={a} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-700">{a}</span>
                <span className="text-xs text-gray-400">Due: 10 Jul</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-gold" /> Recent Results</h3>
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
