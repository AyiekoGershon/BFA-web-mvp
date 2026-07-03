import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/supabase/auth'
import Layout from './components/layout/Layout'
import PortalLayout from './components/portal/PortalLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import Academics from './pages/Academics'
import Admissions from './pages/Admissions'
import Gallery from './pages/Gallery'
import News from './pages/News'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Nursery from './pages/Nursery'
import Primary from './pages/Primary'
import Login from './pages/Login'
import PlaceholderPage from './pages/PlaceholderPage'
import AdminOverview from './pages/admin/AdminOverview'
import AdminPortalAccounts from './pages/admin/AdminPortalAccounts'
import AdminStudents from './pages/admin/AdminStudents'
import AdminTeachers from './pages/admin/AdminTeachers'
import AdminClasses from './pages/admin/AdminClasses'
import AdminAnnouncements from './pages/admin/AdminAnnouncements'
import AdminAdmissions from './pages/admin/AdminAdmissions'
import AdminEvents from './pages/admin/AdminEvents'
import AdminNews from './pages/admin/AdminNews'
import AdminGallery from './pages/admin/AdminGallery'
import AdminMessages from './pages/admin/AdminMessages'
import AdminTimetable from './pages/admin/AdminTimetable'
import AdminTestimonials from './pages/admin/AdminTestimonials'
import AdminStaffRequests from './pages/admin/AdminStaffRequests'
import AdminHomepageImages from './pages/admin/AdminHomepageImages'
import AdminMigration from './pages/admin/AdminMigration'
import AdminProjectSnapshot from './pages/admin/AdminProjectSnapshot'
import AdminLayoutPage from './pages/admin/AdminLayoutPage'
import ParentOverview from './pages/parent/ParentOverview'
import ParentChild from './pages/parent/ParentChild'
import ParentAssignments from './pages/parent/ParentAssignments'
import ParentResults from './pages/parent/ParentResults'
import ParentAnnouncements from './pages/parent/ParentAnnouncements'
import StudentOverview from './pages/student/StudentOverview'
import StudentAssignments from './pages/student/StudentAssignments'
import StudentResults from './pages/student/StudentResults'
import StudentTimetable from './pages/student/StudentTimetable'
import StudentAnnouncements from './pages/student/StudentAnnouncements'
import TeacherOverview from './pages/teacher/TeacherOverview'
import TeacherAssignments from './pages/teacher/TeacherAssignments'
import TeacherAttendance from './pages/teacher/TeacherAttendance'
import TeacherResults from './pages/teacher/TeacherResults'
import TeacherTimetable from './pages/teacher/TeacherTimetable'
import TeacherAnnouncements from './pages/teacher/TeacherAnnouncements'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/nursery" element={<Nursery />} />
            <Route path="/primary" element={<Primary />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/news" element={<News />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/facilities" element={<PlaceholderPage />} />
            <Route path="/calendar" element={<PlaceholderPage />} />
            <Route path="/careers" element={<PlaceholderPage />} />
            <Route path="/downloads" element={<PlaceholderPage />} />
            <Route path="/history" element={<PlaceholderPage />} />
            <Route path="/leadership" element={<PlaceholderPage />} />
            <Route path="/mission" element={<PlaceholderPage />} />
            <Route path="/staff" element={<PlaceholderPage />} />
            <Route path="/staff-signup" element={<PlaceholderPage />} />
            <Route path="/testimonials" element={<PlaceholderPage />} />
            <Route path="/privacy" element={<PlaceholderPage />} />
            <Route path="/terms" element={<PlaceholderPage />} />
          </Route>

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />

          {/* Admin portal */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<PortalLayout />}>
              <Route path="/admin" element={<AdminOverview />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/teachers" element={<AdminTeachers />} />
              <Route path="/admin/accounts" element={<AdminPortalAccounts />} />
              <Route path="/admin/classes" element={<AdminClasses />} />
              <Route path="/admin/announcements" element={<AdminAnnouncements />} />
              <Route path="/admin/admissions" element={<AdminAdmissions />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/admin/news" element={<AdminNews />} />
              <Route path="/admin/gallery" element={<AdminGallery />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
              <Route path="/admin/timetable" element={<AdminTimetable />} />
              <Route path="/admin/testimonials" element={<AdminTestimonials />} />
              <Route path="/admin/staff-requests" element={<AdminStaffRequests />} />
              <Route path="/admin/homepage-images" element={<AdminHomepageImages />} />
              <Route path="/admin/migration" element={<AdminMigration />} />
              <Route path="/admin/project-snapshot" element={<AdminProjectSnapshot />} />
              <Route path="/admin/layout" element={<AdminLayoutPage />} />
            </Route>
          </Route>

          {/* Parent portal */}
          <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
            <Route element={<PortalLayout />}>
              <Route path="/parent" element={<ParentOverview />} />
              <Route path="/parent/child" element={<ParentChild />} />
              <Route path="/parent/assignments" element={<ParentAssignments />} />
              <Route path="/parent/results" element={<ParentResults />} />
              <Route path="/parent/announcements" element={<ParentAnnouncements />} />
            </Route>
          </Route>

          {/* Student portal */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route element={<PortalLayout />}>
              <Route path="/student" element={<StudentOverview />} />
              <Route path="/student/assignments" element={<StudentAssignments />} />
              <Route path="/student/results" element={<StudentResults />} />
              <Route path="/student/timetable" element={<StudentTimetable />} />
              <Route path="/student/announcements" element={<StudentAnnouncements />} />
            </Route>
          </Route>

          {/* Teacher portal */}
          <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
            <Route element={<PortalLayout />}>
              <Route path="/teacher" element={<TeacherOverview />} />
              <Route path="/teacher/assignments" element={<TeacherAssignments />} />
              <Route path="/teacher/attendance" element={<TeacherAttendance />} />
              <Route path="/teacher/results" element={<TeacherResults />} />
              <Route path="/teacher/timetable" element={<TeacherTimetable />} />
              <Route path="/teacher/announcements" element={<TeacherAnnouncements />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Layout />}>
            <Route path="*" element={<PlaceholderPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
