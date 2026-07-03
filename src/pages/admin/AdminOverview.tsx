import { Users, GraduationCap, School, ClipboardList } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/portal/StatCard'
import DataTable from '../../components/portal/DataTable'

const stats = [
  { title: 'Total Students', value: 520, icon: Users, description: '45 new this term', color: 'primary' as const },
  { title: 'Teachers', value: 28, icon: GraduationCap, description: '4 departments', color: 'gold' as const },
  { title: 'Classes', value: 16, icon: School, description: 'Nursery & Primary', color: 'lavender' as const },
  { title: 'Pending Admissions', value: 12, icon: ClipboardList, description: 'Awaiting review', color: 'green' as const },
]

const recentStudents = [
  { name: 'Alice Wanjiku', class: 'Grade 4A', status: 'Active' },
  { name: 'Brian Omondi', class: 'Grade 2B', status: 'Active' },
  { name: 'Grace Akinyi', class: 'Nursery B', status: 'Active' },
  { name: 'Daniel Kimutai', class: 'Grade 6A', status: 'Active' },
  { name: 'Faith Chebet', class: 'Grade 3A', status: 'Active' },
]

const recentColumns = [
  { key: 'name', label: 'Name' },
  { key: 'class', label: 'Class' },
  { key: 'status', label: 'Status', render: () => <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span> },
]

export default function AdminOverview() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of Bright Future Academy</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Students</h3>
          <DataTable columns={recentColumns} data={recentStudents} />
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Student', href: '/admin/students', icon: Users },
              { label: 'New Announcement', href: '/admin/announcements', icon: ClipboardList },
              { label: 'Review Admissions', href: '/admin/admissions', icon: ClipboardList },
              { label: 'Manage Classes', href: '/admin/classes', icon: School },
            ].map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.label}
                  to={action.href}
                  className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-primary/5 border border-gray-100 transition-all"
                >
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
