import { useEffect, useState } from 'react'
import { Plus, X, LoaderCircle } from 'lucide-react'
import { db } from '../../lib/supabase/db'

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [classId, setClassId] = useState('')
  const [subject, setSubject] = useState('')
  const [dueDate, setDueDate] = useState('')

  const loadData = async () => {
    setLoading(true)
    try {
      const [asgn, cls] = await Promise.all([db.assignments.list(), db.classes.list()])
      setAssignments(asgn || [])
      setClasses(cls || [])
      if (cls?.length > 0 && !classId) setClassId(cls[0].id)
    } catch { setError('Failed to load data.') }
    finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [])

  const openModal = () => {
    setTitle(''); setDescription(''); setSubject(''); setDueDate('')
    if (classes.length > 0) setClassId(classes[0].id)
    setError(''); setSuccess(''); setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setSuccess(''); setSubmitting(true)
    try {
      await db.assignments.create({ title, description, class_id: classId, subject, due_date: new Date(dueDate).toISOString() })
      setSuccess(`Assignment "${title}" created!`)
      setModalOpen(false)
      await loadData()
    } catch (_e: any) {
      setError(_e?.message || 'Failed to create assignment.')
    } finally { setSubmitting(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        <button onClick={openModal} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all shadow-md shadow-primary/25">
          <Plus className="w-4 h-4" /> New Assignment
        </button>
      </div>
      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      {success && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
      ) : assignments.length > 0 ? (
        <div className="space-y-3">
          {assignments.map((a: any) => (
            <div key={a.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900">{a.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{a.description}</p>
              <div className="flex gap-4 mt-2 text-xs text-gray-400">
                <span>Subject: {a.subject}</span>
                <span>Class: {a.class_name || a.class_id}</span>
                <span>Due: {new Date(a.due_date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : <p className="text-gray-400">No assignments yet. Create one to get started.</p>}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-serif text-lg font-bold">New Assignment</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Title</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" placeholder="E.g. Algebra Exercise 4" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" placeholder="Instructions for students..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Class</label>
                  <select value={classId} onChange={e => setClassId(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm bg-white">
                    {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Subject</label>
                  <input type="text" required value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" placeholder="Mathematics" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Due Date</label>
                <input type="datetime-local" required value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark shadow-md shadow-primary/25 disabled:opacity-50">
                  {submitting ? <LoaderCircle className="w-4 h-4 animate-spin" /> : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
