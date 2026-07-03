# Supabase Database Setup Guide for BFA Portal

This guide walks you through setting up Supabase from scratch for the BFA school portal project.

## 1. Create a Supabase project

1. Go to https://supabase.com and sign in.
2. Click New Project.
3. Choose your organization.
4. Enter a project name, such as `bfa-school-portal`.
5. Choose a strong database password and save it somewhere safe.
6. Select a region close to your users.
7. Click Create new project.

> Keep the database password safe. You will need it only if you ever connect directly to the database.

## 2. Get your project credentials

After the project is created:

1. Open your Supabase project dashboard.
2. Go to Project Settings -> API.
3. Copy these values:
   - Project URL
   - Project API key (anon key)

Create a `.env` file in your project root if it does not already exist.

Add:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_CREATE_USER_FUNCTION_URL=
```

If you are using the default environment file template, you can paste the values there.

## 3. Enable authentication

1. In the Supabase dashboard, go to Authentication.
2. Open Providers.
3. Enable Email provider.
4. For local development, turn off email confirmation if you want instant sign-in.
5. Save the settings.

Recommended settings for development:
- Email provider: enabled
- Confirm email: disabled for local testing
- Password reset: enabled

## 4. Create the database schema

Open the SQL Editor in Supabase and run the following SQL.

### 4.1 Enable UUID extension

```sql
create extension if not exists "uuid-ossp";
```

### 4.2 Profiles table

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin','teacher','student','parent')),
  full_name text not null,
  phone text,
  avatar_url text,
  created_at timestamptz default now()
);
```

### 4.3 Parents table

```sql
create table if not exists public.parents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  full_name text not null,
  email text unique not null,
  phone text,
  address text,
  created_at timestamptz default now()
);
```

### 4.4 Teachers table

```sql
create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  employee_number text unique not null,
  full_name text not null,
  email text unique not null,
  phone text,
  subject_specialization text[],
  qualifications text,
  date_of_birth date,
  gender text check (gender in ('male','female')),
  address text,
  photo_url text,
  status text default 'active' check (status in ('active','inactive','terminated')),
  created_at timestamptz default now()
);
```

### 4.5 Students table

```sql
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  admission_number text unique not null,
  full_name text not null,
  class_id uuid,
  parent_id uuid,
  date_of_birth date,
  gender text check (gender in ('male','female')),
  address text,
  phone text,
  photo_url text,
  status text default 'active' check (status in ('active','graduated','transferred','suspended')),
  created_at timestamptz default now()
);
```

### 4.6 Classes table

```sql
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  section text not null check (section in ('nursery','primary')),
  grade integer not null,
  stream text,
  teacher_id uuid references public.teachers(id),
  capacity integer default 35,
  created_at timestamptz default now()
);
```

### 4.7 Announcements table

```sql
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  target_role text default 'all' check (target_role in ('admin','teacher','student','parent','all')),
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);
```

### 4.8 Assignments table

```sql
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  class_id uuid references public.classes(id),
  subject text not null,
  due_date timestamptz,
  file_url text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);
```

### 4.9 Events table

```sql
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date timestamptz not null,
  location text,
  target_role text default 'all',
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);
```

### 4.10 Attendance table

```sql
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete cascade,
  class_id uuid references public.classes(id),
  date date not null default current_date,
  status text not null check (status in ('present','absent','late','excused')),
  remarks text,
  marked_by uuid references auth.users(id),
  unique(student_id, class_id, date)
);
```

### 4.11 Grades table

```sql
create table if not exists public.grades (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete cascade,
  class_id uuid references public.classes(id),
  subject text not null,
  score numeric(5,2),
  grade text,
  term text not null,
  academic_year text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);
```

### 4.12 Admissions table

```sql
create table if not exists public.admissions (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  date_of_birth date,
  gender text check (gender in ('male','female')),
  previous_school text,
  grade_applying text,
  parent_name text not null,
  parent_phone text,
  parent_email text,
  address text,
  status text default 'pending' check (status in ('pending','approved','rejected','enrolled')),
  created_at timestamptz default now()
);
```

