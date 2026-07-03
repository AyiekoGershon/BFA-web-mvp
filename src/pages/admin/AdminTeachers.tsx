import { useEffect, useState } from 'react'
import { Plus, X, LoaderCircle, RefreshCw } from 'lucide-react'
import DataTable from '../../components/portal/DataTable'
import { db } from '../../lib/supabase/db'

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState<any[]>([])

  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [empNo, setEmpNo] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subjects, setSubjects] = useState('')
  const [qualifications, setQualifications] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [status, setStatus] = useState<'active' | 'inactive' | 'terminated'>('active')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadTeachers = async () => {
    setLoading(true)
    try {
      const data = await db.teachers.list()
      const mapped = data.map((t: any) => ({
        ...t,
        empNo: t.employee_number,
        name: t.full_name,
        subjects: Array.isArray(t.subject_specialization)
          ? t.subject_specialization.join(', ')
          : String(t.subject_specialization || ''),
      }))
      setTeachers(mapped)
    } catch {
      setError('Failed to load teachers list.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeachers()
  }, [])

  const openModal = () => {
    setFullName('')
    setEmail('')
    setPhone('')
    setSubjects('')
    setQualifications('')
    setGender('male')
    setStatus('active')
    // Generate unique employee number using timestamp
    const timestamp = Date.now().toString().slice(-4)
    setEmpNo(`TCH-${timestamp}`)
    setError('')
    setSuccess('')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const subjectArray = subjects
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)

      await db.teachers.create({
        employee_number: empNo,
        full_name: fullName,
        email,
        phone,
        subject_specialization: subjectArray,
        qualifications,
        gender,
        status,
      })

      setSuccess(`Teacher ${fullName} added successfully!`)
      setModalOpen(false)
      await loadTeachers()
    } catch (_e: any) {
      const msg = _e?.message || 'Failed to save teacher record.'
      // Make duplicate key errors more user-friendly
      if (msg.includes('duplicate key') || msg.includes('already exists')) {
        setError(`${msg}\n\nTip: Try changing the Employee Number to something unique.`)
      } else if (msg.includes('violates not-null')) {
        setError(`Missing required field: ${msg}`)
      } else {
        setError(msg)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    { key: 'empNo', label: 'Employee No.' },
    { key: 'name', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'subjects', label: 'Subjects' },
    {
      key: 'status',
      label: 'Status',
      render: (v: unknown) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
          v === 'active' ? 'bg-green-100 text-green-700 border border-green-200/50' : 'bg-red-100 text-red-700 border border-red-200/50'
        }`}>
          {String(v)}
        </span>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage teaching staff</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadTeachers}
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
            Add Teacher
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
          <DataTable columns={columns} data={teachers} searchable />
        )}
      </div>

      {/* Add Teacher Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-serif text-lg font-bold text-gray-900">Add New Teacher</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Teacher Full Name</label>
                  <input
                    type="text" required
                    value={fullName} onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.g. Mr. John Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Employee Number</label>
                  <input
                    type="text" required
                    value={empNo} onChange={(e) => setEmpNo(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email Address</label>
                  <input
                    type="email" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="teacher@bfacademy.ac.ke"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Gender</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['male', 'female'].map((g) => (
                      <button
                        key={g} type="button"
                        onClick={() => setGender(g as 'male' | 'female')}
                        className={`py-2 rounded-xl text-sm font-medium border capitalize transition-all ${
                          gender === g
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
                  <select
                    value={status} onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Subject Specializations (comma separated)</label>
                  <input
                    type="text"
                    value={subjects} onChange={(e) => setSubjects(e.target.value)}
                    placeholder="E.g. Mathematics, Science, Social Studies"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Academic Qualifications</label>
                  <input
                    type="text"
                    value={qualifications} onChange={(e) => setQualifications(e.target.value)}
                    placeholder="E.g. Bachelor of Education (Science)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button" onClick={closeModal}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all shadow-md shadow-primary/25 disabled:opacity-50"
                >
                  {submitting ? <LoaderCircle className="w-4 h-4 animate-spin" /> : 'Save Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
