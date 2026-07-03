import { Upload, ArrowUpDown } from 'lucide-react'

const images = [
  { name: 'Hero Banner 1', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', active: true },
  { name: 'Hero Banner 2', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=800&q=80', active: false },
  { name: 'Hero Banner 3', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80', active: false },
]

export default function AdminHomepageImages() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage Images</h1>
          <p className="text-gray-500 text-sm mt-1">Manage hero slider images</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
          <Upload className="w-4 h-4" />
          Upload Image
        </button>
      </div>
      <div className="space-y-4">
        {images.map((img, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col sm:flex-row">
            <img src={img.url} alt={img.name} className="w-full sm:w-48 h-32 object-cover" />
            <div className="flex-1 p-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{img.name}</h3>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  img.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>{img.active ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><ArrowUpDown className="w-4 h-4" /></button>
                <button className="p-2 rounded-lg hover:bg-red-50 text-red-500">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
