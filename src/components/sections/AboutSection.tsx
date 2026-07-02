import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Shield, Award } from 'lucide-react'

const highlights = [
  {
    icon: Heart,
    title: 'Our Mission',
    description: 'To provide quality, holistic education that nurtures intellectual, spiritual, and social development in a Christ-centered environment.',
  },
  {
    icon: Shield,
    title: 'Our Vision',
    description: 'To be a center of academic excellence producing well-rounded, God-fearing leaders who positively impact society.',
  },
  {
    icon: Award,
    title: 'Our Values',
    description: 'Excellence, Integrity, Discipline, Respect, Teamwork, and Faith form the foundation of everything we do.',
  },
]

export default function AboutSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-soft-blue text-primary rounded-full text-sm font-medium mb-4">About Us</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6">
            Welcome to <span className="brand-gradient-text">Bright Future Academy</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Established in {new Date().getFullYear() - 15}, Bright Future Academy has been a beacon of quality education 
            in Migori County, Kenya. We are committed to nurturing each child's unique potential through a balanced approach 
            that combines academic excellence with character formation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {highlights.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="bg-soft-blue rounded-2xl p-8 card-hover">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            Learn more about our story
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
