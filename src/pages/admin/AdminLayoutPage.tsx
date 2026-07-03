import { Save, RotateCcw } from 'lucide-react'

export default function AdminLayoutPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Layout Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Customize portal appearance</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all">
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Theme Colors</h3>
          <div className="space-y-4">
            {[
              { label: 'Primary Color', value: '#287EE2' },
              { label: 'Gold Accent', value: '#E8A623' },
              { label: 'Lavender', value: '#B399CC' },
              { label: 'Background', value: '#DEE5ED' },
            ].map((c) => (
              <div key={c.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{c.label}</span>
                <div className="flex items-center gap-2">
                  <input type="color" value={c.value} className="w-8 h-8 rounded cursor-pointer border-0" />
                  <span className="text-xs text-gray-500 font-mono">{c.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
          <div className="space-y-3">
            {['Show sidebar labels', 'Collapse sidebar by default', 'Show announcement banner', 'Enable dark mode toggle'].map((setting) => (
              <label key={setting} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">{setting}</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
