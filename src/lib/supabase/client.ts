import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Role = 'admin' | 'teacher' | 'student' | 'parent'

export interface Profile {
  id: string
  email: string
  role: Role
  full_name: string
  phone?: string
  avatar_url?: string
  created_at: string
}

export interface Student {
  id: string
  admission_number: string
  full_name: string
  class_id: string
  parent_id?: string
  date_of_birth: string
  gender: 'male' | 'female'
  address: string
  phone?: string
  photo_url?: string
  status: 'active' | 'graduated' | 'transferred' | 'suspended'
  created_at: string
}

export interface Teacher {
  id: string
  employee_number: string
  full_name: string
  email: string
  phone: string
  subject_specialization: string[]
  qualifications: string
  date_of_birth: string
  gender: 'male' | 'female'
  address: string
  photo_url?: string
  status: 'active' | 'inactive' | 'terminated'
  created_at: string
}

export interface Class {
  id: string
  name: string
  section: 'nursery' | 'primary'
  grade: number
  stream?: string
  teacher_id?: string
  capacity: number
  created_at: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  target_role: Role | 'all'
  created_by: string
  created_at: string
}

export interface Assignment {
  id: string
  title: string
  description: string
  class_id: string
  subject: string
  due_date: string
  file_url?: string
  created_by: string
  created_at: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  target_role: Role | 'all'
  created_by: string
  created_at: string
}

export interface Attendance {
  id: string
  student_id: string
  class_id: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  remarks?: string
  marked_by: string
}

export interface Grade {
  id: string
  student_id: string
  class_id: string
  subject: string
  score: number
  grade: string
  term: string
  academic_year: string
  created_by: string
  created_at: string
}

export interface Admission {
  id: string
  student_name: string
  date_of_birth: string
  gender: 'male' | 'female'
  previous_school?: string
  grade_applying: string
  parent_name: string
  parent_phone: string
  parent_email: string
  address: string
  status: 'pending' | 'approved' | 'rejected' | 'enrolled'
  created_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  subject: string
  content: string
  read: boolean
  created_at: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface GalleryImage {
  id: string
  title: string
  url: string
  category: string
  uploaded_by: string
  created_at: string
}

export interface TimetableEntry {
  id: string
  class_id: string
  day_of_week: number
  start_time: string
  end_time: string
  subject: string
  teacher_id: string
  room: string
}

export interface StaffRequest {
  id: string
  staff_id: string
  title: string
  description: string
  type: 'leave' | 'resource' | 'complaint' | 'other'
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  image_url?: string
  published: boolean
  created_by: string
  created_at: string
}
