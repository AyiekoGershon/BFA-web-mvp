import { Plus, Calendar } from 'lucide-react'

const news = [
  { title: 'Annual Sports Day 2025', date: 'June 15, 2025', status: 'Published' },
  { title: 'Science Fair Winners Announced', date: 'May 28, 2025', status: 'Published' },
  { title: 'New Computer Lab Inaugurated', date: 'April 10, 2025', status: 'Published' },
]

export default function AdminNews() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News</h1>
          <p className="text-gray-500 text-sm mt-1">Manage news articles</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
          <Plus className="w-4 h-4" />
          New Article
        </button>
      </div>
      <div className="space-y-4">
        {news.map((a, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-soft-blue flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{a.title}</h3>
                <p className="text-sm text-gray-500">{a.date}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{a.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
