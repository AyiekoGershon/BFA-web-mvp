import { Clock } from 'lucide-react'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const periods = ['8:00-8:40', '8:40-9:20', '9:20-10:00', '10:00-10:40', '11:00-11:40', '11:40-12:20', '12:20-1:00', '2:00-2:40', '2:40-3:20']
const classes = ['4A Math', '4B Math', '5A Math', '6A Math', '4A Math', '5A Math', 'Free', '6A Math', '4B Math']

export default function TeacherTimetable() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Timetable</h1>
        <p className="text-gray-500 text-sm mt-1">Your teaching schedule</p>
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
                <td className="px-4 py-3 text-gray-500 font-medium whitespace-nowrap">{time}</td>
                {days.map((_, d) => {
                  const cls = classes[(d * 3 + p) % classes.length]
                  return (
                    <td key={d} className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        cls === 'Free' ? 'bg-gray-100 text-gray-400' : 'bg-primary/10 text-primary'
                      }`}>{cls}</span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
