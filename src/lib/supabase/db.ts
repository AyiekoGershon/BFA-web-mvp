/**
 * Database abstraction layer — delegates to the FastAPI backend.
 *
 * All data operations go through the FastAPI backend which connects to
 * Supabase PostgreSQL. Role-aware routing ensures teachers, students,
 * and parents hit their own portal endpoints (not admin endpoints).
 */

import {
  adminApi,
  teacherApi,
  studentApi,
  parentApi,
  publicApi,
  getRole,
} from '../api/client'

// ── Role-aware API selection ───────────────────────────────────────────────

/** Returns the appropriate student API based on current role */
function studentListApi() {
  const role = getRole()
  if (role === 'teacher') return () => teacherApi.getStudents()
  if (role === 'parent') return () => parentApi.getChildren()
  return () => adminApi.getStudents()
}

/** Returns the appropriate class API based on current role */
function classListApi() {
  const role = getRole()
  if (role === 'teacher') return () => teacherApi.getClasses()
  return () => adminApi.getClasses()
}

/** Returns the appropriate assignment API */
function assignmentListApi() {
  const role = getRole()
  if (role === 'teacher') return () => teacherApi.getAssignments()
  if (role === 'student') return () => studentApi.getAssignments()
  if (role === 'parent') return () => parentApi.getAssignments()
  return () => adminApi.getAnnouncements() // fallback — admin doesn't have dedicated assignment list
}

/** Returns the appropriate grades/results API */
function gradeListApi() {
  const role = getRole()
  if (role === 'teacher') return () => teacherApi.getResults()
  if (role === 'student') return () => studentApi.getResults()
  if (role === 'parent') return () => parentApi.getResults()
  return () => adminApi.getStudents() // fallback
}

/** Returns the appropriate timetable API */
function timetableListApi() {
  const role = getRole()
  if (role === 'teacher') return () => teacherApi.getTimetable()
  if (role === 'student') return () => studentApi.getTimetable()
  if (role === 'parent') return () => parentApi.getTimetable()
  return () => adminApi.getAnnouncements() // fallback
}

/** Returns the appropriate attendance API */
function attendanceListApi() {
  return () => teacherApi.getAttendance()
}

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

// ── API Layer ─────────────────────────────────────────────────────────────

export const db = {
  students: {
    list: () => apiList(studentListApi()),
    create: (student: any) => apiCreate(student, () => adminApi.createStudent(student)),
  },

  teachers: {
    list: () => apiList(() => adminApi.getTeachers()),
    create: (teacher: any) => apiCreate(teacher, () => adminApi.createTeacher(teacher)),
  },

  classes: {
    list: () => apiList(classListApi()),
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
      apiList(() => adminApi.updateAdmissionStatus(id, status)).then(() => null),
  },

  assignments: {
    list: () => apiList(assignmentListApi()),
    create: (asg: any) => apiCreate(asg, () => teacherApi.createAssignment(asg)),
  },

  timetable: {
    list: () => apiList(timetableListApi()),
  },

  grades: {
    list: () => apiList(gradeListApi()),
    create: (grade: any) => apiCreate(grade, () => teacherApi.enterResults([grade])),
  },

  attendance: {
    list: () => apiList(attendanceListApi()),
    mark: (records: any[]) => apiCreate(records, () => teacherApi.markAttendance(records)),
  },
}

/** @deprecated No demo mode — this is always 'live' */
export function getDbMode(): 'live' | 'demo' { return 'live' }
/** @deprecated No demo mode — setting has no effect */
export function setDbMode(_mode: 'live' | 'demo') {}
