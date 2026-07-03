import { Plus } from 'lucide-react'
import DataTable from '../../components/portal/DataTable'

const mockClasses = [
  { name: 'Nursery A', section: 'Nursery', grade: 1, teacher: 'Mrs. Jane Wanjiku', students: 24, capacity: 25 },
  { name: 'Nursery B', section: 'Nursery', grade: 1, teacher: 'Ms. Faith Chebet', students: 22, capacity: 25 },
  { name: 'Grade 1A', section: 'Primary', grade: 1, teacher: 'Mr. David Ochieng', students: 30, capacity: 35 },
  { name: 'Grade 1B', section: 'Primary', grade: 1, teacher: 'Mrs. Grace Akinyi', students: 28, capacity: 35 },
  { name: 'Grade 2A', section: 'Primary', grade: 2, teacher: 'Sr. Mary John', students: 32, capacity: 35 },
  { name: 'Grade 3A', section: 'Primary', grade: 3, teacher: 'Mr. Peter Kamau', students: 29, capacity: 35 },
  { name: 'Grade 4A', section: 'Primary', grade: 4, teacher: 'Mrs. Anne Mwangi', students: 31, capacity: 35 },
  { name: 'Grade 5A', section: 'Primary', grade: 5, teacher: 'Mr. James Omondi', students: 27, capacity: 35 },
  { name: 'Grade 6A', section: 'Primary', grade: 6, teacher: 'Sr. Mary John', students: 30, capacity: 35 },
]

const columns = [
  { key: 'name', label: 'Class Name' },
  { key: 'section', label: 'Section' },
  { key: 'teacher', label: 'Class Teacher' },
  {
    key: 'students',
    label: 'Students',
    render: (_v: unknown, row: Record<string, unknown>) => (
      <span className={Number(row.capacity) - Number(row.students) < 3 ? 'text-orange-600 font-medium' : ''}>
        {String(row.students)} / {String(row.capacity)}
      </span>
    ),
  },
]

export default function AdminClasses() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-500 text-sm mt-1">Manage classes and streams</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
          <Plus className="w-4 h-4" />
          Add Class
        </button>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <DataTable columns={columns} data={mockClasses} searchable />
      </div>
    </div>
  )
}
