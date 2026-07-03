import { useEffect, useState } from 'react'
import { Users, GraduationCap, School, ClipboardList, Megaphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/portal/StatCard'
import DataTable from '../../components/portal/DataTable'
import { db } from '../../lib/supabase/db'

export default function AdminOverview() {
  const [stats, setStats] = useState([
    { title: 'Total Students', value: 0, icon: Users, description: 'Active students', color: 'primary' as const },
    { title: 'Teachers', value: 0, icon: GraduationCap, description: 'Teaching staff', color: 'gold' as const },
    { title: 'Classes', value: 0, icon: School, description: 'Nursery & Primary', color: 'lavender' as const },
    { title: 'Pending Admissions', value: 0, icon: ClipboardList, description: 'Awaiting review', color: 'green' as const },
  ])
  const [recentStudents, setRecentStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const studentList = await db.students.list()
        const teacherList = await db.teachers.list()
        const classList = await db.classes.list()
        const admissionList = await db.admissions.list()

        const pendingAdmissions = admissionList.filter((a: any) => a.status === 'pending').length

        setStats([
          { title: 'Total Students', value: studentList.length, icon: Users, description: 'Active students', color: 'primary' as const },
          { title: 'Teachers', value: teacherList.length, icon: GraduationCap, description: 'Teaching staff', color: 'gold' as const },
          { title: 'Classes', value: classList.length, icon: School, description: 'Nursery & Primary', color: 'lavender' as const },
          { title: 'Pending Admissions', value: pendingAdmissions, icon: ClipboardList, description: 'Awaiting review', color: 'green' as const },
        ])

        // Get recent 5 students sorted by created_at (fallback matching or list splice)
        const sortedStudents = [...studentList]
          .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
          .slice(0, 5)
        
        // Map class ID to name
        const mappedRecent = sortedStudents.map(student => {
          const matchingClass = classList.find((c: any) => c.id === student.class_id)
          return {
            name: student.full_name,
            class: matchingClass ? matchingClass.name : 'Unassigned',
            status: student.status
          }
        })

        setRecentStudents(mappedRecent)
      } catch (error) {
        console.error('Error loading admin overview stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOverviewData()
  }, [])

  const recentColumns = [
    { key: 'name', label: 'Name' },
    { key: 'class', label: 'Class' },
    { key: 'status', label: 'Status', render: (v: unknown) => <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200/50 capitalize">{String(v)}</span> },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of Bright Future Academy</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <>
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
                  { label: 'New Announcement', href: '/admin/announcements', icon: Megaphone },
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
        </>
      )}
    </div>
  )
}