### 4.13 Messages table

```sql
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references auth.users(id),
  receiver_id uuid references auth.users(id),
  subject text not null,
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);
```

### 4.14 Testimonials table

```sql
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  content text not null,
  rating integer check (rating >= 1 and rating <= 5),
  status text default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now()
);
```

### 4.15 Gallery images table

```sql
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  category text,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz default now()
);
```

### 4.16 Timetable entries table

```sql
create table if not exists public.timetable_entries (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references public.classes(id),
  day_of_week integer check (day_of_week between 1 and 5),
  start_time time not null,
  end_time time not null,
  subject text not null,
  teacher_id uuid references public.teachers(id),
  room text
);
```

### 4.17 Staff requests table

```sql
create table if not exists public.staff_requests (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid references auth.users(id),
  title text not null,
  description text,
  type text check (type in ('leave','resource','complaint','other')),
  status text default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now()
);
```

### 4.18 News articles table

```sql
create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  content text,
  image_url text,
  published boolean default false,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);
```

## 5. Enable Row Level Security (RLS)

RLS is important because it prevents users from reading or modifying data that does not belong to them.

Run the following SQL:

```sql
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.teachers enable row level security;
alter table public.parents enable row level security;
alter table public.classes enable row level security;
alter table public.announcements enable row level security;
alter table public.assignments enable row level security;
alter table public.events enable row level security;
alter table public.attendance enable row level security;
alter table public.grades enable row level security;
alter table public.admissions enable row level security;
alter table public.messages enable row level security;
alter table public.testimonials enable row level security;
alter table public.gallery_images enable row level security;
alter table public.timetable_entries enable row level security;
alter table public.staff_requests enable row level security;
alter table public.news_articles enable row level security;
```

### 5.1 Basic profile policies

```sql
create policy "profiles_self_read" on public.profiles
for select using (auth.uid() = id);

create policy "profiles_self_update" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "profiles_insert_self" on public.profiles
for insert with check (auth.uid() = id);
```

### 5.2 Recommended role-based policy pattern

For production, use stronger policies so that:
- admins can manage all records
- teachers can read their assigned classes and update attendance/results
- students can view their own assignments/results
- parents can view their child data only

Example pattern:

```sql
create policy "admins_full_access" on public.students
for all using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);
```

## 6. Create an admin account

1. Open the login page in your app.
2. Use the Supabase Auth sign-up flow or the admin provisioning page once it is wired to an Edge Function.
3. Make sure the first account has the `admin` role in the profiles table.

Example insert:

```sql
insert into public.profiles (id, email, role, full_name)
values (
  '00000000-0000-0000-0000-000000000000',
  'admin@example.com',
  'admin',
  'School Administrator'
);
```

Replace the UUID with the real auth user ID after creating the account.

## 7. Optional: set up an Edge Function for admin-created accounts

For production, do not let the frontend directly create users from the browser. Instead, create a Supabase Edge Function that:
- checks that the caller is an admin
- creates a user in Supabase Auth
- writes the profile row
- optionally creates the matching student/teacher/parent row

Set this environment variable in your app:

```env
VITE_SUPABASE_CREATE_USER_FUNCTION_URL=https://your-project-ref.supabase.co/functions/v1/create-portal-user
```

## 8. Test the setup

1. Start your app.
2. Open the login page.
3. Sign in with the admin account.
4. Confirm the admin portal opens.
5. Test that protected routes redirect correctly for non-admin users.

## 9. Security checklist

- Enable RLS on every table
- Do not expose admin secrets in the frontend
- Use strong passwords
- Prefer Edge Functions for account provisioning
- Restrict access by role
- Review policies regularly

## 10. Common issues

### Error: supabaseUrl is required
This means your `.env` file is missing or Vite did not reload after the change.

Fix:
- confirm `.env` exists
- restart the dev server
- verify the variable names start with `VITE_`

### Login fails
Check:
- email provider is enabled
- the user exists in Supabase Auth
- the profile row exists
- the role is correct

### RLS blocks data access
Check the policies and confirm the `auth.uid()` value matches the expected user.
