import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, BookOpen, Calendar, Megaphone, ClipboardList, UserCheck, FileText,
  MessageSquare, Image, Star, Settings, LogOut, Bell, Menu, School, GraduationCap,
  HelpCircle, Download, ChevronLeft, Clock, ClipboardCheck,
} from 'lucide-react'
import { useAuth } from '../../lib/supabase/auth'
import { siteInfo } from '../../lib/data'
import { cn } from '../../lib/utils'
import type { Role } from '../../lib/supabase/client'

interface NavItem {
  label: string
  icon: React.ElementType
  href: string
}

const navItems: Record<Role, { label: string; items: NavItem[] }[]> = {
  admin: [
    {
      label: 'Main',
      items: [
        { label: 'Overview', icon: LayoutDashboard, href: '/admin' },
        { label: 'Portal Accounts', icon: Users, href: '/admin/accounts' },
        { label: 'Students', icon: Users, href: '/admin/students' },
        { label: 'Teachers', icon: GraduationCap, href: '/admin/teachers' },
        { label: 'Classes', icon: School, href: '/admin/classes' },
        { label: 'Timetable', icon: Clock, href: '/admin/timetable' },
      ],
    },
    {
      label: 'Content',
      items: [
        { label: 'Announcements', icon: Megaphone, href: '/admin/announcements' },
        { label: 'News', icon: FileText, href: '/admin/news' },
        { label: 'Events', icon: Calendar, href: '/admin/events' },
        { label: 'Gallery', icon: Image, href: '/admin/gallery' },
        { label: 'Testimonials', icon: Star, href: '/admin/testimonials' },
      ],
    },
    {
      label: 'Management',
      items: [
        { label: 'Admissions', icon: ClipboardList, href: '/admin/admissions' },
        { label: 'Staff Requests', icon: HelpCircle, href: '/admin/staff-requests' },
        { label: 'Messages', icon: MessageSquare, href: '/admin/messages' },
        { label: 'Homepage Images', icon: Image, href: '/admin/homepage-images' },
      ],
    },
    {
      label: 'System',
      items: [
        { label: 'Layout', icon: Settings, href: '/admin/layout' },
        { label: 'Migration Kit', icon: Download, href: '/admin/migration' },
        { label: 'Project Snapshot', icon: ClipboardCheck, href: '/admin/project-snapshot' },
      ],
    },
  ],
  parent: [
    {
      label: 'Main',
      items: [
        { label: 'Overview', icon: LayoutDashboard, href: '/parent' },
        { label: 'My Child', icon: Users, href: '/parent/child' },
        { label: 'Assignments', icon: BookOpen, href: '/parent/assignments' },
        { label: 'Results', icon: ClipboardCheck, href: '/parent/results' },
        { label: 'Announcements', icon: Megaphone, href: '/parent/announcements' },
      ],
    },
  ],
  student: [
    {
      label: 'Main',
      items: [
        { label: 'Overview', icon: LayoutDashboard, href: '/student' },
        { label: 'Assignments', icon: BookOpen, href: '/student/assignments' },
        { label: 'Results', icon: ClipboardCheck, href: '/student/results' },
        { label: 'Timetable', icon: Clock, href: '/student/timetable' },
        { label: 'Announcements', icon: Megaphone, href: '/student/announcements' },
      ],
    },
  ],
  teacher: [
    {
      label: 'Main',
      items: [
        { label: 'Overview', icon: LayoutDashboard, href: '/teacher' },
        { label: 'Assignments', icon: BookOpen, href: '/teacher/assignments' },
        { label: 'Attendance', icon: UserCheck, href: '/teacher/attendance' },
        { label: 'Results', icon: ClipboardCheck, href: '/teacher/results' },
        { label: 'Timetable', icon: Clock, href: '/teacher/timetable' },
        { label: 'Announcements', icon: Megaphone, href: '/teacher/announcements' },
      ],
    },
  ],
}

export default function PortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const { profile, role, signOut } = useAuth()

  if (!role) return null

  const sections = navItems[role]

  return (
    <div className="min-h-screen bg-gray-50">
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300',
          collapsed ? 'w-20' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between h-20 px-4 border-b border-gray-200">
          <Link to="/" className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
            <img src={siteInfo.logo} alt="" className="h-10 w-10 rounded-lg" />
            {!collapsed && (
              <div>
                <p className="font-serif text-sm font-bold text-gray-900 leading-tight">{siteInfo.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider capitalize">{role}</p>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
          >
            <ChevronLeft className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
          </button>
        </div>

        <nav className="p-3 space-y-6 overflow-y-auto h-[calc(100vh-5rem)]">
          {sections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  {section.label}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = location.pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                        collapsed && 'justify-center',
                        active
                          ? 'bg-primary text-white shadow-md shadow-primary/20'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-white">
          <button
            onClick={signOut}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all',
              collapsed && 'justify-center'
            )}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <div className={cn('transition-all duration-300', collapsed ? 'lg:ml-20' : 'lg:ml-64')}>
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 capitalize">{role} Portal</h2>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                  {profile?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
                  <p className="text-xs text-gray-500 capitalize">{role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
