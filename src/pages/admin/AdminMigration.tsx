import { Download, Upload, Database, AlertCircle } from 'lucide-react'

export default function AdminMigration() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Migration Kit</h1>
        <p className="text-gray-500 text-sm mt-1">Import and export school data</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover text-center">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Download className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Export Data</h3>
          <p className="text-sm text-gray-500 mb-4">Download all data as CSV/Excel</p>
          <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">Export</button>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover text-center">
          <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-7 h-7 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Import Data</h3>
          <p className="text-sm text-gray-500 mb-4">Upload data from CSV/Excel</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all">Import</button>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover text-center">
          <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Database className="w-7 h-7 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Backup Database</h3>
          <p className="text-sm text-gray-500 mb-4">Create a full system backup</p>
          <button className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-all">Backup Now</button>
        </div>
      </div>
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-700">Migration tools are available for administrators. Exported data contains sensitive information. Handle with care.</p>
      </div>
    </div>
  )
}
