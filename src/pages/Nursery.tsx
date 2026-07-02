import { Check, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { academics } from '../lib/data'

const nursery = academics[0]

export default function Nursery() {
  return (
    <div>
      <section className="hero-gradient py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6">
            {nursery.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">{nursery.description}</p>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img src={nursery.image} alt={nursery.title} className="rounded-2xl shadow-xl w-full h-[400px] object-cover" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Program Overview</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{nursery.description}</p>
              <div className="space-y-3 mb-8">
                {nursery.programs.map((p) => (
                  <div key={p} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-gray-700">{p}</span>
                  </div>
                ))}
              </div>
              <Link to="/admissions" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all">
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
