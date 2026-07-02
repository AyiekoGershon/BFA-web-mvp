import { Link } from 'react-router-dom'
import { ArrowRight, Quote } from 'lucide-react'
import { leadership } from '../../lib/data'

export default function LeadershipSection() {
  return (
    <section className="py-20 md:py-28 hero-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-white text-primary rounded-full text-sm font-medium mb-4 shadow-sm">Leadership</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6">
            Our School Leadership
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Dedicated professionals committed to providing quality education and fostering holistic development.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadership.map((person) => (
            <div key={person.name} className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover">
              <div className="relative h-64 overflow-hidden">
                <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-lg font-bold text-gray-900">{person.name}</h3>
                <p className="text-sm text-primary font-medium mb-3">{person.role}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{person.bio}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/leadership"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            Meet our full team
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
