import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import DataTable from '../../components/portal/DataTable'

const mockStudents = [
  { admission: 'BFA-2025-001', name: 'Alice Wanjiku', class: 'Grade 4A', gender: 'Female', status: 'active' },
  { admission: 'BFA-2025-002', name: 'Brian Omondi', class: 'Grade 2B', gender: 'Male', status: 'active' },
  { admission: 'BFA-2025-003', name: 'Grace Akinyi', class: 'Nursery B', gender: 'Female', status: 'active' },
  { admission: 'BFA-2025-004', name: 'Daniel Kimutai', class: 'Grade 6A', gender: 'Male', status: 'active' },
  { admission: 'BFA-2025-005', name: 'Faith Chebet', class: 'Grade 3A', gender: 'Female', status: 'active' },
]

const columns = [
  { key: 'admission', label: 'Admission No.' },
  { key: 'name', label: 'Full Name' },
  { key: 'class', label: 'Class' },
  { key: 'gender', label: 'Gender' },
  {
    key: 'status',
    label: 'Status',
    render: (v: unknown) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        v === 'active' ? 'bg-green-100 text-green-700' :
        v === 'graduated' ? 'bg-blue-100 text-blue-700' :
        'bg-red-100 text-red-700'
      }`}>
        {String(v).charAt(0).toUpperCase() + String(v).slice(1)}
      </span>
    ),
  },
]

export default function AdminStudents() {
  const [search, setSearch] = useState('')
  const filtered = mockStudents.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.admission.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all registered students</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <DataTable columns={columns} data={filtered} searchable onSearch={setSearch} />
      </div>
    </div>
  )
}
