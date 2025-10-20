/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext, useRef, useCallback } from "react"

const AuthContext = createContext()
const getUserRoleFromToken = (token) => {
  try {
    if (!token) return null
    const tokenParts = token.split('.')
    if (tokenParts.length !== 3) {
      console.error('Token JWT inválido: formato incorrecto')
      return null
    }
    // Decodificar el payload del JWT (parte del medio)
    const payload = JSON.parse(atob(tokenParts[1]))
    // Buscar el rol en diferentes posibles campos
    const role = payload.rol || payload.role || payload.tipoUsuario || payload.tipo_usuario || payload.userRole || null
    console.log('Rol extraído del token:', role)
    return role
  } catch (error) {
    console.error('Error al decodificar el token:', error)
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [token, setToken] = useState(null)
  const logoutTimerRef = useRef(null)

  const clearLogoutTimer = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current)
      logoutTimerRef.current = null
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
    setUserRole(null)
    setToken(null)
    clearLogoutTimer()
  }, [clearLogoutTimer])

  const scheduleAutoLogout = useCallback((token) => {
    clearLogoutTimer()
    try {
      if (!token) return
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (!payload.exp) return
      const expMs = payload.exp * 1000
      const delay = expMs - Date.now()
      if (delay <= 0) {
        // Ya expiró
        logout()
        return
      }
      logoutTimerRef.current = setTimeout(() => {
        logout()
        // Opcional: podríamos disparar un evento custom para mostrar modal fuera del contexto
        window.dispatchEvent(new CustomEvent('token-expired'))
      }, delay)
    } catch (e) {
      console.error('No se pudo programar el auto-logout:', e)
    }
  }, [clearLogoutTimer, logout])

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setIsAuthenticated(true)
      setToken(storedToken)
      const role = getUserRoleFromToken(storedToken)
      setUserRole(role)
      scheduleAutoLogout(storedToken)
    } else {
      setIsAuthenticated(false)
      setUserRole(null)
      setToken(null)
    }
  }, [scheduleAutoLogout, logout, clearLogoutTimer])

  // Escuchar cambios externos al localStorage (otra pestaña) y evento de expiración
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'token') {
        const newToken = e.newValue
        if (!newToken) {
          // Eliminado
          logout()
        } else {
          setIsAuthenticated(true)
          setToken(newToken)
          setUserRole(getUserRoleFromToken(newToken))
          scheduleAutoLogout(newToken)
        }
      }
    }
    const handleExpired = () => {
      // Ya se ejecutó logout en timeout, aquí podríamos mostrar algo adicional si se quiere.
    }
    window.addEventListener('storage', handleStorage)
    window.addEventListener('token-expired', handleExpired)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('token-expired', handleExpired)
      clearLogoutTimer()
    }
  }, [scheduleAutoLogout, clearLogoutTimer, logout])

  const login = (token) => {
    localStorage.setItem("token", token)
    setIsAuthenticated(true)
    setToken(token)
    const role = getUserRoleFromToken(token)
    setUserRole(role)
  scheduleAutoLogout(token)
  }

  // logout ya definido arriba

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);