import { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'

type User = {
  id: number | null
  name?: string
  email?: string
  is_admin?: boolean
}

const AuthContext = createContext<any>(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await api.get('/me')
      setUser({
        id: response.data?.id || null,
        name: response.data?.name || undefined,
        email: response.data?.email || undefined,
        is_admin: response.data?.is_admin || undefined
      })
    } catch (error) {
      console.error('Erro ao buscar usuario:', error)
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await api.post('/login', { email, password })
    const { token } = response.data
    localStorage.setItem('token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    await fetchUser()
    return response.data
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post('/register', { name, email, password, password_confirmation: password })
    const { token, user } = response.data
    localStorage.setItem('token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
    return response.data
  }

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      setUser(null)
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}