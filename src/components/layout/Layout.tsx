import { Link, Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { navLinks } from '../../lib/data'

function getLabel(segment: string) {
  const match = navLinks.find((link) => link.href === `/${segment}`)
  if (match) return match.label
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function Layout() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)
  const currentLabel = segments.length ? getLabel(segments[segments.length - 1]) : 'Home'

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {location.pathname !== '/' && (
          <section className="bg-slate-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-500">
                  <Link to="/" className="font-medium text-slate-700 hover:text-primary">
                    Home
                  </Link>
                  {segments.map((segment, index) => (
                    <span key={segment} className="inline-flex items-center gap-1">
                      <span className="text-slate-400">›</span>
                      {index === segments.length - 1 ? (
                        <span className="font-semibold text-slate-700">{getLabel(segment)}</span>
                      ) : (
                        <Link to={`/${segment}`} className="text-slate-600 hover:text-primary">
                          {getLabel(segment)}
                        </Link>
                      )}
                    </span>
                  ))}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-gold" />
                  {currentLabel.toUpperCase()}
                </div>
              </div>
            </div>
          </section>
        )}
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
