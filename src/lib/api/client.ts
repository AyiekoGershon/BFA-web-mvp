/**
 * API Client — interfaces with the FastAPI backend.
 *
 * Architecture:
 *   Frontend (React) → apiClient (this file) → FastAPI (port 8000) → Supabase
 *
 * The frontend no longer talks to Supabase directly. All data flows through
 * the FastAPI backend which enforces role-based access control server-side.
 *
 * JWT tokens are stored in sessionStorage (tab-isolated) and sent as Bearer tokens on every
 * authenticated request. The token is obtained from POST /api/auth/login.
 */

// ── Configuration ─────────────────────────────────────────────────────────
// Base URL of the FastAPI backend. In production, this would be your deployed
// backend URL. For local dev, the backend runs on port 8000.

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ── Token Management ──────────────────────────────────────────────────────

function getToken(): string | null {
  return sessionStorage.getItem('bfa_access_token')
}

function setToken(token: string): void {
  sessionStorage.setItem('bfa_access_token', token)
}

function clearToken(): void {
  sessionStorage.removeItem('bfa_access_token')
}

function getUser(): { id: string; email: string; role: string; full_name: string } | null {
  const raw = sessionStorage.getItem('bfa_user')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function setUser(user: Record<string, any>): void {
  sessionStorage.setItem('bfa_user', JSON.stringify(user))
}

function clearUser(): void {
  sessionStorage.removeItem('bfa_user')
}

// ── HTTP Client ───────────────────────────────────────────────────────────
// A thin wrapper around fetch that adds auth headers and handles errors.

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  detail?: any  // FastAPI nests errors here: { success, error: { code, message } } or validation array
  error?: {
    code: string
    message: string
    details?: Record<string, any>
  }
}

class ApiError extends Error {
  code: string
  status: number
  details?: Record<string, any>

  constructor(message: string, code: string, status: number, details?: Record<string, any>) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.details = details
  }
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  // Attach auth token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Try to parse JSON response
  let body: ApiResponse<T>
  try {
    body = await response.json()
  } catch {
    throw new ApiError(
      `Server returned status ${response.status}`,
      'PARSE_ERROR',
      response.status,
    )
  }

  // Handle error responses
  if (!response.ok) {
    // FastAPI errors come in two shapes:
    //   1. Custom HTTPException: { detail: { success: false, error: { code, message } } }
    //   2. Pydantic validation:   { detail: [{ type, loc, msg }] }
    let errorCode: string
    let errorMessage: string
    let errorDetails: Record<string, any> | undefined

    // Check for FastAPI-style detail.error
    const detail = body.detail
    if (detail && !Array.isArray(detail) && detail.error) {
      errorCode = detail.error.code || 'UNKNOWN'
      errorMessage = detail.error.message || 'An unexpected error occurred.'
      errorDetails = detail.error.details
    } else if (Array.isArray(detail)) {
      // Pydantic validation error
      const messages = detail.map((d: any) => `${d.loc.join('.')}: ${d.msg}`)
      errorCode = 'VALIDATION_ERROR'
      errorMessage = messages.join('; ')
    } else if (body.error) {
      // Plain error response (non-FastAPI)
      errorCode = body.error.code || 'UNKNOWN'
      errorMessage = body.error.message || 'An unexpected error occurred.'
      errorDetails = body.error.details
    } else {
      errorCode = 'UNKNOWN'
      errorMessage = `Request failed with status ${response.status}`
    }

    // If token expired, clear auth state BEFORE throwing
    if (response.status === 401) {
      clearToken()
      clearUser()
    }

    throw new ApiError(errorMessage, errorCode, response.status, errorDetails)
  }

  return body
}

// ── Auth API ──────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string
  password: string
  expected_role?: string
}

export interface LoginResult {
  access_token: string
  token_type: string
  user: {
    id: string
    email: string
    role: string
    full_name: string
    phone?: string
    avatar_url?: string
  }
  redirect: string
}

export const authApi = {
  /**
   * Login — authenticate and get JWT.
   * Stores token + user in sessionStorage (tab-isolated) on success.
   */
  async login(payload: LoginPayload): Promise<LoginResult> {
    const res = await request<LoginResult>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    if (res.data) {
      setToken(res.data.access_token)
      setUser(res.data.user)
    }

    return res.data!
  },

  /**
   * Logout — clear stored token and user.
   */
  logout(): void {
    clearToken()
    clearUser()
  },

  /**
   * Get the currently logged-in user from sessionStorage.
   */
  getCurrentUser() {
    return getUser()
  },

  /**
   * Check if a user is logged in.
   */
  isAuthenticated(): boolean {
    return !!getToken()
  },

  /**
   * Validate the stored token with the backend.
   */
  async validateToken(): Promise<boolean> {
    try {
      await request('/api/auth/me')
      return true
    } catch {
      clearToken()
      clearUser()
      return false
    }
  },
}

// ── Role Helpers ──────────────────────────────────────────────────────────

export type Role = 'admin' | 'teacher' | 'student' | 'parent'

export function getRole(): Role | null {
  const user = getUser()
  return (user?.role as Role) || null
}

export function isRole(role: Role): boolean {
  return getRole() === role
}

// ── Public API (No Auth Required) ─────────────────────────────────────────

