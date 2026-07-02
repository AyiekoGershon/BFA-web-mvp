import { Link } from 'react-router-dom'
import { ArrowRight, Award, Target, Eye } from 'lucide-react'
import { siteInfo } from '../lib/data'

const values = [
  { title: 'Excellence', description: 'We strive for the highest standards in everything we do.' },
  { title: 'Integrity', description: 'We uphold honesty and strong moral principles.' },
  { title: 'Discipline', description: 'We cultivate self-discipline and respect for others.' },
  { title: 'Teamwork', description: 'We work together to achieve common goals.' },
  { title: 'Faith', description: 'We nurture spiritual growth rooted in Christian values.' },
]

export default function About() {
  return (
    <div>
      <section className="hero-gradient py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6">
            About <span className="brand-gradient-text">Bright Future Academy</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {siteInfo.fullName} has been a pillar of quality education in Migori County, Kenya, 
            nurturing young minds and building futures since our founding.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Bright Future Academy (Ecole Notre Dame Des Anges) was established with a vision to provide accessible, quality education to the children of Migori County and beyond.</p>
                <p>Over the years, we have grown from humble beginnings into a thriving educational institution that serves over 500 students. Our commitment to holistic education — nurturing the mind, body, and spirit — remains at the core of everything we do.</p>
                <p>We follow the Competency-Based Curriculum (CBC) as outlined by the Kenya Institute of Curriculum Development, ensuring our students are well-prepared for the challenges of the 21st century.</p>
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=600&q=80" alt="Students" className="rounded-2xl shadow-xl w-full h-[400px] object-cover" />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-5">
                <p className="text-3xl font-bold text-primary">15+</p>
                <p className="text-sm text-gray-600">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">To provide quality, holistic education that nurtures intellectual, spiritual, and social development in a Christ-centered environment, preparing learners to become responsible and productive citizens.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Eye className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">To be a center of academic excellence and moral uprightness, producing well-rounded, God-fearing leaders who positively impact their communities and the world at large.</p>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-xl p-6 text-center shadow-md card-hover">
                <div className="w-12 h-12 rounded-full bg-soft-blue flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-serif font-bold text-gray-900 mb-2">{v.title}</h4>
                <p className="text-sm text-gray-600">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/25">
            Get in Touch
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
