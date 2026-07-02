import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
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
import PlaceholderPage from './pages/PlaceholderPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
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
          <Route path="*" element={<PlaceholderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
