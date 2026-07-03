import { Clock } from 'lucide-react'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const periods = ['8:00-8:40', '8:40-9:20', '9:20-10:00', '10:00-10:40', '11:00-11:40', '11:40-12:20', '12:20-1:00', '2:00-2:40', '2:40-3:20']
const subjects = ['Math', 'English', 'Science', 'Kiswahili', 'Social Studies', 'CRE', 'PE', 'Music', 'Art']

const timetable = days.map((_, d) =>
  periods.map((_, p) => subjects[(d + p * 2) % subjects.length])
)

export default function AdminTimetable() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
        <p className="text-gray-500 text-sm mt-1">School timetable management</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-600 w-28">Time</th>
              {days.map((d) => <th key={d} className="px-4 py-3 text-left font-semibold text-gray-600">{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {periods.map((time, p) => (
              <tr key={p} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {time}
                </td>
                {days.map((_, d) => (
                  <td key={d} className="px-4 py-3">
                    <span className="px-2 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary">
                      {timetable[d][p]}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
