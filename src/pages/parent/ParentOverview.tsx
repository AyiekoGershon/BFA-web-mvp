import { useEffect, useState } from 'react'
import { User, BookOpen, ClipboardCheck, Bell } from 'lucide-react'
import StatCard from '../../components/portal/StatCard'
import { db } from '../../lib/supabase/db'
import { useAuth } from '../../lib/api/auth'
import { parentApi } from '../../lib/api/client'

export default function ParentOverview() {
  const { user } = useAuth()
  const [children, setChildren] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const [grades, setGrades] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      db.students.list(),
      db.assignments.list(),
      db.grades.list(),
    ]).then(([students, asgn, grds]) => {
      setChildren(students || [])
      setAssignments(asgn || [])
      setGrades(grds || [])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    parentApi.getAnnouncements().then(r => {
      if (r.success) setAnnouncements((r.data || []).slice(0, 3))
    }).catch(() => {})
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome, {user?.full_name || 'Parent'}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="My Children" value={children.length} icon={User} color="primary" />
        <StatCard title="Assignments" value={assignments.length} icon={BookOpen} color="gold" />
        <StatCard title="Recent Results" value={grades.length} icon={ClipboardCheck} color="green" />
        <StatCard title="Announcements" value={announcements.length} icon={Bell} color="lavender" />
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">My Children</h3>
        {children.length > 0 ? (
          <div className="space-y-4">
            {children.map((child: any) => (
              <div key={child.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {child.full_name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{child.full_name}</p>
                    <p className="text-sm text-gray-500">{child.admission_number}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{child.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No children linked to your account yet.</p>
        )}
      </div>
    </div>
  )
}
