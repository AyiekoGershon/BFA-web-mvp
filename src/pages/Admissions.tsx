import { useState } from 'react'
import { Check, Download, ArrowRight, FileText, Send, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { db } from '../lib/supabase/db'

const steps = [
  { title: 'Request Application', description: 'Download the application form from our website or collect it from the school office.' },
  { title: 'Submit Documents', description: 'Return the completed form with required documents: birth certificate, previous school reports, and passport photos.' },
  { title: 'Assessment', description: 'The student will undergo a simple assessment to determine appropriate class placement.' },
  { title: 'Admission Letter', description: 'Successful applicants receive an admission letter with further instructions.' },
  { title: 'Reporting', description: 'Report to school on the specified date with all requirements and uniform.' },
]

const requirements = [
  'Birth certificate (copy)',
  'Previous school report cards',
  '4 passport-size photos',
  'Immunization record',
  'Parent/guardian ID (copy)',
  'Transfer letter (if applicable)',
]

export default function Admissions() {
  const [studentName, setStudentName] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [previousSchool, setPreviousSchool] = useState('')
  const [gradeApplying, setGradeApplying] = useState('Grade 1')
  const [parentName, setParentName] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [address, setAddress] = useState('')

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await db.admissions.create({
        student_name: studentName,
        date_of_birth: dob,
        gender,
        previous_school: previousSchool,
        grade_applying: gradeApplying,
        parent_name: parentName,
        parent_phone: parentPhone,
        parent_email: parentEmail,
        address,
        status: 'pending',
      })
      setSubmitted(true)
      setStudentName('')
      setDob('')
      setParentName('')
      setParentPhone('')
      setParentEmail('')
      setAddress('')
      setPreviousSchool('')
    } catch (_e: any) {
      setError(_e.message || 'Failed to submit admission application.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <section className="hero-gradient py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6">
            <span className="brand-gradient-text">Admissions</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Begin your child's journey with Bright Future Academy. We welcome applications from families seeking quality education in Migori County.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-10 text-center">Admission Process</h2>
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && <div className="w-0.5 h-full bg-primary/20 mt-2" />}
                </div>
                <div className="pb-6">
                  <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Requirements</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {requirements.map((req) => (
                  <div key={req} className="flex items-center gap-2 text-gray-700">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-2xl p-8 shadow-sm">
                <div className="w-14 h-14 rounded-xl bg-soft-blue flex items-center justify-center mb-5">
                  <FileText className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Download Offline Form</h3>
                <p className="text-gray-600 mb-6">Preferred manual process? Download our application form, fill it out, and submit it to the school office along with the required documents.</p>
                <a href="#" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all shadow-md">
                  <Download className="w-4 h-4" />
                  Download PDF Form
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-gray-900">Application Submitted!</h3>
                  <p className="text-gray-600 max-w-sm">
                    Thank you for applying to Bright Future Academy. Our admissions office will review your application and contact you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-gray-900">Apply Online</h3>
                  <p className="text-sm text-gray-500">Fill in the student details to submit an online admission application.</p>
                  
                  {error && (
                    <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 border border-red-200">{error}</div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Student Full Name</label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                        placeholder="Child's full name"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Gender</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['male', 'female'].map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGender(g as 'male' | 'female')}
                            className={`py-2 rounded-xl text-sm font-medium border capitalize transition-all ${
                              gender === g
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Grade Applying For</label>
                      <select
                        value={gradeApplying}
                        onChange={(e) => setGradeApplying(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all bg-white"
                      >
                        {['Nursery', 'Pre-Unit', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'].map((grade) => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Previous School</label>
                      <input
                        type="text"
                        value={previousSchool}
                        onChange={(e) => setPreviousSchool(e.target.value)}
                        placeholder="If any"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 my-4 pt-4" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Parent/Guardian Full Name</label>
                      <input
                        type="text"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        required
                        placeholder="Parent/guardian name"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Parent Phone Number</label>
                      <input
                        type="tel"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        required
                        pattern="^\+?[\d\s\-\(\)]{7,15}$"
                        placeholder="+254 7..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Parent Email</label>
                      <input
                        type="email"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        required
                        placeholder="parent@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Physical Address</label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        rows={2}
                        placeholder="E.g. Migori Town, Kuria..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 mt-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Application
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-8">Contact our admissions office for assistance with the application process.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all">
            Contact Us
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

