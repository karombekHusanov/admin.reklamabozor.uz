import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getApiErrorMessage } from '@/core/api/api-error'
import { TOKEN_STORAGE_KEY } from '@/core/constants'
import {
  adminLogin as adminLoginRequest,
  fetchCurrentUser,
  logout as logoutRequest,
} from '@/modules/auth/services/auth.service'
import type { User } from '@/modules/auth/types/user'

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error'

let bootstrapPromise: Promise<boolean> | null = null

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY))
  const status = ref<AuthStatus>('idle')
  const error = ref<string | null>(null)

  const isAuthenticated = computed(
    () => status.value === 'authenticated' && user.value !== null,
  )
  const isLoading = computed(() => status.value === 'loading')

  function setSession(nextUser: User, nextToken: string) {
    user.value = nextUser
    token.value = nextToken
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken)
    status.value = 'authenticated'
    error.value = null
  }

  function clearSession() {
    user.value = null
    token.value = null
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    status.value = 'idle'
    bootstrapPromise = null
  }

  async function login(email: string, password: string) {
    status.value = 'loading'
    error.value = null

    try {
      const response = await adminLoginRequest(email, password)
      setSession(response.user, response.token)
    } catch (e) {
      status.value = 'error'
      error.value = getApiErrorMessage(e)
      clearSession()
      throw e
    }
  }

  async function restoreSession(): Promise<boolean> {
    if (!token.value) {
      status.value = 'idle'
      return false
    }

    status.value = 'loading'

    try {
      user.value = await fetchCurrentUser()
      status.value = 'authenticated'
      return true
    }
    catch {
      clearSession()
      return false
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await logoutRequest()
      }
    }
    finally {
      clearSession()
    }
  }

  function bootstrap(): Promise<boolean> {
    if (bootstrapPromise) {
      return bootstrapPromise
    }

    bootstrapPromise = (async () => {
      if (isAuthenticated.value) {
        return true
      }

      if (token.value) {
        return await restoreSession()
      }

      status.value = 'idle'
      return false
    })()

    return bootstrapPromise
  }

  return {
    user,
    token,
    status,
    error,
    isAuthenticated,
    isLoading,
    login,
    logout,
    restoreSession,
    bootstrap,
    clearSession,
  }
})
