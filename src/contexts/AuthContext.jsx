import { createContext, useState, useEffect, useCallback } from 'react'
import API from '../api/axios'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('adopet_token'))
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user && !!token

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem('adopet_token')
      if (savedToken) {
        try {
          const res = await API.get('/auth/me')
          if (res.data.success) {
            setUser(res.data.data)
            setToken(savedToken)
          } else {
            clearAuth()
          }
        } catch {
          clearAuth()
        }
      }
      setLoading(false)
    }
    restoreSession()
  }, [])

  const clearAuth = () => {
    localStorage.removeItem('adopet_token')
    localStorage.removeItem('adopet_user')
    setUser(null)
    setToken(null)
  }

  const login = useCallback(async (email, password) => {
    const res = await API.post('/auth/login', { email, password })
    if (res.data.success) {
      const { token: newToken, user: userData } = res.data.data
      localStorage.setItem('adopet_token', newToken)
      localStorage.setItem('adopet_user', JSON.stringify(userData))
      setToken(newToken)
      setUser(userData)
      return { success: true }
    }
    return { success: false, message: res.data.message }
  }, [])

  const register = useCallback(async (name, username, email, password) => {
    const res = await API.post('/auth/register', { name, username, email, password })
    if (res.data.success) {
      return { success: true, message: res.data.message }
    }
    return { success: false, message: res.data.message }
  }, [])

  const logout = useCallback(async () => {
    try {
      await API.post('/auth/logout')
    } catch {
      // ignore
    }
    clearAuth()
  }, [])

  const updateProfile = useCallback(async (data) => {
    const res = await API.put('/auth/profile', data)
    if (res.data.success) {
      const updatedUser = { ...user, ...res.data.data }
      setUser(updatedUser)
      localStorage.setItem('adopet_user', JSON.stringify(updatedUser))
      return { success: true }
    }
    return { success: false, message: res.data.message }
  }, [user])

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
