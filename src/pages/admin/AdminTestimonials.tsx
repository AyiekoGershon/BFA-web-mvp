import { Star, Check, X } from 'lucide-react'

const testimonials = [
  { name: 'Mrs. Jane Wanjiku', role: 'Parent', content: 'Bright Future Academy has transformed my child\'s education.', rating: 5, status: 'approved' },
  { name: 'Mr. James Omondi', role: 'Parent', content: 'I am impressed by the school\'s commitment to holistic education.', rating: 5, status: 'pending' },
  { name: 'Ms. Faith Chebet', role: 'Alumna', content: 'My years at BFA laid the foundation for my success.', rating: 5, status: 'approved' },
]

export default function AdminTestimonials() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
        <p className="text-gray-500 text-sm mt-1">Manage testimonials and reviews</p>
      </div>
      <div className="space-y-4">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{t.name}</h3>
                  <span className="text-sm text-gray-500">{t.role}</span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 italic">"{t.content}"</p>
              </div>
              <div className="flex items-center gap-2">
                {t.status === 'pending' ? (
                  <>
                    <button className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"><Check className="w-4 h-4" /></button>
                    <button className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"><X className="w-4 h-4" /></button>
                  </>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Approved</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
