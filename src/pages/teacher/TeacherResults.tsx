import { Award, Download, Plus } from 'lucide-react'
import DataTable from '../../components/portal/DataTable'

const grades = [
  { name: 'Alice Wanjiku', math: 'A', english: 'B+', science: 'A', kiswahili: 'B', avg: '85%' },
  { name: 'Brian Omondi', math: 'B+', english: 'A-', science: 'B+', kiswahili: 'A-', avg: '82%' },
  { name: 'Grace Akinyi', math: 'A', english: 'A', science: 'A', kiswahili: 'B+', avg: '92%' },
  { name: 'Daniel Kimutai', math: 'B', english: 'B+', science: 'B+', kiswahili: 'B', avg: '78%' },
  { name: 'Faith Chebet', math: 'A-', english: 'A', science: 'A-', kiswahili: 'A', avg: '90%' },
]

const columns = [
  { key: 'name', label: 'Student Name' },
  { key: 'math', label: 'Math' },
  { key: 'english', label: 'English' },
  { key: 'science', label: 'Science' },
  { key: 'kiswahili', label: 'Kiswahili' },
  { key: 'avg', label: 'Average',
    render: (v: unknown) => (
      <span className="font-semibold text-gray-900">{String(v)}</span>
    ),
  },
]

export default function TeacherResults() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Results</h1>
          <p className="text-gray-500 text-sm mt-1">Manage student grades - Term 1 2025</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
            <Plus className="w-4 h-4" />
            Add Grade
          </button>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <DataTable columns={columns} data={grades} searchable />
      </div>
    </div>
  )
}
