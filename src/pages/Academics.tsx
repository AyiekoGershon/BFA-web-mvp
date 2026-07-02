import { Check, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { academics } from '../lib/data'

export default function Academics() {
  return (
    <div>
      <section className="hero-gradient py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6">
            Our <span className="brand-gradient-text">Academic Programs</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We offer a comprehensive educational journey following the Competency-Based Curriculum (CBC), 
            from early childhood through primary education.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {academics.map((program) => (
              <div key={program.slug} className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 card-hover">
                <div className="relative h-64 overflow-hidden">
                  <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-primary">
                      {program.ageRange}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">{program.title}</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>
                  <h3 className="font-semibold text-gray-900 mb-3">Programs Offered:</h3>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {program.programs.map((p) => (
                      <div key={p} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    to={`/${program.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-all"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">Ready to Join Us?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Give your child the gift of quality education. Applications are now open for the upcoming academic year.</p>
          <Link to="/admissions" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/25">
            Apply for Admission
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
