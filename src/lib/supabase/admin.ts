/**
 * Admin portal account creation — delegates to the FastAPI backend.
 *
 * This file replaces the old Supabase-based admin.ts. It creates portal
 * accounts via the FastAPI backend which handles the Supabase interaction
 * server-side, avoiding the session hijack bug.
 */

import type { Role } from '../api/client'

export interface CreatePortalUserPayload {
  email: string
  password: string
  full_name: string
  role: Exclude<Role, 'admin'>
}

export async function createPortalUser(payload: CreatePortalUserPayload) {
  try {
    // Use the auth API's portal-account endpoint (admin-only)
    const token = localStorage.getItem('bfa_access_token')
    if (!token) {
      return { error: 'You must be signed in as an administrator to create portal accounts.' }
    }

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    const response = await fetch(`${API_BASE_URL}/api/auth/portal-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const body = await response.json()

    if (!response.ok) {
      return { error: body?.error?.message || 'Failed to create portal account.' }
    }

    return { success: true, user: body.data }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unexpected error while creating portal account.',
    }
  }
}
