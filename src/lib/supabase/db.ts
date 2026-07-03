/**
 * Database abstraction layer — delegates to the FastAPI backend.
 *
 * All data operations go through the FastAPI backend which connects to
 * Supabase PostgreSQL. There is no demo mode or localStorage fallback —
 * the backend MUST be running and Supabase MUST be configured.
 */

import {
  adminApi,
  teacherApi,
  studentApi,
  publicApi,
} from '../api/client'

// ── API helpers ────────────────────────────────────────────────────────────

async function apiList(apiCall: () => Promise<{ success: boolean; data?: any }>): Promise<any[]> {
  const res = await apiCall()
  if (res.success && res.data) {
    return Array.isArray(res.data) ? res.data : [res.data]
  }
  throw new Error('API call failed')
}

async function apiCreate(
  _newItem: any,
  apiCall: () => Promise<{ success: boolean; data?: any }>,
): Promise<any> {
  const res = await apiCall()
  if (res.success && res.data) return res.data
  throw new Error('API create failed')
}

async function apiUpdate(
  _id: string,
  _updates: any,
  apiCall: () => Promise<{ success: boolean; data?: any }>,
): Promise<any> {
  const res = await apiCall()
  if (res.success && res.data) return res.data
  return null
}

// ── API Layer ─────────────────────────────────────────────────────────────
// Same interface as before — all page components continue to work.

export const db = {
  students: {
    list: () => apiList(() => adminApi.getStudents()),
    create: (student: any) => apiCreate(student, () => adminApi.createStudent(student)),
  },

  teachers: {
    list: () => apiList(() => adminApi.getTeachers()),
    create: (teacher: any) => apiCreate(teacher, () => adminApi.createTeacher(teacher)),
  },

  classes: {
    list: () => apiList(() => adminApi.getClasses()),
    create: (cls: any) => apiCreate(cls, () => adminApi.createClass(cls)),
  },

  announcements: {
    list: () => apiList(() => adminApi.getAnnouncements()),
    create: (ann: any) => apiCreate(ann, () => adminApi.createAnnouncement(ann)),
  },

  admissions: {
    list: () => apiList(() => adminApi.getAdmissions()),
    create: (adm: any) => apiCreate({ ...adm, status: 'pending' }, () => publicApi.submitAdmission(adm)),
    updateStatus: (id: string, status: 'pending' | 'approved' | 'rejected' | 'enrolled') =>
      apiUpdate(id, { status }, () => adminApi.updateAdmissionStatus(id, status)),
  },

  assignments: {
    list: () => apiList(() => teacherApi.getAssignments()),
    create: (asg: any) => apiCreate(asg, () => teacherApi.createAssignment(asg)),
  },

  timetable: {
    list: () => apiList(() => studentApi.getTimetable()),
  },

  grades: {
    list: () => apiList(() => studentApi.getResults()),
    create: (grade: any) => apiCreate(grade, () => teacherApi.enterResults([grade])),
  },

  attendance: {
    list: () => apiList(() => teacherApi.getAttendance()),
    mark: (records: any[]) => apiCreate(records, () => teacherApi.markAttendance(records)),
  },
}

/** @deprecated No demo mode — this is always 'live' */
export function getDbMode(): 'live' | 'demo' { return 'live' }
/** @deprecated No demo mode — setting has no effect */
export function setDbMode(_mode: 'live' | 'demo') {}
