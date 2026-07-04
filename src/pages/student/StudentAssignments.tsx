import { useEffect, useState } from 'react'
import { db } from '../../lib/supabase/db'

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState<any[]>([])
  useEffect(() => { db.assignments.list().then(setAssignments).catch(() => {}) }, [])
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">My Assignments</h1>
      {assignments.length > 0 ? (
        <div className="space-y-3">
          {assignments.map((a: any) => (
            <div key={a.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900">{a.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{a.description}</p>
              <div className="flex gap-4 mt-2 text-xs text-gray-400">
                <span>{a.subject}</span>
                <span>Due: {new Date(a.due_date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : <p className="text-gray-400">No assignments yet.</p>}
    </div>
  )
}
