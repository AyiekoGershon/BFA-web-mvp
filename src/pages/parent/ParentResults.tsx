import { useEffect, useState } from 'react'
import { db } from '../../lib/supabase/db'

export default function ParentResults() {
  const [grades, setGrades] = useState<any[]>([])
  useEffect(() => { db.grades.list().then(setGrades).catch(() => {}) }, [])
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Child's Results</h1>
      {grades.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b"><th className="text-left py-2">Student</th><th className="text-left py-2">Subject</th><th className="text-left py-2">Score</th><th className="text-left py-2">Grade</th></tr></thead>
            <tbody>
              {grades.map((g: any) => (
                <tr key={g.id} className="border-b">
                  <td className="py-2">{g.student_name || g.student_id}</td>
                  <td className="py-2">{g.subject}</td>
                  <td className="py-2">{g.score}%</td>
                  <td className="py-2"><span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">{g.grade}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="text-gray-400">No results yet.</p>}
    </div>
  )
}
