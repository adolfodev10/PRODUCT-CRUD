import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface PrivateRouteProps {
  children: React.ReactNode
  requiredAdmin?: boolean
}

export default function PrivateRoute({ children, requiredAdmin = false }: PrivateRouteProps) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>
  }

  if(!user) {
    return <Navigate to="/login" />
  }

  if (requiredAdmin && !user.is_admin) {
    return <Navigate to="/dashboard" />
  }

  return <>{children}</>
}