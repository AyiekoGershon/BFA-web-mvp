import { Check, Download, ArrowRight, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {requirements.map((req) => (
                  <div key={req} className="flex items-center gap-2 text-gray-700">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 rounded-xl bg-soft-blue flex items-center justify-center mb-5">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Download Application Form</h3>
              <p className="text-gray-600 mb-6">Download our application form, fill it out, and submit it to the school office along with the required documents.</p>
              <a href="#" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/25">
                <Download className="w-4 h-4" />
                Download Form
              </a>
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
