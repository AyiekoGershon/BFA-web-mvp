import { useEffect, useState } from 'react'
import { Save, LoaderCircle } from 'lucide-react'
import { db } from '../../lib/supabase/db'

const STATUSES = ['present', 'absent', 'late', 'excused']

export default function TeacherAttendance() {
  const [students, setStudents] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [records, setRecords] = useState<any[]>([])
  const [classId, setClassId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Attendance state per student
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: string; remarks: string }>>({})

  const loadData = async () => {
    setLoading(true)
    try {
      const [st, cls, att] = await Promise.all([db.students.list(), db.classes.list(), db.attendance.list()])
      setStudents(st || [])
      setClasses(cls || [])
      setRecords(att || [])
      if (cls?.length > 0 && !classId) setClassId(cls[0].id)
    } catch { setError('Failed to load data.') }
    finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [])

  // Load existing attendance for selected class and date
  useEffect(() => {
    const existing = records.filter(r => r.class_id === classId && r.date === date)
    const map: Record<string, { status: string; remarks: string }> = {}
    existing.forEach(r => { map[r.student_id] = { status: r.status, remarks: r.remarks || '' } })
    setAttendanceMap(map)
  }, [classId, date, records])

  const filteredStudents = classId ? students.filter(s => s.class_id === classId) : []

  const toggleStatus = (studentId: string, status: string) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: { ...(prev[studentId] || { remarks: '' }), status }
    }))
  }

  const handleSave = async () => {
    setError(''); setSuccess(''); setSaving(true)
    try {
      const payload = filteredStudents.map(s => ({
        student_id: s.id,
        class_id: classId,
        date,
        status: attendanceMap[s.id]?.status || 'present',
        remarks: attendanceMap[s.id]?.remarks || '',
      }))
      await db.attendance.mark(payload)
      setSuccess(`Attendance saved for ${filteredStudents.length} students.`)
      await loadData()
    } catch (_e: any) {
      setError(_e?.message || 'Failed to save attendance.')
    } finally { setSaving(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
        <button onClick={handleSave} disabled={saving || filteredStudents.length === 0} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark shadow-md disabled:opacity-50">
          {saving ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Attendance
        </button>
      </div>
      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      {success && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Class</label>
          <select value={classId} onChange={e => setClassId(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm">
            {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
      ) : filteredStudents.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Student</th>
                <th className="text-center py-3 px-2 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(s => (
                <tr key={s.id} className="border-t">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{s.full_name}</p>
                    <p className="text-xs text-gray-400">{s.admission_number}</p>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-1 justify-center">
                      {STATUSES.map(st => (
                        <button key={st} onClick={() => toggleStatus(s.id, st)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                            (attendanceMap[s.id]?.status || 'present') === st
                              ? st === 'present' ? 'bg-green-100 text-green-700 border border-green-200'
                              : st === 'absent' ? 'bg-red-100 text-red-700 border border-red-200'
                              : st === 'late' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                              : 'bg-blue-100 text-blue-700 border border-blue-200'
                              : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                          }`}
                        >{st}</button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border">
          <p className="text-gray-400">Select a class to view students and mark attendance.</p>
        </div>
      )}
    </div>
  )
}
