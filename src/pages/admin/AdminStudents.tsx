import { useEffect, useState } from 'react'
import { Plus, X, LoaderCircle, RefreshCw } from 'lucide-react'
import DataTable from '../../components/portal/DataTable'
import { db } from '../../lib/supabase/db'

export default function AdminStudents() {
  const [students, setStudents] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [fullName, setFullName] = useState('')
  const [admissionNo, setAdmissionNo] = useState('')
  const [classId, setClassId] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [dob, setDob] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'active' | 'graduated' | 'transferred' | 'suspended'>('active')

  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const loadData = async () => {
    setLoading(true)
    try {
      const studentData = await db.students.list()
      const classData = await db.classes.list()
      setClasses(classData)
      if (classData.length > 0) {
        setClassId(classData[0].id)
      }

      // Map class name to each student
      const mapped = studentData.map((s: any) => {
        const c = classData.find((item: any) => item.id === s.class_id)
        return {
          ...s,
          admission: s.admission_number, // DT key
          name: s.full_name, // DT key
          class: c ? c.name : 'Unassigned',
        }
      })
      setStudents(mapped)
    } catch {
      setError('Failed to load student profiles.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const openModal = () => {
    // Reset all form fields when opening modal
    setFullName('')
    setAdmissionNo(`BFA-2025-${Math.floor(100 + Math.random() * 900)}`)
    setDob('')
    setAddress('')
    setPhone('')
    setGender('male')
    setStatus('active')
    if (classes.length > 0) {
      setClassId(classes[0].id)
    }
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    // Reset classId so it's fresh next time
    if (classes.length > 0) {
      setClassId(classes[0].id)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await db.students.create({
        admission_number: admissionNo,
        full_name: fullName,
        class_id: classId,
        gender,
        date_of_birth: dob,
        address,
        phone,
        status,
      })

      // Reset
      setFullName('')
      setAdmissionNo('')
      setDob('')
      setAddress('')
      setPhone('')
      setModalOpen(false)
      await loadData()
    } catch (_e: any) {
      setError((_e as Error)?.message || 'Failed to save student record.')
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    { key: 'admission', label: 'Admission No.' },
    { key: 'name', label: 'Full Name' },
    { key: 'class', label: 'Class' },
    { key: 'gender', label: 'Gender', render: (v: unknown) => <span className="capitalize">{String(v)}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (v: unknown) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
          v === 'active' ? 'bg-green-100 text-green-700 border border-green-200/50' :
          v === 'graduated' ? 'bg-blue-100 text-blue-700 border border-blue-200/50' :
          v === 'transferred' ? 'bg-orange-100 text-orange-700 border border-orange-200/50' :
          'bg-red-100 text-red-700 border border-red-200/50'
        }`}>
          {String(v)}
        </span>
      ),
    },
  ]

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.admission.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all registered students</p>
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
            Add Student
          </button>
        </div>
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <DataTable columns={columns} data={filtered} searchable onSearch={setSearch} />
        )}
      </div>

      {/* Add Student Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-serif text-lg font-bold text-gray-900">Add New Student</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.g. John Doe Jr."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Admission Number</label>
                  <input
                    type="text"
                    required
                    value={admissionNo}
                    onChange={(e) => setAdmissionNo(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Class Placement</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.section})</option>
                    ))}
                    {classes.length === 0 && <option value="">No classes configured</option>}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Gender</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['male', 'female'].map((g) => (
                      <button
                        key={g}
                        type="button"
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
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="graduated">Graduated</option>
                    <option value="transferred">Transferred</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Parent Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Home Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Residential address"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                  />
                </div>
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
                  {submitting ? <LoaderCircle className="w-4 h-4 animate-spin" /> : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

