import React from 'react'
import { useAuth } from '../contexts/AuthenticaContext'
import { CBadge } from '@coreui/react'

const UserInfo = () => {
  const { isAuthenticated, userRole } = useAuth()

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="d-flex align-items-center">
      <span className="me-2">Rol:</span>
      <CBadge color={userRole === 'doctor' || userRole === 'Doctor' ? 'success' : 'info'}>
        {userRole || 'Usuario'}
      </CBadge>
    </div>
  )
}

export default UserInfo
