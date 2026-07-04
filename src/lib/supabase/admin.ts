/**
 * Admin portal account creation — delegates to the FastAPI backend.
 *
 * Creates teacher, student, and parent portal accounts without
 * hijacking the admin's session. The backend uses the service_role
 * key to create users in Supabase Auth.
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
    // Read admin token from sessionStorage (NOT localStorage — must match client.ts)
    const token = sessionStorage.getItem('bfa_access_token')
    if (!token) {
      return { error: 'Admin session not found. Please log in as administrator again.' }
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
      // FastAPI nests errors under detail.error
      const errMsg = body?.detail?.error?.message
        || body?.error?.message
        || body?.detail?.message
        || 'Failed to create portal account.'
      return { error: errMsg }
    }

    return { success: true, user: body.data }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error — check that the backend is running.',
    }
  }
}
