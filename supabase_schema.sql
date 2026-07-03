-- ============================================================================
-- Bright Future Academy — Supabase Database Schema
-- ============================================================================
-- This schema defines all tables for the BFA school management system.
-- Run this SQL in the Supabase SQL Editor (https://app.supabase.com → SQL Editor).
--
-- Architecture:
--   Frontend → FastAPI (JWT) → Supabase PostgreSQL (service_role)
--   The backend uses the service_role key, so RLS is bypassed server-side.
--   All access control is handled by FastAPI dependencies (require_role, etc.).
-- ============================================================================

-- ============================================================================
-- 1. PROFILES — Base user table for all portal roles
--    Linked to Supabase Auth (auth.users) via profiles.id = auth.users.id
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email       TEXT NOT NULL,
    role        TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
    full_name   TEXT NOT NULL,
    phone       TEXT,
    avatar_url  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);


-- ============================================================================
-- 2. STUDENTS — Enrolled children
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.students (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admission_number  TEXT UNIQUE NOT NULL,
    full_name         TEXT NOT NULL,
    class_id          UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    parent_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    date_of_birth     DATE NOT NULL,
    gender            TEXT NOT NULL CHECK (gender IN ('male', 'female')),
    address           TEXT NOT NULL,
    phone             TEXT,
    photo_url         TEXT,
    status            TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'transferred', 'suspended')),
    created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_class ON public.students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_parent ON public.students(parent_id);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(status);


-- ============================================================================
-- 3. TEACHERS — Staff members
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.teachers (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_number         TEXT UNIQUE NOT NULL,
    full_name               TEXT NOT NULL,
    email                   TEXT NOT NULL,
    phone                   TEXT NOT NULL,
    subject_specialization  TEXT[] DEFAULT '{}',
    qualifications          TEXT NOT NULL,
    date_of_birth           DATE,
    gender                  TEXT NOT NULL DEFAULT 'male' CHECK (gender IN ('male', 'female')),
    address                 TEXT,
    photo_url               TEXT,
    status                  TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
    created_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teachers_status ON public.teachers(status);


-- ============================================================================
-- 4. CLASSES — Grade/stream groupings
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.classes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    section     TEXT NOT NULL CHECK (section IN ('nursery', 'primary')),
    grade       INTEGER NOT NULL CHECK (grade >= 0 AND grade <= 6),
    stream      TEXT,
    teacher_id  UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
    capacity    INTEGER NOT NULL DEFAULT 35 CHECK (capacity > 0),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_classes_section ON public.classes(section);


-- ============================================================================
-- 5. ADMISSIONS — Application records
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.admissions (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name      TEXT NOT NULL,
    date_of_birth     DATE NOT NULL,
    gender            TEXT NOT NULL CHECK (gender IN ('male', 'female')),
    previous_school   TEXT,
    grade_applying    TEXT NOT NULL,
    parent_name       TEXT NOT NULL,
    parent_phone      TEXT NOT NULL,
    parent_email      TEXT NOT NULL,
    address           TEXT NOT NULL,
    status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'enrolled')),
    created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admissions_status ON public.admissions(status);


-- ============================================================================
-- 6. ANNOUNCEMENTS — Broadcast messages
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.announcements (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT NOT NULL,
    content     TEXT NOT NULL,
    target_role TEXT NOT NULL DEFAULT 'all' CHECK (target_role IN ('admin', 'teacher', 'student', 'parent', 'all')),
    created_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_target ON public.announcements(target_role);
CREATE INDEX IF NOT EXISTS idx_announcements_date ON public.announcements(created_at DESC);


-- ============================================================================
-- 7. ASSIGNMENTS — Homework/Tasks
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.assignments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    class_id    UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    subject     TEXT NOT NULL,
    due_date    TIMESTAMPTZ NOT NULL,
    file_url    TEXT,
    created_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assignments_class ON public.assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due ON public.assignments(due_date);


-- ============================================================================
-- 8. ATTENDANCE — Daily student attendance
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.attendance (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id  UUID REFERENCES public.students(id) ON DELETE CASCADE,
    class_id    UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    date        DATE NOT NULL,
    status      TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    remarks     TEXT,
    marked_by   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    -- Enforce one record per student per date
    UNIQUE(student_id, class_id, date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON public.attendance(student_id);


-- ============================================================================
-- 9. GRADES — Exam/Assessment results
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.grades (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id    UUID REFERENCES public.students(id) ON DELETE CASCADE,
    class_id      UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    subject       TEXT NOT NULL,
    score         REAL NOT NULL CHECK (score >= 0 AND score <= 100),
    grade         TEXT NOT NULL,
    term          TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    created_by    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_grades_student ON public.grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_class ON public.grades(class_id);


-- ============================================================================
-- 10. TIMETABLE ENTRIES — Weekly class schedules
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.timetable_entries (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id      UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    day_of_week   INTEGER NOT NULL CHECK (day_of_week >= 1 AND day_of_week <= 5),
    start_time    TIME NOT NULL,
    end_time      TIME NOT NULL,
    subject       TEXT NOT NULL,
    teacher_id    UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
    room          TEXT NOT NULL,
    UNIQUE(class_id, day_of_week, start_time)
);

CREATE INDEX IF NOT EXISTS idx_timetable_class ON public.timetable_entries(class_id);


-- ============================================================================
-- 11. EVENTS — School events calendar
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    date        TIMESTAMPTZ NOT NULL,
    location    TEXT NOT NULL,
    target_role TEXT NOT NULL DEFAULT 'all' CHECK (target_role IN ('admin', 'teacher', 'student', 'parent', 'all')),
    created_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- 12. GALLERY IMAGES — Photo gallery
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT NOT NULL,
    url         TEXT NOT NULL,
    category    TEXT NOT NULL,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- 13. NEWS ARTICLES — School news
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.news_articles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT NOT NULL,
    excerpt     TEXT NOT NULL,
    content     TEXT NOT NULL,
    image_url   TEXT,
    published   BOOLEAN DEFAULT FALSE,
    created_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- 14. TESTIMONIALS — Parent/student reviews
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    role        TEXT NOT NULL,
    content     TEXT NOT NULL,
    rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- 15. MESSAGES — Internal messaging
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.messages (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id   UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject     TEXT NOT NULL,
    content     TEXT NOT NULL,
    read        BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- 16. STAFF REQUESTS — Leave, resource, complaint requests
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.staff_requests (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    type        TEXT NOT NULL CHECK (type IN ('leave', 'resource', 'complaint', 'other')),
    status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- 17. CONTACT MESSAGES — Public contact form submissions
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name   TEXT NOT NULL,
    email       TEXT NOT NULL,
    subject     TEXT NOT NULL,
    message     TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- ROW LEVEL SECURITY (RLS) — Disabled for service_role access
-- ============================================================================
-- Since the FastAPI backend uses the service_role key, it bypasses RLS.
-- If you ever need direct frontend access, implement RLS policies per table.
-- For now, all tables are secured by FastAPI middleware (JWT + role checks).

-- Enable RLS on all tables (blocks direct anonymous access)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
