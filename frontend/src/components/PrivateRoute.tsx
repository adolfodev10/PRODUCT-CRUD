import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface PrivateRouteProps {
  children: React.ReactNode
  requiredAdmin?: boolean
}

export default function PrivateRoute({ children, requiredAdmin = false }: PrivateRouteProps) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredAdmin && !user.is_admin) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}