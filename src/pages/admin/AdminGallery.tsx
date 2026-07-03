import { Plus, Upload } from 'lucide-react'
import { gallery } from '../../lib/data'

export default function AdminGallery() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
          <p className="text-gray-500 text-sm mt-1">Manage school photo gallery</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
          <Upload className="w-4 h-4" />
          Upload Images
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((img, i) => (
          <div key={i} className="relative group rounded-xl overflow-hidden aspect-square cursor-pointer">
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium">Delete</button>
            </div>
            <p className="absolute bottom-2 left-2 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">{img.category}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
