import { Plus } from 'lucide-react'
import DataTable from '../../components/portal/DataTable'

const mockTeachers = [
  { empNo: 'TCH-001', name: 'Sr. Mary John', email: 'mary@bfacademy.ac.ke', subjects: 'Mathematics, Science', status: 'active' },
  { empNo: 'TCH-002', name: 'Mr. David Ochieng', email: 'david@bfacademy.ac.ke', subjects: 'English, Kiswahili', status: 'active' },
  { empNo: 'TCH-003', name: 'Mrs. Grace Akinyi', email: 'grace@bfacademy.ac.ke', subjects: 'Social Studies, CRE', status: 'active' },
  { empNo: 'TCH-004', name: 'Mr. Peter Kamau', email: 'peter@bfacademy.ac.ke', subjects: 'Science, Technology', status: 'active' },
]

const columns = [
  { key: 'empNo', label: 'Employee No.' },
  { key: 'name', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'subjects', label: 'Subjects' },
  {
    key: 'status',
    label: 'Status',
    render: (v: unknown) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        v === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {String(v).charAt(0).toUpperCase() + String(v).slice(1)}
      </span>
    ),
  },
]

export default function AdminTeachers() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage teaching staff</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
          <Plus className="w-4 h-4" />
          Add Teacher
        </button>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <DataTable columns={columns} data={mockTeachers} searchable />
      </div>
    </div>
  )
}
