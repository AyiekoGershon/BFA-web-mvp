import { User, BookOpen, ClipboardCheck, Bell, Calendar } from 'lucide-react'
import StatCard from '../../components/portal/StatCard'

export default function ParentOverview() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
        <p className="text-gray-500 mt-1">Stay updated on your child's progress</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="My Children" value={2} icon={User} color="primary" />
        <StatCard title="Pending Assignments" value={3} icon={BookOpen} color="gold" />
        <StatCard title="Recent Results" value={5} icon={ClipboardCheck} color="green" />
        <StatCard title="New Announcements" value={2} icon={Bell} color="lavender" />
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">My Children</h3>
        <div className="space-y-4">
          {[
            { name: 'Alice Wanjiku', class: 'Grade 4A', status: 'Active' },
            { name: 'Brian Wanjiku', class: 'Nursery B', status: 'Active' },
          ].map((child) => (
            <div key={child.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {child.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{child.name}</p>
                  <p className="text-sm text-gray-500">{child.class}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{child.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
