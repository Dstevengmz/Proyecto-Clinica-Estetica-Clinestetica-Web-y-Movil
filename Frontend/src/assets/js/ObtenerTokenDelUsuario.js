const ObtenerUsuarioIToken = () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null
    
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.id || payload.userId || payload.sub
  } catch (error) {
    console.error('Error al obtener ID del usuario:', error)
    return null
  }
}
export default ObtenerUsuarioIToken
