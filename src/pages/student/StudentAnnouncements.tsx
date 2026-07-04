import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { studentApi } from '../../lib/api/client'

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  useEffect(() => {
    studentApi.getAnnouncements().then(r => { if (r.success) setAnnouncements(r.data || []) }).catch(() => {})
  }, [])
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Announcements</h1>
      {announcements.length > 0 ? (
        <div className="space-y-3">
          {announcements.map((a: any) => (
            <div key={a.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-3">
              <Bell className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">{a.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{a.content}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(a.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : <p className="text-gray-400">No announcements yet.</p>}
    </div>
  )
}
