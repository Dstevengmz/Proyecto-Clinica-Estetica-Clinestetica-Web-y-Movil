import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://proyecto-clinica-estetica-app.vercel.app" target="_blank" rel="noopener noreferrer">
          Clinestetica
        </a>
        <span className="ms-1">&copy; 2025 Clinestetica.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1"></span>
        <a href="https://proyecto-clinica-estetica-app.vercel.app"  target="_blank" rel="noopener noreferrer">
          Desarrollado por Dstevengmz, Liliana, Constanza
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
