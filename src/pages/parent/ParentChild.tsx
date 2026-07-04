import { useEffect, useState } from 'react'
import { db } from '../../lib/supabase/db'

export default function ParentChild() {
  const [children, setChildren] = useState<any[]>([])
  useEffect(() => { db.students.list().then(setChildren).catch(() => {}) }, [])
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">My Children</h1>
      {children.length > 0 ? (
        <div className="space-y-4">
          {children.map((c: any) => (
            <div key={c.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {c.full_name?.charAt(0) || 'S'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{c.full_name}</h3>
                  <p className="text-sm text-gray-500">Admission: {c.admission_number}</p>
                  <div className="flex gap-4 mt-1 text-xs text-gray-400">
                    <span>Gender: {c.gender}</span>
                    <span>DOB: {c.date_of_birth}</span>
                    <span>Status: <span className="text-green-600 font-medium">{c.status}</span></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : <p className="text-gray-400">No children linked to your account.</p>}
    </div>
  )
}
