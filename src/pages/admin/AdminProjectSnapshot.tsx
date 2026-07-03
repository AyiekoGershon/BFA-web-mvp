import { FileText, Download } from 'lucide-react'

const logs = [
  { action: 'Student record updated', user: 'Admin', date: '2025-07-03 14:30' },
  { action: 'New admission approved', user: 'Admin', date: '2025-07-03 10:15' },
  { action: 'Teacher assigned to Grade 4A', user: 'Admin', date: '2025-07-02 16:45' },
  { action: 'Timetable updated', user: 'Admin', date: '2025-07-02 11:20' },
  { action: 'New announcement published', user: 'Admin', date: '2025-07-01 09:00' },
]

export default function AdminProjectSnapshot() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Snapshot</h1>
          <p className="text-gray-500 text-sm mt-1">System activity log and audit trail</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all">
          <Download className="w-4 h-4" />
          Export Log
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Recent Activity Log
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {logs.map((log, i) => (
            <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-900">{log.action}</p>
                <p className="text-xs text-gray-500 mt-0.5">By: {log.user}</p>
              </div>
              <span className="text-xs text-gray-400">{log.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
