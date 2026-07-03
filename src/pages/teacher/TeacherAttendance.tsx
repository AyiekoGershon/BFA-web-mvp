import { useState } from 'react'
import { Check, X, Clock } from 'lucide-react'

const students = [
  { name: 'Alice Wanjiku', adm: 'BFA-001' },
  { name: 'Brian Omondi', adm: 'BFA-002' },
  { name: 'Grace Akinyi', adm: 'BFA-003' },
  { name: 'Daniel Kimutai', adm: 'BFA-004' },
  { name: 'Faith Chebet', adm: 'BFA-005' },
]

type Status = 'present' | 'absent' | 'late' | null

export default function TeacherAttendance() {
  const [attendance, setAttendance] = useState<Record<string, Status>>({})

  const toggle = (adm: string, status: Status) => {
    setAttendance((prev) => ({ ...prev, [adm]: prev[adm] === status ? null : status }))
  }

  const allMarked = students.every((s) => attendance[s.adm])
  const present = Object.values(attendance).filter((s) => s === 'present').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-500 text-sm mt-1">Mark daily attendance for Grade 4A</p>
        </div>
        <div className="flex items-center gap-3">
          {allMarked && <span className="text-sm text-gray-500">{present} present / {students.length} total</span>}
          <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">Save</button>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-6 text-sm text-gray-500">
          <span className="font-medium">Date: 3 July 2025</span>
          <span className="font-medium">Class: Grade 4A</span>
        </div>
        {students.map((s) => (
          <div key={s.adm} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                {s.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{s.name}</p>
                <p className="text-xs text-gray-400">{s.adm}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {([
                { status: 'present' as Status, icon: Check, color: 'text-green-600 bg-green-100 hover:bg-green-200' },
                { status: 'absent' as Status, icon: X, color: 'text-red-600 bg-red-100 hover:bg-red-200' },
                { status: 'late' as Status, icon: Clock, color: 'text-orange-600 bg-orange-100 hover:bg-orange-200' },
              ]).map((btn) => {
                const Icon = btn.icon
                const active = attendance[s.adm] === btn.status
                return (
                  <button
                    key={btn.status}
                    onClick={() => toggle(s.adm, btn.status)}
                    className={`p-2 rounded-lg transition-all ${
                      active ? btn.color + ' ring-2 ring-offset-1' : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
