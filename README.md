# Bright Future Academy (BFA) — School Management System

<div align="center">

![BFA Logo](public/images/Logo.png)

**A full-stack school management platform for Ecole Notre Dame Des Anges**

*Nurturing Minds, Building Futures — Migori County, Kenya*

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Data Engineering Highlights](#-data-engineering-highlights)
- [Database Schema](#-database-schema)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Portals & Roles](#-portals--roles)
- [Security](#-security)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🌍 Overview

Bright Future Academy (BFA) is a **production-grade school management system** built for Ecole Notre Dame Des Anges in Migori County, Kenya. It replaces paper-based administration with a digital ecosystem connecting four distinct user portals — **Admin**, **Teacher**, **Student**, and **Parent** — each with role-gated access and independent functionality.

The system handles the complete school lifecycle: public admissions → admin review → enrollment → class assignment → daily attendance → exam results → parent visibility.

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────┐
│                   React Frontend                      │
│  (Vite + TypeScript + Tailwind CSS)                   │
│  Port 5173                                            │
└──────────────────┬──────┬──────┬──────┬──────────────┘
                   │      │      │      │
              JWT Auth (Bearer Token)
                   │      │      │      │
┌──────────────────▼──────▼──────▼──────▼──────────────┐
│                  FastAPI Backend                      │
│  (Python 3.11 + Uvicorn)                              │
│  Port 8000                                            │
│  ┌─────────┬──────────┬──────────┬──────────┐        │
│  │ Admin   │ Teacher  │ Student  │  Parent  │        │
│  │ Router  │ Router   │ Router   │  Router  │        │
│  └────┬────┴────┬─────┴────┬─────┴────┬─────┘        │
│       │         │          │          │               │
│       └─────────┴──────────┴──────────┘               │
│                      │                                │
│              Service Layer (Business Logic)           │
│                      │                                │
│              Supabase Client (service_role)            │
└──────────────────────┬───────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────┐
│               Supabase PostgreSQL                      │
│  ┌──────┬──────────┬────────┬──────────────┐         │
│  │Auth  │ Profiles │ 17     │ Row-Level    │         │
│  │(JWT) │          │ Tables │ Security     │         │
│  └──────┴──────────┴────────┴──────────────┘         │
└──────────────────────────────────────────────────────┘
```

**Design principles:**
- **Separation of concerns** — Frontend never touches the database directly
- **Service layer** — Business logic isolated from HTTP concerns
- **JWT-based auth** — Backend issues tokens after validating with Supabase Auth
- **Role-gated API** — Each portal has independent route files with middleware guards
- **Type safety** — TypeScript (frontend) + Pydantic models (backend) ensure end-to-end type correctness

---

## 📊 Data Engineering Highlights

This project demonstrates **full-stack data engineering proficiency** across the entire data lifecycle:

### Data Modeling & Schema Design
- **17 normalized PostgreSQL tables** with proper foreign keys, constraints, and indexes
- **Star-schema-like relationships**: `profiles` (dimension) → `students`, `teachers` (facts)
- **Slowly-changing dimensions**: Student status tracking (active → graduated → transferred)
- **Temporal data**: Attendance records with date-partitioned queries, academic year/term scoping
- **Array fields**: Teacher subject specializations stored as PostgreSQL `TEXT[]` for efficient querying

### Data Pipeline Architecture
```
Source (Public Forms) → Ingestion (FastAPI) → Validation (Pydantic) → 
  Transformation (Service Layer) → Storage (Supabase PostgreSQL) → 
    Serving (Role-gated REST API) → Consumption (React UI)
```

### ETL Patterns
| Pattern | Implementation | Description |
|---------|---------------|-------------|
| **Admission → Enrollment** | `admission_service.enroll_student()` | Transforms application data into student records with auto-generated admission numbers and class placement |
| **Batch Attendance** | `attendance_service.mark_attendance()` | Upserts multiple attendance records in a single transaction using `ON CONFLICT` resolution |
| **Grade Entry** | `grade_service.create_grades()` | Batch-inserts exam results with automatic `created_by` attribution from JWT |

### Data Integrity
- **UUID primary keys** with `gen_random_uuid()` defaults on all tables
- **Unique constraints**: `admission_number`, `employee_number`, composite `(student_id, class_id, date)` on attendance
- **Check constraints**: Score range (0-100), rating range (1-5), valid enum values for status fields
- **Cascading deletes**: Class deletion cascades to assignments, student deletion cascades to grades
- **Foreign key relationships**: Students → Classes → Teachers → Profiles

### Performance Optimization
- **Strategic indexing**: Indexes on `status`, `class_id`, `date`, `target_role`, `created_at DESC`
- **Query optimization**: Joined queries via Supabase's PostgREST `select("*, classes(name)")` for single-request data hydration
- **Connection pooling**: Singleton Supabase client with lazy initialization

### Data Governance
- **Row-Level Security** (RLS) enabled on all tables — enforced server-side by service_role
- **Role-based access control** (RBAC) — 4 distinct roles with independent API routes
- **Audit trails**: `created_by`, `marked_by`, `created_at` fields on all transactional tables
- **Data isolation**: Portal users can only access data scoped to their role

---

## 🗄 Database Schema

```sql
-- Core Tables (17 total)
profiles               -- User accounts linked to Supabase Auth
students               -- Enrolled children with class/parent linkage
teachers               -- Staff with qualifications & subject specialization
classes                -- Grade/stream groupings with capacity tracking
admissions             -- Application pipeline (pending → approved → enrolled)
announcements          -- Role-targeted broadcast messages
assignments            -- Homework/tasks with due dates
attendance             -- Daily student attendance (upsert-safe)
grades                 -- Exam/assessment results
timetable_entries      -- Weekly class schedules
events                 -- School calendar
gallery_images         -- Photo gallery
news_articles          -- Published news
testimonials           -- Parent/student reviews
messages               -- Internal messaging
staff_requests         -- Leave, resource, complaint requests
contact_messages       -- Public contact form submissions
```

Full DDL available in [`supabase_schema.sql`](supabase_schema.sql)

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, TypeScript 6, Vite 8 | SPA with role-based portals |
| **Styling** | Tailwind CSS 4, Lucide Icons | Responsive, glassmorphism UI |
| **Backend** | Python 3.11, FastAPI, Uvicorn | REST API with JWT auth |
| **Database** | Supabase (PostgreSQL 15) | Relational data with RLS |
| **Auth** | Supabase Auth + JWT (python-jose) | Dual-layer authentication |
| **Validation** | Pydantic v2, Zod (implicit via TS) | Request/response type safety |
| **DevOps** | Vite, Oxlint, Uvicorn reload | Fast dev cycles |

---

## ✨ Features

### Public Website
- 🏠 Responsive landing page with hero image carousel
- 📝 Online admission application form with validation
- 📧 Contact form with server-side persistence
- 📱 Mobile-friendly navigation with collapsible menu
- 🖼 Photo gallery, news, FAQ, leadership, and testimonials sections

### Admin Portal (`/admin`)
- 📊 Real-time dashboard with live statistics
- 👥 **Student CRUD** — Add, view, update, delete student records
- 👨‍🏫 **Teacher CRUD** — Manage staff with subject specialization
- 🏫 **Class CRUD** — Create grade/stream groupings, assign teachers
- 📢 **Announcements** — Broadcast to specific roles or all users
- 📋 **Admissions Pipeline** — Review, approve, reject, and enroll applicants with class placement
- 🔐 **Portal Account Provisioning** — Create teacher/student/parent accounts without session hijacking

### Teacher Portal (`/teacher`)
- 📝 **Assignment Management** — Create assignments with class targeting and due dates
- ✅ **Attendance Marking** — Toggle per-student status and batch-save
- 📈 **Grade Entry** — Enter exam scores with student/class/subject selection
- 📅 **Timetable View** — Weekly teaching schedule
- 📢 **Announcements** — School-wide and teacher-specific notices

### Student Portal (`/student`)
- 📝 View assignments with due dates
- 📊 Check exam results with grades
- 📅 Daily class timetable
- 📢 Stay updated with announcements

### Parent Portal (`/parent`)
- 👶 View linked children with admission details
- 📝 Monitor assignments
- 📈 Track exam results
- 📢 School announcements

---

## 📁 Project Structure

```
BFA/
├── src/                          # Frontend (React + TypeScript)
│   ├── components/
│   │   ├── auth/                 # ProtectedRoute with JWT validation
│   │   ├── layout/               # Header, Footer, public Layout
│   │   ├── portal/               # PortalLayout (sidebar), StatCard, DataTable
│   │   └── sections/             # Homepage sections (Hero, About, FAQ, etc.)
│   ├── lib/
│   │   ├── api/                  # API client (fetch wrapper, authApi, role APIs)
│   │   └── supabase/             # DB facade (delegates to FastAPI)
│   ├── pages/
│   │   ├── admin/                # 16 admin portal pages
│   │   ├── teacher/              # 6 teacher portal pages
│   │   ├── student/              # 5 student portal pages
│   │   └── parent/               # 5 parent portal pages
│   └── main.tsx                  # App entry point
│
├── backend/                      # FastAPI Backend (Python)
│   ├── app/
│   │   ├── main.py               # App entry, CORS, router registration
│   │   ├── config.py             # Environment configuration
│   │   ├── database.py           # Supabase client (singleton, service_role)
│   │   ├── dependencies.py       # JWT auth middleware + role guards
│   │   ├── models/               # 11 Pydantic schema files
│   │   ├── routers/              # 6 route files (auth, public, admin, teacher, student, parent)
│   │   ├── services/             # 10 business logic modules
│   │   └── _utils/               # Security (JWT, hashing) + response helpers
│   ├── requirements.txt
│   └── .env.example
│
├── public/images/                # Static assets (logo, hero images)
├── supabase_schema.sql           # Full DDL for 17 tables
├── index.html
├── vite.config.ts
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.11
- **Supabase** project (free tier works)
- **Git**

### 1. Clone & Install

```bash
git clone https://github.com/AyiekoGershon/BFA-web-mvp.git
cd BFA-web-mvp

# Frontend
npm install

# Backend
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

**Backend** (`backend/.env`):
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...  # Found in Supabase → Settings → API → service_role
JWT_SECRET_KEY=your-random-secret-string
ALLOWED_ORIGINS=http://localhost:5173
```

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:8000
```

### 3. Set Up Database

1. Go to [Supabase SQL Editor](https://app.supabase.com)
2. Run the contents of [`supabase_schema.sql`](supabase_schema.sql)
3. This creates all 17 tables with indexes, constraints, and RLS

### 4. Create Admin Account

```bash
cd backend
python -c "
from app.database import get_supabase
s = get_supabase()
user = s.auth.admin.create_user({
    'email': 'admin@bfacademy.ac.ke',
    'password': 'YourSecurePassword123!',
    'email_confirm': True,
    'user_metadata': {'full_name': 'Administrator', 'role': 'admin'}
})
s.table('profiles').upsert({
    'id': user.user.id,
    'email': 'admin@bfacademy.ac.ke',
    'role': 'admin',
    'full_name': 'Administrator'
}, on_conflict='id').execute()
print('Admin created!')
"
```

### 5. Run

```bash
# Terminal 1 — Backend
cd backend
python -m uvicorn app.main:app --reload --port 8000

# Terminal 2 — Frontend
npm run dev
```

Open **http://localhost:5173/login/admin** and sign in.

---

## 📡 API Documentation

When the backend is running, interactive docs are available:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### API Overview

| Prefix | Auth | Description |
|--------|------|-------------|
| `POST /api/auth/login` | None | Authenticate, get JWT |
| `POST /api/auth/signup` | None | Register new user |
| `POST /api/auth/portal-account` | Admin | Create portal accounts |
| `GET /api/public/admissions` | None | Submit application |
| `POST /api/public/contact` | None | Submit contact form |
| `GET /api/admin/*` | Admin | Full CRUD on all entities |
| `GET /api/teacher/*` | Teacher | Assignments, attendance, grades |
| `GET /api/student/*` | Student | View assignments, results, timetable |
| `GET /api/parent/*` | Parent | Child info, assignments, results |

**Standard response format:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully."
}
```

**Error format:**
```json
{
  "detail": {
    "success": false,
    "error": {
      "code": "CREATE_FAILED",
      "message": "Duplicate employee number."
    }
  }
}
```

---

## 🔐 Portals & Roles

| Portal | URL | Role | Capabilities |
|--------|-----|------|-------------|
| Admin | `/login/admin` | `admin` | Full system access, CRUD, portal provisioning, admissions pipeline |
| Teacher | `/login/teacher` | `teacher` | Create assignments, mark attendance, enter grades, view timetable |
| Student | `/login/student` | `student` | View assignments, results, timetable, announcements |
| Parent | `/login/parent` | `parent` | View children, assignments, results, announcements |

**Session isolation:** Each tab uses `sessionStorage` — you can have all four portals open simultaneously without interference.

---

## 🔒 Security

- **JWT authentication** — Backend validates Supabase credentials, issues own short-lived tokens (8-hour expiry)
- **Role-based access control** — FastAPI middleware (`require_role`, `require_any_role`) gates every endpoint
- **Service role isolation** — `SUPABASE_SERVICE_ROLE_KEY` never exposed to frontend; all DB access is server-side
- **Session hijack prevention** — Portal account creation uses a separate non-persisting Supabase client
- **Row-Level Security** — Enabled on all 17 tables; bypassed only by service_role
- **Input validation** — Pydantic models validate all request bodies, TypeScript ensures type-safe API calls
- **CORS** — Configured for allowed frontend origins only
- **Password hashing** — bcrypt via passlib for any server-side password operations

---

## 🚢 Deployment

### Backend (FastAPI)

```bash
# Production server
cd backend
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000
```

Deploy to: **Railway**, **Render**, **Fly.io**, or any Docker-capable platform.

### Frontend (React)

```bash
npm run build    # Outputs to dist/
```

Deploy `dist/` to: **Vercel**, **Netlify**, **Cloudflare Pages**, or **GitHub Pages**.

Set `VITE_API_URL` to your deployed backend URL.

### Database

Supabase handles PostgreSQL hosting. Run `supabase_schema.sql` once to initialize.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for Bright Future Academy**

*Ecole Notre Dame Des Anges — Migori County, Kenya*

</div>
