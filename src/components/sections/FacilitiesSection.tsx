import { Link } from 'react-router-dom'
import { ArrowRight, School, FlaskConical, Monitor, BookOpen, Trophy, Music } from 'lucide-react'
import { facilities } from '../../lib/data'

const iconMap: Record<string, React.ElementType> = {
  School, FlaskConical, Monitor, BookOpen, Trophy, Music,
}

export default function FacilitiesSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-soft-blue text-primary rounded-full text-sm font-medium mb-4">Facilities</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6">
            Our School Facilities
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We provide modern facilities that create an enabling environment for effective teaching and learning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => {
            const Icon = iconMap[facility.icon] || School
            return (
              <div key={facility.title} className="group bg-gray-50 rounded-2xl p-8 card-hover border border-gray-100">
                <div className="w-14 h-14 rounded-xl bg-soft-blue flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                  <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-serif text-lg font-bold text-gray-900 mb-3">{facility.title}</h3>
                <p className="text-gray-600 leading-relaxed">{facility.description}</p>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/facilities"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View all facilities
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
