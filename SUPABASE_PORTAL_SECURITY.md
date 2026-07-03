# Secure portal account provisioning plan

## Summary
The application should no longer allow public self-signup. Instead:
- the public login page is for existing users only
- the admin portal is the only place where new portal accounts can be created
- account provisioning should be handled through a secure Supabase Edge Function or server-side process

## Recommended database design

### 1. Auth users
Use Supabase Auth as the source of truth for identity.
- Users are created by an admin-triggered Edge Function.
- Each user receives a role in auth.user metadata or in a profile row.

### 2. Profiles table
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

### 3. Role-specific tables
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

## Security controls
1. Enable Row Level Security on every table.
2. Create policies so users can only read/update their own profile and role-specific data.
3. Use an Edge Function for creation so secrets stay server-side.
4. Do not expose admin creation UI unless the current user has the admin role.
5. Require a strong password policy in Supabase Auth.

## Example RLS policy pattern
```sql
alter table public.profiles enable row level security;

create policy "profiles_self_read" on public.profiles
for select using (auth.uid() = id);

create policy "profiles_self_update" on public.profiles
for update using (auth.uid() = id);
```

## Edge Function example
Create a Supabase Edge Function that:
- verifies the caller has an admin role
- creates a new auth user
- writes the profile row
- optionally creates a student/teacher/parent row
- returns a safe response

## Suggested implementation steps
1. Create the Supabase Edge Function.
2. Add the function URL to your environment as VITE_SUPABASE_CREATE_USER_FUNCTION_URL.
3. Enable auth email provider and disable signups in the public UI.
4. Add admin-only provisioning page in the app.
5. Test with a real admin account and verify that only admins can create new portal users.
