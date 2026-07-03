import DataTable from '../../components/portal/DataTable'

const requests = [
  { staff: 'Mr. David Ochieng', title: 'Annual Leave', type: 'Leave', status: 'pending' },
  { staff: 'Mrs. Grace Akinyi', title: 'Science Lab Equipment', type: 'Resource', status: 'approved' },
  { staff: 'Mr. Peter Kamau', title: 'Classroom Repairs', type: 'Complaint', status: 'pending' },
]

const columns = [
  { key: 'staff', label: 'Staff' },
  { key: 'title', label: 'Title' },
  { key: 'type', label: 'Type' },
  {
    key: 'status',
    label: 'Status',
    render: (v: unknown) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        v === 'approved' ? 'bg-green-100 text-green-700' :
        v === 'rejected' ? 'bg-red-100 text-red-700' :
        'bg-yellow-100 text-yellow-700'
      }`}>{String(v).charAt(0).toUpperCase() + String(v).slice(1)}</span>
    ),
  },
]

export default function AdminStaffRequests() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Staff Requests</h1>
        <p className="text-gray-500 text-sm mt-1">Manage staff leave and resource requests</p>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <DataTable columns={columns} data={requests} />
      </div>
    </div>
  )
}
