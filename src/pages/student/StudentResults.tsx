import { Award, Download } from 'lucide-react'

const results = [
  { term: 'Term 1 2025', subjects: { Math: 'A', English: 'B+', Science: 'A', Kiswahili: 'B', 'Social Studies': 'B+', CRE: 'A' } },
  { term: 'Term 2 2024', subjects: { Math: 'B+', English: 'B', Science: 'A-', Kiswahili: 'B+', 'Social Studies': 'B', CRE: 'A' } },
]

export default function StudentResults() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Results</h1>
          <p className="text-gray-500 text-sm mt-1">View your academic performance</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>
      <div className="space-y-6">
        {results.map((term, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-gold" />
              {term.term}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(term.subjects).map(([subject, grade]) => (
                <div key={subject} className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-xs text-gray-500">{subject}</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{grade as string}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
