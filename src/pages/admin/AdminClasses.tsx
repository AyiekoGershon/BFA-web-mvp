import { useEffect, useState } from 'react'
import { Plus, X, LoaderCircle, RefreshCw } from 'lucide-react'
import DataTable from '../../components/portal/DataTable'
import { db } from '../../lib/supabase/db'

export default function AdminClasses() {
  const [classes, setClasses] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [section, setSection] = useState<'nursery' | 'primary'>('primary')
  const [grade, setGrade] = useState(1)
  const [stream, setStream] = useState('A')
  const [teacherId, setTeacherId] = useState('')
  const [capacity, setCapacity] = useState(35)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const openModal = () => {
    setName('')
    setSection('primary')
    setGrade(1)
    setStream('A')
    setCapacity(35)
    if (teachers.length > 0) setTeacherId(teachers[0].id)
    setError('')
    setSuccess('')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setError('')
  }
  const loadData = async () => {
    setLoading(true)
    try {
      const classData = await db.classes.list()
      const teacherData = await db.teachers.list()
      const studentData = await db.students.list()
      setTeachers(teacherData)
      if (teacherData.length > 0) {
        setTeacherId(teacherData[0].id)
      }

      // Map teacher name and calculate student counts dynamically
      const mapped = classData.map((cls: any) => {
        const t = teacherData.find((item: any) => item.id === cls.teacher_id)
        const enrolledCount = studentData.filter((s: any) => s.class_id === cls.id).length
        return {
          ...cls,
          section: cls.section.charAt(0).toUpperCase() + cls.section.slice(1),
          teacher: t ? t.full_name : 'No Teacher Assigned',
          students: enrolledCount,
          capacity: cls.capacity || 35
        }
      })
      setClasses(mapped)
    } catch {
      setError('Failed to load classes list.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await db.classes.create({
        name,
        section,
        grade,
        stream,
        teacher_id: teacherId,
        capacity,
      })

      // Reset
      setName('')
      setSection('primary')
      setGrade(1)
      setStream('A')
      setCapacity(35)
      setSuccess(`Class ${name} created successfully!`)
      setModalOpen(false)
      await loadData()
    } catch (_e: any) {
      setError((_e as Error)?.message || 'Failed to create class.')
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    { key: 'name', label: 'Class Name' },
    { key: 'section', label: 'Section' },
    { key: 'teacher', label: 'Class Teacher' },
    {
      key: 'students',
      label: 'Students',
      render: (_v: unknown, row: any) => (
        <span className={row.capacity - row.students < 3 ? 'text-amber-600 font-semibold' : 'text-gray-700'}>
          {row.students} / {row.capacity}
        </span>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-500 text-sm mt-1">Manage classes and streams</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-gray-600 transition-all hover:border-gray-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all shadow-md shadow-primary/25"
          >
            <Plus className="w-4 h-4" />
            Add Class
          </button>
        </div>
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 whitespace-pre-wrap">{error}</div>}
      {success && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <DataTable columns={columns} data={classes} searchable />
        )}
      </div>

      {/* Add Class Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-serif text-lg font-bold text-gray-900">Add New Class</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Class Name (e.g. Grade 4A)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Grade 4A"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Section</label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all bg-white"
                  >
                    <option value="nursery">Nursery</option>
                    <option value="primary">Primary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Capacity</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Grade (Level)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={8}
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Stream (e.g. A, B)</label>
                  <input
                    type="text"
                    required
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                    placeholder="A"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Class Teacher</label>
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all bg-white"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.full_name} ({t.employee_number})</option>
                  ))}
                  {teachers.length === 0 && <option value="">No teachers available</option>}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all shadow-md shadow-primary/25 disabled:opacity-50"
                >
                  {submitting ? <LoaderCircle className="w-4 h-4 animate-spin" /> : 'Save Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

