import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Phone } from 'lucide-react'
import { siteInfo } from '../../lib/data'

const heroImages = [
  '/images/Home/flag.png',
  '/images/Home/1.jpg',
  '/images/Home/2.jpg',
  '/images/Home/class.jpg',
  '/images/Home/students.jpg',
]

export default function HeroSection() {
  const images = useMemo(() => heroImages, [])
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % images.length)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [images.length])

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        {images.map((image, idx) => (
          <div
            key={image}
            className={
              `absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-out ${
                idx === active ? 'opacity-100' : 'opacity-0'
              }`
            }
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-5rem)] flex items-center">
        <div className="w-full">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 border border-white/10 shadow-lg shadow-black/20 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
              Private School · {siteInfo.location}
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-5xl xl:text-6xl font-serif font-black tracking-[-0.04em] text-white leading-tight">
              Building <span className="brand-gradient-text">Bright Futures</span><br />
              With Love and Excellence
            </h1>

            <p className="mt-8 mx-auto max-w-2xl text-base sm:text-lg leading-8 text-slate-200/90">
              Welcome to {siteInfo.name} — where every learner is valued, supported, and prepared to become a responsible and productive leader of tomorrow.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
              <Link
                to="/admissions"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-xl shadow-primary/30 transition hover:bg-primary-dark"
              >
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Learn More
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                <Phone className="w-4 h-4" />
                Contact Us
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-200">
              <div className="rounded-3xl bg-white/10 p-5 border border-white/10 backdrop-blur-sm">
                <p className="text-2xl font-bold">500+</p>
                <p className="mt-1 text-slate-300">Students enrolled</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 border border-white/10 backdrop-blur-sm">
                <p className="text-2xl font-bold">15+</p>
                <p className="mt-1 text-slate-300">Years of excellence</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 border border-white/10 backdrop-blur-sm">
                <p className="text-2xl font-bold">120+</p>
                <p className="mt-1 text-slate-300">Awards & recognitions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
