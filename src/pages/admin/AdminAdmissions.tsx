import { useEffect, useState } from 'react'
import DataTable from '../../components/portal/DataTable'
import { db } from '../../lib/supabase/db'
import { Check, X, UserPlus, RefreshCw } from 'lucide-react'

export default function AdminAdmissions() {
  const [admissions, setAdmissions] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [enrollingId, setEnrollingId] = useState<string | null>(null)
  const [selectedClassId, setSelectedClassId] = useState('')

  const loadAdmissions = async () => {
    setLoading(true)
    try {
      const data = await db.admissions.list()
      const classData = await db.classes.list()
      setClasses(classData)
      if (classData.length > 0 && !selectedClassId) {
        setSelectedClassId(classData[0].id)
      }

      const normalized = data.map((d: any) => ({
        ...d,
        name: d.student_name,
        parent: d.parent_name,
        phone: d.parent_phone,
        grade: d.grade_applying
      }))
      setAdmissions(normalized)
    } catch {
      setError('Failed to load admission applications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdmissions()
  }, [])

  const handleUpdateStatus = async (row: any, newStatus: 'pending' | 'approved' | 'rejected' | 'enrolled') => {
    setError('')
    setSuccess('')

    if (newStatus === 'enrolled') {
      // Show class selector instead of immediately enrolling
      setEnrollingId(row.id)
      return
    }

    try {
      await db.admissions.updateStatus(row.id, newStatus)
      setSuccess(`Application status updated to '${newStatus}' for ${row.student_name || row.name}.`)
      await loadAdmissions()
    } catch (_e: any) {
      setError((_e as Error)?.message || 'Failed to update application status.')
    }
  }

  const handleEnroll = async () => {
    if (!enrollingId || !selectedClassId) return
    setError('')
    setSuccess('')

    try {
      // First update status to enrolled
      await db.admissions.updateStatus(enrollingId, 'enrolled')

      // Then create student record with the selected class
      const admission = admissions.find(a => a.id === enrollingId)
      if (admission) {
        const admissionNo = `BFA-2025-${Math.floor(100 + Math.random() * 900)}`
        await db.students.create({
          admission_number: admissionNo,
          full_name: admission.student_name || admission.name,
          gender: admission.gender || 'male',
          status: 'active',
          date_of_birth: admission.date_of_birth || '2016-01-01',
          address: admission.address || '',
          phone: admission.parent_phone || admission.phone || '',
          class_id: selectedClassId,
        })
      }

      setEnrollingId(null)
      setSuccess(`Student enrolled successfully into ${classes.find(c => c.id === selectedClassId)?.name || 'selected class'}.`)
      await loadAdmissions()
    } catch (_e: any) {
      setError((_e as Error)?.message || 'Failed to enroll student.')
    }
  }

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
          pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200/50',
          approved: 'bg-green-100 text-green-700 border border-green-200/50',
          rejected: 'bg-red-100 text-red-700 border border-red-200/50',
          enrolled: 'bg-blue-100 text-blue-700 border border-blue-200/50',
        }
        return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${colors[status] || ''}`}>
          {status}
        </span>
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_v: unknown, row: any) => (
        <div className="flex items-center gap-1.5">
          {enrollingId === row.id ? (
            <div className="flex items-center gap-2">
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
              >
                {classes.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <button
                onClick={handleEnroll}
                className="px-2.5 py-1 bg-primary text-white hover:bg-primary-dark rounded-lg text-xs font-semibold shadow-sm shadow-primary/25 transition-all"
              >
                Confirm
              </button>
              <button
                onClick={() => setEnrollingId(null)}
                className="px-2.5 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-xs font-medium transition-all"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              {row.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(row, 'approved')}
                    title="Approve Application"
                    className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200/50 transition-all flex items-center gap-1 text-xs font-medium"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(row, 'rejected')}
                    title="Reject Application"
                    className="p-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200/50 transition-all flex items-center gap-1 text-xs font-medium"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </>
              )}
              {row.status === 'approved' && (
                <button
                  onClick={() => handleUpdateStatus(row, 'enrolled')}
                  className="px-2.5 py-1 bg-primary text-white hover:bg-primary-dark rounded-lg text-xs font-semibold shadow-sm shadow-primary/25 transition-all flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Enroll Student
                </button>
              )}
              {row.status === 'enrolled' && (
                <span className="text-xs text-gray-400 italic">Fully Enrolled</span>
              )}
              {row.status === 'rejected' && (
                <button
                  onClick={() => handleUpdateStatus(row, 'pending')}
                  className="text-xs text-gray-500 hover:text-primary transition-all underline"
                >
                  Reconsider
                </button>
              )}
            </>
          )}
        </div>
      )
    }
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admissions</h1>
          <p className="text-gray-500 text-sm mt-1">Review and manage admission applications</p>
        </div>
        <button
          onClick={loadAdmissions}
          disabled={loading}
          className="p-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-gray-600 transition-all hover:border-gray-300 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      {success && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <DataTable columns={columns} data={admissions} searchable />
        )}
      </div>
    </div>
  )
}
