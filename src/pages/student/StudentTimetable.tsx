import { useEffect, useState } from 'react'
import { db } from '../../lib/supabase/db'

const DAYS = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function StudentTimetable() {
  const [entries, setEntries] = useState<any[]>([])
  useEffect(() => { db.timetable.list().then(setEntries).catch(() => {}) }, [])
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">My Timetable</h1>
      {entries.length > 0 ? (
        <div className="space-y-2">
          {entries.map((e: any) => (
            <div key={e.id} className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm border">
              <div>
                <p className="font-medium text-gray-900">{e.subject}</p>
                <p className="text-xs text-gray-500">{DAYS[e.day_of_week] || 'Day ' + e.day_of_week} · {e.start_time} - {e.end_time}</p>
              </div>
              <span className="text-xs text-gray-400">{e.room}</span>
            </div>
          ))}
        </div>
      ) : <p className="text-gray-400">No timetable yet.</p>}
    </div>
  )
}
