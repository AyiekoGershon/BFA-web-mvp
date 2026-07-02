import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { academics } from '../../lib/data'

export default function AcademicsSection() {
  return (
    <section className="py-20 md:py-28 hero-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-white text-primary rounded-full text-sm font-medium mb-4 shadow-sm">Academics</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6">
            Our Academic Programs
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We offer a comprehensive educational journey from early childhood through primary school, 
            following the Competency-Based Curriculum (CBC).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {academics.map((program) => (
            <div key={program.slug} className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover">
              <div className="relative h-56 overflow-hidden">
                <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-primary">
                    {program.ageRange}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">{program.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>
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
                  className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
