import { supabase, type Role } from './client'

export interface CreatePortalUserPayload {
  email: string
  password: string
  full_name: string
  role: Exclude<Role, 'admin'>
}

export async function createPortalUser(payload: CreatePortalUserPayload) {
  try {
    const sessionResult = await supabase.auth.getSession()
    const session = sessionResult.data.session

    if (!session?.access_token) {
      return {
        error: 'You must be signed in as an administrator to create portal accounts.',
      }
    }

    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          full_name: payload.full_name,
          role: payload.role,
        },
      },
    })

    if (error) {
      return {
        error: error.message,
      }
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert(
        {
          id: data.user.id,
          email: payload.email,
          role: payload.role,
          full_name: payload.full_name,
        },
        { onConflict: 'id' }
      )

      if (profileError) {
        return {
          error: profileError.message,
        }
      }
    }

    return {
      success: true,
      user: data.user,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unexpected error while creating portal account.',
    }
  }
}
