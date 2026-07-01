import axios from 'axios'
import { TOKEN_STORAGE_KEY } from '@/core/constants'
import { absolutizeMediaUrls } from '@/core/lib/media'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => {
    // Resolve host-less "/storage/…" file paths to absolute URLs using the API base.
    if (response.data) {
      response.data = absolutizeMediaUrls(response.data)
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }

    return Promise.reject(error)
  },
)
