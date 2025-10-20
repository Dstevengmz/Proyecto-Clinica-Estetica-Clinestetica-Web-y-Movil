
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthenticaContext'

function CerrarSesion() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  useEffect(() => {
    logout()
    const x = location.pathname
    const destino = x.includes('/dashboard') ? '/iniciarsesion' : '/inicio'
    navigate(destino)
  }, [logout, navigate, location.pathname])

  return null
}

export default CerrarSesion