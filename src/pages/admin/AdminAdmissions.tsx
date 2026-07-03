import DataTable from '../../components/portal/DataTable'

const mockAdmissions = [
  { name: 'James Otieno', grade: 'Grade 1', parent: 'Mr. Otieno', phone: '+254 712 345 678', status: 'pending' },
  { name: 'Mary Wambui', grade: 'Nursery', parent: 'Mrs. Wambui', phone: '+254 723 456 789', status: 'approved' },
  { name: 'Peter Kamau', grade: 'Grade 3', parent: 'Mr. Kamau', phone: '+254 734 567 890', status: 'pending' },
  { name: 'Susan Achieng', grade: 'Grade 5', parent: 'Mr. Achieng', phone: '+254 745 678 901', status: 'rejected' },
]

const columns = [
  { key: 'name', label: 'Student Name' },
  { key: 'grade', label: 'Grade Applying' },
  { key: 'parent', label: 'Parent/Guardian' },
  { key: 'phone', label: 'Phone' },
  {
    key: 'status',
    label: 'Status',
    render: (v: unknown) => {
      const status = String(v)
      const colors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700',
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
        enrolled: 'bg-blue-100 text-blue-700',
      }
      return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || ''}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    },
  },
]

export default function AdminAdmissions() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admissions</h1>
        <p className="text-gray-500 text-sm mt-1">Review and manage admission applications</p>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <DataTable columns={columns} data={mockAdmissions} searchable />
      </div>
    </div>
  )
}
