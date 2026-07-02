import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { siteInfo, navLinks } from '../../lib/data'
import { cn } from '../../lib/utils'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src={siteInfo.logo} alt={siteInfo.name} className="h-12 w-auto" />
            <div className="hidden sm:block">
              <h1 className="font-serif text-lg font-bold text-gray-900 leading-tight">{siteInfo.name}</h1>
              <p className="text-xs text-gray-500">BFA | Migori, Mabera | Kenya</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  location.pathname === link.href
                    ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                    : 'text-slate-600 hover:text-primary hover:bg-slate-100'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="relative ml-2">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Portals
                <ChevronDown className={cn('w-4 h-4 transition-transform', dropdownOpen && 'rotate-180')} />
              </button>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                    {['Parent', 'Student', 'Teacher', 'Admin'].map((role) => (
                      <Link
                        key={role}
                        to={`/${role.toLowerCase()}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {role} Portal
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-4 py-2 rounded-full text-sm font-medium',
                  location.pathname === link.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 hover:text-primary hover:bg-slate-100'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100">
              <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Portals</p>
              {['Parent', 'Student', 'Teacher', 'Admin'].map((role) => (
                <Link
                  key={role}
                  to={`/${role.toLowerCase()}`}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-primary hover:bg-blue-50/50"
                >
                  {role} Portal
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
