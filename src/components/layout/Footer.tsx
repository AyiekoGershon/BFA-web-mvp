import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Clock, Globe, MessageCircle, Camera, Play } from 'lucide-react'
import { siteInfo } from '../../lib/data'

const footerLinks = {
  'Quick Links': [
    { label: 'About Us', href: '/about' },
    { label: 'Academics', href: '/academics' },
    { label: 'Admissions', href: '/admissions' },
    { label: 'Facilities', href: '/facilities' },
    { label: 'News & Events', href: '/news' },
    { label: 'Contact Us', href: '/contact' },
  ],
  Academics: [
    { label: 'Nursery Section', href: '/nursery' },
    { label: 'Primary Section', href: '/primary' },
    { label: 'Calendar', href: '/calendar' },
    { label: 'Downloads', href: '/downloads' },
    { label: 'FAQ', href: '/faq' },
  ],
  'More': [
    { label: 'Leadership', href: '/leadership' },
    { label: 'Mission & Vision', href: '/mission' },
    { label: 'Staff', href: '/staff' },
    { label: 'Testimonials', href: '/testimonials' },
    { label: 'Careers', href: '/careers' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={siteInfo.logo} alt={siteInfo.name} className="h-12 w-auto brightness-0 invert" />
              <div>
                <h3 className="font-serif text-xl font-bold text-white">{siteInfo.name}</h3>
                <p className="text-sm text-gray-400">BFA | Migori, Mabera | Kenya</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">{siteInfo.description}</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{siteInfo.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{siteInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{siteInfo.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Mon - Fri: 7:30 AM - 4:30 PM</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              {[Globe, MessageCircle, Camera, Play].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-serif text-base font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm text-gray-400 hover:text-gold transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} {siteInfo.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
              <div className="flex items-center gap-2">
                <img src={siteInfo.flag} alt="Kenya Flag" className="h-4 w-auto" />
                <span>Migori County, Kenya</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
