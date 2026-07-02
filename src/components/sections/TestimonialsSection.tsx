import { Star, Quote } from 'lucide-react'
import { testimonials } from '../../lib/data'

export default function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-soft-blue text-primary rounded-full text-sm font-medium mb-4">Testimonials</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6">
            What People Say About Us
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Hear from parents, alumni, and community members about their experiences with Bright Future Academy.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {testimonials.map((t, index) => (
            <div key={index} className="relative rounded-3xl border border-slate-200/70 bg-slate-50 p-8 shadow-sm">
              <Quote className="w-10 h-10 text-primary/10 absolute top-6 right-6" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 italic">"{t.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