export const publicApi = {
  /** Submit an admission application */
  submitAdmission: (data: Record<string, any>) =>
    request('/api/public/admissions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** Submit a contact form message */
  submitContact: (data: Record<string, any>) =>
    request('/api/public/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** Get public announcements */
  getAnnouncements: (limit = 10) =>
    request('/api/public/announcements?limit=' + limit),
}

// ── Admin API ─────────────────────────────────────────────────────────────

export const adminApi = {
  // Overview
  getOverview: () => request('/api/admin/overview'),

  // Students
  getStudents: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request('/api/admin/students' + qs)
  },
  getStudent: (id: string) => request(`/api/admin/students/${id}`),
  createStudent: (data: Record<string, any>) =>
    request('/api/admin/students', { method: 'POST', body: JSON.stringify(data) }),
  updateStudent: (id: string, data: Record<string, any>) =>
    request(`/api/admin/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStudent: (id: string) =>
    request(`/api/admin/students/${id}`, { method: 'DELETE' }),

  // Teachers
  getTeachers: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request('/api/admin/teachers' + qs)
  },
  getTeacher: (id: string) => request(`/api/admin/teachers/${id}`),
  createTeacher: (data: Record<string, any>) =>
    request('/api/admin/teachers', { method: 'POST', body: JSON.stringify(data) }),
  updateTeacher: (id: string, data: Record<string, any>) =>
    request(`/api/admin/teachers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTeacher: (id: string) =>
    request(`/api/admin/teachers/${id}`, { method: 'DELETE' }),

  // Classes
  getClasses: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request('/api/admin/classes' + qs)
  },
  getClass: (id: string) => request(`/api/admin/classes/${id}`),
  createClass: (data: Record<string, any>) =>
    request('/api/admin/classes', { method: 'POST', body: JSON.stringify(data) }),
  updateClass: (id: string, data: Record<string, any>) =>
    request(`/api/admin/classes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteClass: (id: string) =>
    request(`/api/admin/classes/${id}`, { method: 'DELETE' }),

  // Announcements
  getAnnouncements: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request('/api/admin/announcements' + qs)
  },
  createAnnouncement: (data: Record<string, any>) =>
    request('/api/admin/announcements', { method: 'POST', body: JSON.stringify(data) }),
  updateAnnouncement: (id: string, data: Record<string, any>) =>
    request(`/api/admin/announcements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAnnouncement: (id: string) =>
    request(`/api/admin/announcements/${id}`, { method: 'DELETE' }),

  // Admissions
  getAdmissions: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request('/api/admin/admissions' + qs)
  },
  updateAdmissionStatus: (id: string, status: string) =>
    request(`/api/admin/admissions/${id}/status?status=${status}`, { method: 'PUT' }),
  enrollStudent: (id: string, classId: string) =>
    request(`/api/admin/admissions/${id}/enroll`, {
      method: 'POST',
      body: JSON.stringify({ class_id: classId }),
    }),
}

// ── Teacher API ───────────────────────────────────────────────────────────

export const teacherApi = {
  getOverview: () => request('/api/teacher/overview'),
  getStudents: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request('/api/teacher/students' + qs)
  },
  getClasses: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request('/api/teacher/classes' + qs)
  },
  getAssignments: () => request('/api/teacher/assignments'),
  createAssignment: (data: Record<string, any>) =>
    request('/api/teacher/assignments', { method: 'POST', body: JSON.stringify(data) }),
  updateAssignment: (id: string, data: Record<string, any>) =>
    request(`/api/teacher/assignments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAssignment: (id: string) =>
    request(`/api/teacher/assignments/${id}`, { method: 'DELETE' }),
  getAttendance: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request('/api/teacher/attendance' + qs)
  },
  markAttendance: (records: Record<string, any>[]) =>
    request('/api/teacher/attendance', {
      method: 'POST',
      body: JSON.stringify({ records }),
    }),
  getResults: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request('/api/teacher/results' + qs)
  },
  enterResults: (grades: Record<string, any>[]) =>
    request('/api/teacher/results', {
      method: 'POST',
      body: JSON.stringify({ grades }),
    }),
  updateGrade: (id: string, data: Record<string, any>) =>
    request(`/api/teacher/results/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getTimetable: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request('/api/teacher/timetable' + qs)
  },
  getAnnouncements: () => request('/api/teacher/announcements'),
}

// ── Student API ───────────────────────────────────────────────────────────

export const studentApi = {
  getOverview: () => request('/api/student/overview'),
  getAssignments: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request('/api/student/assignments' + qs)
  },
  getResults: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request('/api/student/results' + qs)
  },
  getTimetable: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request('/api/student/timetable' + qs)
  },
  getAnnouncements: () => request('/api/student/announcements'),
}

// ── Parent API ────────────────────────────────────────────────────────────

export const parentApi = {
  getOverview: () => request('/api/parent/overview'),
  getChildren: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request('/api/parent/child' + qs)
  },
  getAssignments: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request('/api/parent/assignments' + qs)
  },
  getResults: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request('/api/parent/results' + qs)
  },
  getTimetable: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request('/api/parent/timetable' + qs)
  },
  getAnnouncements: () => request('/api/parent/announcements'),
}
