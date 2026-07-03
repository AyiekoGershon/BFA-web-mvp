import { Search, MessageSquare, Mail } from 'lucide-react'

const messages = [
  { from: 'Mr. David Ochieng', subject: 'Classroom Resources Request', date: '2025-07-02', read: false },
  { from: 'Mrs. Grace Akinyi', subject: 'Grade 4 Field Trip Proposal', date: '2025-07-01', read: true },
  { from: 'Parent: Mrs. Wanjiku', subject: 'Inquiry About My Child', date: '2025-06-30', read: false },
]

export default function AdminMessages() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 text-sm mt-1">Internal communication</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {messages.map((m, i) => (
          <div key={i} className={`flex items-start gap-4 p-5 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer ${!m.read ? 'bg-blue-50/50' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className={`text-sm ${!m.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{m.from}</h3>
                <span className="text-xs text-gray-400">{m.date}</span>
              </div>
              <p className={`text-sm mt-0.5 truncate ${!m.read ? 'font-medium text-gray-800' : 'text-gray-500'}`}>{m.subject}</p>
            </div>
            {!m.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
          </div>
        ))}
      </div>
    </div>
  )
}
