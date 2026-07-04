import { useEffect, useState } from 'react'
import { Plus, X, LoaderCircle } from 'lucide-react'
import { db } from '../../lib/supabase/db'

export default function TeacherResults() {
  const [grades, setGrades] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [studentId, setStudentId] = useState('')
  const [classId, setClassId] = useState('')
  const [subject, setSubject] = useState('')
  const [score, setScore] = useState('')
  const [grade, setGrade] = useState('')
  const [term, setTerm] = useState('Term 2')
  const [academicYear, setAcademicYear] = useState('2025')

  const loadData = async () => {
    setLoading(true)
    try {
      const [gr, st, cls] = await Promise.all([db.grades.list(), db.students.list(), db.classes.list()])
      setGrades(gr || [])
      setStudents(st || [])
      setClasses(cls || [])
      if (st?.length > 0 && !studentId) setStudentId(st[0].id)
      if (cls?.length > 0 && !classId) setClassId(cls[0].id)
    } catch { setError('Failed to load data.') }
    finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [])

  const openModal = () => {
    setSubject(''); setScore(''); setGrade('')
    if (students.length > 0) setStudentId(students[0].id)
    if (classes.length > 0) setClassId(classes[0].id)
    setError(''); setSuccess(''); setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setSuccess(''); setSubmitting(true)
    try {
      await db.grades.create({ student_id: studentId, class_id: classId, subject, score: Number(score), grade, term, academic_year: academicYear })
      setSuccess(`Grade entered for ${subject}!`)
      setModalOpen(false)
      await loadData()
    } catch (_e: any) {
      setError(_e?.message || 'Failed to save grade.')
    } finally { setSubmitting(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Results</h1>
        <button onClick={openModal} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark shadow-md shadow-primary/25">
          <Plus className="w-4 h-4" /> Enter Grade
        </button>
      </div>
      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      {success && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
      ) : grades.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Student</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Subject</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Score</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Grade</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Term</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g: any) => (
                <tr key={g.id} className="border-t">
                  <td className="py-3 px-4">{g.student_name || g.student_id}</td>
                  <td className="py-3 px-4">{g.subject}</td>
                  <td className="py-3 px-4">{g.score}%</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">{g.grade}</span></td>
                  <td className="py-3 px-4 text-gray-500">{g.term}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="text-gray-400">No results yet. Enter grades to get started.</p>}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-serif text-lg font-bold">Enter Grade</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Student</label>
                <select value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm">
                  {students.map((s: any) => <option key={s.id} value={s.id}>{s.full_name} ({s.admission_number})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Class</label>
                  <select value={classId} onChange={e => setClassId(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm">
                    {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Subject</label>
                  <input type="text" required value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" placeholder="Mathematics" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Score (%)</label>
                  <input type="number" required min={0} max={100} value={score} onChange={e => setScore(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" placeholder="85" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Grade</label>
                  <input type="text" required value={grade} onChange={e => setGrade(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" placeholder="A, B+, C, etc." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Term</label>
                  <select value={term} onChange={e => setTerm(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm">
                    {['Term 1', 'Term 2', 'Term 3'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Academic Year</label>
                  <input type="text" value={academicYear} onChange={e => setAcademicYear(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark shadow-md disabled:opacity-50">
                  {submitting ? <LoaderCircle className="w-4 h-4 animate-spin" /> : 'Save Grade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
